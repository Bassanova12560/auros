import { protocolError, protocolJson, protocolRoute } from "@/lib/protocol";
import {
  chargeflowPublicResponse,
  getChargeflowById,
  verifyChargeflowSignatureForId,
} from "@/lib/chargeflow";
import { checkRateLimitAsync, getRequestIp } from "@/lib/rate-limit";

type RouteContext = { params: Promise<{ id: string }> };

export const GET = protocolRoute(async (req: Request, context: RouteContext) => {
  const ip = getRequestIp(req);
  const rate = await checkRateLimitAsync(`chargeflow-id:${ip}`, 60, 3_600_000);
  if (!rate.allowed) {
    return protocolError(
      "rate_limited",
      "Too many verification requests. Try again later.",
      429
    );
  }

  const { id: rawId } = await context.params;
  const id = decodeURIComponent(rawId).trim();
  if (!id) {
    return protocolError("validation_error", "Missing ChargeFlow unit id", 400);
  }

  const record = await getChargeflowById(id);
  if (!record) {
    return protocolError("not_found", "ChargeFlow unit not found", 404);
  }

  const valid = verifyChargeflowSignatureForId(
    record.id,
    record.content_hash,
    record.signature
  );
  if (!valid) {
    return protocolJson({
      valid: false,
      id: record.id,
      reason: "signature_mismatch",
    });
  }

  return protocolJson(chargeflowPublicResponse(record));
});
