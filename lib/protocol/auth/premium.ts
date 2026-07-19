import { KEY_PREFIX_LIVE } from "../constants";
import type { ApiKeyRecord } from "./keys";
import { protocolError } from "../response";

export const PREMIUM_PRICING = {
  monitor_starter: { price_eur: 49, assets: 5, label: "Monitor Starter" },
  monitor_pro: { price_eur: 199, assets: 25, label: "Monitor Pro" },
} as const;

export function isPremiumTier(tier: ApiKeyRecord["tier"] | undefined): boolean {
  return tier === "premium" || tier === "monitor" || tier === "enterprise";
}

/**
 * Premium gate — paid tier on the key record only.
 * Live prefix alone is NOT enough (free keys are also issued as auros_pk_live_*).
 */
export function checkPremiumAccess(
  _rawKey: string,
  record?: Pick<ApiKeyRecord, "tier" | "prefix"> | null
): { allowed: true } | { allowed: false; response: ReturnType<typeof protocolError> } {
  if (record && isPremiumTier(record.tier)) {
    return { allowed: true };
  }
  return {
    allowed: false,
    response: protocolError(
      "premium_required",
      "Endpoint réservé au tier premium / Monitor / Enterprise. Passez au plan Monitor (49€/mo · 5 actifs, 199€/mo · 25 actifs) ou contactez contact@getauros.com. Une clé auros_pk_live_* gratuite ne suffit pas.",
      403
    ),
  };
}

/** Higher monitor asset caps for paid tiers (not merely live-prefixed free keys). */
export function monitorAssetLimitForRecord(
  record?: Pick<ApiKeyRecord, "tier"> | null,
  liveCap = 25,
  defaultCap = 5
): number {
  if (!record) return defaultCap;
  if (record.tier === "enterprise") return liveCap;
  if (record.tier === "premium" || record.tier === "monitor") return liveCap;
  return defaultCap;
}

export function premiumPricingMeta() {
  return {
    pricing: PREMIUM_PRICING,
    upgrade_url: "https://getauros.com/developers#premium",
    contact: "contact@getauros.com",
  };
}

/** @deprecated Prefer monitorAssetLimitForRecord — kept for call-site clarity. */
export function isLivePrefixedKey(rawKey: string): boolean {
  return rawKey.startsWith(KEY_PREFIX_LIVE);
}
