import { protocolError, protocolJson, protocolRoute } from "@/lib/protocol";
import {
  expressWattSecondaryInterest,
  getWattSecondaryListing,
  wattSecondaryInterestRequestSchema,
  wattSecondaryPublic,
} from "@/lib/watts";
import { checkRateLimitAsync, getRequestIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

/** POST — express non-binding interest in a secondary listing (demo or public). */
export const POST = protocolRoute(async (req: Request, ctx: Ctx) => {
  const ip = getRequestIp(req);
  const rate = await checkRateLimitAsync(
    `watts-secondary-interest:${ip}`,
    40,
    3_600_000
  );
  if (!rate.allowed) {
    return protocolError("rate_limited", "Interest rate limit reached.", 429);
  }

  let body: unknown = {};
  try {
    const text = await req.text();
    if (text.trim()) body = JSON.parse(text);
  } catch {
    return protocolError("invalid_json", "Request body must be valid JSON", 400);
  }

  const parsed = wattSecondaryInterestRequestSchema.safeParse(body);
  if (!parsed.success) {
    return protocolError(
      "validation_error",
      parsed.error.issues.map((i) => i.message).join("; "),
      400
    );
  }

  const { id } = await ctx.params;
  const existing = await getWattSecondaryListing(id);
  if (!existing) {
    return protocolError("not_found", "Listing not found", 404);
  }

  const result = await expressWattSecondaryInterest({ id });
  if ("error" in result) {
    return protocolError(
      result.status === 409 ? "conflict" : "not_found",
      result.error,
      result.status
    );
  }

  return protocolJson({
    ...wattSecondaryPublic(result),
    interest_note: parsed.data.note ?? null,
    buyer_ref: parsed.data.buyer_ref ?? null,
    note: "Interest is non-binding — no transfer, settlement, or investment advice.",
  });
});
