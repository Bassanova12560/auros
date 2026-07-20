import {
  authenticateProtocolRequest,
  checkPremiumAccess,
  findKeyRecord,
  logProtocolUsage,
  premiumPricingMeta,
  protocolJson,
  protocolRoute,
} from "@/lib/protocol";
import { SHIELD_SLA, listShieldAudit } from "@/lib/shield";

export const runtime = "nodejs";

/** Premium audit trail — hash-only Shield actions. */
export const GET = protocolRoute(async (req: Request) => {
  const auth = await authenticateProtocolRequest(req);
  if (!auth.ok) return auth.response;

  const rawKey = req.headers.get("authorization")?.slice(7).trim() ?? "";
  const record = await findKeyRecord(auth.ctx.keyHash);
  const premium = checkPremiumAccess(rawKey, record);
  if (!premium.allowed) {
    return protocolJson(
      {
        error: {
          code: "premium_required",
          message: "Shield audit log is Premium.",
        },
        ...premiumPricingMeta(),
      },
      { status: 403 }
    );
  }

  const url = new URL(req.url);
  const limitRaw = url.searchParams.get("limit");
  const limit = limitRaw ? Number.parseInt(limitRaw, 10) : 50;
  const events = listShieldAudit(
    auth.ctx.keyHash,
    Number.isFinite(limit) ? limit : 50
  );

  await logProtocolUsage(auth.ctx.keyHash, "/api/v1/shield/audit", "GET", 200);

  return protocolJson({
    events,
    sla: SHIELD_SLA,
    count: events.length,
    ...premiumPricingMeta(),
  });
});
