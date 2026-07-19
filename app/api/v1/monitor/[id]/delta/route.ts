import {
  authenticateProtocolRequest,
  checkPremiumAccess,
  getMonitor,
  premiumPricingMeta,
  protocolError,
  protocolJson,
  protocolRoute,
} from "@/lib/protocol";
import { findKeyRecord } from "@/lib/protocol/auth/keys";
import { logProtocolUsage } from "@/lib/protocol/usage/log";
import { computeMonitorRegulatoryDelta } from "@/lib/protocol/monitor/delta";

type RouteContext = { params: Promise<{ id: string }> };

export const GET = protocolRoute(async (req: Request, context: RouteContext) => {
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

  const delta = computeMonitorRegulatoryDelta(monitor);

  await logProtocolUsage(
    auth.ctx.keyHash,
    `/api/v1/monitor/${id}/delta`,
    "GET",
    200
  );

  return protocolJson({
    monitor_id: monitor.id,
    jurisdiction: monitor.jurisdiction,
    asset_type: monitor.asset_type,
    twin: "regulatory_lite",
    ...delta,
    ...premiumPricingMeta(),
  });
});
