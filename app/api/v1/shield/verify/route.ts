import { protocolError, protocolJson, protocolRoute } from "@/lib/protocol";
import {
  SHIELD_DISCLAIMER,
  getReceipt,
  toPublicVerify,
  verifyCloudAnchor,
} from "@/lib/shield";

export const runtime = "nodejs";

/**
 * Public counterparty verify — forever free.
 * Verify by receipt id OR by content_hash + cloud_signature (stateless).
 */
export const POST = protocolRoute(async (req: Request) => {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return protocolError("invalid_json", "Request body must be valid JSON", 400);
  }

  const b = body as {
    id?: string;
    content_hash?: string;
    cloud_signature?: string;
  };

  if (b.id?.trim()) {
    const receipt = getReceipt(b.id.trim());
    if (!receipt) {
      return protocolError("not_found", "Receipt not found", 404);
    }
    return protocolJson({
      ...toPublicVerify(receipt),
      mode: "receipt",
      freemium: "public_verify_free",
    });
  }

  if (b.content_hash && b.cloud_signature) {
    const valid = verifyCloudAnchor(b.content_hash, b.cloud_signature);
    return protocolJson({
      valid,
      content_hash: b.content_hash.trim().toLowerCase(),
      mode: "stateless",
      payload_retained: false,
      freemium: "public_verify_free",
      disclaimer: SHIELD_DISCLAIMER,
    });
  }

  return protocolError(
    "validation_error",
    "Provide id OR content_hash + cloud_signature",
    400
  );
});
