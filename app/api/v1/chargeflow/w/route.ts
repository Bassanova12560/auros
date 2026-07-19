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
  chargeflowPublicResponse,
  chargeflowWCreateRequestSchema,
  createChargeflowWUnit,
} from "@/lib/chargeflow";

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

  const parsed = chargeflowWCreateRequestSchema.safeParse(body);
  if (!parsed.success) {
    return protocolError(
      "validation_error",
      parsed.error.issues.map((i) => i.message).join("; "),
      400
    );
  }

  const result = await createChargeflowWUnit(auth.ctx.keyHash, parsed.data);
  if ("error" in result) {
    const code =
      result.status === 409
        ? "conflict"
        : result.status === 503
          ? "service_unavailable"
          : "bad_request";
    return protocolError(code, result.error, result.status);
  }

  await logProtocolUsage(auth.ctx.keyHash, "/api/v1/chargeflow/w", "POST", 200);

  return protocolJson({
    ...chargeflowPublicResponse(result.record),
    ...premiumPricingMeta(),
  });
});
