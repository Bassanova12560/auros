import type Stripe from "stripe";

import type { Locale } from "@/lib/i18n";
import type { GreenImpactReportTier } from "@/lib/green/impact-report-pricing";
import {
  parseGreenImpactCheckoutMetadata,
  retrievePaidGreenImpactSession,
} from "@/lib/stripe/green-impact-checkout";
import { getSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Persists Green Impact Report entitlements after Stripe checkout.
 *
 * Env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY (server-only via getSupabaseServerClient).
 * Stripe session verification uses STRIPE_SECRET_KEY (see green-impact-checkout).
 */

export type GreenImpactPurchase = {
  email: string;
  tier: GreenImpactReportTier;
  locale: Locale;
  stripeSessionId: string;
  paidAt: string;
};

export async function fulfillGreenImpactPayment(session: {
  id: string;
  metadata?: Record<string, string> | null;
  customer_details?: { email?: string | null } | null;
  payment_intent?: string | { id: string } | null;
  amount_total?: number | null;
}): Promise<boolean> {
  const meta = parseGreenImpactCheckoutMetadata(
    (session.metadata ?? {}) as Record<string, string>
  );
  if (!meta) return false;

  const email =
    meta.email || session.customer_details?.email?.trim().toLowerCase() || "";
  if (!email) return false;

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : (session.payment_intent?.id ?? null);

  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("green_impact_report_purchases").upsert(
    {
      email,
      tier: meta.tier,
      stripe_session_id: session.id,
      stripe_payment_intent: paymentIntentId,
      amount_cents: session.amount_total ?? null,
      paid_at: new Date().toISOString(),
      locale: meta.locale,
    },
    { onConflict: "stripe_session_id" }
  );

  if (error) {
    console.error("[fulfillGreenImpactPayment]", error);
    return false;
  }

  return true;
}

export async function fulfillGreenImpactPaymentFromStripe(
  session: Stripe.Checkout.Session
): Promise<boolean> {
  if (session.payment_status !== "paid") return false;
  return fulfillGreenImpactPayment(session);
}

export async function getGreenImpactPurchaseBySession(
  sessionId: string
): Promise<GreenImpactPurchase | null> {
  const trimmed = sessionId.trim();
  if (!trimmed) return null;

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("green_impact_report_purchases")
    .select("email, tier, locale, stripe_session_id, paid_at")
    .eq("stripe_session_id", trimmed)
    .maybeSingle();

  if (error || !data?.paid_at) return null;

  return {
    email: data.email as string,
    tier: data.tier as GreenImpactReportTier,
    locale: data.locale as Locale,
    stripeSessionId: data.stripe_session_id as string,
    paidAt: data.paid_at as string,
  };
}

/** DB entitlement first; falls back to paid Stripe session + fulfill (webhook race). */
export async function verifyGreenImpactReportEntitlement(
  sessionId: string
): Promise<GreenImpactPurchase | null> {
  const trimmed = sessionId.trim();
  if (!trimmed) return null;

  const existing = await getGreenImpactPurchaseBySession(trimmed);
  if (existing) return existing;

  const session = await retrievePaidGreenImpactSession(trimmed);
  if (!session) return null;

  const fulfilled = await fulfillGreenImpactPayment(session);
  if (!fulfilled) return null;

  return getGreenImpactPurchaseBySession(trimmed);
}
