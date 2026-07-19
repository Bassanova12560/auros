import { protocolError, protocolJson, protocolRoute } from "@/lib/protocol";
import {
  chargeflowCreateRequestSchema,
  chargeflowPublicResponse,
  createChargeflowUnit,
} from "@/lib/chargeflow";
import { checkRateLimitAsync, getRequestIp } from "@/lib/rate-limit";

/** Public sandboxed mint for /green/chargeflow demo (rate-limited). */
export const POST = protocolRoute(async (req: Request) => {
  const ip = getRequestIp(req);
  const rate = await checkRateLimitAsync(`chargeflow-demo:${ip}`, 10, 3_600_000);
  if (!rate.allowed) {
    return protocolError(
      "rate_limited",
      "Demo limit reached. Use Protocol Premium for production mint.",
      429
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return protocolError("invalid_json", "Request body must be valid JSON", 400);
  }

  const parsed = chargeflowCreateRequestSchema.safeParse(body);
  if (!parsed.success) {
    return protocolError(
      "validation_error",
      parsed.error.issues.map((i) => i.message).join("; "),
      400
    );
  }

  const result = await createChargeflowUnit("demo", parsed.data);
  if ("error" in result) {
    return protocolError("service_unavailable", result.error, result.status);
  }

  return protocolJson({
    ...chargeflowPublicResponse(result.record),
    demo: true,
    note: "Sandbox mint — production use POST /api/v1/chargeflow with Protocol Premium.",
  });
});
