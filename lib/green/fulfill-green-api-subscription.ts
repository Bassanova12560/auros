import type Stripe from "stripe";

import {
  sendGreenApiPremiumActivated,
  sendGreenApiPremiumInternal,
} from "@/lib/emails/send";
import { parseGreenApiPremiumMetadata } from "@/lib/stripe/green-api-checkout";
import {
  createApiKey,
  findKeyByEmail,
  upgradeApiKeyTierByEmail,
} from "@/lib/protocol/auth/keys";
import { PREMIUM_TIER_MONTHLY_LIMIT } from "@/lib/protocol/constants";

export async function fulfillGreenApiPremiumSubscription(
  session: Stripe.Checkout.Session
): Promise<boolean> {
  const meta = parseGreenApiPremiumMetadata(
    (session.metadata ?? {}) as Record<string, string>
  );
  if (!meta) return false;

  const email =
    meta.email || session.customer_details?.email?.trim().toLowerCase() || "";
  if (!email) return false;

  let apiKey: string | null = null;
  const existing = await findKeyByEmail(email);
  if (!existing) {
    const created = await createApiKey(email);
    apiKey = created.apiKey;
  }

  const upgraded = await upgradeApiKeyTierByEmail(email, "premium");
  if (!upgraded) {
    console.warn("[fulfillGreenApiPremium] tier upgrade failed for", email);
    return false;
  }

  void sendGreenApiPremiumActivated(email, {
    apiKey,
    monthlyLimit: PREMIUM_TIER_MONTHLY_LIMIT,
  });
  void sendGreenApiPremiumInternal(email);

  return true;
}

export async function downgradeGreenApiPremiumByEmail(email: string): Promise<boolean> {
  const normalized = email.trim().toLowerCase();
  if (!normalized.includes("@")) return false;
  return upgradeApiKeyTierByEmail(normalized, "free");
}
