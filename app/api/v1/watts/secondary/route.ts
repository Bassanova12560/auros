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
  insertWattSecondaryListing,
  listWattSecondaryListings,
  wattSecondaryListingRequestSchema,
  wattSecondaryPublic,
} from "@/lib/watts";

export const runtime = "nodejs";

/** POST — create secondary listing (Premium). GET — browse open listings. */
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

  const parsed = wattSecondaryListingRequestSchema.safeParse(body);
  if (!parsed.success) {
    return protocolError(
      "validation_error",
      parsed.error.issues.map((i) => i.message).join("; "),
      400
    );
  }

  const result = await insertWattSecondaryListing({
    key_hash: auth.ctx.keyHash,
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

  await logProtocolUsage(
    auth.ctx.keyHash,
    "/api/v1/watts/secondary",
    "POST",
    200
  );

  return protocolJson({
    ...wattSecondaryPublic(result),
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
  const listings = await listWattSecondaryListings({
    status: mine ? undefined : "open",
    key_hash: mine ? auth.ctx.keyHash : undefined,
    limit: 50,
  });

  await logProtocolUsage(
    auth.ctx.keyHash,
    "/api/v1/watts/secondary",
    "GET",
    200
  );

  return protocolJson({
    listings: listings.map(wattSecondaryPublic),
    count: listings.length,
    ...premiumPricingMeta(),
  });
});
