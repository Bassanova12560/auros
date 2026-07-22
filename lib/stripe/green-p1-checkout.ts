import Stripe from "stripe";

import { siteOrigin } from "@/lib/emails/constants";
import type { Locale } from "@/lib/i18n";
import {
  GREEN_FAST_TRACK_CENTS,
  GREEN_FAST_TRACK_PRODUCT,
  GREEN_INDEX_PACK_CENTS,
  GREEN_INDEX_PACK_PRODUCT,
  GREEN_INVESTOR_ROOM_CENTS,
  GREEN_INVESTOR_ROOM_PRODUCT,
  GREEN_READINESS_MRR_CENTS,
  GREEN_READINESS_MRR_PRODUCT,
  greenFastTrackDescription,
  greenFastTrackLabel,
  greenIndexPackDescription,
  greenIndexPackLabel,
  greenInvestorRoomDescription,
  greenInvestorRoomLabel,
  greenReadinessMrrDescription,
  greenReadinessMrrLabel,
  type GreenP1Product,
} from "@/lib/green/p1-cash-pricing";

import { getStripe } from "./jurisdiction-checkout";

function resolveLocale(raw: string | undefined): Locale {
  if (raw === "en" || raw === "es" || raw === "ar" || raw === "zh") return raw;
  return "fr";
}

export type GreenP1CheckoutMeta = {
  product: GreenP1Product;
  email: string;
  locale: Locale;
  company: string;
  notes: string;
};

export function parseGreenP1CheckoutMetadata(
  meta: Record<string, string>
): GreenP1CheckoutMeta | null {
  const product = meta.product as GreenP1Product | undefined;
  if (
    product !== GREEN_FAST_TRACK_PRODUCT &&
    product !== GREEN_INVESTOR_ROOM_PRODUCT &&
    product !== GREEN_INDEX_PACK_PRODUCT &&
    product !== GREEN_READINESS_MRR_PRODUCT
  ) {
    return null;
  }
  const email = meta.email?.trim().toLowerCase();
  if (!email || !email.includes("@")) return null;
  return {
    product,
    email,
    locale: resolveLocale(meta.locale),
    company: meta.company?.trim() || "",
    notes: meta.notes?.trim() || "",
  };
}

export type GreenP1CheckoutInput = {
  email: string;
  locale: Locale;
  company?: string;
  notes?: string;
};

async function createSession(input: {
  product: GreenP1Product;
  mode: "payment" | "subscription";
  cents: number;
  name: string;
  description: string;
  email: string;
  locale: Locale;
  company?: string;
  notes?: string;
  successPath: string;
  cancelPath: string;
}): Promise<{ url: string; sessionId: string } | null> {
  const stripe = getStripe();
  if (!stripe) return null;
  const origin = siteOrigin();
  const metadata: Record<string, string> = {
    product: input.product,
    email: input.email,
    locale: input.locale,
    company: (input.company ?? "").slice(0, 160),
    notes: (input.notes ?? "").slice(0, 400),
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

export async function createGreenFastTrackCheckout(input: GreenP1CheckoutInput) {
  return createSession({
    product: GREEN_FAST_TRACK_PRODUCT,
    mode: "payment",
    cents: GREEN_FAST_TRACK_CENTS,
    name: greenFastTrackLabel(input.locale),
    description: greenFastTrackDescription(input.locale),
    email: input.email,
    locale: input.locale,
    company: input.company,
    notes: input.notes,
    successPath: "/green/fast-track/success",
    cancelPath: "/green/fast-track?cancelled=1",
  });
}

export async function createGreenInvestorRoomCheckout(
  input: GreenP1CheckoutInput
) {
  return createSession({
    product: GREEN_INVESTOR_ROOM_PRODUCT,
    mode: "payment",
    cents: GREEN_INVESTOR_ROOM_CENTS,
    name: greenInvestorRoomLabel(input.locale),
    description: greenInvestorRoomDescription(input.locale),
    email: input.email,
    locale: input.locale,
    company: input.company,
    notes: input.notes,
    successPath: "/green/investors/success",
    cancelPath: "/green/investors?cancelled=1",
  });
}

export async function createGreenIndexPackCheckout(input: GreenP1CheckoutInput) {
  return createSession({
    product: GREEN_INDEX_PACK_PRODUCT,
    mode: "subscription",
    cents: GREEN_INDEX_PACK_CENTS,
    name: greenIndexPackLabel(input.locale),
    description: greenIndexPackDescription(input.locale),
    email: input.email,
    locale: input.locale,
    company: input.company,
    notes: input.notes,
    successPath: "/data/index-pack/success",
    cancelPath: "/data/licence?cancelled=index-pack",
  });
}

export async function createGreenReadinessMrrCheckout(
  input: GreenP1CheckoutInput
) {
  return createSession({
    product: GREEN_READINESS_MRR_PRODUCT,
    mode: "subscription",
    cents: GREEN_READINESS_MRR_CENTS,
    name: greenReadinessMrrLabel(input.locale),
    description: greenReadinessMrrDescription(input.locale),
    email: input.email,
    locale: input.locale,
    company: input.company,
    notes: input.notes,
    successPath: "/green/readiness/success",
    cancelPath: "/green/readiness?cancelled=1",
  });
}

export async function retrievePaidGreenP1Session(
  sessionId: string,
  product: GreenP1Product
): Promise<Stripe.Checkout.Session | null> {
  const stripe = getStripe();
  if (!stripe || !sessionId.trim()) return null;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId.trim());
    if (session.payment_status !== "paid" && session.status !== "complete") {
      return null;
    }
    const meta = parseGreenP1CheckoutMetadata(
      (session.metadata ?? {}) as Record<string, string>
    );
    if (!meta || meta.product !== product) return null;
    return session;
  } catch {
    return null;
  }
}
