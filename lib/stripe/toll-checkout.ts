import Stripe from "stripe";

import { siteOrigin } from "@/lib/emails/constants";
import type { Locale } from "@/lib/i18n";
import { normalizePartnerCode } from "@/lib/partner-attribution";
import {
  TOLL_LIFECYCLE_CENTS,
  TOLL_LIFECYCLE_PRODUCT,
  TOLL_LOOKUP_PACK_CENTS,
  TOLL_LOOKUP_PACK_PRODUCT,
  isTollCashProduct,
  tollLifecycleDescription,
  tollLifecycleLabel,
  tollLookupPackDescription,
  tollLookupPackLabel,
  type TollCashProduct,
} from "@/lib/toll/lifecycle-pricing";
import { getStripe } from "@/lib/stripe/jurisdiction-checkout";

function resolveLocale(raw: string | undefined): Locale {
  if (raw === "en" || raw === "es" || raw === "ar" || raw === "zh") return raw;
  return "fr";
}

export type TollCheckoutMeta = {
  product: TollCashProduct;
  email: string;
  locale: Locale;
  company: string;
  partnerCode: string | null;
  /** Prefer API key hash for credit grant; email fallback */
  creditSubject: string;
};

export function parseTollCheckoutMetadata(
  meta: Record<string, string>
): TollCheckoutMeta | null {
  const product = meta.product ?? "";
  if (!isTollCashProduct(product)) return null;
  const email = meta.email?.trim().toLowerCase();
  if (!email || !email.includes("@")) return null;
  const creditSubject =
    meta.credit_subject?.trim() || `email:${email}`;
  return {
    product,
    email,
    locale: resolveLocale(meta.locale),
    company: meta.company?.trim() || "",
    partnerCode: normalizePartnerCode(meta.partner_code),
    creditSubject,
  };
}

export type TollCheckoutInput = {
  email: string;
  locale: Locale;
  company?: string;
  partnerCode?: string | null;
  creditSubject?: string | null;
};

async function createSession(input: {
  product: TollCashProduct;
  mode: "payment" | "subscription";
  cents: number;
  name: string;
  description: string;
  email: string;
  locale: Locale;
  company?: string;
  partnerCode?: string | null;
  creditSubject?: string | null;
  successPath: string;
  cancelPath: string;
}): Promise<{ url: string; sessionId: string } | null> {
  const stripe = getStripe();
  if (!stripe) return null;
  const origin = siteOrigin();
  const partnerCode = normalizePartnerCode(input.partnerCode);
  const creditSubject =
    input.creditSubject?.trim() || `email:${input.email}`;
  const metadata: Record<string, string> = {
    product: input.product,
    email: input.email,
    locale: input.locale,
    company: (input.company ?? "").slice(0, 160),
    credit_subject: creditSubject.slice(0, 120),
    ...(partnerCode ? { partner_code: partnerCode } : {}),
  };

  const priceData: Stripe.Checkout.SessionCreateParams.LineItem.PriceData = {
    currency: "eur",
    unit_amount: input.cents,
    product_data: {
      name: input.name,
      description: input.description,
    },
  };
  if (input.mode === "subscription") {
    priceData.recurring = { interval: "month" };
  }

  const session = await stripe.checkout.sessions.create({
    mode: input.mode,
    customer_email: input.email,
    line_items: [{ quantity: 1, price_data: priceData }],
    metadata,
    ...(input.mode === "subscription"
      ? { subscription_data: { metadata } }
      : {}),
    success_url: `${origin}${input.successPath}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}${input.cancelPath}`,
    allow_promotion_codes: true,
  });

  if (!session.url) return null;
  return { url: session.url, sessionId: session.id };
}

export async function createTollLookupPackCheckout(input: TollCheckoutInput) {
  return createSession({
    product: TOLL_LOOKUP_PACK_PRODUCT,
    mode: "payment",
    cents: TOLL_LOOKUP_PACK_CENTS,
    name: tollLookupPackLabel(input.locale),
    description: tollLookupPackDescription(input.locale),
    email: input.email,
    locale: input.locale,
    company: input.company,
    partnerCode: input.partnerCode,
    creditSubject: input.creditSubject,
    successPath: "/green/toll/success",
    cancelPath: "/green/toll?cancelled=1",
  });
}

export async function createTollLifecycleCheckout(input: TollCheckoutInput) {
  return createSession({
    product: TOLL_LIFECYCLE_PRODUCT,
    mode: "subscription",
    cents: TOLL_LIFECYCLE_CENTS,
    name: tollLifecycleLabel(input.locale),
    description: tollLifecycleDescription(input.locale),
    email: input.email,
    locale: input.locale,
    company: input.company,
    partnerCode: input.partnerCode,
    creditSubject: input.creditSubject,
    successPath: "/green/toll/success",
    cancelPath: "/green/toll?cancelled=1",
  });
}

/** Retrieve a paid/complete Toll checkout session (success page). */
export async function retrievePaidTollSession(
  sessionId: string
): Promise<Stripe.Checkout.Session | null> {
  const stripe = getStripe();
  if (!stripe || !sessionId.trim()) return null;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId.trim());
    if (session.payment_status !== "paid" && session.status !== "complete") {
      return null;
    }
    const meta = parseTollCheckoutMetadata(
      (session.metadata ?? {}) as Record<string, string>
    );
    if (!meta) return null;
    return session;
  } catch {
    return null;
  }
}
