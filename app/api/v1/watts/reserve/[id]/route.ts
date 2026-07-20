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
import { getWattReservation, wattReservePublicResponse } from "@/lib/watts";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

/** GET — fetch a reservation intent by id (Premium; owner key_hash). */
export const GET = protocolRoute(async (req: Request, ctx: Ctx) => {
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

  await logProtocolUsage(
    auth.ctx.keyHash,
    `/api/v1/watts/reserve/${id}`,
    "GET",
    200
  );

  return protocolJson({
    ...wattReservePublicResponse(row),
    ...premiumPricingMeta(),
  });
});
