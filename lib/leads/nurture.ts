import { sendLeadNurture } from "@/lib/emails/send";
import { isLocale, type Locale } from "@/lib/i18n";
import { getSupabaseServerClient } from "@/lib/supabase/server";

import { dueLeadNurtureStep } from "./nurture-schedule";
import { wizardUrlForLead } from "./wizard-url";

type LeadRow = {
  id: string;
  email: string;
  asset_type: string | null;
  score: number | null;
  locale: string | null;
  nurture_step: number;
  created_at: string;
};

async function emailStartedWizard(
  email: string,
  sinceIso: string
): Promise<boolean> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("leads")
    .select("id")
    .eq("email", email)
    .eq("source", "wizard_step_9")
    .gte("created_at", sinceIso)
    .limit(1);

  if (error) {
    console.error("[lead-nurture] wizard_step_9 lookup", error);
    return false;
  }
  return (data?.length ?? 0) > 0;
}

export async function runLeadNurture(): Promise<{
  processed: number;
  sent: number;
  skipped: number;
}> {
  const supabase = getSupabaseServerClient();
  const { data: rows, error } = await supabase
    .from("leads")
    .select(
      "id, email, asset_type, score, locale, nurture_step, created_at"
    )
    .eq("source", "score_widget")
    .eq("consent", true)
    .lt("nurture_step", 2)
    .order("created_at", { ascending: true })
    .limit(50);

  if (error || !rows?.length) {
    if (error) console.error("[lead-nurture]", error);
    return { processed: 0, sent: 0, skipped: 0 };
  }

  let sent = 0;
  let skipped = 0;
  const now = Date.now();

  for (const row of rows as LeadRow[]) {
    const targetStep = dueLeadNurtureStep(
      new Date(row.created_at).getTime(),
      row.nurture_step ?? 0,
      now
    );
    if (!targetStep) continue;

    if (await emailStartedWizard(row.email, row.created_at)) {
      skipped++;
      await supabase
        .from("leads")
        .update({
          nurture_step: 2,
          last_nurture_at: new Date().toISOString(),
        })
        .eq("id", row.id);
      continue;
    }

    const locale: Locale = isLocale(row.locale ?? "") ? row.locale! : "fr";
    const wizardUrl = wizardUrlForLead({ assetType: row.asset_type });

    const ok = await sendLeadNurture(row.email, {
      locale,
      step: targetStep,
      wizardUrl,
      score: row.score,
      assetType: row.asset_type,
    });

    if (ok) {
      sent++;
      await supabase
        .from("leads")
        .update({
          nurture_step: targetStep,
          last_nurture_at: new Date().toISOString(),
        })
        .eq("id", row.id);
    }
  }

  return { processed: rows.length, sent, skipped };
}
