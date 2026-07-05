import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Locale } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n";
import { isValidCaptureEmail } from "@/lib/email-capture";

export async function saveAcademyWaitlistSignup(input: {
  email: string;
  track: string;
  locale?: string;
}): Promise<{ ok: true; id: string } | { ok: false; error: "invalid" | "database" }> {
  const email = input.email.trim().toLowerCase();
  if (!isValidCaptureEmail(email)) return { ok: false, error: "invalid" };

  const locale =
    input.locale && isLocale(input.locale.slice(0, 2) as Locale)
      ? input.locale.slice(0, 2)
      : "fr";

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("academy_waitlist")
    .insert({
      email,
      track: input.track.trim() || "praticien",
      locale,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("[saveAcademyWaitlistSignup]", error);
    return { ok: false, error: "database" };
  }

  return { ok: true, id: String(data.id) };
}
