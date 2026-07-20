import { protocolError, protocolJson, protocolRoute } from "@/lib/protocol";
import { wattReservePublicResponse } from "@/lib/watts";
import { confirmWattReservation, getWattReservation } from "@/lib/watts/server";
import { checkRateLimitAsync, getRequestIp } from "@/lib/rate-limit";
import { z } from "zod";

export const runtime = "nodejs";

const bodySchema = z.object({
  reservation_id: z.string().uuid(),
});

/** Public sandboxed confirm for /green/chargeflow/reserve (rate-limited). */
export const POST = protocolRoute(async (req: Request) => {
  const ip = getRequestIp(req);
  const rate = await checkRateLimitAsync(
    `watts-reserve-demo-confirm:${ip}`,
    10,
    3_600_000
  );
  if (!rate.allowed) {
    return protocolError(
      "rate_limited",
      "Demo confirm limit reached. Use Protocol Premium POST /api/v1/watts/reserve/:id/confirm.",
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

  const row = await getWattReservation(parsed.data.reservation_id);
  if (!row || row.key_hash !== "demo") {
    return protocolError("not_found", "Demo reservation not found", 404);
  }

  const result = await confirmWattReservation({
    reservation: row,
    keyHash: "demo",
  });

  if (!result.ok) {
    return protocolError(
      result.status === 409
        ? "conflict"
        : result.status === 503
          ? "service_unavailable"
          : "validation_error",
      result.error,
      result.status
    );
  }

  return protocolJson({
    ...wattReservePublicResponse(result.reservation),
    unit: result.unit,
    demo: true,
    note: "Sandbox confirm — production use POST /api/v1/watts/reserve/:id/confirm with Protocol Premium.",
  });
});
