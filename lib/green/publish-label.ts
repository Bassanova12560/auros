import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { Locale } from "@/lib/i18n";
import type { GreenProjectType } from "./constants";
import { normalizeGreenLabelPreferredLocale } from "./label-locale";

function getAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SECRET_KEY?.trim();
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

export type PublishGreenLabelInput = {
  applicationId: string;
  labelTier?: "verified" | "pilot";
  verifyToken?: string;
  summaryFr: string;
  summaryEn: string;
  summaryEs: string;
};

export type PublishGreenLabelResult =
  | {
      ok: true;
      projectId: string;
      verifyToken: string;
      email: string;
      contactName: string;
      projectName: string;
      preferredLocale: Locale;
      assetDnaId?: string;
    }
  | { ok: false; error: "not_found" | "already_published" | "database" };

export async function publishGreenLabelApplication(
  input: PublishGreenLabelInput
): Promise<PublishGreenLabelResult> {
  const supabase = getAdminClient();
  if (!supabase) return { ok: false, error: "database" };

  const { data: app, error: fetchErr } = await supabase
    .from("green_label_applications")
    .select("*")
    .eq("id", input.applicationId)
    .maybeSingle();

  if (fetchErr || !app) return { ok: false, error: "not_found" };
  if (app.registry_project_id) return { ok: false, error: "already_published" };

  const projectId = `verified-${slugify(String(app.project_name))}-${Date.now().toString(36)}`;
  const verifyToken =
    input.verifyToken?.trim() ||
    `ag-verified-${Math.random().toString(36).slice(2, 10)}`;
  const now = new Date().toISOString();

  const { assetDnaClassFromGreenProject, mintAssetDna, persistAssetDna } =
    await import("@/lib/asset-dna");
  const { appendProofStreamEvent } = await import("@/lib/proof-stream");

  const dna = await mintAssetDna({
    assetClass: assetDnaClassFromGreenProject(String(app.project_type)),
    displayName: String(app.project_name),
    jurisdiction: { country: String(app.country) },
    origin: {
      operatorName: String(app.contact_name),
      siteName: String(app.project_name),
    },
    compliance: {
      labelTier: input.labelTier ?? "verified",
      listingTier: "verified",
    },
    links: {
      registryProjectId: projectId,
    },
  });

  const insertPayload: Record<string, unknown> = {
    id: projectId,
    name: String(app.project_name),
    project_type: app.project_type as GreenProjectType,
    country: String(app.country),
    label_tier: input.labelTier ?? "verified",
    certified_at: now,
    verify_token: verifyToken,
    summary_fr: input.summaryFr,
    summary_en: input.summaryEn,
    summary_es: input.summaryEs,
    website: String(app.website),
    source_application_id: input.applicationId,
    asset_dna_id: dna.id,
  };

  let { error: insertErr } = await supabase
    .from("green_registry_projects")
    .insert(insertPayload);

  if (insertErr?.message?.includes("asset_dna_id")) {
    delete insertPayload.asset_dna_id;
    const retry = await supabase.from("green_registry_projects").insert(insertPayload);
    insertErr = retry.error;
  }

  if (insertErr) {
    console.error("[publishGreenLabelApplication]", insertErr);
    return { ok: false, error: "database" };
  }

  appendProofStreamEvent({
    assetDnaId: dna.id,
    action: "dna.minted",
    meta: { registryProjectId: projectId },
  });
  appendProofStreamEvent({
    assetDnaId: dna.id,
    action: "registry.published",
    meta: {
      registryProjectId: projectId,
      labelTier: input.labelTier ?? "verified",
    },
  });

  dna.updatedAt = now;
  await persistAssetDna(dna);

  const { error: updateErr } = await supabase
    .from("green_label_applications")
    .update({
      status: "approved",
      registry_project_id: projectId,
      reviewed_at: now,
      asset_dna_id: dna.id,
    })
    .eq("id", input.applicationId);

  if (updateErr) {
    // Retry without asset_dna_id if column missing
    if (updateErr.message?.includes("asset_dna_id")) {
      const retryUp = await supabase
        .from("green_label_applications")
        .update({
          status: "approved",
          registry_project_id: projectId,
          reviewed_at: now,
        })
        .eq("id", input.applicationId);
      if (retryUp.error) {
        console.error("[publishGreenLabelApplication] update", retryUp.error);
        return { ok: false, error: "database" };
      }
    } else {
      console.error("[publishGreenLabelApplication] update", updateErr);
      return { ok: false, error: "database" };
    }
  }

  return {
    ok: true,
    projectId,
    verifyToken,
    email: String(app.email),
    contactName: String(app.contact_name),
    projectName: String(app.project_name),
    preferredLocale: normalizeGreenLabelPreferredLocale(
      app.preferred_locale as string | null | undefined
    ),
    assetDnaId: dna.id,
  };
}

export type PendingGreenLabelApplication = {
  id: string;
  projectName: string;
  projectType: string;
  contactName: string;
  email: string;
  country: string;
  website: string;
  description: string;
  createdAt: string;
  hasDocument: boolean;
  reminderSentAt: string | null;
  secondReminderSentAt: string | null;
};

export async function listPendingGreenLabelApplications(): Promise<
  PendingGreenLabelApplication[]
> {
  const supabase = getAdminClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("green_label_applications")
    .select(
      "id,project_name,project_type,contact_name,email,country,website,description,created_at,document_path,reminder_sent_at,second_reminder_sent_at"
    )
    .eq("status", "pending")
    .is("registry_project_id", null)
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("[listPendingGreenLabelApplications]", error);
    return [];
  }

  return data.map((row) => ({
    id: String(row.id),
    projectName: String(row.project_name),
    projectType: String(row.project_type),
    contactName: String(row.contact_name),
    email: String(row.email),
    country: String(row.country),
    website: String(row.website),
    description: String(row.description),
    createdAt: String(row.created_at),
    hasDocument: Boolean(row.document_path),
    reminderSentAt: row.reminder_sent_at ? String(row.reminder_sent_at) : null,
    secondReminderSentAt: row.second_reminder_sent_at
      ? String(row.second_reminder_sent_at)
      : null,
  }));
}
