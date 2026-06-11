import Stripe from "stripe";

import { siteOrigin } from "@/lib/emails/constants";
import type { Locale } from "@/lib/i18n";
import {
  isWizardTier,
  WIZARD_TIER_AMOUNTS,
  WIZARD_TIER_LABELS,
  type WizardTier,
} from "@/lib/wizard-modes";

import { getStripe } from "./jurisdiction-checkout";

export { getStripe, stripeWebhookSecret } from "./jurisdiction-checkout";

export type WizardCheckoutInput = {
  tier: WizardTier;
  locale: Locale;
  email: string;
  firstName?: string;
};

export function wizardProduct(tier: WizardTier) {
  return {
    tier,
    currency: "eur" as const,
    amountCents: WIZARD_TIER_AMOUNTS[tier],
    name: WIZARD_TIER_LABELS[tier],
  };
}

export function parseWizardCheckoutMetadata(
  meta: Record<string, string>
): { tier: WizardTier; email: string; locale: Locale } | null {
  if (meta.product !== "wizard") return null;
  const tier = meta.wizard_tier?.trim();
  const email = meta.email?.trim().toLowerCase();
  if (!tier || !isWizardTier(tier) || !email || !email.includes("@")) {
    return null;
  }
  const localeRaw = meta.locale?.trim();
  const locale: Locale =
    localeRaw === "en" || localeRaw === "es" || localeRaw === "fr"
      ? localeRaw
      : "fr";
  return { tier, email, locale };
}

export async function createWizardCheckoutSession(
  input: WizardCheckoutInput,
  stripeClient?: Stripe
): Promise<{ url: string; sessionId: string } | null> {
  const stripe = stripeClient ?? getStripe();
  if (!stripe) return null;

  const product = wizardProduct(input.tier);
  const origin = siteOrigin();
  const label = product.name[input.locale] ?? product.name.fr;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: input.email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: product.currency,
          unit_amount: product.amountCents,
          product_data: {
            name: label,
            description:
              input.locale === "en"
                ? "AUROS Pro wizard — institutional dossier"
                : input.locale === "es"
                  ? "Wizard Pro AUROS — dossier institucional"
                  : "Wizard Pro AUROS — dossier institutionnel",
          },
        },
      },
    ],
    metadata: {
      product: "wizard",
      wizard_tier: input.tier,
      email: input.email,
      locale: input.locale,
      firstName: input.firstName ?? "",
    },
    success_url: `${origin}/wizard/ready?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/wizard/pro?cancelled=1`,
    allow_promotion_codes: true,
  });

  if (!session.url) return null;
  return { url: session.url, sessionId: session.id };
}
