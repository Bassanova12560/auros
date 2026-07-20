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
import { matchWattProfile, wattReservePublicResponse, wattReserveRequestSchema } from "@/lib/watts";
import { insertWattReservation } from "@/lib/watts/server";

export const runtime = "nodejs";

/**
 * POST — create a watts reservation intent (Premium).
 * Does NOT mint CFU. Matching is deterministic rules only.
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

  const parsed = wattReserveRequestSchema.safeParse(body);
  if (!parsed.success) {
    return protocolError(
      "validation_error",
      parsed.error.issues.map((i) => i.message).join("; "),
      400
    );
  }

  const matched = matchWattProfile(parsed.data);
  if (!matched.ok) {
    return protocolJson(
      {
        error: { code: "validation_error", message: matched.error },
        match_reasons: matched.reasons,
      },
      { status: 400 }
    );
  }

  const row = await insertWattReservation({
    key_hash: auth.ctx.keyHash,
    profile: parsed.data,
    match_score: matched.match_score,
    match_reasons: matched.reasons,
    suggested_unit_kind: matched.suggested_unit_kind,
  });

  await logProtocolUsage(
    auth.ctx.keyHash,
    "/api/v1/watts/reserve",
    "POST",
    200
  );

  return protocolJson({
    ...wattReservePublicResponse(row),
    ...premiumPricingMeta(),
  });
});
