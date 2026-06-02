/** Dev-only placeholder — must never be used in production. */
export const ACADEMY_DEV_SECRET = "auros-academy-dev-secret-change-in-production";

export function isAcademyProduction(): boolean {
  return (
    process.env.NODE_ENV === "production" ||
    process.env.VERCEL_ENV === "production"
  );
}

export function resolveAcademyCertSecret(): string | null {
  const s = process.env.ACADEMY_CERT_SECRET?.trim();
  if (!s) {
    if (isAcademyProduction()) return null;
    return ACADEMY_DEV_SECRET;
  }
  if (isAcademyProduction() && s === ACADEMY_DEV_SECRET) return null;
  return s;
}

export function resolveAcademySessionSecret(): string | null {
  const s =
    process.env.ACADEMY_SESSION_SECRET?.trim() ||
    process.env.ACADEMY_CERT_SECRET?.trim();
  if (!s) {
    if (isAcademyProduction()) return null;
    return ACADEMY_DEV_SECRET;
  }
  if (isAcademyProduction() && s === ACADEMY_DEV_SECRET) return null;
  return s;
}

/** Legacy certify bypass — disabled in production unless explicitly enabled. */
export function isLegacyCertifyAllowed(): boolean {
  if (!isAcademyProduction()) return true;
  return process.env.ACADEMY_LEGACY_CERTIFY === "1";
}

export function academySecretsHealthy(): {
  ok: boolean;
  certSecret: boolean;
  notDevDefault: boolean;
} {
  const raw = process.env.ACADEMY_CERT_SECRET?.trim() ?? "";
  const certSecret = raw.length >= 16;
  const notDevDefault = raw !== "" && raw !== ACADEMY_DEV_SECRET;
  const ok = isAcademyProduction() ? certSecret && notDevDefault : certSecret || !isAcademyProduction();
  return { ok, certSecret, notDevDefault };
}
