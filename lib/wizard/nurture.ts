import { sendWizardResumeReminder } from "@/lib/emails/send";
import { siteOrigin } from "@/lib/emails/constants";
import { isLocale, type Locale } from "@/lib/i18n";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const MS_48H = 48 * 60 * 60 * 1000;

type PurchaseRow = {
  id: string;
  email: string;
  tier: string;
  stripe_session_id: string;
  locale: string;
  paid_at: string;
  completed_at: string | null;
  reminder_sent_at: string | null;
};

export async function runWizardReminders(): Promise<{
  processed: number;
  sent: number;
}> {
  const supabase = getSupabaseServerClient();
  const cutoff = new Date(Date.now() - MS_48H).toISOString();

  const { data: rows, error } = await supabase
    .from("wizard_purchases")
    .select(
      "id, email, tier, stripe_session_id, locale, paid_at, completed_at, reminder_sent_at"
    )
    .eq("wizard_unlocked", true)
    .is("completed_at", null)
    .is("reminder_sent_at", null)
    .lt("paid_at", cutoff)
    .order("paid_at", { ascending: true })
    .limit(50);

  if (error || !rows?.length) {
    if (error) console.error("[wizard-reminders]", error);
    return { processed: 0, sent: 0 };
  }

  let sent = 0;
  const origin = siteOrigin();

  for (const row of rows as PurchaseRow[]) {
    const locale: Locale = isLocale(row.locale) ? row.locale : "fr";
    const resumeUrl = `${origin}/wizard?mode=pro&session_id=${encodeURIComponent(row.stripe_session_id)}`;

    const ok = await sendWizardResumeReminder(row.email, {
      locale,
      resumeUrl,
      tier: row.tier,
    });

    if (ok) {
      sent++;
      await supabase
        .from("wizard_purchases")
        .update({ reminder_sent_at: new Date().toISOString() })
        .eq("id", row.id);
    }
  }

  return { processed: rows.length, sent };
}

export async function markWizardPurchaseCompleted(
  email: string
): Promise<void> {
  const normalized = email.trim().toLowerCase();
  if (!normalized.includes("@")) return;

  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from("wizard_purchases")
    .update({ completed_at: new Date().toISOString() })
    .eq("email", normalized)
    .is("completed_at", null);

  if (error) console.error("[markWizardPurchaseCompleted]", error);
}
