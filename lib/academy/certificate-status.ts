import { RENEWAL_DUE_DAYS } from "./constants";
import type { AcademyCertificate, CertificateStatus } from "./types";
import type { AcademyLocale } from "./i18n";
import { getAcademyPageMessages } from "./i18n-pages";

export function getCertificateStatus(cert: AcademyCertificate): CertificateStatus {
  const now = Date.now();
  const expires = new Date(cert.expiresAt).getTime();
  if (Number.isNaN(expires)) return "expired";
  if (now > expires) return "expired";
  const dueWindow = RENEWAL_DUE_DAYS * 86_400_000;
  if (expires - now <= dueWindow) return "renewal_due";
  return "active";
}

export function isLegacyCertificate(cert: AcademyCertificate): boolean {
  return !cert.expiresAt || !cert.curriculumVersion;
}

export function statusLabel(status: CertificateStatus, locale: AcademyLocale = "fr"): string {
  return getAcademyPageMessages(locale).verify.status[status];
}
