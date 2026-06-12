import {
  authenticateProtocolRequest,
  checkPremiumAccess,
  protocolError,
  protocolJson,
  protocolRoute,
} from "@/lib/protocol";
import { findKeyRecord } from "@/lib/protocol/auth/keys";
import { deleteWebhook } from "@/lib/protocol/webhooks/store";
import { logProtocolUsage } from "@/lib/protocol/usage/log";

type RouteContext = { params: Promise<{ id: string }> };

export const DELETE = protocolRoute(async (req: Request, context: RouteContext) => {
  const auth = await authenticateProtocolRequest(req);
  if (!auth.ok) return auth.response;

  const rawKey = req.headers.get("authorization")?.slice(7).trim() ?? "";
  const record = await findKeyRecord(auth.ctx.keyHash);
  const premium = checkPremiumAccess(rawKey, record);
  if (!premium.allowed) return premium.response;

  const { id } = await context.params;
  const deleted = await deleteWebhook(id, auth.ctx.keyHash);
  if (!deleted) {
    return protocolError("not_found", "Webhook introuvable ou accès refusé", 404);
  }

  await logProtocolUsage(auth.ctx.keyHash, `/api/v1/webhooks/${id}`, "DELETE", 200);

  return protocolJson({ ok: true, id, deleted: true });
});
