import { absoluteUrl } from "@/lib/comparators/site";

import {
  CERT_VALIDITY_DAYS,
  CURRICULUM_VERSION,
  INTEGRITY_LEVEL,
} from "./constants";
import {
  createCertificateToken,
  newCertificateId,
} from "./cert-token";
import { getAcademyMessages, type AcademyLocale } from "./i18n";
import type { AcademyTierId } from "./constants";
import type { AcademyCertificate } from "./types";

export function computeExpiresAt(fromIso: string, days = CERT_VALIDITY_DAYS): string {
  const d = new Date(fromIso);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString();
}

export function issueCertificate(input: {
  fullName: string;
  tier: AcademyTierId;
  renewalGeneration?: number;
  priorId?: string;
  locale?: AcademyLocale;
}): { certificate: AcademyCertificate; token: string } {
  const issuedAt = new Date().toISOString();
  const id = input.priorId ?? newCertificateId();
  const locale = input.locale ?? "fr";
  const labels = getAcademyMessages(locale).tierNames;

  const certificate: Omit<AcademyCertificate, "tierLabel"> = {
    id,
    fullName: input.fullName.trim(),
    tier: input.tier,
    issuedAt,
    expiresAt: computeExpiresAt(issuedAt),
    curriculumVersion: CURRICULUM_VERSION,
    renewalGeneration: input.renewalGeneration ?? 0,
    integrityLevel: INTEGRITY_LEVEL,
  };

  return {
    certificate: { ...certificate, tierLabel: labels[input.tier] },
    token: createCertificateToken(certificate),
  };
}

export function verifyUrl(token: string): string {
  return absoluteUrl(`/academy/verify/${token}`);
}

export function renewalUrl(token: string): string {
  return absoluteUrl(`/academy/renew?cert=${encodeURIComponent(token)}`);
}
