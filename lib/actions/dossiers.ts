"use server";

import { auth } from "@clerk/nextjs/server";

import { computeAdmissionReadiness } from "@/lib/admission-scoring";
import { mergeDossierDataBlob, splitDossierDataBlob } from "@/lib/dossier-data";
import { isValidCaptureEmail } from "@/lib/email-capture";
import {
  sendSubmitDossierConfirmation,
  sendSubmitDossierInternal,
} from "@/lib/emails/send";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { clampScore, isUuid } from "@/lib/validation";
import {
  normalizeWizardData,
  type DossierContent,
  type WizardData,
} from "@/lib/wizard-types";
import { isLocale, type Locale } from "@/lib/i18n";
import { normalizePartnerCode } from "@/lib/partner-attribution";
import { tierFromScore } from "@/lib/score";

export type SaveDossierInput = {
  assetType: string | null;
  data: Record<string, unknown>;
  score: number;
  aiContent?: DossierContent;
  aiMeta?: { provider: string; generatedAt: string };
  /** Partner apporteur code from ?partner=CODE */
  referredBy?: string | null;
};

export type SaveDossierResult =
  | { ok: true; id: string }
  | { ok: false; error: "unauthenticated" }
  | { ok: false; error: "database"; message: string };

export type FetchedDossier = {
  id: string;
  generatedAt: string;
  score: number;
  tier: "low" | "mid" | "high";
  tierLabel: string;
  data: WizardData;
  aiContent?: DossierContent;
  aiMeta?: { provider: string; generatedAt: string };
  status: string;
};

export type GetDossierResult =
  | { ok: true; dossier: FetchedDossier }
  | { ok: false; error: "unauthenticated" }
  | { ok: false; error: "invalid_id" }
  | { ok: false; error: "not_found" }
  | { ok: false; error: "database"; message: string };

export async function getDossierByIdAction(
  dossierId: string
): Promise<GetDossierResult> {
  const { userId } = await auth();
  if (!userId) return { ok: false, error: "unauthenticated" };
  if (!isUuid(dossierId)) return { ok: false, error: "invalid_id" };

  const supabase = getSupabaseServerClient();
  const { data: row, error } = await supabase
    .from("dossiers")
    .select("id, asset_type, data, score, status, created_at")
    .eq("id", dossierId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    return { ok: false, error: "database", message: error.message };
  }
  if (!row) return { ok: false, error: "not_found" };

  const { wizard: raw, aiContent, aiMeta } = splitDossierDataBlob(
    (row.data as Record<string, unknown>) ?? {}
  );
  const data = normalizeWizardData(
    raw as Parameters<typeof normalizeWizardData>[0]
  );
  const score = clampScore(row.score);
  const tier = tierFromScore(score);

  return {
    ok: true,
    dossier: {
      id: row.id as string,
      generatedAt: (row.created_at as string) ?? new Date().toISOString(),
      score,
      tier: tier.tier,
      tierLabel: tier.label,
      data,
      aiContent,
      aiMeta,
      status: (row.status as string) ?? "draft",
    },
  };
}

export async function saveDossierAction(
  input: SaveDossierInput
): Promise<SaveDossierResult> {
  const { userId } = await auth();
  if (!userId) return { ok: false, error: "unauthenticated" };

  const payload = input.aiContent
    ? mergeDossierDataBlob(input.data, input.aiContent, input.aiMeta!)
    : input.data;

  const referredBy = normalizePartnerCode(input.referredBy ?? null);

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("dossiers")
    .insert({
      user_id: userId,
      asset_type: input.assetType,
      data: payload,
      score: clampScore(input.score),
      status: input.aiContent ? "generated" : "draft",
      referred_by: referredBy,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("[saveDossierAction]", error);
    return {
      ok: false,
      error: "database",
      message: error?.message ?? "Unknown database error",
    };
  }

  return { ok: true, id: data.id as string };
}

export async function syncGuestDossierAction(
  input: SaveDossierInput
): Promise<SaveDossierResult> {
  return saveDossierAction(input);
}

export type UpdateDossierGeneratedInput = {
  id: string;
  data: Record<string, unknown>;
  aiContent: DossierContent;
  aiMeta: { provider: string; generatedAt: string };
};

export type UpdateDossierGeneratedResult =
  | { ok: true }
  | { ok: false; error: "unauthenticated" }
  | { ok: false; error: "database"; message: string };

export async function updateDossierGeneratedAction(
  input: UpdateDossierGeneratedInput
): Promise<UpdateDossierGeneratedResult> {
  const { userId } = await auth();
  if (!userId) return { ok: false, error: "unauthenticated" };
  if (!isUuid(input.id)) {
    return { ok: false, error: "database", message: "Invalid dossier id" };
  }

  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from("dossiers")
    .update({
      status: "generated",
      data: mergeDossierDataBlob(input.data, input.aiContent, input.aiMeta),
    })
    .eq("id", input.id)
    .eq("user_id", userId);

  if (error) {
    return { ok: false, error: "database", message: error.message };
  }
  return { ok: true };
}

export type SubmitDossierResult =
  | { ok: true }
  | { ok: false; error: "unauthenticated" }
  | { ok: false; error: "not_found" }
  | { ok: false; error: "database"; message: string };

export async function submitDossierAction(
  dossierId: string,
  locale?: Locale
): Promise<SubmitDossierResult> {
  const { userId } = await auth();
  if (!userId) return { ok: false, error: "unauthenticated" };
  if (!isUuid(dossierId)) return { ok: false, error: "not_found" };

  const supabase = getSupabaseServerClient();
  const { data: row, error: fetchError } = await supabase
    .from("dossiers")
    .select("id, asset_type, data, score")
    .eq("id", dossierId)
    .eq("user_id", userId)
    .maybeSingle();

  if (fetchError) {
    return { ok: false, error: "database", message: fetchError.message };
  }
  if (!row) return { ok: false, error: "not_found" };

  const { error } = await supabase
    .from("dossiers")
    .update({
      status: "submitted",
      submitted_at: new Date().toISOString(),
    })
    .eq("id", dossierId)
    .eq("user_id", userId);

  if (error) {
    return { ok: false, error: "database", message: error.message };
  }

  const { wizard: rawWizard } = splitDossierDataBlob(
    (row.data as Record<string, unknown>) ?? {}
  );
  const wizard = normalizeWizardData(
    rawWizard as Parameters<typeof normalizeWizardData>[0]
  );
  const readiness = computeAdmissionReadiness(wizard);

  const userLocale: Locale =
    locale && isLocale(locale) ? locale : "fr";

  const emailPayload = {
    dossierId,
    assetType: (row.asset_type as string) ?? wizard.assetType ?? "Asset",
    score: clampScore(row.score),
    admissionPercent: readiness.overallAdmission,
    platform: wizard.platform ?? "",
    email: wizard.email,
    firstName: wizard.firstName,
    country: wizard.country,
    locale: userLocale,
  };

  if (wizard.email && isValidCaptureEmail(wizard.email)) {
    void sendSubmitDossierConfirmation(wizard.email, emailPayload);
  }
  void sendSubmitDossierInternal(emailPayload);

  const { notifyPlatformSubmitWebhook } = await import(
    "@/lib/webhooks/platform-submit"
  );
  void notifyPlatformSubmitWebhook({
    event: "dossier.submitted",
    dossierId,
    assetType: emailPayload.assetType,
    score: emailPayload.score,
    admissionPercent: emailPayload.admissionPercent,
    platform: emailPayload.platform,
    country: emailPayload.country,
    email: emailPayload.email,
    firstName: emailPayload.firstName,
    submittedAt: new Date().toISOString(),
  });

  return { ok: true };
}
