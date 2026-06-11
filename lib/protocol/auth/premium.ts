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

/** Premium gate: live keys or paid tier. Free/test/demo → 403. */
export function checkPremiumAccess(
  rawKey: string,
  record?: Pick<ApiKeyRecord, "tier" | "prefix"> | null
): { allowed: true } | { allowed: false; response: ReturnType<typeof protocolError> } {
  if (rawKey.startsWith(KEY_PREFIX_LIVE)) {
    return { allowed: true };
  }
  if (record && isPremiumTier(record.tier)) {
    return { allowed: true };
  }
  return {
    allowed: false,
    response: protocolError(
      "premium_required",
      "Endpoint réservé au tier premium. Utilisez une clé auros_pk_live_* ou passez au plan Monitor (49€/mo · 5 actifs, 199€/mo · 25 actifs). Contact : contact@getauros.com",
      403
    ),
  };
}

export function premiumPricingMeta() {
  return {
    pricing: PREMIUM_PRICING,
    upgrade_url: "https://getauros.com/developers#premium",
    contact: "contact@getauros.com",
  };
}
