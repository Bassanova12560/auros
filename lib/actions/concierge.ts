"use server";

import { isValidCaptureEmail } from "@/lib/email-capture";
import {
  sendConciergeConfirmation,
  sendConciergeInternal,
} from "@/lib/emails/send";
import { siteOrigin } from "@/lib/emails/constants";
import { isLocale, type Locale } from "@/lib/i18n";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type SaveConciergeInput = {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  assetType?: string;
  city?: string;
  country?: string;
  value?: number;
  score?: number;
  dossierUrl?: string;
  locale?: Locale;
};

export type SaveConciergeResult =
  | { ok: true; id: string }
  | { ok: false; error: "invalid" }
  | { ok: false; error: "database"; message: string };

export async function saveConciergeAction(
  input: SaveConciergeInput
): Promise<SaveConciergeResult> {
  const email = input.email.trim().toLowerCase();
  const name = input.name.trim();
  if (!name || !isValidCaptureEmail(email)) {
    return { ok: false, error: "invalid" };
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("concierge_requests")
    .insert({
      name,
      email,
      phone: input.phone?.trim() || null,
      message: input.message?.trim() || null,
      asset_type: input.assetType?.trim() || null,
      value:
        typeof input.value === "number" && Number.isFinite(input.value)
          ? input.value
          : null,
      score:
        typeof input.score === "number" && Number.isFinite(input.score)
          ? Math.round(input.score)
          : null,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("[saveConciergeAction]", error);
    return {
      ok: false,
      error: "database",
      message: error?.message ?? "Insert failed",
    };
  }

  const dossierUrl =
    input.dossierUrl?.trim() || `${siteOrigin()}/dossier`;
  const assetType = input.assetType?.trim() || "Asset";

  const locale =
    input.locale && isLocale(input.locale) ? input.locale : "fr";

  void sendConciergeConfirmation(email, {
    name,
    email,
    assetType,
    city: input.city,
    country: input.country,
    valueEur: input.value,
    score: input.score,
    locale,
  });

  void sendConciergeInternal({
    name,
    email,
    phone: input.phone,
    message: input.message,
    assetType,
    valueEur: input.value,
    score: input.score,
    dossierUrl,
  });

  return { ok: true, id: data.id as string };
}
