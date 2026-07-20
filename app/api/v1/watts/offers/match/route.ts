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
  listWattCapacityOffers,
  rankOffersForProfile,
  wattOfferPublic,
  wattReserveRequestSchema,
} from "@/lib/watts";

export const runtime = "nodejs";

/**
 * POST — rank open capacity offers against a buyer profile (Premium).
 * Deterministic rules only — no auto-reserve.
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

  const offers = await listWattCapacityOffers({ status: "open", limit: 100 });
  const ranked = rankOffersForProfile(parsed.data, offers, 10);

  await logProtocolUsage(
    auth.ctx.keyHash,
    "/api/v1/watts/offers/match",
    "POST",
    200
  );

  return protocolJson({
    matches: ranked.map((m) => ({
      offer_id: m.offer.id,
      match_score: m.match_score,
      match_reasons: m.reasons,
      offer: wattOfferPublic(m.offer),
    })),
    count: ranked.length,
    ...premiumPricingMeta(),
  });
});
