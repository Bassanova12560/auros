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
  chargeflowRetireRequestSchema,
  retireChargeflowRecord,
} from "@/lib/chargeflow";

type RouteContext = { params: Promise<{ id: string }> };

export const POST = protocolRoute(async (req: Request, context: RouteContext) => {
  const auth = await authenticateProtocolRequest(req);
  if (!auth.ok) return auth.response;

  const rawKey = req.headers.get("authorization")?.slice(7).trim() ?? "";
  const keyRecord = await findKeyRecord(auth.ctx.keyHash);
  const premium = checkPremiumAccess(rawKey, keyRecord);
  if (!premium.allowed) return premium.response;

  const { id: rawId } = await context.params;
  const id = decodeURIComponent(rawId).trim();
  if (!id) {
    return protocolError("validation_error", "Missing ChargeFlow unit id", 400);
  }

  let body: unknown = {};
  try {
    const text = await req.text();
    if (text.trim()) body = JSON.parse(text);
  } catch {
    return protocolError("invalid_json", "Request body must be valid JSON", 400);
  }

  const parsed = chargeflowRetireRequestSchema.safeParse(body);
  if (!parsed.success) {
    return protocolError(
      "validation_error",
      parsed.error.issues.map((i) => i.message).join("; "),
      400
    );
  }

  const result = await retireChargeflowRecord(
    id,
    auth.ctx.keyHash,
    parsed.data.reason
  );
  if ("error" in result) {
    return protocolError(
      result.status === 404 ? "not_found" : "forbidden",
      result.error,
      result.status
    );
  }

  await logProtocolUsage(
    auth.ctx.keyHash,
    `/api/v1/chargeflow/${id}/retire`,
    "POST",
    200
  );

  return protocolJson({
    ...chargeflowPublicResponse(result.record),
    ...premiumPricingMeta(),
  });
});
