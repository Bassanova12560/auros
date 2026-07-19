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
  chargeflowPartnerSyncRequestSchema,
  syncPartnerSessions,
} from "@/lib/chargeflow";

/**
 * Sync partner sessions (Tesla Fleet / TotalEnergies / generic OCPI) → CFU-E.
 * Sandbox needs no credentials; live requires partner tokens (not stored).
 */
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

  const parsed = chargeflowPartnerSyncRequestSchema.safeParse(body);
  if (!parsed.success) {
    return protocolError(
      "validation_error",
      parsed.error.issues.map((i) => i.message).join("; "),
      400
    );
  }

  const result = await syncPartnerSessions({
    partner: parsed.data.partner,
    mode: parsed.data.mode,
    keyHash: auth.ctx.keyHash,
    operator_id: parsed.data.operator_id,
    credentials: parsed.data.credentials,
    sessions: parsed.data.sessions,
    limit: parsed.data.limit,
  });

  if (!result.ok) {
    return protocolError(result.code, result.message, result.status);
  }

  await logProtocolUsage(
    auth.ctx.keyHash,
    "/api/v1/chargeflow/partners/sync",
    "POST",
    200
  );

  return protocolJson({
    partner: result.partner,
    mode: result.mode,
    source: result.source,
    disclaimer: result.disclaimer,
    total: result.total,
    succeeded: result.succeeded,
    failed: result.failed,
    items: result.items,
    ...premiumPricingMeta(),
  });
});
