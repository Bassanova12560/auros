/**
 * Billable lifecycle events — Stripe-like fee per reality event (v0 credits).
 */

import {
  appendProofStreamEvent,
  type ProofStreamAction,
  type ProofStreamEvent,
} from "@/lib/proof-stream";
import {
  consumeTollCredits,
  type TollMeterSubject,
} from "@/lib/toll/metering";

export type BillableLifecycleResult =
  | { ok: true; event: ProofStreamEvent; meterRemaining: number }
  | { ok: false; error: "quota_exceeded"; limit: number };

/**
 * Append Proof Stream event and consume 1 lifecycle credit (bonus events first).
 */
export async function appendBillableLifecycleEvent(input: {
  subject: TollMeterSubject;
  assetDnaId: string;
  action: ProofStreamAction;
  contentHash?: string;
  meta?: Record<string, unknown>;
}): Promise<BillableLifecycleResult> {
  const meter = await consumeTollCredits({
    subject: input.subject,
    op: "lifecycle_event",
  });
  if (!meter.allowed) {
    return { ok: false, error: "quota_exceeded", limit: meter.limit };
  }
  const event = appendProofStreamEvent({
    assetDnaId: input.assetDnaId,
    action: input.action,
    contentHash: input.contentHash,
    meta: {
      ...input.meta,
      billable: true,
      tollSubject: input.subject.id,
    },
  });
  return { ok: true, event, meterRemaining: meter.remaining };
}
