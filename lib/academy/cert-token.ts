import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

import type { AcademyCertificate, CertificateStatus } from "./types";
import { getCertificateStatus, isLegacyCertificate } from "./certificate-status";
import { resolveAcademyCertSecret } from "./security";

const TIER_LABELS: Record<AcademyCertificate["tier"], string> = {
  fundamentals: "Certification Fondamentaux RWA",
  praticien: "Certification Praticien RWA",
  entreprise: "Certification Entreprise RWA",
};

function certSecret(): string | null {
  return resolveAcademyCertSecret();
}

function signPayload(payload: string): string | null {
  const secret = certSecret();
  if (!secret) return null;
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export function tierLabel(tier: AcademyCertificate["tier"]): string {
  return TIER_LABELS[tier];
}

type StoredCert = Omit<AcademyCertificate, "tierLabel">;

export function createCertificateToken(input: StoredCert): string {
  const secret = certSecret();
  if (!secret) {
    throw new Error("ACADEMY_CERT_SECRET not configured");
  }
  const payload = JSON.stringify({
    id: input.id,
    fullName: input.fullName.trim(),
    tier: input.tier,
    issuedAt: input.issuedAt,
    expiresAt: input.expiresAt,
    curriculumVersion: input.curriculumVersion,
    renewalGeneration: input.renewalGeneration,
    integrityLevel: input.integrityLevel,
  });
  const sig = signPayload(payload);
  if (!sig) {
    throw new Error("ACADEMY_CERT_SECRET not configured");
  }
  return Buffer.from(JSON.stringify({ p: payload, s: sig })).toString(
    "base64url"
  );
}

export function parseCertificateToken(token: string): AcademyCertificate | null {
  try {
    const raw = JSON.parse(
      Buffer.from(token, "base64url").toString("utf8")
    ) as { p?: string; s?: string };
    if (!raw.p || !raw.s) return null;
    const expected = signPayload(raw.p);
    if (!expected || !safeEqual(expected, raw.s)) return null;

    const data = JSON.parse(raw.p) as Partial<StoredCert> & {
      id: string;
      fullName: string;
      tier: AcademyCertificate["tier"];
      issuedAt: string;
    };

    if (!data.id || !data.fullName || !data.tier || !data.issuedAt) return null;

    const cert: AcademyCertificate = {
      id: data.id,
      fullName: data.fullName,
      tier: data.tier,
      tierLabel: tierLabel(data.tier),
      issuedAt: data.issuedAt,
      expiresAt: data.expiresAt ?? "",
      curriculumVersion: data.curriculumVersion ?? "",
      renewalGeneration: data.renewalGeneration ?? 0,
      integrityLevel: (data.integrityLevel ?? 1) as AcademyCertificate["integrityLevel"],
    };

    return cert;
  } catch {
    return null;
  }
}

export function newCertificateId(): string {
  return randomBytes(5).toString("hex").toUpperCase();
}

export function formatIssuedDate(iso: string, locale = "fr-FR"): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function enrichCertificateView(cert: AcademyCertificate): AcademyCertificate & {
  status: CertificateStatus;
  legacy: boolean;
} {
  const legacy = isLegacyCertificate(cert);
  const status = legacy ? "renewal_due" : getCertificateStatus(cert);
  return { ...cert, status, legacy };
}
