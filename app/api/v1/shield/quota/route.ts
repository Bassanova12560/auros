import {
  authenticateProtocolRequest,
  checkPremiumAccess,
  findKeyRecord,
  logProtocolUsage,
  premiumPricingMeta,
  protocolJson,
  protocolRoute,
} from "@/lib/protocol";
import {
  SHIELD_FREE_TAP_MONTHLY,
  getTapUsage,
  listReceiptsForExport,
  shieldPlanFromPremium,
  shieldTapLimit,
} from "@/lib/shield";

export const runtime = "nodejs";

/** GET quota + recent receipts for dashboard. */
export const GET = protocolRoute(async (req: Request) => {
  const auth = await authenticateProtocolRequest(req);
  if (!auth.ok) return auth.response;

  const rawKey = req.headers.get("authorization")?.slice(7).trim() ?? "";
  const record = await findKeyRecord(auth.ctx.keyHash);
  const premium = checkPremiumAccess(rawKey, record);
  const plan = shieldPlanFromPremium(premium.allowed);
  const limit = shieldTapLimit(plan);
  const usage = getTapUsage(auth.ctx.keyHash);
  const remaining = Math.max(0, limit - usage.count);
  const receipts = listReceiptsForExport(20, auth.ctx.keyHash);

  await logProtocolUsage(auth.ctx.keyHash, "/api/v1/shield/quota", "GET", 200);

  return protocolJson({
    plan,
    month: usage.month,
    used: usage.count,
    limit,
    remaining,
    free_monthly: SHIELD_FREE_TAP_MONTHLY,
    receipts,
    upgrade_url: "/developers#monitor",
    dashboard_url: `/developers/shield/dashboard?key=…`,
    next:
      plan === "free"
        ? {
            pack: "Upgrade Premium → POST /api/v1/shield/pack",
            try: "/developers/shield#essayer",
          }
        : {
            pack: "POST /api/v1/shield/pack",
            audit: "GET /api/v1/shield/audit",
            reseal: "POST /api/v1/shield/reseal",
          },
    ...(plan === "free" ? premiumPricingMeta() : {}),
  });
});
