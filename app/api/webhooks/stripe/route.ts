/** Requires STRIPE_SECRET_KEY + STRIPE_WEBHOOK_SECRET (lib/stripe/jurisdiction-checkout). */
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { fulfillJurisdictionPayment, fulfillWalkInPayment, parseCheckoutMetadata } from "@/lib/jurisdictions/fulfill-payment";
import { fulfillAcademyDiplomaPayment } from "@/lib/academy/fulfill-diploma-payment";
import { parseAcademyDiplomaMetadata } from "@/lib/academy/diploma-checkout";
import { fulfillGreenImpactPaymentFromStripe } from "@/lib/green/fulfill-impact-payment";
import { fulfillGreenApiPremiumSubscription, downgradeGreenApiPremiumByEmail } from "@/lib/green/fulfill-green-api-subscription";
import { getStripe, stripeWebhookSecret } from "@/lib/stripe/jurisdiction-checkout";
import { parseGreenImpactCheckoutMetadata } from "@/lib/stripe/green-impact-checkout";
import { parseGreenApiPremiumMetadata } from "@/lib/stripe/green-api-checkout";
import { parseWizardCheckoutMetadata } from "@/lib/stripe/wizard-checkout";
import { fulfillWizardPayment } from "@/lib/wizard/fulfill-payment";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const stripe = getStripe();
  const secret = stripeWebhookSecret();

  if (!stripe || !secret) {
    return NextResponse.json({ error: "stripe_unconfigured" }, { status: 503 });
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "missing_signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch (err) {
    console.error("[stripe-webhook]", err);
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const sessionMeta = (session.metadata ?? {}) as Record<string, string>;

    const wizardMeta = parseWizardCheckoutMetadata(sessionMeta);
    if (wizardMeta) {
      await fulfillWizardPayment(session);
      return NextResponse.json({ received: true });
    }

    const academyMeta = parseAcademyDiplomaMetadata(sessionMeta);
    if (academyMeta) {
      await fulfillAcademyDiplomaPayment(session);
      return NextResponse.json({ received: true });
    }

    const greenImpactMeta = parseGreenImpactCheckoutMetadata(sessionMeta);
    if (greenImpactMeta) {
      await fulfillGreenImpactPaymentFromStripe(session);
      return NextResponse.json({ received: true });
    }

    const greenApiMeta = parseGreenApiPremiumMetadata(sessionMeta);
    if (greenApiMeta) {
      await fulfillGreenApiPremiumSubscription(session);
      return NextResponse.json({ received: true });
    }

    const meta = parseCheckoutMetadata(
      (session.metadata ?? {}) as Record<string, string>
    );

    if (meta?.leadId) {
      await fulfillJurisdictionPayment({
        leadId: meta.leadId,
        tier: meta.tier,
        locale: meta.locale,
        sessionId: session.id,
        paymentIntentId:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id,
        amountCents: session.amount_total ?? undefined,
      });
    } else if (meta) {
      await fulfillWalkInPayment({
        session,
        tier: meta.tier,
        locale: meta.locale,
      });
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const meta = (subscription.metadata ?? {}) as Record<string, string>;
    const parsed = parseGreenApiPremiumMetadata(meta);
    if (parsed) {
      await downgradeGreenApiPremiumByEmail(parsed.email);
    }
  }

  return NextResponse.json({ received: true });
}
