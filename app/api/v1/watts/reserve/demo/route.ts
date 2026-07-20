import { protocolError, protocolJson, protocolRoute } from "@/lib/protocol";
import {
  insertWattReservation,
  matchWattProfile,
  wattReservePublicResponse,
  wattReserveRequestSchema,
} from "@/lib/watts";
import { checkRateLimitAsync, getRequestIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

/** Public sandboxed reserve intent for /green/chargeflow/reserve (rate-limited). */
export const POST = protocolRoute(async (req: Request) => {
  const ip = getRequestIp(req);
  const rate = await checkRateLimitAsync(
    `watts-reserve-demo:${ip}`,
    20,
    3_600_000
  );
  if (!rate.allowed) {
    return protocolError(
      "rate_limited",
      "Demo limit reached. Use Protocol Premium POST /api/v1/watts/reserve.",
      429
    );
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

  const matched = matchWattProfile(parsed.data);
  if (!matched.ok) {
    return protocolJson(
      {
        error: { code: "validation_error", message: matched.error },
        match_reasons: matched.reasons,
      },
      { status: 400 }
    );
  }

  const row = await insertWattReservation({
    key_hash: "demo",
    profile: parsed.data,
    match_score: matched.match_score,
    match_reasons: matched.reasons,
    suggested_unit_kind: matched.suggested_unit_kind,
  });

  return protocolJson({
    ...wattReservePublicResponse(row),
    demo: true,
    note: "Sandbox intent — production use POST /api/v1/watts/reserve with Protocol Premium. Confirm via POST /api/v1/watts/reserve/demo/confirm.",
  });
});
