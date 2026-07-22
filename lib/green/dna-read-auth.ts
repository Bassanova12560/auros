/**
 * Volume gates for Asset DNA / Proof Stream / Portfolio reads.
 * Anonymous: small · free API key / signed-in: medium · premium+/institutional: full.
 */

import {
  authenticateGreenPublicRequest,
  type GreenApiTier,
} from "@/lib/green/api/auth";
import { greenApiError } from "@/lib/green/api/response";
import {
  maxTier,
  sessionTierBoost,
} from "@/lib/green/institutional-access";

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

async function clerkSessionBoost(): Promise<GreenApiTier | null> {
  try {
    const { auth, currentUser } = await import("@clerk/nextjs/server");
    const session = await auth();
    if (!session.userId) return null;
    const user = await currentUser();
    const email =
      user?.primaryEmailAddress?.emailAddress ??
      user?.emailAddresses?.[0]?.emailAddress ??
      null;
    return sessionTierBoost({
      userId: session.userId,
      orgId: session.orgId,
      email,
    });
  } catch {
    return null;
  }
}

/**
 * Authenticate (optional Bearer) and clamp requested limit to tier max.
 * Signed-in Clerk sessions boost anonymous → free (or enterprise if allowlisted).
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

  let tier = auth.auth.tier;
  if (tier === "anonymous") {
    const boost = await clerkSessionBoost();
    if (boost) tier = maxTier(tier, boost);
  }

  const max =
    kind === "portfolio"
      ? portfolioLimitForTier(tier)
      : streamLimitForTier(tier);
  const safeRequested = Number.isFinite(requestedLimit)
    ? Math.max(1, Math.floor(requestedLimit))
    : max;
  const limit = Math.min(safeRequested, max);
  return {
    ok: true,
    tier,
    limit,
    capped: safeRequested > max,
  };
}
