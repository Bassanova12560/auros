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
  confirmWattReservation,
  getWattReservation,
  wattReservePublicResponse,
} from "@/lib/watts";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

/**
 * POST — explicit confirm → mint CFU-E or CFU-F linked to reservation_id.
 * Never auto-minted from reserve.
 */
export const POST = protocolRoute(async (req: Request, ctx: Ctx) => {
  const auth = await authenticateProtocolRequest(req);
  if (!auth.ok) return auth.response;

  const rawKey = req.headers.get("authorization")?.slice(7).trim() ?? "";
  const record = await findKeyRecord(auth.ctx.keyHash);
  const premium = checkPremiumAccess(rawKey, record);
  if (!premium.allowed) return premium.response;

  const { id } = await ctx.params;
  const row = await getWattReservation(id);
  if (!row || row.key_hash !== auth.ctx.keyHash) {
    return protocolError("not_found", "Reservation not found", 404);
  }

  const result = await confirmWattReservation({
    reservation: row,
    keyHash: auth.ctx.keyHash,
  });

  if (!result.ok) {
    return protocolError(
      result.status === 409
        ? "conflict"
        : result.status === 503
          ? "service_unavailable"
          : "validation_error",
      result.error,
      result.status
    );
  }

  await logProtocolUsage(
    auth.ctx.keyHash,
    `/api/v1/watts/reserve/${id}/confirm`,
    "POST",
    200
  );

  return protocolJson({
    ...wattReservePublicResponse(result.reservation),
    unit: result.unit,
    ...premiumPricingMeta(),
  });
});
