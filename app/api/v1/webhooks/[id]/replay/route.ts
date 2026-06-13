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
  replayDeadLetterForWebhook,
  replayDelivery,
} from "@/lib/protocol/webhooks/deliveries";
import { getWebhook } from "@/lib/protocol/webhooks/store";
import { logProtocolUsage } from "@/lib/protocol/usage/log";

type RouteContext = { params: Promise<{ id: string }> };

export const POST = protocolRoute(async (req: Request, context: RouteContext) => {
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

  let deliveryId: string | undefined;
  try {
    const body = (await req.json()) as { delivery_id?: string };
    deliveryId = body.delivery_id?.trim();
  } catch {
    // empty body — replay all dead letter
  }

  if (deliveryId) {
    const result = await replayDelivery(deliveryId, auth.ctx.keyHash);
    if (!result) {
      return protocolError("not_found", "Delivery introuvable ou accès refusé", 404);
    }
    if (result.delivery.webhook_id && result.delivery.webhook_id !== id) {
      return protocolError(
        "validation_error",
        "Cette delivery n'appartient pas à ce webhook",
        400
      );
    }

    await logProtocolUsage(
      auth.ctx.keyHash,
      `/api/v1/webhooks/${id}/replay`,
      "POST",
      200
    );

    return protocolJson({
      replayed: 1,
      delivery: deliveryToPublic(result.delivery),
      ok: result.ok,
    });
  }

  const batch = await replayDeadLetterForWebhook(id, auth.ctx.keyHash);

  await logProtocolUsage(
    auth.ctx.keyHash,
    `/api/v1/webhooks/${id}/replay`,
    "POST",
    200
  );

  return protocolJson({
    webhook_id: id,
    ...batch,
  });
});
