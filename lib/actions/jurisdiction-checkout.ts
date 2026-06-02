"use server";

import { isValidCaptureEmail } from "@/lib/email-capture";
import { isLocale, type Locale } from "@/lib/i18n";
import {
  createJurisdictionCheckoutSession,
  getStripe,
} from "@/lib/stripe/jurisdiction-checkout";
import type { JurisdictionProductTier } from "@/lib/jurisdictions/pricing";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type CheckoutResult =
  | { ok: true; url: string }
  | { ok: false; error: "invalid" | "stripe_unconfigured" | "not_found" | "already_paid" };

export async function createJurisdictionCheckoutAction(input: {
  tier: JurisdictionProductTier;
  leadId?: string;
  email?: string;
  locale?: string;
}): Promise<CheckoutResult> {
  if (!getStripe()) {
    return { ok: false, error: "stripe_unconfigured" };
  }

  const tier = input.tier;
  if (tier !== "starter" && tier !== "launch") {
    return { ok: false, error: "invalid" };
  }

  const locale: Locale =
    input.locale && isLocale(input.locale) ? input.locale : "fr";
  const supabase = getSupabaseServerClient();

  let email = input.email?.trim().toLowerCase();
  let customerName: string | undefined;
  let leadId = input.leadId;

  if (leadId) {
    const { data: lead } = await supabase
      .from("jurisdiction_leads")
      .select("id, email, first_name, paid_at")
      .eq("id", leadId)
      .maybeSingle();

    if (!lead) return { ok: false, error: "not_found" };
    if (lead.paid_at) return { ok: false, error: "already_paid" };

    email = lead.email as string;
    customerName = lead.first_name as string;
  } else if (email && !isValidCaptureEmail(email)) {
    return { ok: false, error: "invalid" };
  }

  const session = await createJurisdictionCheckoutSession({
    tier,
    locale,
    leadId,
    email,
    customerName,
  });

  if (!session) return { ok: false, error: "stripe_unconfigured" };

  if (leadId) {
    await supabase
      .from("jurisdiction_leads")
      .update({ stripe_session_id: session.sessionId })
      .eq("id", leadId);
  }

  return { ok: true, url: session.url };
}
