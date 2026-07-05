import type Stripe from "stripe";

import type { Locale } from "@/lib/i18n";
import {
  parseGreenLabelCheckoutMetadata,
  retrievePaidGreenLabelSession,
} from "@/lib/stripe/green-label-checkout";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type GreenLabelPaymentRecord = {
  applicationId: string;
  email: string;
  locale: Locale;
  stripeSessionId: string;
  paidAt: string;
};

export async function getGreenLabelApplicationForCheckout(
  applicationId: string,
  email: string,
): Promise<{ id: string; projectName: string; paidAt: string | null } | null> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("green_label_applications")
    .select("id, project_name, email, paid_at")
    .eq("id", applicationId.trim())
    .maybeSingle();

  if (error || !data) return null;
  if (String(data.email).trim().toLowerCase() !== email.trim().toLowerCase()) {
    return null;
  }

  return {
    id: String(data.id),
    projectName: String(data.project_name),
    paidAt: data.paid_at ? String(data.paid_at) : null,
  };
}

export async function fulfillGreenLabelPayment(session: {
  id: string;
  metadata?: Record<string, string> | null;
  customer_details?: { email?: string | null } | null;
  payment_intent?: string | { id: string } | null;
  amount_total?: number | null;
}): Promise<boolean> {
  const meta = parseGreenLabelCheckoutMetadata(
    (session.metadata ?? {}) as Record<string, string>,
  );
  if (!meta) return false;

  const email =
    meta.email || session.customer_details?.email?.trim().toLowerCase() || "";
  if (!email) return false;

  const application = await getGreenLabelApplicationForCheckout(
    meta.applicationId,
    email,
  );
  if (!application) return false;
  if (application.paidAt) return true;

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : (session.payment_intent?.id ?? null);

  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from("green_label_applications")
    .update({
      stripe_session_id: session.id,
      stripe_payment_intent: paymentIntentId,
      amount_cents: session.amount_total ?? null,
      paid_at: new Date().toISOString(),
    })
    .eq("id", meta.applicationId)
    .is("paid_at", null);

  if (error) {
    console.error("[fulfillGreenLabelPayment]", error);
    return false;
  }

  return true;
}

export async function fulfillGreenLabelPaymentFromStripe(
  session: Stripe.Checkout.Session,
): Promise<boolean> {
  if (session.payment_status !== "paid") return false;
  return fulfillGreenLabelPayment(session);
}

export async function getGreenLabelPaymentBySession(
  sessionId: string,
): Promise<GreenLabelPaymentRecord | null> {
  const trimmed = sessionId.trim();
  if (!trimmed) return null;

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("green_label_applications")
    .select("id, email, preferred_locale, stripe_session_id, paid_at")
    .eq("stripe_session_id", trimmed)
    .maybeSingle();

  if (error || !data?.paid_at) return null;

  const localeRaw = data.preferred_locale ? String(data.preferred_locale) : "fr";
  const locale: Locale =
    localeRaw === "en" || localeRaw === "es" || localeRaw === "fr" ? localeRaw : "fr";

  return {
    applicationId: String(data.id),
    email: String(data.email),
    locale,
    stripeSessionId: String(data.stripe_session_id),
    paidAt: String(data.paid_at),
  };
}

export async function verifyGreenLabelPayment(
  sessionId: string,
): Promise<GreenLabelPaymentRecord | null> {
  const trimmed = sessionId.trim();
  if (!trimmed) return null;

  const existing = await getGreenLabelPaymentBySession(trimmed);
  if (existing) return existing;

  const session = await retrievePaidGreenLabelSession(trimmed);
  if (!session) return null;

  const fulfilled = await fulfillGreenLabelPayment(session);
  if (!fulfilled) return null;

  return getGreenLabelPaymentBySession(trimmed);
}
