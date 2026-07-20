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
import { wattSecondaryPublic } from "@/lib/watts";
import { withdrawWattSecondaryListing } from "@/lib/watts/server";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export const POST = protocolRoute(async (req: Request, ctx: Ctx) => {
  const auth = await authenticateProtocolRequest(req);
  if (!auth.ok) return auth.response;

  const rawKey = req.headers.get("authorization")?.slice(7).trim() ?? "";
  const record = await findKeyRecord(auth.ctx.keyHash);
  const premium = checkPremiumAccess(rawKey, record);
  if (!premium.allowed) return premium.response;

  const { id } = await ctx.params;
  const result = await withdrawWattSecondaryListing({
    id,
    keyHash: auth.ctx.keyHash,
  });
  if ("error" in result) {
    return protocolError(
      result.status === 409 ? "conflict" : "not_found",
      result.error,
      result.status
    );
  }

  await logProtocolUsage(
    auth.ctx.keyHash,
    `/api/v1/watts/secondary/${id}/withdraw`,
    "POST",
    200
  );

  return protocolJson({
    ...wattSecondaryPublic(result),
    ...premiumPricingMeta(),
  });
});
