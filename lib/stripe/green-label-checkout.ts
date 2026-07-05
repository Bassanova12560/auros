import Stripe from "stripe";

import { siteOrigin } from "@/lib/emails/constants";
import type { Locale } from "@/lib/i18n";
import { greenLabelReviewProduct } from "@/lib/green/label-pricing";

import { getStripe } from "./jurisdiction-checkout";

export { getStripe } from "./jurisdiction-checkout";

export type GreenLabelCheckoutInput = {
  applicationId: string;
  email: string;
  locale: Locale;
  projectName?: string;
};

export function parseGreenLabelCheckoutMetadata(
  meta: Record<string, string>,
): { applicationId: string; email: string; locale: Locale } | null {
  if (meta.product !== "green_label_review") return null;
  const applicationId = meta.application_id?.trim();
  const email = meta.email?.trim().toLowerCase();
  if (!applicationId || !email || !email.includes("@")) return null;
  const localeRaw = meta.locale?.trim();
  const locale: Locale =
    localeRaw === "en" || localeRaw === "es" || localeRaw === "fr" ? localeRaw : "fr";
  return { applicationId, email, locale };
}

export async function createGreenLabelCheckoutSession(
  input: GreenLabelCheckoutInput,
  stripeClient?: Stripe,
): Promise<{ url: string; sessionId: string } | null> {
  const stripe = stripeClient ?? getStripe();
  if (!stripe) return null;

  const product = greenLabelReviewProduct();
  const origin = siteOrigin();
  const label = product.name[input.locale] ?? product.name.fr;

  const description =
    input.locale === "en"
      ? "RTMS document review for AUROS Green Verified label candidacy"
      : input.locale === "es"
        ? "Revisión documental RTMS para candidatura AUROS Green Verified"
        : "Revue documentaire RTMS pour candidature Label AUROS Green Verified";

  const metadata: Record<string, string> = {
    product: "green_label_review",
    application_id: input.applicationId,
    email: input.email,
    locale: input.locale,
    projectName: input.projectName ?? "",
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
    success_url: `${origin}/green/label/ready?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/green/label?cancelled=label_payment`,
    allow_promotion_codes: true,
  });

  if (!session.url) return null;
  return { url: session.url, sessionId: session.id };
}

export async function retrievePaidGreenLabelSession(
  sessionId: string,
): Promise<Stripe.Checkout.Session | null> {
  const stripe = getStripe();
  if (!stripe || !sessionId.trim()) return null;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId.trim());
    if (session.payment_status !== "paid") return null;
    const meta = parseGreenLabelCheckoutMetadata(
      (session.metadata ?? {}) as Record<string, string>,
    );
    if (!meta) return null;
    return session;
  } catch {
    return null;
  }
}
