import {
  authenticateProtocolRequest,
  checkPremiumAccess,
  protocolError,
  protocolJson,
  protocolRoute,
} from "@/lib/protocol";
import { findKeyRecord } from "@/lib/protocol/auth/keys";
import {
  deliveryToPublic,
  listDeliveriesForWebhook,
} from "@/lib/protocol/webhooks/deliveries";
import type { WebhookDeliveryStatus } from "@/lib/protocol/webhooks/deliveries";
import { getWebhook } from "@/lib/protocol/webhooks/store";
import { logProtocolUsage } from "@/lib/protocol/usage/log";

type RouteContext = { params: Promise<{ id: string }> };

const VALID_STATUSES = new Set<WebhookDeliveryStatus>([
  "pending",
  "delivered",
  "failed",
  "dead_letter",
]);

export const GET = protocolRoute(async (req: Request, context: RouteContext) => {
  const auth = await authenticateProtocolRequest(req);
  if (!auth.ok) return auth.response;

  const rawKey = req.headers.get("authorization")?.slice(7).trim() ?? "";
  const record = await findKeyRecord(auth.ctx.keyHash);
  const premium = checkPremiumAccess(rawKey, record);
  if (!premium.allowed) return premium.response;

  const { id } = await context.params;
  const webhook = await getWebhook(id, auth.ctx.keyHash);
  if (!webhook) {
    return protocolError("not_found", "Webhook introuvable ou accès refusé", 404);
  }

  const url = new URL(req.url);
  const limit = Number(url.searchParams.get("limit") ?? "20");
  const offset = Number(url.searchParams.get("offset") ?? "0");
  const statusParam = url.searchParams.get("status");
  const status =
    statusParam && VALID_STATUSES.has(statusParam as WebhookDeliveryStatus)
      ? (statusParam as WebhookDeliveryStatus)
      : undefined;

  const resolvedLimit = Math.min(Math.max(Number.isFinite(limit) ? limit : 20, 1), 100);
  const resolvedOffset = Math.max(Number.isFinite(offset) ? offset : 0, 0);

  const { deliveries, total } = await listDeliveriesForWebhook(id, auth.ctx.keyHash, {
    limit: resolvedLimit,
    offset: resolvedOffset,
    status,
  });

  await logProtocolUsage(
    auth.ctx.keyHash,
    `/api/v1/webhooks/${id}/deliveries`,
    "GET",
    200
  );

  return protocolJson({
    webhook_id: id,
    deliveries: deliveries.map(deliveryToPublic),
    total,
    limit: resolvedLimit,
    offset: resolvedOffset,
  });
});
