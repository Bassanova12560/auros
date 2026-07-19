import {
  authenticateProtocolRequest,
  checkPremiumAccess,
  countActiveMonitors,
  createMonitor,
  listMonitorsForKey,
  monitorRequestSchema,
  premiumPricingMeta,
  protocolError,
  protocolJson,
  protocolRoute,
} from "@/lib/protocol";
import { findKeyRecord } from "@/lib/protocol/auth/keys";
import { logProtocolUsage } from "@/lib/protocol/usage/log";
import { monitorAssetLimitForRecord } from "@/lib/protocol/auth/premium";
import { computeMonitorRegulatoryDelta } from "@/lib/protocol/monitor/delta";

export const GET = protocolRoute(async (req: Request) => {
  const auth = await authenticateProtocolRequest(req);
  if (!auth.ok) return auth.response;

  const rawKey = req.headers.get("authorization")?.slice(7).trim() ?? "";
  const record = await findKeyRecord(auth.ctx.keyHash);
  const premium = checkPremiumAccess(rawKey, record);
  if (!premium.allowed) return premium.response;

  const monitors = await listMonitorsForKey(auth.ctx.keyHash);
  const items = monitors.map((monitor) => {
    const delta = computeMonitorRegulatoryDelta(monitor);
    return {
      id: monitor.id,
      status: monitor.status,
      asset_type: monitor.asset_type,
      jurisdiction: monitor.jurisdiction,
      structure: monitor.structure,
      rules_version: monitor.rules_version,
      created_at: monitor.created_at,
      last_alert_at: monitor.last_alert_at,
      delta: {
        item_count: delta.item_count,
        impact_sum: delta.impact_sum,
        rules_version_changed: delta.rules_version_changed,
      },
    };
  });

  await logProtocolUsage(auth.ctx.keyHash, "/api/v1/monitor", "GET", 200);

  return protocolJson({
    total: items.length,
    limit: monitorAssetLimitForRecord(record),
    items,
    ...premiumPricingMeta(),
  });
});

export const POST = protocolRoute(async (req: Request) => {
  const auth = await authenticateProtocolRequest(req);
  if (!auth.ok) return auth.response;

  const rawKey = req.headers.get("authorization")?.slice(7).trim() ?? "";
  const record = await findKeyRecord(auth.ctx.keyHash);
  const premium = checkPremiumAccess(rawKey, record);
  if (!premium.allowed) return premium.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return protocolError("invalid_json", "Request body must be valid JSON", 400);
  }

  const parsed = monitorRequestSchema.safeParse(body);
  if (!parsed.success) {
    return protocolError(
      "validation_error",
      parsed.error.issues.map((i) => i.message).join("; "),
      400
    );
  }

  const activeCount = await countActiveMonitors(auth.ctx.keyHash);
  const limit = monitorAssetLimitForRecord(record);
  if (activeCount >= limit) {
    return protocolError(
      "quota_exceeded",
      `Limite de monitors atteinte (${limit} actifs). Passez au plan Monitor Pro (199€/mo · 25 actifs) ou Enterprise.`,
      429
    );
  }

  const monitor = await createMonitor(auth.ctx.keyHash, parsed.data, auth.ctx.email);

  await logProtocolUsage(auth.ctx.keyHash, "/api/v1/monitor", "POST", 201);

  return protocolJson(
    {
      id: monitor.id,
      status: monitor.status === "deleted" ? "paused" : monitor.status,
      asset_type: monitor.asset_type,
      jurisdiction: monitor.jurisdiction,
      structure: monitor.structure,
      alert_on: monitor.alert_on,
      webhook_url: monitor.webhook_url,
      email: monitor.email,
      baseline_score: monitor.baseline_score,
      rules_version: monitor.rules_version,
      baseline_feed_ids: monitor.baseline_feed_ids,
      created_at: monitor.created_at,
      ...premiumPricingMeta(),
    },
    { status: 201 }
  );
});
