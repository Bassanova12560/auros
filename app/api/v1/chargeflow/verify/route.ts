import { protocolError, protocolJson, protocolRoute } from "@/lib/protocol";
import {
  chargeflowPublicResponse,
  getChargeflowById,
  isChargeflowContentHash,
  verifyChargeflowSignature,
} from "@/lib/chargeflow";
import { checkRateLimitAsync, getRequestIp } from "@/lib/rate-limit";

export const GET = protocolRoute(async (req: Request) => {
  const ip = getRequestIp(req);
  const rate = await checkRateLimitAsync(`chargeflow-verify:${ip}`, 60, 3_600_000);
  if (!rate.allowed) {
    return protocolError(
      "rate_limited",
      "Too many verification requests. Try again later.",
      429
    );
  }

  const url = new URL(req.url);
  const id = url.searchParams.get("id")?.trim();
  const hash = url.searchParams.get("hash")?.trim().toLowerCase();
  const sig = url.searchParams.get("sig")?.trim().toLowerCase();

  if (id) {
    const record = await getChargeflowById(id);
    if (!record) {
      return protocolError("not_found", "ChargeFlow unit not found", 404);
    }
    const valid = verifyChargeflowSignature(record.content_hash, record.signature);
    if (!valid) {
      return protocolJson({
        valid: false,
        id: record.id,
        reason: "signature_mismatch",
      });
    }
    return protocolJson(chargeflowPublicResponse(record));
  }

  if (hash && sig) {
    if (!isChargeflowContentHash(hash)) {
      return protocolError(
        "validation_error",
        "hash must be a 64-char hex SHA-256",
        400
      );
    }
    const valid = verifyChargeflowSignature(hash, sig);
    return protocolJson({
      valid,
      content_hash: hash,
      signature: sig,
      reason: valid ? undefined : "signature_mismatch",
      disclaimer:
        "AUROS ChargeFlow CFU-E — cryptographic verify only. Not a legal certificate.",
    });
  }

  return protocolError(
    "validation_error",
    "Provide id=… or hash=…&sig=…",
    400
  );
});
