import type { SupabaseClient } from "@supabase/supabase-js";

import {
  sendJurisdictionPaymentConfirmation,
  sendJurisdictionPaymentInternal,
} from "@/lib/emails/send";
import { siteOrigin } from "@/lib/emails/constants";
import type { Locale } from "@/lib/i18n";
import { jurisdictionProduct } from "@/lib/jurisdictions/pricing";
import type { JurisdictionProductTier } from "@/lib/jurisdictions/pricing";
import { notifyJurisdictionWebhook } from "@/lib/jurisdictions/webhook-notify";

import { deliverStarterKitForLead } from "./starter-kit-deliver-core";

export async function fulfillJurisdictionPaymentForLead(
  supabase: SupabaseClient,
  input: {
    leadId: string;
    tier: JurisdictionProductTier;
    locale: Locale;
    sessionId: string;
    paymentIntentId?: string;
    amountCents?: number;
  },
  options: { sendEmails?: boolean } = {}
): Promise<boolean> {
  const sendEmails = options.sendEmails !== false;

  const { data: lead } = await supabase
    .from("jurisdiction_leads")
    .select("id, email, first_name, paid_at, kind")
    .eq("id", input.leadId)
    .maybeSingle();

  if (!lead || lead.paid_at) return Boolean(lead?.paid_at);

  const now = new Date().toISOString();
  const { error } = await supabase
    .from("jurisdiction_leads")
    .update({
      status: "paid",
      paid_at: now,
      paid_tier: input.tier,
      stripe_session_id: input.sessionId,
      stripe_payment_intent: input.paymentIntentId ?? null,
    })
    .eq("id", input.leadId);

  if (error) {
    console.error("[fulfillJurisdictionPayment]", error);
    return false;
  }

  const product = jurisdictionProduct(input.tier);
  const delivery = await deliverStarterKitForLead(supabase, input.leadId, {
    sendEmails,
  });
  const portalUrl = delivery.ok
    ? `${siteOrigin()}/starter/${delivery.token}`
    : undefined;

  if (!delivery.ok) {
    console.error("[fulfillJurisdictionPayment] delivery failed", delivery.error);
    if (sendEmails) {
      void sendJurisdictionPaymentConfirmation(lead.email as string, {
        firstName: lead.first_name as string,
        tier: product.name[input.locale] ?? product.name.fr,
        locale: input.locale,
        pendingDelivery: true,
      });
    }
  }

  if (sendEmails) {
    void sendJurisdictionPaymentInternal({
      firstName: lead.first_name as string,
      email: lead.email as string,
      tier: product.name[input.locale] ?? product.name.fr,
      sessionId: input.sessionId,
      amountCents: input.amountCents,
      portalUrl,
      deliveryOk: delivery.ok,
    });
  }

  void notifyJurisdictionWebhook({
    event: "jurisdiction.payment.paid",
    leadId: input.leadId,
    kind: lead.kind as "guide" | "quote",
    email: lead.email as string,
    firstName: lead.first_name as string,
    leadScore: 100,
    leadTier: "hot",
    paidTier: input.tier,
    amountCents: input.amountCents,
  });

  return true;
}
