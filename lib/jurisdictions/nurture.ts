import {
  sendJurisdictionNurture,
} from "@/lib/emails/send";
import { isLocale, type Locale } from "@/lib/i18n";
import { getSupabaseServerClient } from "@/lib/supabase/server";

import { checkoutUrlForLead } from "./checkout-url";

const MS_DAY = 86_400_000;

type LeadRow = {
  id: string;
  first_name: string;
  email: string;
  locale: string;
  nurture_step: number;
  created_at: string;
};

export async function runJurisdictionNurture(): Promise<{
  processed: number;
  sent: number;
}> {
  const supabase = getSupabaseServerClient();
  const { data: rows, error } = await supabase
    .from("jurisdiction_leads")
    .select("id, first_name, email, locale, nurture_step, created_at")
    .is("paid_at", null)
    .in("status", ["new", "nurtured"])
    .lt("nurture_step", 2)
    .order("created_at", { ascending: true })
    .limit(50);

  if (error || !rows?.length) {
    if (error) console.error("[jurisdiction-nurture]", error);
    return { processed: 0, sent: 0 };
  }

  let sent = 0;
  const now = Date.now();

  for (const row of rows as LeadRow[]) {
    const ageMs = now - new Date(row.created_at).getTime();
    const step = row.nurture_step ?? 0;
    let targetStep: 1 | 2 | null = null;

    if (step === 0 && ageMs >= MS_DAY) targetStep = 1;
    else if (step === 1 && ageMs >= MS_DAY * 3) targetStep = 2;
    else continue;

    const locale: Locale = isLocale(row.locale) ? row.locale : "fr";
    const checkoutUrl = await checkoutUrlForLead(
      row.id,
      locale,
      row.email,
      row.first_name
    );

    const ok = await sendJurisdictionNurture(row.email, {
      firstName: row.first_name,
      locale,
      checkoutUrl,
      step: targetStep,
    });

    if (ok) {
      sent++;
      await supabase
        .from("jurisdiction_leads")
        .update({
          nurture_step: targetStep,
          last_nurture_at: new Date().toISOString(),
          status: "nurtured",
        })
        .eq("id", row.id);
    }
  }

  return { processed: rows.length, sent };
}
