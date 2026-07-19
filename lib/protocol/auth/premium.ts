import { KEY_PREFIX_LIVE } from "../constants";
import type { ApiKeyRecord } from "./keys";
import { protocolError } from "../response";
import type { MonitorPlan } from "../monitor/pricing";
import {
  MONITOR_PRO_MONTHLY_EUR,
  MONITOR_STARTER_MONTHLY_EUR,
} from "../monitor/pricing";

export const PREMIUM_PRICING = {
  monitor_starter: {
    price_eur: MONITOR_STARTER_MONTHLY_EUR,
    assets: 5,
    label: "Monitor Starter",
  },
  monitor_pro: {
    price_eur: MONITOR_PRO_MONTHLY_EUR,
    assets: 25,
    label: "Monitor Pro",
  },
  monitor_enterprise: {
    price_eur: null as number | null,
    assets: 100,
    label: "Monitor Enterprise",
    from_eur: 1000,
  },
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

type LimitRecord = Pick<ApiKeyRecord, "tier"> & {
  monitor_plan?: MonitorPlan | null;
};

/**
 * Monitor asset caps:
 * - Starter (monitor + starter) → 5
 * - Pro (monitor + pro) / Green premium → 25
 * - Enterprise → 100
 * - free / unknown → defaultCap (5)
 */
export function monitorAssetLimitForRecord(
  record?: LimitRecord | null,
  _legacyPaidCap = 25,
  defaultCap = 5
): number {
  if (!record) return defaultCap;
  if (record.tier === "enterprise") {
    return PREMIUM_PRICING.monitor_enterprise.assets;
  }
  if (record.tier === "monitor") {
    if (record.monitor_plan === "starter") {
      return PREMIUM_PRICING.monitor_starter.assets;
    }
    return PREMIUM_PRICING.monitor_pro.assets;
  }
  if (record.tier === "premium") {
    return PREMIUM_PRICING.monitor_pro.assets;
  }
  return defaultCap;
}

export function premiumPricingMeta() {
  return {
    pricing: PREMIUM_PRICING,
    upgrade_url: "https://getauros.com/developers#monitor",
    contact: "contact@getauros.com",
    enterprise: "Sales-led from €1 000/mo — contact@getauros.com",
  };
}

/** @deprecated Prefer monitorAssetLimitForRecord — kept for call-site clarity. */
export function isLivePrefixedKey(rawKey: string): boolean {
  return rawKey.startsWith(KEY_PREFIX_LIVE);
}
