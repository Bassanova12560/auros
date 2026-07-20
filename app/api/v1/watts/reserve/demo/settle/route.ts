import { protocolError, protocolJson, protocolRoute } from "@/lib/protocol";
import {
  getWattReservation,
  settleWattReservation,
  wattReservePublicResponse,
  wattSettleRequestSchema,
} from "@/lib/watts";
import { checkRateLimitAsync, getRequestIp } from "@/lib/rate-limit";
import { z } from "zod";

export const runtime = "nodejs";

const bodySchema = wattSettleRequestSchema.extend({
  reservation_id: z.string().uuid(),
});

/** Public sandboxed settle for /green/chargeflow/reserve (rate-limited). */
export const POST = protocolRoute(async (req: Request) => {
  const ip = getRequestIp(req);
  const rate = await checkRateLimitAsync(
    `watts-reserve-demo-settle:${ip}`,
    10,
    3_600_000
  );
  if (!rate.allowed) {
    return protocolError(
      "rate_limited",
      "Demo settle limit reached. Use Protocol Premium POST /api/v1/watts/reserve/:id/settle.",
      429
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return protocolError("invalid_json", "Request body must be valid JSON", 400);
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return protocolError(
      "validation_error",
      parsed.error.issues.map((i) => i.message).join("; "),
      400
    );
  }

  const { reservation_id, ...settle } = parsed.data;
  const row = await getWattReservation(reservation_id);
  if (!row || row.key_hash !== "demo") {
    return protocolError("not_found", "Demo reservation not found", 404);
  }

  const result = await settleWattReservation({
    reservation: row,
    keyHash: "demo",
    settle,
  });

  if (!result.ok) {
    return protocolError(
      result.status === 409
        ? "conflict"
        : result.status === 404
          ? "not_found"
          : "validation_error",
      result.error,
      result.status
    );
  }

  return protocolJson({
    ...wattReservePublicResponse(result.reservation),
    unit: result.unit,
    newly_retired: result.newly_retired,
    demo: true,
    note: "Sandbox settle — production use POST /api/v1/watts/reserve/:id/settle with Protocol Premium.",
  });
});
