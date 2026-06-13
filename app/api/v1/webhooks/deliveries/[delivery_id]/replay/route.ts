import {
  authenticateProtocolRequest,
  checkPremiumAccess,
  protocolError,
  protocolJson,
  protocolRoute,
} from "@/lib/protocol";
import { findKeyRecord } from "@/lib/protocol/auth/keys";
import { deliveryToPublic, replayDelivery } from "@/lib/protocol/webhooks/deliveries";
import { logProtocolUsage } from "@/lib/protocol/usage/log";

type RouteContext = { params: Promise<{ delivery_id: string }> };

export const POST = protocolRoute(async (req: Request, context: RouteContext) => {
  const auth = await authenticateProtocolRequest(req);
  if (!auth.ok) return auth.response;

  const rawKey = req.headers.get("authorization")?.slice(7).trim() ?? "";
  const record = await findKeyRecord(auth.ctx.keyHash);
  const premium = checkPremiumAccess(rawKey, record);
  if (!premium.allowed) return premium.response;

  const { delivery_id } = await context.params;
  const result = await replayDelivery(delivery_id, auth.ctx.keyHash);
  if (!result) {
    return protocolError("not_found", "Delivery introuvable ou accès refusé", 404);
  }

  await logProtocolUsage(
    auth.ctx.keyHash,
    `/api/v1/webhooks/deliveries/${delivery_id}/replay`,
    "POST",
    200
  );

  return protocolJson({
    delivery: deliveryToPublic(result.delivery),
    ok: result.ok,
  });
});
