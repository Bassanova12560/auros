import {
  sendJurisdictionPaymentConfirmation,
  sendJurisdictionPaymentInternal,
} from "@/lib/emails/send";
import { siteOrigin } from "@/lib/emails/constants";
import type { Locale } from "@/lib/i18n";
import { parseCheckoutMetadata } from "@/lib/jurisdictions/checkout-metadata";
import { fulfillJurisdictionPaymentForLead } from "@/lib/jurisdictions/fulfill-payment-core";
import { jurisdictionProduct } from "@/lib/jurisdictions/pricing";
import type { JurisdictionProductTier } from "@/lib/jurisdictions/pricing";
import { deliverStarterKitForLead } from "@/lib/jurisdictions/starter-kit-deliver-core";
import { notifyJurisdictionWebhook } from "@/lib/jurisdictions/webhook-notify";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export { parseCheckoutMetadata };
export { fulfillJurisdictionPaymentForLead } from "@/lib/jurisdictions/fulfill-payment-core";

export async function fulfillJurisdictionPayment(input: {
  leadId: string;
  tier: JurisdictionProductTier;
  locale: Locale;
  sessionId: string;
  paymentIntentId?: string;
  amountCents?: number;
}): Promise<boolean> {
  return fulfillJurisdictionPaymentForLead(getSupabaseServerClient(), input);
}

export async function fulfillWalkInPayment(input: {
  session: {
    id: string;
    customer_details?: { email?: string | null; name?: string | null } | null;
    payment_intent?: string | { id: string } | null;
    amount_total?: number | null;
  };
  tier: JurisdictionProductTier;
  locale: Locale;
}): Promise<boolean> {
  const email = input.session.customer_details?.email?.trim().toLowerCase();
  if (!email) return false;

  const name =
    input.session.customer_details?.name?.trim() || email.split("@")[0];
  const supabase = getSupabaseServerClient();

  const { data: lead, error } = await supabase
    .from("jurisdiction_leads")
    .insert({
      kind: "quote",
      first_name: name,
      email,
      project_type: "other",
      jurisdictions: ["unsure"],
      locale: input.locale,
      status: "paid",
      paid_at: new Date().toISOString(),
      paid_tier: input.tier,
      lead_score: 50,
      lead_tier: "warm",
      stripe_session_id: input.session.id,
      stripe_payment_intent:
        typeof input.session.payment_intent === "string"
          ? input.session.payment_intent
          : input.session.payment_intent?.id ?? null,
    })
    .select("id")
    .single();

  if (error || !lead) {
    console.error("[fulfillWalkInPayment]", error);
    return false;
  }

  const product = jurisdictionProduct(input.tier);
  const paymentIntentId =
    typeof input.session.payment_intent === "string"
      ? input.session.payment_intent
      : input.session.payment_intent?.id;

  const delivery = await deliverStarterKitForLead(supabase, lead.id as string);
  const portalUrl = delivery.ok
    ? `${siteOrigin()}/starter/${delivery.token}`
    : undefined;

  if (!delivery.ok) {
    void sendJurisdictionPaymentConfirmation(email, {
      firstName: name,
      tier: product.name[input.locale] ?? product.name.fr,
      locale: input.locale,
      pendingDelivery: true,
    });
  }

  void sendJurisdictionPaymentInternal({
    firstName: name,
    email,
    tier: product.name[input.locale] ?? product.name.fr,
    sessionId: input.session.id,
    amountCents: input.session.amount_total ?? undefined,
    portalUrl,
    deliveryOk: delivery.ok,
  });

  void notifyJurisdictionWebhook({
    event: "jurisdiction.payment.paid",
    leadId: lead.id as string,
    kind: "quote",
    email,
    firstName: name,
    leadScore: 50,
    leadTier: "warm",
    paidTier: input.tier,
    amountCents: input.session.amount_total ?? undefined,
  });

  return true;
}
