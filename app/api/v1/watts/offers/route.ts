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
import { wattCapacityOfferRequestSchema, wattOfferPublic } from "@/lib/watts";
import { insertWattCapacityOffer, listWattCapacityOffers } from "@/lib/watts/server";

export const runtime = "nodejs";

/** POST — list a producer capacity window (Premium). GET — browse open offers. */
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

  const parsed = wattCapacityOfferRequestSchema.safeParse(body);
  if (!parsed.success) {
    return protocolError(
      "validation_error",
      parsed.error.issues.map((i) => i.message).join("; "),
      400
    );
  }

  const result = await insertWattCapacityOffer({
    key_hash: auth.ctx.keyHash,
    request: parsed.data,
  });
  if ("error" in result) {
    return protocolError("validation_error", result.error, 400);
  }

  await logProtocolUsage(
    auth.ctx.keyHash,
    "/api/v1/watts/offers",
    "POST",
    200
  );

  return protocolJson({
    ...wattOfferPublic(result),
    ...premiumPricingMeta(),
  });
});

export const GET = protocolRoute(async (req: Request) => {
  const auth = await authenticateProtocolRequest(req);
  if (!auth.ok) return auth.response;

  const rawKey = req.headers.get("authorization")?.slice(7).trim() ?? "";
  const record = await findKeyRecord(auth.ctx.keyHash);
  const premium = checkPremiumAccess(rawKey, record);
  if (!premium.allowed) return premium.response;

  const url = new URL(req.url);
  const mine = url.searchParams.get("mine") === "1";
  const country = url.searchParams.get("country") ?? undefined;
  const statusParam = url.searchParams.get("status");
  const status =
    statusParam === "open" || statusParam === "withdrawn"
      ? statusParam
      : "open";

  const offers = await listWattCapacityOffers({
    status: mine ? undefined : status,
    country,
    key_hash: mine ? auth.ctx.keyHash : undefined,
    limit: 50,
  });

  await logProtocolUsage(auth.ctx.keyHash, "/api/v1/watts/offers", "GET", 200);

  return protocolJson({
    offers: offers.map(wattOfferPublic),
    count: offers.length,
    ...premiumPricingMeta(),
  });
});
