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
import { getWattSecondaryListing, wattSecondaryPublic } from "@/lib/watts";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export const GET = protocolRoute(async (req: Request, ctx: Ctx) => {
  const auth = await authenticateProtocolRequest(req);
  if (!auth.ok) return auth.response;

  const rawKey = req.headers.get("authorization")?.slice(7).trim() ?? "";
  const record = await findKeyRecord(auth.ctx.keyHash);
  const premium = checkPremiumAccess(rawKey, record);
  if (!premium.allowed) return premium.response;

  const { id } = await ctx.params;
  const listing = await getWattSecondaryListing(id);
  if (!listing) {
    return protocolError("not_found", "Listing not found", 404);
  }

  await logProtocolUsage(
    auth.ctx.keyHash,
    `/api/v1/watts/secondary/${id}`,
    "GET",
    200
  );

  return protocolJson({
    ...wattSecondaryPublic(listing),
    ...premiumPricingMeta(),
  });
});
