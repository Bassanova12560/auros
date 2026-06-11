"use server";

import { getWizardPurchaseBySession } from "@/lib/wizard/fulfill-payment";

export type WizardUnlockResult =
  | { ok: true; unlocked: true; tier: string; email: string }
  | { ok: true; unlocked: false }
  | { ok: false; error: "missing_session" };

export async function getWizardUnlockBySessionAction(
  sessionId: string | null | undefined
): Promise<WizardUnlockResult> {
  if (!sessionId?.trim()) {
    return { ok: false, error: "missing_session" };
  }

  const result = await getWizardPurchaseBySession(sessionId.trim());
  if (!result.ok) {
    return { ok: true, unlocked: false };
  }

  if (!result.unlocked || !result.tier || !result.email) {
    return { ok: true, unlocked: false };
  }

  return {
    ok: true,
    unlocked: true,
    tier: result.tier,
    email: result.email,
  };
}
