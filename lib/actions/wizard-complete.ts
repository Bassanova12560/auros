"use server";

import { markWizardPurchaseCompleted } from "@/lib/wizard/nurture";

export async function markWizardCompletedAction(
  email: string | null | undefined
): Promise<{ ok: boolean }> {
  if (!email?.trim()) return { ok: false };
  await markWizardPurchaseCompleted(email);
  return { ok: true };
}
