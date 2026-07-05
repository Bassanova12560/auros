import { createHmac, timingSafeEqual } from "node:crypto";

import type { H2oScoreResult } from "@/lib/green/scoring/h2o-score";

const DEV_SECRET = "auros-h2o-preview-dev-secret";
const TOKEN_TTL_MS = 90 * 24 * 60 * 60 * 1000;

export type H2oSignedPreview = {
  preview_id: string;
  rating: number;
  tier: H2oScoreResult["tier"];
  asset_class: H2oScoreResult["asset_class"];
  passport_required: boolean;
  priority_keys: H2oScoreResult["priority_keys"];
  flow_m3_per_year: number | null;
  concession_years: number | null;
  exp: number;
};

function isProduction(): boolean {
  return (
    process.env.NODE_ENV === "production" ||
    process.env.VERCEL_ENV === "production"
  );
}

function previewSecret(): string {
  const s =
    process.env.H2O_PREVIEW_SIGNING_KEY?.trim() ||
    process.env.GREEN_EXPORT_SIGNING_KEY?.trim() ||
    process.env.CRON_SECRET?.trim();
  if (s && (!isProduction() || s !== DEV_SECRET)) return s;
  if (isProduction()) return DEV_SECRET;
  return DEV_SECRET;
}

function sign(payload: string): string {
  return createHmac("sha256", previewSecret()).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export function createH2oPreviewVerifyToken(
  result: Pick<
    H2oScoreResult,
    | "preview_id"
    | "rating"
    | "tier"
    | "asset_class"
    | "passport_required"
    | "priority_keys"
    | "flow_m3_per_year"
    | "concession_years"
  >,
): string {
  const payload = JSON.stringify({
    preview_id: result.preview_id,
    rating: result.rating,
    tier: result.tier,
    asset_class: result.asset_class,
    passport_required: result.passport_required,
    priority_keys: result.priority_keys,
    flow_m3_per_year: result.flow_m3_per_year,
    concession_years: result.concession_years,
    exp: Date.now() + TOKEN_TTL_MS,
  } satisfies Omit<H2oSignedPreview, "exp"> & { exp: number });
  const sig = sign(payload);
  return Buffer.from(JSON.stringify({ p: payload, s: sig })).toString("base64url");
}

export function verifyH2oPreviewVerifyToken(token: string): H2oSignedPreview | null {
  try {
    const raw = JSON.parse(
      Buffer.from(token, "base64url").toString("utf8"),
    ) as { p?: string; s?: string };
    if (!raw.p || !raw.s) return null;
    const expected = sign(raw.p);
    if (!safeEqual(expected, raw.s)) return null;

    const data = JSON.parse(raw.p) as H2oSignedPreview;
    if (
      !data.preview_id ||
      typeof data.rating !== "number" ||
      !data.tier ||
      !data.asset_class
    ) {
      return null;
    }
    if (typeof data.exp !== "number" || Date.now() > data.exp) return null;

    return data;
  } catch {
    return null;
  }
}
