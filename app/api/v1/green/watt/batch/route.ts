import {
  authenticateProtocolRequest,
  checkPremiumAccess,
  protocolError,
  protocolJson,
  protocolRoute,
} from "@/lib/protocol";
import { findKeyRecord } from "@/lib/protocol/auth/keys";
import { logProtocolUsage } from "@/lib/protocol/usage/log";
import { wattBatchRequestSchema } from "@/lib/green/schemas/watt-batch";
import { resolveWattBatchItem } from "@/lib/green/scoring/watt-batch";

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

  const parsed = wattBatchRequestSchema.safeParse(body);
  if (!parsed.success) {
    return protocolError(
      "validation_error",
      parsed.error.issues.map((i) => i.message).join("; "),
      400
    );
  }

  const results = parsed.data.items.map((item, index) => {
    const outcome = resolveWattBatchItem(item);
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
      watt_score: outcome.result,
    };
  });

  const succeeded = results.filter((r) => r.ok).length;

  await logProtocolUsage(
    auth.ctx.keyHash,
    "/api/v1/green/watt/batch",
    "POST",
    200
  );

  return protocolJson({
    disclaimer:
      "Indicative AUROS Watt Score — energy value signal, not a production audit. Batch endpoint requires paid premium tier (Monitor / Green API Premium / Enterprise) — a free auros_pk_live_* key is not enough.",
    total: results.length,
    succeeded,
    failed: results.length - succeeded,
    items: results,
    meta: {
      version: "1.0" as const,
      computed_at: new Date().toISOString(),
    },
  });
});
