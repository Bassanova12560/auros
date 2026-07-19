import { PROTOCOL_DISCLAIMER } from "@/lib/protocol/constants";
import { enqueueWebhookDelivery } from "@/lib/protocol/webhooks/deliveries";
import type { WebhookEventPayload } from "@/lib/protocol/webhooks/sign";
import { listWebhooksForKey } from "@/lib/protocol/webhooks/store";

import { chargeflowVerifyUrl } from "./store";
import type { ChargeflowRecord } from "./store";

export const CHARGEFLOW_WEBHOOK_MINTED = "chargeflow.unit.minted" as const;
export const CHARGEFLOW_WEBHOOK_RETIRED = "chargeflow.unit.retired" as const;

export type ChargeflowWebhookEvent =
  | typeof CHARGEFLOW_WEBHOOK_MINTED
  | typeof CHARGEFLOW_WEBHOOK_RETIRED;

function buildPayload(
  event: ChargeflowWebhookEvent,
  record: ChargeflowRecord
): WebhookEventPayload {
  const verb = event === CHARGEFLOW_WEBHOOK_MINTED ? "minted" : "retired";
  return {
    event,
    severity: "low",
    impact_on_score: 0,
    summary: `ChargeFlow CFU-${record.unit_kind.toUpperCase()} ${verb}: ${record.id}`,
    details: {
      id: record.id,
      unit_kind: record.unit_kind,
      status: record.status,
      content_hash: record.content_hash,
      external_ref: record.external_ref,
      operator_id: record.operator_id,
      verify_url: chargeflowVerifyUrl(record.id),
      retired_at: record.retired_at,
      retire_reason: record.retire_reason,
      public: {
        energy_kwh: record.public.energy_kwh ?? null,
        volume_m3: record.public.volume_m3 ?? null,
        capacity_kw: record.public.capacity_kw ?? null,
      },
    },
    timestamp: new Date().toISOString(),
    disclaimer: record.disclaimer || PROTOCOL_DISCLAIMER,
  };
}

/**
 * Notify webhooks registered on this API key for ChargeFlow lifecycle events.
 * Fire-and-forget safe: errors are swallowed so mint/retire never fail on webhook issues.
 */
export async function notifyChargeflowWebhooks(
  keyHash: string,
  event: ChargeflowWebhookEvent,
  record: ChargeflowRecord
): Promise<{ matched: number; fired: number; errors: number }> {
  if (!keyHash || keyHash === "demo") {
    return { matched: 0, fired: 0, errors: 0 };
  }

  let matched = 0;
  let fired = 0;
  let errors = 0;

  try {
    const hooks = await listWebhooksForKey(keyHash);
    const payload = buildPayload(event, record);
    for (const wh of hooks) {
      if (!wh.active || !wh.events.includes(event)) continue;
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
