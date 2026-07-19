import { protocolError, protocolJson, protocolRoute } from "@/lib/protocol";
import {
  attestationPublicResponse,
  getAttestationById,
  verifyAttestSignature,
} from "@/lib/protocol/attest";
import { checkRateLimitAsync, getRequestIp } from "@/lib/rate-limit";

type RouteContext = { params: Promise<{ id: string }> };

export const GET = protocolRoute(async (req: Request, context: RouteContext) => {
  const ip = getRequestIp(req);
  const rate = await checkRateLimitAsync(`attest-id:${ip}`, 60, 3_600_000);
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
    return protocolError("validation_error", "Missing attestation id", 400);
  }

  const record = await getAttestationById(id);
  if (!record) {
    return protocolError("not_found", "Attestation not found", 404);
  }

  const valid = verifyAttestSignature(record.content_hash, record.signature);
  if (!valid) {
    return protocolJson({
      valid: false,
      id: record.id,
      reason: "signature_mismatch",
    });
  }

  return protocolJson(attestationPublicResponse(record));
});
