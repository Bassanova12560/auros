"use server";

import { isValidCaptureEmail } from "@/lib/email-capture";
import type { Locale } from "@/lib/i18n";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type SaveGreenPraticienInput = {
  fullName: string;
  email: string;
  organization?: string;
  fundamentalsCertId?: string;
  message?: string;
  locale?: Locale;
};

export type SaveGreenPraticienResult =
  | { ok: true; id: string }
  | { ok: false; error: "invalid" }
  | { ok: false; error: "database"; message: string };

export async function saveGreenPraticienAction(
  input: SaveGreenPraticienInput
): Promise<SaveGreenPraticienResult> {
  const email = input.email.trim().toLowerCase();
  if (!input.fullName.trim() || !isValidCaptureEmail(email)) {
    return { ok: false, error: "invalid" };
  }

  const locale = input.locale ?? "fr";
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("green_praticien_waitlist")
    .insert({
      full_name: input.fullName.trim(),
      email,
      organization: input.organization?.trim() || null,
      fundamentals_cert_id: input.fundamentalsCertId?.trim() || null,
      message: input.message?.trim() || null,
      locale,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("[saveGreenPraticienAction]", error);
    return {
      ok: false,
      error: "database",
      message: error?.message ?? "Insert failed",
    };
  }

  return { ok: true, id: data.id as string };
}
