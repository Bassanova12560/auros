import { isLocale, type Locale } from "@/lib/i18n";
import {
  sendAcademyRemindersSubscribed,
  sendAcademyRenewalSuccess,
} from "@/lib/emails/send";

import { parseCertificateToken } from "./cert-token";
import { renewalUrl, verifyUrl } from "./issue-certificate";
import {
  academyUnsubscribeUrl,
  getReminderPrefsForCert,
  syncCertAfterRenewal,
  upsertAcademyReminderPref,
} from "./reminder-prefs";
import type { AcademyCertificate } from "./types";

export async function notifyAcademyRemindersSubscribed(input: {
  email: string;
  certToken: string;
  locale?: string;
}): Promise<
  | { ok: true }
  | { ok: false; reason: "invalid_email" | "invalid_cert" | "database" }
> {
  const result = await upsertAcademyReminderPref(input);
  if (!result.ok) return result;

  const cert = parseCertificateToken(input.certToken);
  if (!cert) return { ok: false, reason: "invalid_cert" };

  const locale: Locale = isLocale(input.locale ?? "fr") ? (input.locale as Locale) : "fr";
  const firstName = cert.fullName.trim().split(/\s+/)[0] || cert.fullName;

  await sendAcademyRemindersSubscribed(input.email, {
    firstName,
    expiresAt: cert.expiresAt,
    verifyUrl: verifyUrl(input.certToken),
    renewUrl: renewalUrl(input.certToken),
    unsubscribeUrl: academyUnsubscribeUrl(result.unsubscribeToken),
    locale,
  });

  return { ok: true };
}

export async function notifyAcademyRenewalSuccess(
  certificate: AcademyCertificate,
  certToken: string
): Promise<void> {
  await syncCertAfterRenewal(certificate.id, certToken, certificate.expiresAt);

  const prefs = await getReminderPrefsForCert(certificate.id);
  if (!prefs.length) return;

  for (const pref of prefs) {
    const locale: Locale = isLocale(pref.locale) ? pref.locale : "fr";
    await sendAcademyRenewalSuccess(pref.email, {
      firstName: pref.first_name ?? certificate.fullName.split(/\s+/)[0] ?? certificate.fullName,
      expiresAt: certificate.expiresAt,
      verifyUrl: verifyUrl(certToken),
      renewUrl: renewalUrl(certToken),
      unsubscribeUrl: academyUnsubscribeUrl(pref.unsubscribe_token),
      renewalGeneration: certificate.renewalGeneration,
      locale,
    });
  }
}
