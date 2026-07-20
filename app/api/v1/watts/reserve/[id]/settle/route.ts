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
import { wattReservePublicResponse, wattSettleRequestSchema } from "@/lib/watts";
import { getWattReservation, settleWattReservation } from "@/lib/watts/server";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

/**
 * POST — explicit settle on delivery → retire linked CFU.
 * Never auto-settled from confirm.
 */
export const POST = protocolRoute(async (req: Request, ctx: Ctx) => {
  const auth = await authenticateProtocolRequest(req);
  if (!auth.ok) return auth.response;

  const rawKey = req.headers.get("authorization")?.slice(7).trim() ?? "";
  const record = await findKeyRecord(auth.ctx.keyHash);
  const premium = checkPremiumAccess(rawKey, record);
  if (!premium.allowed) return premium.response;

  let body: unknown = {};
  try {
    const text = await req.text();
    if (text.trim()) body = JSON.parse(text);
  } catch {
    return protocolError("invalid_json", "Request body must be valid JSON", 400);
  }

  const parsed = wattSettleRequestSchema.safeParse(body);
  if (!parsed.success) {
    return protocolError(
      "validation_error",
      parsed.error.issues.map((i) => i.message).join("; "),
      400
    );
  }

  const { id } = await ctx.params;
  const row = await getWattReservation(id);
  if (!row || row.key_hash !== auth.ctx.keyHash) {
    return protocolError("not_found", "Reservation not found", 404);
  }

  const result = await settleWattReservation({
    reservation: row,
    keyHash: auth.ctx.keyHash,
    settle: parsed.data,
  });

  if (!result.ok) {
    return protocolError(
      result.status === 409
        ? "conflict"
        : result.status === 404
          ? "not_found"
          : "validation_error",
      result.error,
      result.status
    );
  }

  await logProtocolUsage(
    auth.ctx.keyHash,
    `/api/v1/watts/reserve/${id}/settle`,
    "POST",
    200
  );

  return protocolJson({
    ...wattReservePublicResponse(result.reservation),
    unit: result.unit,
    newly_retired: result.newly_retired,
    ...premiumPricingMeta(),
  });
});
