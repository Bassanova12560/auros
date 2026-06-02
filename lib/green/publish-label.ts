import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { GreenProjectType } from "./constants";

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

  const { error: insertErr } = await supabase.from("green_registry_projects").insert({
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
  });

  if (insertErr) {
    console.error("[publishGreenLabelApplication]", insertErr);
    return { ok: false, error: "database" };
  }

  const { error: updateErr } = await supabase
    .from("green_label_applications")
    .update({
      status: "approved",
      registry_project_id: projectId,
      reviewed_at: now,
    })
    .eq("id", input.applicationId);

  if (updateErr) {
    console.error("[publishGreenLabelApplication] update", updateErr);
    return { ok: false, error: "database" };
  }

  return {
    ok: true,
    projectId,
    verifyToken,
    email: String(app.email),
    contactName: String(app.contact_name),
    projectName: String(app.project_name),
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
};

export async function listPendingGreenLabelApplications(): Promise<
  PendingGreenLabelApplication[]
> {
  const supabase = getAdminClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("green_label_applications")
    .select(
      "id,project_name,project_type,contact_name,email,country,website,description,created_at"
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
  }));
}
