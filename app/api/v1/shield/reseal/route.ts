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
import { appendShieldAudit, resealReceipt } from "@/lib/shield";

export const runtime = "nodejs";

/**
 * Premium reseal — schedule hybrid_pqc_ready envelope on an existing receipt.
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
          message: "Reseal / PQC agility is Premium.",
        },
        ...premiumPricingMeta(),
      },
      { status: 403 }
    );
  }

  let body: { receipt_id?: string; content_hash?: string } = {};
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return protocolError("invalid_json", "JSON body required", 400);
  }

  if (!body.receipt_id?.trim()) {
    return protocolError("validation_error", "receipt_id required", 400);
  }

  const result = await resealReceipt({
    receipt_id: body.receipt_id.trim(),
    content_hash: body.content_hash,
  });

  if (!result.ok) {
    return protocolError(
      result.status === 503 ? "service_unavailable" : "validation_error",
      result.error,
      result.status
    );
  }

  appendShieldAudit({
    key_hash: auth.ctx.keyHash,
    action: "reseal",
    receipt_id: result.reseal.source_receipt_id,
    content_hash: result.reseal.content_hash,
    meta: { reseal_id: result.reseal.reseal_id, status: result.reseal.status },
  });

  await logProtocolUsage(auth.ctx.keyHash, "/api/v1/shield/reseal", "POST", 200);

  return protocolJson({
    ...result.reseal,
    ...premiumPricingMeta(),
  });
});
