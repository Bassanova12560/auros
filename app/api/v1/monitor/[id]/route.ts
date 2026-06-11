import {
  authenticateProtocolRequest,
  checkPremiumAccess,
  deleteMonitor,
  getMonitor,
  premiumPricingMeta,
  protocolError,
  protocolJson,
} from "@/lib/protocol";
import { findKeyRecord } from "@/lib/protocol/auth/keys";
import { logProtocolUsage } from "@/lib/protocol/usage/log";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(req: Request, context: RouteContext) {
  const auth = await authenticateProtocolRequest(req);
  if (!auth.ok) return auth.response;

  const rawKey = req.headers.get("authorization")?.slice(7).trim() ?? "";
  const record = await findKeyRecord(auth.ctx.keyHash);
  const premium = checkPremiumAccess(rawKey, record);
  if (!premium.allowed) return premium.response;

  const { id } = await context.params;
  const monitor = await getMonitor(id, auth.ctx.keyHash);
  if (!monitor) {
    return protocolError("not_found", "Monitor introuvable ou accès refusé", 404);
  }

  await logProtocolUsage(auth.ctx.keyHash, `/api/v1/monitor/${id}`, "GET", 200);

  return protocolJson({
    id: monitor.id,
    status: monitor.status,
    asset_type: monitor.asset_type,
    jurisdiction: monitor.jurisdiction,
    structure: monitor.structure,
    alert_on: monitor.alert_on,
    webhook_url: monitor.webhook_url,
    email: monitor.email,
    baseline_score: monitor.baseline_score,
    created_at: monitor.created_at,
    updated_at: monitor.updated_at,
    last_checked_at: monitor.last_checked_at,
    last_alert_at: monitor.last_alert_at,
    ...premiumPricingMeta(),
  });
}

export async function DELETE(req: Request, context: RouteContext) {
  const auth = await authenticateProtocolRequest(req);
  if (!auth.ok) return auth.response;

  const rawKey = req.headers.get("authorization")?.slice(7).trim() ?? "";
  const record = await findKeyRecord(auth.ctx.keyHash);
  const premium = checkPremiumAccess(rawKey, record);
  if (!premium.allowed) return premium.response;

  const { id } = await context.params;
  const deleted = await deleteMonitor(id, auth.ctx.keyHash);
  if (!deleted) {
    return protocolError("not_found", "Monitor introuvable ou accès refusé", 404);
  }

  await logProtocolUsage(auth.ctx.keyHash, `/api/v1/monitor/${id}`, "DELETE", 200);

  return protocolJson({ ok: true, id, deleted: true });
}
