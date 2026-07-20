import { protocolError, protocolJson, protocolRoute } from "@/lib/protocol";
import { wattSecondaryListingRequestSchema, wattSecondaryPublic } from "@/lib/watts";
import { insertWattSecondaryListing, listWattSecondaryListings } from "@/lib/watts/server";
import { checkRateLimitAsync, getRequestIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

export const POST = protocolRoute(async (req: Request) => {
  const ip = getRequestIp(req);
  const rate = await checkRateLimitAsync(
    `watts-secondary-demo:${ip}`,
    20,
    3_600_000
  );
  if (!rate.allowed) {
    return protocolError(
      "rate_limited",
      "Demo limit reached. Use Protocol Premium POST /api/v1/watts/secondary.",
      429
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return protocolError("invalid_json", "Request body must be valid JSON", 400);
  }

  const parsed = wattSecondaryListingRequestSchema.safeParse(body);
  if (!parsed.success) {
    return protocolError(
      "validation_error",
      parsed.error.issues.map((i) => i.message).join("; "),
      400
    );
  }

  const result = await insertWattSecondaryListing({
    key_hash: "demo",
    request: parsed.data,
  });
  if ("error" in result) {
    return protocolError(
      result.status === 404
        ? "not_found"
        : result.status === 409
          ? "conflict"
          : "validation_error",
      result.error,
      result.status
    );
  }

  return protocolJson({
    ...wattSecondaryPublic(result),
    demo: true,
  });
});

export const GET = protocolRoute(async (req: Request) => {
  const ip = getRequestIp(req);
  const rate = await checkRateLimitAsync(
    `watts-secondary-demo-list:${ip}`,
    60,
    3_600_000
  );
  if (!rate.allowed) {
    return protocolError("rate_limited", "Demo list limit reached.", 429);
  }

  const listings = await listWattSecondaryListings({
    status: "open",
    limit: 40,
  });

  return protocolJson({
    listings: listings.map(wattSecondaryPublic),
    count: listings.length,
    demo: true,
  });
});
