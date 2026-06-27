import {
  authenticateProtocolRequest,
  protocolError,
  protocolJson,
  protocolRoute,
} from "@/lib/protocol";
import { logProtocolUsage } from "@/lib/protocol/usage/log";
import { carbonQualityBatchRequestSchema } from "@/lib/green/schemas/carbon-quality-batch";
import { resolveCarbonQualityBatchItem } from "@/lib/green/scoring/carbon-quality-batch";

export const POST = protocolRoute(async (req: Request) => {
  const auth = await authenticateProtocolRequest(req);
  if (!auth.ok) return auth.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return protocolError("invalid_json", "Request body must be valid JSON", 400);
  }

  const parsed = carbonQualityBatchRequestSchema.safeParse(body);
  if (!parsed.success) {
    return protocolError(
      "validation_error",
      parsed.error.issues.map((i) => i.message).join("; "),
      400
    );
  }

  const results = parsed.data.items.map((item, index) => {
    const outcome = resolveCarbonQualityBatchItem(item);
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
      carbon_quality: outcome.result,
    };
  });

  const succeeded = results.filter((r) => r.ok).length;

  await logProtocolUsage(
    auth.ctx.keyHash,
    "/api/v1/green/carbon-quality/batch",
    "POST",
    200
  );

  return protocolJson({
    disclaimer:
      "Indicative AUROS Carbon Quality Score — not Verra/ICVCM certification. Batch endpoint requires API key.",
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
