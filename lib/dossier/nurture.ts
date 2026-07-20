import { sendWizardResumeReminder } from "@/lib/emails/send";
import { siteOrigin } from "@/lib/emails/constants";
import { isLocale, type Locale } from "@/lib/i18n";
import { isSupabaseConfigured } from "@/lib/protocol/auth/keys";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const MS_72H = 72 * 60 * 60 * 1000;

type DossierRow = {
  id: string;
  email: string | null;
  status: string | null;
  locale: string | null;
  updated_at: string;
  nurture_sent_at?: string | null;
};

/**
 * Incomplete dossier nurture — resume + Shield/concierge soft upsell via resume email.
 */
export async function runDossierIncompleteNurture(): Promise<{
  processed: number;
  sent: number;
  skipped: number;
}> {
  if (!isSupabaseConfigured()) {
    return { processed: 0, sent: 0, skipped: 0 };
  }

  const supabase = getSupabaseServerClient();
  const cutoff = new Date(Date.now() - MS_72H).toISOString();

  const { data: rows, error } = await supabase
    .from("dossiers")
    .select("id, email, status, locale, updated_at, nurture_sent_at")
    .in("status", ["draft", "generated", "needs_info"])
    .not("email", "is", null)
    .lt("updated_at", cutoff)
    .is("nurture_sent_at", null)
    .order("updated_at", { ascending: true })
    .limit(40);

  if (error) {
    // Column may not exist yet — soft fail
    console.error("[dossier-nurture]", error.message);
    return { processed: 0, sent: 0, skipped: 0 };
  }

  if (!rows?.length) return { processed: 0, sent: 0, skipped: 0 };

  let sent = 0;
  let skipped = 0;
  const origin = siteOrigin();

  for (const row of rows as DossierRow[]) {
    const email = row.email?.trim().toLowerCase();
    if (!email) {
      skipped += 1;
      continue;
    }
    const locale: Locale = isLocale(row.locale ?? "") ? (row.locale as Locale) : "fr";
    const resumeUrl = `${origin}/dossier?id=${encodeURIComponent(row.id)}`;

    const ok = await sendWizardResumeReminder(email, {
      locale,
      resumeUrl,
      tier: "dossier",
    });

    if (ok) {
      sent += 1;
      await supabase
        .from("dossiers")
        .update({ nurture_sent_at: new Date().toISOString() })
        .eq("id", row.id);
    } else {
      skipped += 1;
    }
  }

  return { processed: rows.length, sent, skipped };
}
