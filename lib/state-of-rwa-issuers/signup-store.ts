import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Locale } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n";
import { isValidCaptureEmail } from "@/lib/email-capture";

export async function saveReportDownloadSignup(input: {
  email: string;
  name: string;
  edition: string;
  locale?: string;
}): Promise<{ ok: true; id: string } | { ok: false; error: "invalid" | "database" }> {
  const email = input.email.trim().toLowerCase();
  const name = input.name.trim();
  if (!isValidCaptureEmail(email) || name.length < 2) {
    return { ok: false, error: "invalid" };
  }

  const locale =
    input.locale && isLocale(input.locale.slice(0, 2) as Locale)
      ? input.locale.slice(0, 2)
      : "fr";

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("report_download_signups")
    .insert({
      email,
      name,
      edition: input.edition.trim(),
      locale,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("[saveReportDownloadSignup]", error);
    return { ok: false, error: "database" };
  }

  return { ok: true, id: String(data.id) };
}
