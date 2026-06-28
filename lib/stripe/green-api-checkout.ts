import Stripe from "stripe";

import { siteOrigin } from "@/lib/emails/constants";
import type { Locale } from "@/lib/i18n";
import {
  GREEN_API_PREMIUM_AMOUNT_CENTS,
  GREEN_API_PREMIUM_PRODUCT,
  greenApiPremiumDescription,
  greenApiPremiumLabel,
} from "@/lib/green/green-api-pricing";

import { getStripe } from "./jurisdiction-checkout";

export function parseGreenApiPremiumMetadata(
  meta: Record<string, string>
): { email: string; locale: Locale } | null {
  if (meta.product !== GREEN_API_PREMIUM_PRODUCT) return null;
  const email = meta.email?.trim().toLowerCase();
  if (!email || !email.includes("@")) return null;
  const localeRaw = meta.locale?.trim();
  const locale: Locale =
    localeRaw === "en" || localeRaw === "es" || localeRaw === "fr" ? localeRaw : "fr";
  return { email, locale };
}

export type GreenApiCheckoutInput = {
  email: string;
  locale: Locale;
};

export async function createGreenApiPremiumCheckoutSession(
  input: GreenApiCheckoutInput,
  stripeClient?: Stripe
): Promise<{ url: string; sessionId: string } | null> {
  const stripe = stripeClient ?? getStripe();
  if (!stripe) return null;

  const origin = siteOrigin();
  const label = greenApiPremiumLabel(input.locale);
  const description = greenApiPremiumDescription(input.locale);

  const metadata: Record<string, string> = {
    product: GREEN_API_PREMIUM_PRODUCT,
    email: input.email,
    locale: input.locale,
  };

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: input.email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: GREEN_API_PREMIUM_AMOUNT_CENTS,
          recurring: { interval: "month" },
          product_data: { name: label, description },
        },
      },
    ],
    metadata,
    subscription_data: { metadata },
    success_url: `${origin}/green/api/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/green/api?cancelled=premium`,
    allow_promotion_codes: true,
  });

  if (!session.url) return null;
  return { url: session.url, sessionId: session.id };
}

export async function retrievePaidGreenApiPremiumSession(
  sessionId: string
): Promise<Stripe.Checkout.Session | null> {
  const stripe = getStripe();
  if (!stripe || !sessionId.trim()) return null;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId.trim());
    if (session.payment_status !== "paid" && session.status !== "complete") return null;
    const meta = parseGreenApiPremiumMetadata(
      (session.metadata ?? {}) as Record<string, string>
    );
    if (!meta) return null;
    return session;
  } catch {
    return null;
  }
}
