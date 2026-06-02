import type { Locale } from "@/lib/i18n";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { createJurisdictionCheckoutSession } from "@/lib/stripe/jurisdiction-checkout";
import type { JurisdictionProductTier } from "./pricing";

export async function checkoutUrlForLead(
  leadId: string,
  locale: Locale,
  email: string,
  customerName: string,
  tier: JurisdictionProductTier = "starter"
): Promise<string | undefined> {
  const session = await createJurisdictionCheckoutSession({
    tier,
    locale,
    leadId,
    email,
    customerName,
  });
  if (!session) return undefined;

  const supabase = getSupabaseServerClient();
  await supabase
    .from("jurisdiction_leads")
    .update({ stripe_session_id: session.sessionId })
    .eq("id", leadId);

  return session.url;
}
