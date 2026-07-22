import { isValidAssetDnaId } from "@/lib/asset-dna";
import type { ProofStreamAction } from "@/lib/proof-stream";
import { appendBillableLifecycleEvent } from "@/lib/toll/lifecycle";
import {
  parseJsonBody,
  protocolError,
  protocolJson,
  tollMeteredGuard,
} from "@/lib/toll/http";

export const runtime = "nodejs";

const ACTIONS = new Set<ProofStreamAction>([
  "dna.minted",
  "market.submitted",
  "market.approved",
  "market.rejected",
  "label.submitted",
  "registry.published",
  "compliance.updated",
  "doc.attached",
]);

/**
 * POST /api/v1/toll/lifecycle — billable Proof Stream event (Bearer).
 * Credits consumed inside appendBillableLifecycleEvent (bonus events first).
 */
export async function POST(request: Request) {
  const guard = await tollMeteredGuard(request, "schema", { requireAuth: true });
  if (!guard.ok) return guard.response;

  const parsed = await parseJsonBody(request);
  if (!parsed.ok) return parsed.response;

  const assetDnaId = String(parsed.body.assetDnaId ?? "").trim();
  const action = String(parsed.body.action ?? "") as ProofStreamAction;
  if (!isValidAssetDnaId(assetDnaId)) {
    return protocolError("invalid_id", "Invalid Asset DNA id", 400);
  }
  if (!ACTIONS.has(action)) {
    return protocolError("invalid_action", "Unsupported lifecycle action", 400);
  }

  const result = await appendBillableLifecycleEvent({
    subject: guard.subject,
    assetDnaId,
    action,
    contentHash:
      typeof parsed.body.contentHash === "string"
        ? parsed.body.contentHash
        : undefined,
    meta:
      parsed.body.meta && typeof parsed.body.meta === "object"
        ? (parsed.body.meta as Record<string, unknown>)
        : undefined,
  });

  if (!result.ok) {
    return protocolError(
      "quota_exceeded",
      `Lifecycle event credits exceeded (${result.limit}/mo). Buy Lifecycle Maintain at /green/toll.`,
      429
    );
  }

  return protocolJson({
    ok: true,
    event: result.event,
    meter: { remaining: result.meterRemaining, cost: 1 },
  });
}
