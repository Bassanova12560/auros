import Stripe from "stripe";

import { siteOrigin } from "@/lib/emails/constants";
import type { Locale } from "@/lib/i18n";
import {
  GREEN_MARKET_INTRO_CENTS,
  GREEN_MARKET_INTRO_PRODUCT,
  GREEN_MARKET_VERIFIED_CENTS,
  GREEN_MARKET_VERIFIED_PRODUCT,
  greenMarketIntroDescription,
  greenMarketIntroLabel,
  greenMarketVerifiedDescription,
  greenMarketVerifiedLabel,
} from "@/lib/green/market-cash-pricing";

import { getStripe } from "./jurisdiction-checkout";

function resolveLocale(raw: string | undefined): Locale {
  if (raw === "en" || raw === "es" || raw === "ar" || raw === "zh") return raw;
  return "fr";
}

export function parseGreenMarketIntroMetadata(
  meta: Record<string, string>
): {
  email: string;
  locale: Locale;
  offerId: string;
  offerTitle: string;
  actorName: string;
  visitorName: string;
  message: string;
} | null {
  if (meta.product !== GREEN_MARKET_INTRO_PRODUCT) return null;
  const email = meta.email?.trim().toLowerCase();
  if (!email || !email.includes("@")) return null;
  return {
    email,
    locale: resolveLocale(meta.locale),
    offerId: meta.offerId?.trim() || "",
    offerTitle: meta.offerTitle?.trim() || "",
    actorName: meta.actorName?.trim() || "",
    visitorName: meta.visitorName?.trim() || "",
    message: meta.message?.trim() || "",
  };
}

export function parseGreenMarketVerifiedMetadata(
  meta: Record<string, string>
): { email: string; locale: Locale; company: string; actorId: string; notes: string } | null {
  if (meta.product !== GREEN_MARKET_VERIFIED_PRODUCT) return null;
  const email = meta.email?.trim().toLowerCase();
  if (!email || !email.includes("@")) return null;
  return {
    email,
    locale: resolveLocale(meta.locale),
    company: meta.company?.trim() || "",
    actorId: meta.actorId?.trim() || "",
    notes: meta.notes?.trim() || "",
  };
}

export type GreenMarketIntroCheckoutInput = {
  email: string;
  locale: Locale;
  offerId: string;
  offerTitle: string;
  actorName: string;
  visitorName?: string;
  message?: string;
};

export async function createGreenMarketIntroCheckoutSession(
  input: GreenMarketIntroCheckoutInput,
  stripeClient?: Stripe
): Promise<{ url: string; sessionId: string } | null> {
  const stripe = stripeClient ?? getStripe();
  if (!stripe) return null;

  const origin = siteOrigin();
  const metadata: Record<string, string> = {
    product: GREEN_MARKET_INTRO_PRODUCT,
    email: input.email,
    locale: input.locale,
    offerId: input.offerId.slice(0, 120),
    offerTitle: input.offerTitle.slice(0, 200),
    actorName: input.actorName.slice(0, 120),
    visitorName: (input.visitorName ?? "").slice(0, 120),
    message: (input.message ?? "").slice(0, 400),
  };

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: input.email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: GREEN_MARKET_INTRO_CENTS,
          product_data: {
            name: greenMarketIntroLabel(input.locale),
            description: greenMarketIntroDescription(input.locale),
          },
        },
      },
    ],
    metadata,
    success_url: `${origin}/green/market/intro/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/green/market/offer/${encodeURIComponent(input.offerId)}?cancelled=intro`,
    allow_promotion_codes: true,
  });

  if (!session.url) return null;
  return { url: session.url, sessionId: session.id };
}

export type GreenMarketVerifiedCheckoutInput = {
  email: string;
  locale: Locale;
  company?: string;
  actorId?: string;
  notes?: string;
};

export async function createGreenMarketVerifiedCheckoutSession(
  input: GreenMarketVerifiedCheckoutInput,
  stripeClient?: Stripe
): Promise<{ url: string; sessionId: string } | null> {
  const stripe = stripeClient ?? getStripe();
  if (!stripe) return null;

  const origin = siteOrigin();
  const metadata: Record<string, string> = {
    product: GREEN_MARKET_VERIFIED_PRODUCT,
    email: input.email,
    locale: input.locale,
    company: (input.company ?? "").slice(0, 160),
    actorId: (input.actorId ?? "").slice(0, 120),
    notes: (input.notes ?? "").slice(0, 400),
  };

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: input.email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: GREEN_MARKET_VERIFIED_CENTS,
          product_data: {
            name: greenMarketVerifiedLabel(input.locale),
            description: greenMarketVerifiedDescription(input.locale),
          },
        },
      },
    ],
    metadata,
    success_url: `${origin}/green/market/verified/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/green/market?cancelled=verified`,
    allow_promotion_codes: true,
  });

  if (!session.url) return null;
  return { url: session.url, sessionId: session.id };
}

export async function retrievePaidGreenMarketSession(
  sessionId: string,
  product: typeof GREEN_MARKET_INTRO_PRODUCT | typeof GREEN_MARKET_VERIFIED_PRODUCT
): Promise<Stripe.Checkout.Session | null> {
  const stripe = getStripe();
  if (!stripe || !sessionId.trim()) return null;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId.trim());
    if (session.payment_status !== "paid" && session.status !== "complete") {
      return null;
    }
    const meta = (session.metadata ?? {}) as Record<string, string>;
    if (meta.product !== product) return null;
    return session;
  } catch {
    return null;
  }
}
