import { randomBytes } from "node:crypto";

import { isValidCaptureEmail } from "@/lib/email-capture";
import { isLocale, type Locale } from "@/lib/i18n";
import { getSupabaseServerClient } from "@/lib/supabase/server";

import { parseCertificateToken } from "./cert-token";
import { dueReminderKind } from "./reminder-schedule";
import { renewalUrl, verifyUrl } from "./issue-certificate";
import { absoluteUrl } from "@/lib/comparators/site";
import {
  sendAcademyReminderJ14,
  sendAcademyReminderJ3,
} from "@/lib/emails/send";

export type AcademyReminderRow = {
  id: string;
  email: string;
  cert_id: string;
  cert_token: string;
  first_name: string | null;
  tier: string;
  expires_at: string;
  locale: string;
  reminders_enabled: boolean;
  reminder_14_sent_at: string | null;
  reminder_3_sent_at: string | null;
  unsubscribe_token: string;
};

function firstNameFromFullName(fullName: string): string {
  const part = fullName.trim().split(/\s+/)[0];
  return part || fullName.trim();
}

export function academyUnsubscribeUrl(unsubscribeToken: string): string {
  return absoluteUrl(
    `/academy/reminders/unsubscribe?token=${encodeURIComponent(unsubscribeToken)}`
  );
}

export async function upsertAcademyReminderPref(input: {
  email: string;
  certToken: string;
  locale?: string;
}): Promise<
  | { ok: true; unsubscribeToken: string }
  | { ok: false; reason: "invalid_email" | "invalid_cert" | "database" }
> {
  const email = input.email.trim().toLowerCase();
  if (!isValidCaptureEmail(email)) {
    return { ok: false, reason: "invalid_email" };
  }

  const cert = parseCertificateToken(input.certToken);
  if (!cert?.expiresAt) {
    return { ok: false, reason: "invalid_cert" };
  }

  const locale: Locale = isLocale(input.locale ?? "fr") ? (input.locale as Locale) : "fr";
  const firstName = firstNameFromFullName(cert.fullName);
  const unsubscribeToken = randomBytes(18).toString("base64url");

  try {
    const supabase = getSupabaseServerClient();

    const { data: existing } = await supabase
      .from("academy_reminder_prefs")
      .select("id, unsubscribe_token")
      .eq("cert_id", cert.id)
      .eq("email", email)
      .maybeSingle();

    const row = {
      email,
      cert_id: cert.id,
      cert_token: input.certToken,
      first_name: firstName,
      tier: cert.tier,
      expires_at: cert.expiresAt,
      locale,
      reminders_enabled: true,
      reminder_14_sent_at: null,
      reminder_3_sent_at: null,
      updated_at: new Date().toISOString(),
    };

    if (existing?.id) {
      const { error } = await supabase
        .from("academy_reminder_prefs")
        .update(row)
        .eq("id", existing.id);
      if (error) {
        console.error("[academy-reminders] update failed", error);
        return { ok: false, reason: "database" };
      }
      return {
        ok: true,
        unsubscribeToken: (existing.unsubscribe_token as string) || unsubscribeToken,
      };
    }

    const { error } = await supabase.from("academy_reminder_prefs").insert({
      ...row,
      unsubscribe_token: unsubscribeToken,
    });
    if (error) {
      console.error("[academy-reminders] insert failed", error);
      return { ok: false, reason: "database" };
    }

    return { ok: true, unsubscribeToken };
  } catch (err) {
    console.error("[academy-reminders] upsert error", err);
    return { ok: false, reason: "database" };
  }
}

export async function syncCertAfterRenewal(
  certId: string,
  certToken: string,
  expiresAt: string
): Promise<void> {
  try {
    const supabase = getSupabaseServerClient();
    await supabase
      .from("academy_reminder_prefs")
      .update({
        cert_token: certToken,
        expires_at: expiresAt,
        reminder_14_sent_at: null,
        reminder_3_sent_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq("cert_id", certId)
      .eq("reminders_enabled", true);
  } catch (err) {
    console.error("[academy-reminders] sync renewal failed", err);
  }
}

export async function unsubscribeAcademyReminders(
  token: string
): Promise<boolean> {
  const t = token.trim();
  if (!t) return false;

  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("academy_reminder_prefs")
      .update({
        reminders_enabled: false,
        updated_at: new Date().toISOString(),
      })
      .eq("unsubscribe_token", t)
      .select("id")
      .maybeSingle();

    if (error || !data?.id) return false;
    return true;
  } catch {
    return false;
  }
}

export async function getReminderPrefsForCert(
  certId: string
): Promise<AcademyReminderRow[]> {
  try {
    const supabase = getSupabaseServerClient();
    const { data } = await supabase
      .from("academy_reminder_prefs")
      .select("*")
      .eq("cert_id", certId)
      .eq("reminders_enabled", true);
    return (data ?? []) as AcademyReminderRow[];
  } catch {
    return [];
  }
}

export async function runAcademyReminderCron(): Promise<{
  processed: number;
  sentJ14: number;
  sentJ3: number;
}> {
  let sentJ14 = 0;
  let sentJ3 = 0;

  try {
    const supabase = getSupabaseServerClient();
    const now = Date.now();
    const horizon = new Date(now + 15 * 86_400_000).toISOString();

    const { data: rows, error } = await supabase
      .from("academy_reminder_prefs")
      .select("*")
      .eq("reminders_enabled", true)
      .gt("expires_at", new Date(now).toISOString())
      .lte("expires_at", horizon)
      .limit(100);

    if (error || !rows?.length) {
      if (error) console.error("[academy-reminders-cron]", error);
      return { processed: 0, sentJ14: 0, sentJ3: 0 };
    }

    for (const row of rows as AcademyReminderRow[]) {
      const kind = dueReminderKind(row.expires_at, now, {
        j14: Boolean(row.reminder_14_sent_at),
        j3: Boolean(row.reminder_3_sent_at),
      });
      if (!kind) continue;

      const locale: Locale = isLocale(row.locale) ? row.locale : "fr";
      const firstName = row.first_name ?? "—";

      const payload = {
        firstName,
        locale,
        expiresAt: row.expires_at,
        verifyUrl: verifyUrl(row.cert_token),
        renewUrl: renewalUrl(row.cert_token),
        unsubscribeUrl: academyUnsubscribeUrl(row.unsubscribe_token),
      };

      const ok =
        kind === "j14"
          ? await sendAcademyReminderJ14(row.email, payload)
          : await sendAcademyReminderJ3(row.email, payload);

      if (!ok) continue;

      if (kind === "j14") {
        sentJ14++;
        await supabase
          .from("academy_reminder_prefs")
          .update({ reminder_14_sent_at: new Date().toISOString() })
          .eq("id", row.id);
      } else {
        sentJ3++;
        await supabase
          .from("academy_reminder_prefs")
          .update({ reminder_3_sent_at: new Date().toISOString() })
          .eq("id", row.id);
      }
    }

    return { processed: rows.length, sentJ14, sentJ3 };
  } catch (err) {
    console.error("[academy-reminders-cron]", err);
    return { processed: 0, sentJ14, sentJ3 };
  }
}
