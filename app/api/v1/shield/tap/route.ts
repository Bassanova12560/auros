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
  appendShieldAudit,
  createCloudTapReceipt,
  getTapUsage,
  incrementTapUsage,
  notifyShieldTapWebhooks,
  shieldPlanFromPremium,
  shieldTapLimit,
} from "@/lib/shield";

export const runtime = "nodejs";

/**
 * Non-invasive proof tap — FREE (100/mo) · PREMIUM unlimited.
 * Hashes body (or accepts content_hash), discards payload, issues public cloud co-seal.
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
          message: `Free Shield tap limit reached (${limit}/mo). Upgrade to Protocol Premium / Monitor for unlimited anchors — getauros.com/developers#monitor`,
        },
        plan,
        used: usage.count,
        limit,
        ...premiumPricingMeta(),
      },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return protocolError("invalid_json", "Request body must be valid JSON", 400);
  }

  const b = body as {
    body?: string;
    content_hash?: string;
    kind?: string;
    local_signature?: string;
    profile?: string;
    tenant_ref?: string;
    label?: string;
  };

  if (b.profile === "hybrid_pqc_ready_v1" && plan !== "premium") {
    return protocolJson(
      {
        error: {
          code: "premium_required",
          message: "hybrid_pqc_ready_v1 requires Protocol Premium / Monitor.",
        },
        ...premiumPricingMeta(),
      },
      { status: 403 }
    );
  }

  const result = createCloudTapReceipt(
    {
      body: b.body,
      content_hash: b.content_hash,
      kind: (b.kind as "tap") ?? "tap",
      local_signature: b.local_signature,
      profile: b.profile as
        | "classical_hmac_sha256_v1"
        | "hybrid_pqc_ready_v1"
        | undefined,
      tenant_ref: b.tenant_ref ?? auth.ctx.keyHash,
      label: b.label,
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
  await logProtocolUsage(auth.ctx.keyHash, "/api/v1/shield/tap", "POST", 200);

  void notifyShieldTapWebhooks(auth.ctx.keyHash, result.receipt).catch(
    () => undefined
  );

  if (plan === "premium") {
    appendShieldAudit({
      key_hash: auth.ctx.keyHash,
      action: "tap",
      receipt_id: result.receipt.id,
      content_hash: result.receipt.content_hash,
    });
  }

  return protocolJson({
    ...result.receipt,
    quota: { plan, used, limit, remaining: Math.max(0, limit - used) },
    freemium: {
      free: ["proof_tap", "public_verify", "cbom"],
      premium: [
        "unlimited_taps",
        "batch",
        "hybrid_pqc_ready",
        "receipt_export",
        "audit_log",
        "reseal",
      ],
    },
    disclaimer: SHIELD_DISCLAIMER,
    ...(plan === "free" ? premiumPricingMeta() : {}),
  });
});
