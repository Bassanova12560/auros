/**
 * Referral URLs, share links, and attribution for viral score sharing.
 */

export const AUROS_REFERRAL_SOURCE_KEY = "auros_referral_source";

export const AUROS_SHARE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://auros-delta.vercel.app";

export type ReferralSource = {
  type: "SCORE" | "DOSSIER";
  asset?: string;
  score?: number;
  token?: string;
  landedAt: string;
  rawQuery: string;
};

export type ScoreShareParams = {
  assetDescription: string;
  score: number;
};

export function shareOrigin(): string {
  if (typeof window !== "undefined") return window.location.origin;
  return AUROS_SHARE_ORIGIN;
}

export function buildScoreShareUrl(params: ScoreShareParams): string {
  const url = new URL("/", shareOrigin());
  url.searchParams.set("ref", "SCORE");
  url.searchParams.set("asset", params.assetDescription);
  url.searchParams.set("score", String(params.score));
  return url.toString();
}

export function buildScoreShareUrlFromAssetType(
  assetType: string,
  score: number
): string {
  const url = new URL("/", shareOrigin());
  url.searchParams.set("ref", "SCORE");
  url.searchParams.set("asset", assetType);
  url.searchParams.set("score", String(score));
  return url.toString();
}

export function parseScoreReferral(
  searchParams: URLSearchParams
): { asset: string; score: number } | null {
  if (searchParams.get("ref") !== "SCORE") return null;
  const asset = searchParams.get("asset");
  const scoreRaw = searchParams.get("score");
  if (!asset || !scoreRaw) return null;
  const score = Number.parseInt(scoreRaw, 10);
  if (!Number.isFinite(score) || score < 0 || score > 100) return null;
  return { asset: decodeURIComponent(asset.replace(/\+/g, " ")), score };
}

export function saveReferralSource(source: ReferralSource): void {
  try {
    localStorage.setItem(AUROS_REFERRAL_SOURCE_KEY, JSON.stringify(source));
  } catch {
    // ignore
  }
}

export function captureReferralFromSearchParams(
  searchParams: URLSearchParams
): ReferralSource | null {
  const scoreRef = parseScoreReferral(searchParams);
  if (scoreRef) {
    const source: ReferralSource = {
      type: "SCORE",
      asset: scoreRef.asset,
      score: scoreRef.score,
      landedAt: new Date().toISOString(),
      rawQuery: searchParams.toString(),
    };
    saveReferralSource(source);
    return source;
  }

  const token = searchParams.get("token");
  if (token) {
    const source: ReferralSource = {
      type: "DOSSIER",
      token,
      landedAt: new Date().toISOString(),
      rawQuery: searchParams.toString(),
    };
    saveReferralSource(source);
    return source;
  }

  return null;
}

export function getReferralSource(): ReferralSource | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUROS_REFERRAL_SOURCE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ReferralSource;
    if (parsed?.type && parsed.landedAt) return parsed;
  } catch {
    // ignore
  }
  return null;
}

export function withReferralAttribution<T extends Record<string, unknown>>(
  payload: T
): T & { referralSource?: ReferralSource } {
  const referral = getReferralSource();
  if (!referral) return payload;
  return { ...payload, referralSource: referral };
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}
