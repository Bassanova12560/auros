import { protocolError, protocolJson, protocolRoute } from "@/lib/protocol";
import { rankOffersForProfile, wattOfferPublic, wattReserveRequestSchema } from "@/lib/watts";
import { listWattCapacityOffers } from "@/lib/watts/server";
import { checkRateLimitAsync, getRequestIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

/** Public demo — match a buyer profile against open capacity offers. */
export const POST = protocolRoute(async (req: Request) => {
  const ip = getRequestIp(req);
  const rate = await checkRateLimitAsync(
    `watts-offers-demo-match:${ip}`,
    30,
    3_600_000
  );
  if (!rate.allowed) {
    return protocolError("rate_limited", "Demo match limit reached.", 429);
  }

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
  const ranked = rankOffersForProfile(parsed.data, offers, 8);

  return protocolJson({
    matches: ranked.map((m) => ({
      offer_id: m.offer.id,
      match_score: m.match_score,
      match_reasons: m.reasons,
      offer: wattOfferPublic(m.offer),
    })),
    count: ranked.length,
    demo: true,
  });
});
