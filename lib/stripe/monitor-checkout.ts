import Stripe from "stripe";

import { siteOrigin } from "@/lib/emails/constants";
import type { Locale } from "@/lib/i18n";
import {
  MONITOR_PRODUCT,
  monitorPlanAmountCents,
  monitorPlanDescription,
  monitorPlanLabel,
  type MonitorPlan,
} from "@/lib/protocol/monitor/pricing";

import { getStripe } from "./jurisdiction-checkout";

export function parseMonitorCheckoutMetadata(
  meta: Record<string, string>
): { email: string; locale: Locale; plan: MonitorPlan } | null {
  if (meta.product !== MONITOR_PRODUCT) return null;
  const email = meta.email?.trim().toLowerCase();
  if (!email || !email.includes("@")) return null;
  const plan = meta.plan === "pro" ? "pro" : meta.plan === "starter" ? "starter" : null;
  if (!plan) return null;
  const localeRaw = meta.locale?.trim();
  const locale: Locale =
    localeRaw === "en" || localeRaw === "es" || localeRaw === "fr" ? localeRaw : "fr";
  return { email, locale, plan };
}

export type MonitorCheckoutInput = {
  email: string;
  locale: Locale;
  plan: MonitorPlan;
};

export async function createMonitorCheckoutSession(
  input: MonitorCheckoutInput,
  stripeClient?: Stripe
): Promise<{ url: string; sessionId: string } | null> {
  const stripe = stripeClient ?? getStripe();
  if (!stripe) return null;

  const origin = siteOrigin();
  const label = monitorPlanLabel(input.plan, input.locale);
  const description = monitorPlanDescription(input.plan, input.locale);

  const metadata: Record<string, string> = {
    product: MONITOR_PRODUCT,
    plan: input.plan,
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
          unit_amount: monitorPlanAmountCents(input.plan),
          recurring: { interval: "month" },
          product_data: { name: label, description },
        },
      },
    ],
    metadata,
    subscription_data: { metadata },
    success_url: `${origin}/developers/monitor/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/developers?cancelled=monitor#monitor`,
    allow_promotion_codes: true,
  });

  if (!session.url) return null;
  return { url: session.url, sessionId: session.id };
}

export async function retrievePaidMonitorSession(
  sessionId: string
): Promise<Stripe.Checkout.Session | null> {
  const stripe = getStripe();
  if (!stripe || !sessionId.trim()) return null;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId.trim());
    if (session.payment_status !== "paid" && session.status !== "complete") return null;
    const meta = parseMonitorCheckoutMetadata(
      (session.metadata ?? {}) as Record<string, string>
    );
    if (!meta) return null;
    return session;
  } catch {
    return null;
  }
}
