import { isUpgradeTier } from "@/lib/stripe/wizard-checkout";
import { isWizardTier, type WizardTier } from "@/lib/wizard-modes";
import { getSupabaseServerClient } from "@/lib/supabase/server";

import type { WizardCheckoutInput } from "./wizard-checkout";

export async function resolveWizardUpgradeFrom(
  input: Pick<WizardCheckoutInput, "tier" | "email" | "upgradeFrom" | "previousSessionId">
): Promise<{ ok: true; upgradeFrom: WizardTier } | { ok: false; error: string }> {
  if (input.upgradeFrom) {
    if (!isUpgradeTier(input.upgradeFrom, input.tier)) {
      return { ok: false, error: "invalid_upgrade" };
    }
    return { ok: true, upgradeFrom: input.upgradeFrom };
  }

  const supabase = getSupabaseServerClient();

  if (input.previousSessionId?.trim()) {
    const { data, error } = await supabase
      .from("wizard_purchases")
      .select("tier")
      .eq("stripe_session_id", input.previousSessionId.trim())
      .maybeSingle();
    if (error || !data?.tier || !isWizardTier(data.tier)) {
      return { ok: false, error: "prior_purchase_not_found" };
    }
    if (!isUpgradeTier(data.tier, input.tier)) {
      return { ok: false, error: "invalid_upgrade" };
    }
    return { ok: true, upgradeFrom: data.tier };
  }

  return { ok: false, error: "prior_purchase_not_found" };
}
