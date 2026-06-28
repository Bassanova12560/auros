import type Stripe from "stripe";

import { parseGreenApiPremiumMetadata } from "@/lib/stripe/green-api-checkout";
import { upgradeApiKeyTierByEmail } from "@/lib/protocol/auth/keys";

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

  const upgraded = await upgradeApiKeyTierByEmail(email, "premium");
  if (!upgraded) {
    console.warn("[fulfillGreenApiPremium] no api key for email", email);
    return false;
  }
  return true;
}

export async function downgradeGreenApiPremiumByEmail(email: string): Promise<boolean> {
  const normalized = email.trim().toLowerCase();
  if (!normalized.includes("@")) return false;
  return upgradeApiKeyTierByEmail(normalized, "free");
}
