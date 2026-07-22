/**
 * Volume gates for Asset DNA / Proof Stream / Portfolio reads.
 * Anonymous: small · free API key: medium · premium+: full.
 */

import {
  authenticateGreenPublicRequest,
  type GreenApiTier,
} from "@/lib/green/api/auth";
import { greenApiError } from "@/lib/green/api/response";

export const DNA_ANON_PORTFOLIO_LIMIT = 20;
export const DNA_FREE_PORTFOLIO_LIMIT = 50;
export const DNA_PREMIUM_PORTFOLIO_LIMIT = 100;

export const DNA_ANON_STREAM_LIMIT = 20;
export const DNA_FREE_STREAM_LIMIT = 50;
export const DNA_PREMIUM_STREAM_LIMIT = 100;

export function portfolioLimitForTier(tier: GreenApiTier): number {
  if (tier === "premium" || tier === "enterprise") {
    return DNA_PREMIUM_PORTFOLIO_LIMIT;
  }
  if (tier === "free" || tier === "demo") return DNA_FREE_PORTFOLIO_LIMIT;
  return DNA_ANON_PORTFOLIO_LIMIT;
}

export function streamLimitForTier(tier: GreenApiTier): number {
  if (tier === "premium" || tier === "enterprise") {
    return DNA_PREMIUM_STREAM_LIMIT;
  }
  if (tier === "free" || tier === "demo") return DNA_FREE_STREAM_LIMIT;
  return DNA_ANON_STREAM_LIMIT;
}

/**
 * Authenticate (optional Bearer) and clamp requested limit to tier max.
 * Returns 401/429 responses from Green auth when key invalid / quota hit.
 */
export async function authorizeDnaVolumeRead(
  req: Request,
  requestedLimit: number,
  kind: "portfolio" | "stream"
): Promise<
  | {
      ok: true;
      tier: GreenApiTier;
      limit: number;
      capped: boolean;
    }
  | { ok: false; response: ReturnType<typeof greenApiError> }
> {
  const auth = await authenticateGreenPublicRequest(req);
  if (!auth.ok) return auth;

  const max =
    kind === "portfolio"
      ? portfolioLimitForTier(auth.auth.tier)
      : streamLimitForTier(auth.auth.tier);
  const safeRequested = Number.isFinite(requestedLimit)
    ? Math.max(1, Math.floor(requestedLimit))
    : max;
  const limit = Math.min(safeRequested, max);
  return {
    ok: true,
    tier: auth.auth.tier,
    limit,
    capped: safeRequested > max,
  };
}
