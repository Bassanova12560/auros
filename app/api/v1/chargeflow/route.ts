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
  CHARGEFLOW_LIST_DEFAULT_LIMIT,
  CHARGEFLOW_LIST_MAX_LIMIT,
  chargeflowCreateRequestSchema,
  chargeflowPublicResponse,
  createChargeflowUnit,
  listChargeflowForKey,
  type ChargeflowStatus,
  type ChargeflowUnitKind,
} from "@/lib/chargeflow";

export const GET = protocolRoute(async (req: Request) => {
  const auth = await authenticateProtocolRequest(req);
  if (!auth.ok) return auth.response;

  const rawKey = req.headers.get("authorization")?.slice(7).trim() ?? "";
  const record = await findKeyRecord(auth.ctx.keyHash);
  const premium = checkPremiumAccess(rawKey, record);
  if (!premium.allowed) return premium.response;

  const url = new URL(req.url);
  const kindRaw = url.searchParams.get("kind");
  const statusRaw = url.searchParams.get("status");
  const operatorRaw = url.searchParams.get("operator_id");
  const limitRaw = url.searchParams.get("limit");
  const offsetRaw = url.searchParams.get("offset");

  let unit_kind: ChargeflowUnitKind | undefined;
  if (kindRaw) {
    if (kindRaw !== "e" && kindRaw !== "w" && kindRaw !== "f") {
      return protocolError(
        "validation_error",
        "kind must be e, w, or f",
        400
      );
    }
    unit_kind = kindRaw;
  }

  let status: ChargeflowStatus | undefined;
  if (statusRaw) {
    if (statusRaw !== "active" && statusRaw !== "retired") {
      return protocolError(
        "validation_error",
        "status must be active or retired",
        400
      );
    }
    status = statusRaw;
  }

  const operator_id = operatorRaw?.trim() || undefined;

  const limit = limitRaw
    ? Number.parseInt(limitRaw, 10)
    : CHARGEFLOW_LIST_DEFAULT_LIMIT;
  const offset = offsetRaw ? Number.parseInt(offsetRaw, 10) : 0;
  if (
    !Number.isFinite(limit) ||
    limit < 1 ||
    limit > CHARGEFLOW_LIST_MAX_LIMIT
  ) {
    return protocolError(
      "validation_error",
      `limit must be between 1 and ${CHARGEFLOW_LIST_MAX_LIMIT}`,
      400
    );
  }
  if (!Number.isFinite(offset) || offset < 0) {
    return protocolError("validation_error", "offset must be >= 0", 400);
  }

  const listed = await listChargeflowForKey(auth.ctx.keyHash, {
    unit_kind,
    status,
    operator_id,
    limit,
    offset,
  });

  await logProtocolUsage(auth.ctx.keyHash, "/api/v1/chargeflow", "GET", 200);

  return protocolJson({
    total: listed.total,
    limit,
    offset,
    items: listed.items,
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

  const parsed = chargeflowCreateRequestSchema.safeParse(body);
  if (!parsed.success) {
    return protocolError(
      "validation_error",
      parsed.error.issues.map((i) => i.message).join("; "),
      400
    );
  }

  const result = await createChargeflowUnit(auth.ctx.keyHash, parsed.data);
  if ("error" in result) {
    const code =
      result.status === 409
        ? "conflict"
        : result.status === 503
          ? "service_unavailable"
          : "bad_request";
    return protocolError(code, result.error, result.status);
  }

  await logProtocolUsage(auth.ctx.keyHash, "/api/v1/chargeflow", "POST", 200);

  return protocolJson({
    ...chargeflowPublicResponse(result.record),
    ...premiumPricingMeta(),
  });
});
