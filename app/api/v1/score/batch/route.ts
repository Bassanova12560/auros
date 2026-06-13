import {
  authenticateProtocolRequest,
  protocolError,
  protocolJson,
  protocolRoute,
  scoreBatchRequestSchema,
} from "@/lib/protocol";
import { findKeyRecord } from "@/lib/protocol/auth/keys";
import { assertCustomScoringAllowed } from "@/lib/protocol/scoring/assert-custom-scoring";
import {
  processScoreItem,
  validateScoreRequest,
} from "@/lib/protocol/scoring/process-score-item";
import { logProtocolUsage } from "@/lib/protocol/usage/log";

export const POST = protocolRoute(async (req: Request) => {
  const auth = await authenticateProtocolRequest(req);
  if (!auth.ok) return auth.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return protocolError("invalid_json", "Request body must be valid JSON", 400);
  }

  const parsed = scoreBatchRequestSchema.safeParse(body);
  if (!parsed.success) {
    return protocolError(
      "validation_error",
      parsed.error.issues.map((i) => i.message).join("; "),
      400
    );
  }

  const { items, record_history: recordHistoryDefault } = parsed.data;
  const rawKey = req.headers.get("authorization")?.slice(7).trim() ?? "";
  const record = await findKeyRecord(auth.ctx.keyHash);
  const ctx = {
    keyHash: auth.ctx.keyHash,
    isDemo: auth.ctx.isDemo,
    recordHistoryDefault,
  };

  const results = await Promise.all(
    items.map(async (rawItem, index) => {
      const validated = validateScoreRequest(rawItem);
      if (!validated.ok) {
        return {
          index,
          ok: false as const,
          error: { code: "validation_error", message: validated.message },
        };
      }

      const weightGate = assertCustomScoringAllowed(rawKey, record, auth.ctx.isDemo, {
        profile: validated.data.profile,
        weights: validated.data.weights,
      });
      if (!weightGate.ok) {
        return {
          index,
          ok: false as const,
          error: {
            code: "premium_required",
            message: "Custom scoring weights require a premium key.",
          },
        };
      }

      const outcome = await processScoreItem(validated.data, ctx);
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
        ...outcome.result,
      };
    })
  );

  const succeeded = results.filter((r) => r.ok).length;
  const failed = results.length - succeeded;

  await logProtocolUsage(auth.ctx.keyHash, "/api/v1/score/batch", "POST", 200);

  return protocolJson({
    total: results.length,
    succeeded,
    failed,
    items: results,
    meta: {
      version: "1.0" as const,
      computed_at: new Date().toISOString(),
    },
  });
});
