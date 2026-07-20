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
import { buildEvidencePack } from "@/lib/shield/evidence-pack";

export const runtime = "nodejs";

/**
 * Premium Evidence Pack — heavy bank deliverable when every company has RWAs.
 * Aggregates CFU + Shield taps into one sealed, hash-only pack with bank actions.
 */
export const POST = protocolRoute(async (req: Request) => {
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
          message:
            "Evidence Pack is Premium — continuous RWA proof for credit/ESG/auditors. Upgrade Monitor.",
        },
        ...premiumPricingMeta(),
      },
      { status: 403 }
    );
  }

  let body: { label?: string; cfu_limit?: number; tap_limit?: number } = {};
  try {
    if (req.headers.get("content-type")?.includes("json")) {
      body = (await req.json()) as typeof body;
    }
  } catch {
    body = {};
  }

  const result = await buildEvidencePack({
    keyHash: auth.ctx.keyHash,
    label: body.label,
    cfu_limit: body.cfu_limit,
    tap_limit: body.tap_limit,
  });

  if (!result.ok) {
    return protocolError(
      result.status === 503 ? "service_unavailable" : "validation_error",
      result.error,
      result.status
    );
  }

  await logProtocolUsage(auth.ctx.keyHash, "/api/v1/shield/pack", "POST", 200);

  return protocolJson({
    ...result.pack,
    ...premiumPricingMeta(),
  });
});
