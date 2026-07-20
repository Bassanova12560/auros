import {
  sendWizardProPaymentConfirmation,
  sendWizardProPaymentInternal,
} from "@/lib/emails/send";
import { siteOrigin } from "@/lib/emails/constants";
import type { Locale } from "@/lib/i18n";
import { parseWizardCheckoutMetadata } from "@/lib/stripe/wizard-checkout";
import { resolveCatalogLocale } from "@/lib/i18n";
import { WIZARD_TIER_LABELS, type WizardTier } from "@/lib/wizard-modes";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function fulfillWizardPayment(session: {
  id: string;
  metadata?: Record<string, string> | null;
  customer_details?: { email?: string | null; name?: string | null } | null;
  payment_intent?: string | { id: string } | null;
  amount_total?: number | null;
}): Promise<boolean> {
  const meta = parseWizardCheckoutMetadata(
    (session.metadata ?? {}) as Record<string, string>
  );
  if (!meta) return false;

  const email =
    meta.email ||
    session.customer_details?.email?.trim().toLowerCase() ||
    "";
  if (!email) return false;

  const firstName =
    session.metadata?.firstName?.trim() ||
    session.customer_details?.name?.trim() ||
    email.split("@")[0];

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id ?? null;

  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("wizard_purchases").upsert(
    {
      email,
      tier: meta.tier,
      stripe_session_id: session.id,
      stripe_payment_intent: paymentIntentId,
      amount_cents: session.amount_total ?? null,
      paid_at: new Date().toISOString(),
      wizard_unlocked: true,
      locale: meta.locale,
      upgrade_from: meta.upgradeFrom ?? null,
    },
    { onConflict: "stripe_session_id" }
  );

  if (error) {
    console.error("[fulfillWizardPayment]", error);
    return false;
  }

  const tierLabel =
    WIZARD_TIER_LABELS[meta.tier][resolveCatalogLocale(meta.locale)] ??
    WIZARD_TIER_LABELS[meta.tier].fr;
  const wizardUrl = `${siteOrigin()}/wizard?mode=pro&session_id=${encodeURIComponent(session.id)}`;

  void sendWizardProPaymentConfirmation(email, {
    firstName,
    tier: tierLabel,
    locale: meta.locale,
    wizardUrl,
  });

  void sendWizardProPaymentInternal({
    firstName,
    email,
    tier: tierLabel,
    sessionId: session.id,
    amountCents: session.amount_total ?? undefined,
    wizardUrl,
  });

  return true;
}

export async function getWizardPurchaseBySession(
  sessionId: string
): Promise<{
  ok: boolean;
  unlocked: boolean;
  tier?: WizardTier;
  email?: string;
}> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("wizard_purchases")
    .select("wizard_unlocked, tier, email, paid_at")
    .eq("stripe_session_id", sessionId)
    .maybeSingle();

  if (error || !data) {
    return { ok: false, unlocked: false };
  }

  return {
    ok: true,
    unlocked: data.wizard_unlocked === true && !!data.paid_at,
    tier: data.tier as WizardTier,
    email: data.email as string,
  };
}
