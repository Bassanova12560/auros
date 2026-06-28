import { checkRateLimit } from "@/lib/rate-limit";
import {
  sendGreenApiQuotaNurture,
} from "@/lib/emails/send";
import { GREEN_API_PREMIUM_MONTHLY_EUR } from "@/lib/green/green-api-pricing";
import { listFreeTierKeysNearQuota } from "@/lib/protocol/auth/keys";
import { FREE_TIER_MONTHLY_LIMIT } from "@/lib/protocol/constants";

const NURTURE_WINDOW_MS = 28 * 24 * 60 * 60 * 1000;

export async function runGreenApiQuotaNurture(): Promise<{
  candidates: number;
  sent: number;
}> {
  const rows = await listFreeTierKeysNearQuota(0.8);
  let sent = 0;

  for (const row of rows) {
    const dedupe = checkRateLimit(
      `green-api-quota-nurture:${row.key_hash}`,
      1,
      NURTURE_WINDOW_MS
    );
    if (!dedupe.allowed) continue;

    const ok = await sendGreenApiQuotaNurture(row.email, {
      usage: row.usage,
      limit: row.limit,
    });
    if (ok) sent++;
  }

  return { candidates: rows.length, sent };
}

export function greenApiUpsellPayload(auth?: {
  tier: string;
  rateLimit: { remaining: number; limit: number };
}): Record<string, unknown> | null {
  if (!auth || auth.tier === "premium" || auth.tier === "enterprise") return null;
  const { remaining, limit } = auth.rateLimit;
  if (limit <= 0) return null;
  const ratio = remaining / limit;
  if (ratio > 0.2) return null;
  return {
    upgrade_url: "/green/api",
    premium_monthly_eur: GREEN_API_PREMIUM_MONTHLY_EUR,
    premium_monthly_limit: 25_000,
    message:
      "Quota free bientôt épuisé — Green API Premium : 25k req/mois, batch 50, historique.",
  };
}

export { FREE_TIER_MONTHLY_LIMIT };
