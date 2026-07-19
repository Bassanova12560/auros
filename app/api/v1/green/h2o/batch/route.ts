import {
  authenticateProtocolRequest,
  checkPremiumAccess,
  protocolError,
  protocolJson,
  protocolRoute,
} from "@/lib/protocol";
import { findKeyRecord } from "@/lib/protocol/auth/keys";
import { logProtocolUsage } from "@/lib/protocol/usage/log";
import { h2oBatchRequestSchema } from "@/lib/green/schemas/h2o-batch";
import { resolveH2oBatchItem } from "@/lib/green/scoring/h2o-batch";

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

  const parsed = h2oBatchRequestSchema.safeParse(body);
  if (!parsed.success) {
    return protocolError(
      "validation_error",
      parsed.error.issues.map((i) => i.message).join("; "),
      400
    );
  }

  const results = parsed.data.items.map((item, index) => {
    const outcome = resolveH2oBatchItem(item);
    if (!outcome.ok) {
      return {
        index,
        ok: false as const,
        error: { code: outcome.code, message: outcome.message },
      };
    }
    return {
      index,
      ok: true as const,
      id: item.id ?? null,
      h2o_score: outcome.result,
    };
  });

  const succeeded = results.filter((r) => r.ok).length;

  await logProtocolUsage(auth.ctx.keyHash, "/api/v1/green/h2o/batch", "POST", 200);

  return protocolJson({
    disclaimer:
      "Indicative AUROS H₂O Score — hydrological readiness signal. passport_required=true means a verifiable Passeport Hydrique AUROS dossier is required for listing-grade attestation. Batch endpoint requires paid premium tier — a free auros_pk_live_* key is not enough.",
    total: results.length,
    succeeded,
    failed: results.length - succeeded,
    items: results,
    meta: {
      version: "1.0" as const,
      computed_at: new Date().toISOString(),
      passport_standard: "https://getauros.com/eau",
    },
  });
});
