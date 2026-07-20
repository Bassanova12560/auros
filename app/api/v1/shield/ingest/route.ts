import { SITE_URL } from "@/lib/comparators/site";
import {
  authenticateProtocolRequest,
  checkPremiumAccess,
  findKeyRecord,
  logProtocolUsage,
  premiumPricingMeta,
  protocolError,
  protocolJson,
  protocolRoute,
} from "@/lib/protocol";
import {
  SHIELD_DISCLAIMER,
  createCloudTapReceipt,
  getTapUsage,
  incrementTapUsage,
  shieldPlanFromPremium,
  shieldTapLimit,
} from "@/lib/shield";

export const runtime = "nodejs";

/**
 * Easiest integration: POST raw bytes / text — no JSON schema.
 * Headers: Authorization Bearer · optional X-AUROS-Shield-Label
 * Body = anything (export, webhook, CSV). Hashed then discarded.
 */
export const POST = protocolRoute(async (req: Request) => {
  const auth = await authenticateProtocolRequest(req);
  if (!auth.ok) return auth.response;

  const rawKey = req.headers.get("authorization")?.slice(7).trim() ?? "";
  const record = await findKeyRecord(auth.ctx.keyHash);
  const premium = checkPremiumAccess(rawKey, record);
  const plan = shieldPlanFromPremium(premium.allowed);
  const limit = shieldTapLimit(plan);
  const usage = getTapUsage(auth.ctx.keyHash);

  if (usage.count >= limit) {
    return protocolJson(
      {
        error: {
          code: "shield_tap_quota_exceeded",
          message: `Free Shield limit (${limit}/mo). Premium unlocks unlimited ingest + Evidence Pack.`,
        },
        plan,
        used: usage.count,
        limit,
        ...premiumPricingMeta(),
      },
      { status: 429 }
    );
  }

  const label =
    req.headers.get("x-auros-shield-label")?.trim() ||
    req.headers.get("x-shield-label")?.trim() ||
    undefined;

  const raw = await req.text();
  if (!raw || raw.length < 1) {
    return protocolError(
      "validation_error",
      "Send a non-empty body (any content-type). No JSON schema required.",
      400
    );
  }

  // Cap free ingest body size soft — avoid abuse (1 MB)
  if (plan === "free" && raw.length > 1_000_000) {
    return protocolError(
      "payload_too_large",
      "Free ingest max 1MB. Premium allows larger binary taps via content_hash-only mode.",
      413
    );
  }

  const result = createCloudTapReceipt(
    {
      body: raw,
      kind: "tap",
      label,
      plan,
    },
    SITE_URL
  );

  if (!result.ok) {
    return protocolError(
      result.status === 503 ? "service_unavailable" : "validation_error",
      result.error,
      result.status
    );
  }

  const used = incrementTapUsage(auth.ctx.keyHash);
  await logProtocolUsage(auth.ctx.keyHash, "/api/v1/shield/ingest", "POST", 200);

  return protocolJson({
    ok: true,
    integration: "ingest_raw",
    ...result.receipt,
    quota: { plan, used, limit, remaining: Math.max(0, limit - used) },
    next: {
      verify: "POST /api/v1/shield/verify",
      pack_premium: "POST /api/v1/shield/pack",
      one_liner:
        "instrumentFetch({ apiKey }) — wrap fetch without changing business code",
    },
    disclaimer: SHIELD_DISCLAIMER,
    ...(plan === "free" ? premiumPricingMeta() : {}),
  });
});
