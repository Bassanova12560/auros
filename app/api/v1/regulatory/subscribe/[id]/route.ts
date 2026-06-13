import {
  authenticateProtocolRequest,
  checkPremiumAccess,
  deleteRegulatorySubscription,
  getRegulatorySubscription,
  protocolError,
  protocolJson,
  protocolRoute,
} from "@/lib/protocol";
import { findKeyRecord } from "@/lib/protocol/auth/keys";
import { logProtocolUsage } from "@/lib/protocol/usage/log";

type RouteContext = { params: Promise<{ id: string }> };

export const GET = protocolRoute(async (req: Request, context: RouteContext) => {
  const auth = await authenticateProtocolRequest(req);
  if (!auth.ok) return auth.response;

  const rawKey = req.headers.get("authorization")?.slice(7).trim() ?? "";
  const record = await findKeyRecord(auth.ctx.keyHash);
  const premium = checkPremiumAccess(rawKey, record);
  if (!premium.allowed) return premium.response;

  const { id } = await context.params;
  const subscription = await getRegulatorySubscription(id, auth.ctx.keyHash);
  if (!subscription) {
    return protocolError("not_found", "Abonnement feed introuvable", 404);
  }

  await logProtocolUsage(
    auth.ctx.keyHash,
    "/api/v1/regulatory/subscribe/:id",
    "GET",
    200
  );

  return protocolJson({
    id: subscription.id,
    jurisdictions: subscription.jurisdictions,
    tags: subscription.tags,
    webhook_url: subscription.webhook_url,
    email: subscription.email,
    status: subscription.status,
    created_at: subscription.created_at,
    last_notified_at: subscription.last_notified_at,
    events: ["regulatory.update"],
  });
});

export const DELETE = protocolRoute(async (req: Request, context: RouteContext) => {
  const auth = await authenticateProtocolRequest(req);
  if (!auth.ok) return auth.response;

  const rawKey = req.headers.get("authorization")?.slice(7).trim() ?? "";
  const record = await findKeyRecord(auth.ctx.keyHash);
  const premium = checkPremiumAccess(rawKey, record);
  if (!premium.allowed) return premium.response;

  const { id } = await context.params;
  const deleted = await deleteRegulatorySubscription(id, auth.ctx.keyHash);
  if (!deleted) {
    return protocolError("not_found", "Abonnement feed introuvable", 404);
  }

  await logProtocolUsage(
    auth.ctx.keyHash,
    "/api/v1/regulatory/subscribe/:id",
    "DELETE",
    200
  );

  return protocolJson({ ok: true, id, status: "deleted" });
});
