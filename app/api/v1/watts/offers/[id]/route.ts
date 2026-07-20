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
import { getWattCapacityOffer, wattOfferPublic } from "@/lib/watts";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

/** GET — fetch a capacity offer by id (Premium). */
export const GET = protocolRoute(async (req: Request, ctx: Ctx) => {
  const auth = await authenticateProtocolRequest(req);
  if (!auth.ok) return auth.response;

  const rawKey = req.headers.get("authorization")?.slice(7).trim() ?? "";
  const record = await findKeyRecord(auth.ctx.keyHash);
  const premium = checkPremiumAccess(rawKey, record);
  if (!premium.allowed) return premium.response;

  const { id } = await ctx.params;
  const offer = await getWattCapacityOffer(id);
  if (!offer) {
    return protocolError("not_found", "Offer not found", 404);
  }

  await logProtocolUsage(
    auth.ctx.keyHash,
    `/api/v1/watts/offers/${id}`,
    "GET",
    200
  );

  return protocolJson({
    ...wattOfferPublic(offer),
    ...premiumPricingMeta(),
  });
});
