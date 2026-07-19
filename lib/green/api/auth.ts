import { checkRateLimitAsync, getRequestIp } from "@/lib/rate-limit";
import { checkIpBurstLimit, checkProtocolRateLimit } from "@/lib/protocol/auth/rate-limit";
import { findKeyRecord, validateApiKey } from "@/lib/protocol/auth/keys";

import {
  GREEN_ANON_DAILY_LIMIT,
  GREEN_ANON_BULK_MAX_IDS,
  GREEN_FREE_BATCH_MAX_ITEMS,
  GREEN_FREE_BULK_MAX_IDS,
  GREEN_PREMIUM_BATCH_MAX_ITEMS,
} from "./constants";
import { greenApiError } from "./response";

const ANON_WINDOW_MS = 24 * 60 * 60 * 1000;

export type GreenApiTier = "anonymous" | "free" | "premium" | "enterprise" | "demo";

export type GreenApiAuth = {
  tier: GreenApiTier;
  keyHash: string | null;
  rateLimit: {
    allowed: boolean;
    remaining: number;
    limit: number;
    reset: number;
  };
};

export async function authenticateGreenPublicRequest(
  req: Request
): Promise<
  { ok: true; auth: GreenApiAuth } | { ok: false; response: ReturnType<typeof greenApiError> }
> {
  const authHeader = req.headers.get("authorization")?.trim();
  if (authHeader?.startsWith("Bearer ")) {
    const raw = authHeader.slice(7).trim();
    const validation = await validateApiKey(raw);
    if (!validation.valid || !validation.keyHash) {
      return {
        ok: false,
        response: greenApiError("unauthorized", "Invalid API key — create one at POST /api/v1/keys", 401),
      };
    }

    const rate = await checkProtocolRateLimit(validation.keyHash, validation.isDemo);

    let tier: GreenApiTier = validation.isDemo ? "demo" : "free";
    if (!validation.isDemo) {
      const record = await findKeyRecord(validation.keyHash);
      if (record?.tier === "premium" || record?.tier === "monitor") tier = "premium";
      if (record?.tier === "enterprise") tier = "enterprise";
    }

    if (!rate.allowed) {
      const quotaMsg =
        tier === "premium" || tier === "enterprise"
          ? `Monthly API quota exceeded (${rate.limit} requests). Contact hello@getauros.com for Enterprise.`
          : `Monthly API quota exceeded (${rate.limit} requests). Upgrade Green API Premium at /green/api — 25k req/mois.`;
      return {
        ok: false,
        response: greenApiError("quota_exceeded", quotaMsg, 429, {
          tier,
          keyHash: validation.keyHash,
          rateLimit: rate,
        }),
      };
    }

    return {
      ok: true,
      auth: { tier, keyHash: validation.keyHash, rateLimit: rate },
    };
  }

  const ip = getRequestIp(req);
  const burst = await checkIpBurstLimit(ip);
  if (!burst.allowed) {
    return {
      ok: false,
      response: greenApiError("rate_limit", "Too many requests — slow down or use an API key.", 429),
    };
  }

  const daily = await checkRateLimitAsync(
    `green-api:${ip}`,
    GREEN_ANON_DAILY_LIMIT,
    ANON_WINDOW_MS
  );
  if (!daily.allowed) {
    return {
      ok: false,
      response: greenApiError(
        "quota_exceeded",
        `Daily anonymous limit (${GREEN_ANON_DAILY_LIMIT}/day). Get a free API key: POST /api/v1/keys`,
        429,
        {
          tier: "anonymous",
          keyHash: null,
          rateLimit: { ...daily, limit: GREEN_ANON_DAILY_LIMIT },
        }
      ),
    };
  }

  return {
    ok: true,
    auth: {
      tier: "anonymous",
      keyHash: null,
      rateLimit: { ...daily, limit: GREEN_ANON_DAILY_LIMIT },
    },
  };
}

/** Batch and bulk endpoints require an API key. */
export async function requireGreenApiKey(req: Request) {
  const authHeader = req.headers.get("authorization")?.trim();
  if (!authHeader?.startsWith("Bearer ")) {
    return {
      ok: false as const,
      response: greenApiError(
        "api_key_required",
        "This endpoint requires Authorization: Bearer <api_key>. Free keys: POST /api/v1/keys (1000 req/month).",
        401
      ),
    };
  }
  return authenticateGreenPublicRequest(req);
}

/** Premium+ endpoints (history, DPP export batch). */
export async function requireGreenPremiumApiKey(req: Request) {
  const authResult = await requireGreenApiKey(req);
  if (!authResult.ok) return authResult;

  const tier = authResult.auth.tier;
  if (tier !== "premium" && tier !== "enterprise") {
    return {
      ok: false as const,
      response: greenApiError(
        "premium_required",
        "Green API Premium required — subscribe at /green/api or /partners.",
        402,
        authResult.auth
      ),
    };
  }
  return authResult;
}

export function batchMaxItemsForTier(tier: GreenApiTier): number {
  if (tier === "premium" || tier === "enterprise") return GREEN_PREMIUM_BATCH_MAX_ITEMS;
  return GREEN_FREE_BATCH_MAX_ITEMS;
}

export function bulkMaxIdsForTier(tier: GreenApiTier): number {
  if (tier === "anonymous") return GREEN_ANON_BULK_MAX_IDS;
  if (tier === "demo") return 10;
  return GREEN_FREE_BULK_MAX_IDS;
}
