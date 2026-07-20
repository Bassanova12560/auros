import { protocolError, protocolJson, protocolRoute } from "@/lib/protocol";
import {
  insertWattCapacityOffer,
  listWattCapacityOffers,
  wattCapacityOfferRequestSchema,
  wattOfferPublic,
} from "@/lib/watts";
import { checkRateLimitAsync, getRequestIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

/** Public demo — create a capacity offer (rate-limited). */
export const POST = protocolRoute(async (req: Request) => {
  const ip = getRequestIp(req);
  const rate = await checkRateLimitAsync(
    `watts-offers-demo:${ip}`,
    20,
    3_600_000
  );
  if (!rate.allowed) {
    return protocolError(
      "rate_limited",
      "Demo limit reached. Use Protocol Premium POST /api/v1/watts/offers.",
      429
    );
  }

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
    key_hash: "demo",
    request: parsed.data,
  });
  if ("error" in result) {
    return protocolError("validation_error", result.error, 400);
  }

  return protocolJson({
    ...wattOfferPublic(result),
    demo: true,
  });
});

/** Public demo — browse open offers. */
export const GET = protocolRoute(async (req: Request) => {
  const ip = getRequestIp(req);
  const rate = await checkRateLimitAsync(
    `watts-offers-demo-list:${ip}`,
    60,
    3_600_000
  );
  if (!rate.allowed) {
    return protocolError("rate_limited", "Demo list limit reached.", 429);
  }

  const url = new URL(req.url);
  const country = url.searchParams.get("country") ?? undefined;
  const offers = await listWattCapacityOffers({
    status: "open",
    country: country ?? undefined,
    limit: 40,
  });

  return protocolJson({
    offers: offers.map(wattOfferPublic),
    count: offers.length,
    demo: true,
  });
});
