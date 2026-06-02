"use server";

import { isValidCaptureEmail } from "@/lib/email-capture";
import { sendLeadScore } from "@/lib/emails/send";
import { tierFromScore } from "@/lib/score";
import { isLocale, type Locale } from "@/lib/i18n";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type LeadSource = "score_widget" | "wizard_step_9";

export type SaveLeadInput = {
  email: string;
  source: LeadSource;
  assetType?: string | null;
  score?: number | null;
  consent: boolean;
  locale?: Locale;
};

export type SaveLeadResult =
  | { ok: true; id: string }
  | { ok: false; error: "invalid_email" }
  | { ok: false; error: "consent_required" }
  | { ok: false; error: "database"; message: string };

export async function saveLeadAction(
  input: SaveLeadInput
): Promise<SaveLeadResult> {
  const email = input.email.trim().toLowerCase();
  if (!isValidCaptureEmail(email)) {
    return { ok: false, error: "invalid_email" };
  }
  if (!input.consent) {
    return { ok: false, error: "consent_required" };
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("leads")
    .insert({
      email,
      source: input.source,
      asset_type: input.assetType?.trim() || null,
      score:
        typeof input.score === "number" && Number.isFinite(input.score)
          ? Math.round(input.score)
          : null,
      consent: true,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("[saveLeadAction]", error);
    return {
      ok: false,
      error: "database",
      message: error?.message ?? "Insert failed",
    };
  }

  if (
    input.source === "score_widget" &&
    typeof input.score === "number" &&
    Number.isFinite(input.score)
  ) {
    const tier = tierFromScore(input.score);
    const locale =
      input.locale && isLocale(input.locale) ? input.locale : "fr";
    void sendLeadScore(email, {
      score: Math.round(input.score),
      tierLabel: tier.label,
      assetType: input.assetType?.trim() || "Your asset",
      locale,
    });
  }

  return { ok: true, id: data.id as string };
}
