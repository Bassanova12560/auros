/**
 * Partner apporteur attribution — `?partner=CODE` persisted for leads and dossiers.
 */

export const AUROS_PARTNER_CODE_KEY = "auros_partner_code";

export function normalizePartnerCode(
  raw: string | null | undefined
): string | null {
  if (!raw) return null;
  const code = raw
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9_-]/g, "")
    .slice(0, 48);
  return code.length >= 2 ? code : null;
}

export function savePartnerCode(code: string): void {
  const normalized = normalizePartnerCode(code);
  if (!normalized) return;
  try {
    localStorage.setItem(AUROS_PARTNER_CODE_KEY, normalized);
  } catch {
    // ignore
  }
}

export function capturePartnerFromSearchParams(
  searchParams: URLSearchParams
): string | null {
  const code = normalizePartnerCode(searchParams.get("partner"));
  if (code) {
    savePartnerCode(code);
    return code;
  }
  return null;
}

export function getPartnerCode(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return normalizePartnerCode(localStorage.getItem(AUROS_PARTNER_CODE_KEY));
  } catch {
    return null;
  }
}

export function buildPartnerWizardUrl(
  partnerCode: string,
  origin?: string
): string {
  const base =
    origin ??
    (typeof window !== "undefined"
      ? window.location.origin
      : "https://getauros.com");
  const url = new URL("/wizard", base);
  const code = normalizePartnerCode(partnerCode);
  if (code) url.searchParams.set("partner", code);
  return url.toString();
}

/** Suggest a referral code from company name (normalized). */
export function suggestPartnerCode(company: string): string {
  const base =
    normalizePartnerCode(
      company
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^A-Za-z0-9_-]/g, "")
    ) ?? "PARTNER";
  const clipped = base.slice(0, 32);
  return clipped.length >= 2 ? clipped : "PARTNER";
}
