import { PROTOCOL_DISCLAIMER } from "@/lib/protocol/constants";
import { enqueueWebhookDelivery } from "@/lib/protocol/webhooks/deliveries";
import type { WebhookEventPayload } from "@/lib/protocol/webhooks/sign";
import { listWebhooksForKey } from "@/lib/protocol/webhooks/store";

import type { ShieldReceipt } from "./tap";

export const SHIELD_WEBHOOK_TAP_CREATED = "shield.tap.created" as const;

function buildPayload(receipt: ShieldReceipt): WebhookEventPayload {
  return {
    event: SHIELD_WEBHOOK_TAP_CREATED,
    severity: "low",
    impact_on_score: 0,
    summary: `Shield proof tap created: ${receipt.id}`,
    details: {
      id: receipt.id,
      content_hash: receipt.content_hash,
      cloud_signature: receipt.cloud_signature,
      kind: receipt.kind,
      plan: receipt.plan,
      label: receipt.label,
      verify_url: receipt.verify_url,
      payload_retained: false,
    },
    timestamp: new Date().toISOString(),
    disclaimer: receipt.disclaimer || PROTOCOL_DISCLAIMER,
  };
}

/**
 * Notify webhooks subscribed to shield.tap.created for this API key.
 * Fire-and-forget — never fails the tap path.
 */
export async function notifyShieldTapWebhooks(
  keyHash: string,
  receipt: ShieldReceipt
): Promise<{ matched: number; fired: number; errors: number }> {
  if (!keyHash || keyHash === "demo") {
    return { matched: 0, fired: 0, errors: 0 };
  }

  let matched = 0;
  let fired = 0;
  let errors = 0;

  try {
    const hooks = await listWebhooksForKey(keyHash);
    const payload = buildPayload(receipt);
    for (const wh of hooks) {
      if (!wh.active || !wh.events.includes(SHIELD_WEBHOOK_TAP_CREATED)) continue;
      matched += 1;
      try {
        const result = await enqueueWebhookDelivery({
          url: wh.url,
          payload,
          key_hash: keyHash,
          webhook_id: wh.id,
        });
        if (result.ok) fired += 1;
        else errors += 1;
      } catch {
        errors += 1;
      }
    }
  } catch {
    return { matched, fired, errors: errors + 1 };
  }

  return { matched, fired, errors };
}
