"use server";

import { auth, currentUser } from "@clerk/nextjs/server";

import { computeAdmissionReadiness } from "@/lib/admission-scoring";
import { splitDossierDataBlob } from "@/lib/dossier-data";
import {
  normalizeDossierStatus,
  type DossierStatus,
} from "@/lib/dossier-status";
import { sendDossierStatusUpdate } from "@/lib/emails/send";
import { isLocale, type Locale } from "@/lib/i18n";
import { resolvePartnerForClerkUser } from "@/lib/partners/registry";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { isUuid } from "@/lib/validation";
import { normalizeWizardData } from "@/lib/wizard-types";

const PLATFORM_TRIAGE: DossierStatus[] = [
  "in_review",
  "needs_info",
  "approved",
];

export type PlatformInboxRow = {
  id: string;
  asset_type: string | null;
  score: number | null;
  status: DossierStatus;
  submitted_at: string | null;
  admissionPercent: number | null;
  platformLabel: string | null;
  firstName: string | null;
  email: string | null;
};

export async function listPlatformInbox(): Promise<{
  partnerId: string | null;
  partnerCode: string | null;
  rows: PlatformInboxRow[];
  error?: string;
}> {
  const { userId } = await auth();
  if (!userId) return { partnerId: null, partnerCode: null, rows: [] };

  const user = await currentUser();
  const email =
    user?.primaryEmailAddress?.emailAddress?.trim().toLowerCase() ?? null;
  const partner = await resolvePartnerForClerkUser(userId, email);
  if (!partner || partner.kind !== "platform" || partner.status !== "active") {
    return { partnerId: null, partnerCode: null, rows: [] };
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("dossiers")
    .select("id, asset_type, data, score, status, submitted_at")
    .eq("partner_platform_id", partner.id)
    .in("status", ["submitted", "in_review", "needs_info", "approved"])
    .order("submitted_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("[listPlatformInbox]", error);
    return {
      partnerId: partner.id,
      partnerCode: partner.code,
      rows: [],
      error: error.message,
    };
  }

  const rows: PlatformInboxRow[] = (data ?? []).map((row) => {
    const { wizard: rawWizard } = splitDossierDataBlob(
      (row.data as Record<string, unknown>) ?? {}
    );
    const wizard = normalizeWizardData(
      rawWizard as Parameters<typeof normalizeWizardData>[0]
    );
    const readiness = computeAdmissionReadiness(wizard);
    return {
      id: String(row.id),
      asset_type: (row.asset_type as string | null) ?? wizard.assetType ?? null,
      score: typeof row.score === "number" ? row.score : null,
      status: normalizeDossierStatus(row.status as string | null),
      submitted_at: row.submitted_at ? String(row.submitted_at) : null,
      admissionPercent: readiness.overallAdmission,
      platformLabel: wizard.platform || null,
      firstName: wizard.firstName || null,
      email: wizard.email || null,
    };
  });

  return {
    partnerId: partner.id,
    partnerCode: partner.code,
    rows,
  };
}

export type TriageResult =
  | { ok: true }
  | {
      ok: false;
      error:
        | "unauthenticated"
        | "forbidden"
        | "not_found"
        | "invalid_status"
        | "database";
      message?: string;
    };

export async function triagePlatformDossierAction(
  dossierId: string,
  rawStatus: string,
  locale?: Locale
): Promise<TriageResult> {
  const { userId } = await auth();
  if (!userId) return { ok: false, error: "unauthenticated" };
  if (!isUuid(dossierId)) return { ok: false, error: "not_found" };

  const status = normalizeDossierStatus(rawStatus);
  if (!PLATFORM_TRIAGE.includes(status)) {
    return { ok: false, error: "invalid_status" };
  }

  const user = await currentUser();
  const email =
    user?.primaryEmailAddress?.emailAddress?.trim().toLowerCase() ?? null;
  const partner = await resolvePartnerForClerkUser(userId, email);
  if (!partner || partner.kind !== "platform" || partner.status !== "active") {
    return { ok: false, error: "forbidden" };
  }

  const supabase = getSupabaseServerClient();
  const { data: row, error: fetchError } = await supabase
    .from("dossiers")
    .select("id, asset_type, data, partner_platform_id")
    .eq("id", dossierId)
    .eq("partner_platform_id", partner.id)
    .maybeSingle();

  if (fetchError) {
    return { ok: false, error: "database", message: fetchError.message };
  }
  if (!row) return { ok: false, error: "not_found" };

  const { error: upd } = await supabase
    .from("dossiers")
    .update({ status })
    .eq("id", dossierId)
    .eq("partner_platform_id", partner.id);

  if (upd) {
    return { ok: false, error: "database", message: upd.message };
  }

  const { wizard } = splitDossierDataBlob(
    (row.data as Record<string, unknown>) ?? {}
  );
  const to = typeof wizard.email === "string" ? wizard.email.trim() : "";
  const firstName =
    typeof wizard.firstName === "string" ? wizard.firstName : "";
  const assetType =
    (row.asset_type as string) ||
    (typeof wizard.assetType === "string" ? wizard.assetType : "Asset");
  const loc: Locale = locale && isLocale(locale) ? locale : "fr";

  if (to) {
    void sendDossierStatusUpdate(
      to,
      status as "in_review" | "needs_info" | "approved",
      loc,
      firstName,
      assetType
    );
  }

  return { ok: true };
}
