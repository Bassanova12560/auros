import Stripe from "stripe";

import { siteOrigin } from "@/lib/emails/constants";
import type { Locale } from "@/lib/i18n";
import { resolveCatalogLocale } from "@/lib/i18n";
import {
  jurisdictionProduct,
  type JurisdictionProductTier,
} from "@/lib/jurisdictions/pricing";

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) return null;
  if (!stripeClient) {
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}

export function stripeWebhookSecret(): string | null {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  return secret || null;
}

export type CreateCheckoutInput = {
  tier: JurisdictionProductTier;
  locale: Locale;
  leadId?: string;
  email?: string;
  customerName?: string;
};

export async function createJurisdictionCheckoutSession(
  input: CreateCheckoutInput,
  stripeClient?: Stripe
): Promise<{ url: string; sessionId: string } | null> {
  const stripe = stripeClient ?? getStripe();
  if (!stripe) return null;

  const product = jurisdictionProduct(input.tier);
  const origin = siteOrigin();

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
            name: product.name[resolveCatalogLocale(input.locale)] ?? product.name.fr,
            description:
              product.description[resolveCatalogLocale(input.locale)] ??
              product.description.fr,
          },
        },
      },
    ],
    metadata: {
      leadId: input.leadId ?? "",
      tier: input.tier,
      locale: input.locale,
      customerName: input.customerName ?? "",
    },
    success_url: `${origin}/starter/ready?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/jurisdictions?cancelled=1#devis`,
    allow_promotion_codes: true,
  });

  if (!session.url) return null;
  return { url: session.url, sessionId: session.id };
}
