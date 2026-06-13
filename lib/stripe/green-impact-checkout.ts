import Stripe from "stripe";

import { siteOrigin } from "@/lib/emails/constants";
import type { Locale } from "@/lib/i18n";
import {
  greenImpactReportProduct,
  isGreenImpactReportTier,
  type GreenImpactReportTier,
} from "@/lib/green/impact-report-pricing";

import { getStripe } from "./jurisdiction-checkout";

export { getStripe } from "./jurisdiction-checkout";

export type GreenImpactCheckoutInput = {
  tier: GreenImpactReportTier;
  locale: Locale;
  email: string;
  firstName?: string;
};

export function parseGreenImpactCheckoutMetadata(
  meta: Record<string, string>
): { tier: GreenImpactReportTier; email: string; locale: Locale } | null {
  if (meta.product !== "green_impact_report") return null;
  const tier = meta.tier?.trim();
  const email = meta.email?.trim().toLowerCase();
  if (!tier || !isGreenImpactReportTier(tier) || !email || !email.includes("@")) {
    return null;
  }
  const localeRaw = meta.locale?.trim();
  const locale: Locale =
    localeRaw === "en" || localeRaw === "es" || localeRaw === "fr" ? localeRaw : "fr";
  return { tier, email, locale };
}

export async function createGreenImpactCheckoutSession(
  input: GreenImpactCheckoutInput,
  stripeClient?: Stripe
): Promise<{ url: string; sessionId: string } | null> {
  const stripe = stripeClient ?? getStripe();
  if (!stripe) return null;

  const product = greenImpactReportProduct(input.tier);
  const origin = siteOrigin();
  const label = product.name[input.locale] ?? product.name.fr;

  const description =
    input.locale === "en"
      ? "EU Taxonomy + RTMS summary PDF from your AUROS Green dossier"
      : input.locale === "es"
        ? "PDF resumen EU Taxonomy + RTMS desde su dossier AUROS Green"
        : "PDF synthèse EU Taxonomy + RTMS depuis votre dossier AUROS Green";

  const metadata: Record<string, string> = {
    product: "green_impact_report",
    tier: input.tier,
    email: input.email,
    locale: input.locale,
    firstName: input.firstName ?? "",
  };

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: input.email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: product.currency,
          unit_amount: product.amountCents,
          product_data: { name: label, description },
        },
      },
    ],
    metadata,
    success_url: `${origin}/green/impact-report/ready?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/wizard?cancelled=impact_report`,
    allow_promotion_codes: true,
  });

  if (!session.url) return null;
  return { url: session.url, sessionId: session.id };
}

export async function retrievePaidGreenImpactSession(
  sessionId: string
): Promise<Stripe.Checkout.Session | null> {
  const stripe = getStripe();
  if (!stripe || !sessionId.trim()) return null;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId.trim());
    if (session.payment_status !== "paid") return null;
    const meta = parseGreenImpactCheckoutMetadata(
      (session.metadata ?? {}) as Record<string, string>
    );
    if (!meta) return null;
    return session;
  } catch {
    return null;
  }
}
