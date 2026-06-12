import {
  authenticateProtocolRequest,
  listScoreHistory,
  protocolError,
  protocolJson,
  protocolRoute,
  scoreHistoryResponseSchema,
} from "@/lib/protocol";
import { logProtocolUsage } from "@/lib/protocol/usage/log";
import type { ScoreHistoryRecord } from "@/lib/protocol/scoring/history";

type RouteContext = { params: Promise<{ id: string }> };

function toHistoryEntry(record: ScoreHistoryRecord) {
  return {
    id: record.id,
    score: record.score,
    grade: record.grade,
    status: record.payload.status,
    breakdown: record.payload.breakdown,
    mica_classification: record.payload.mica_classification,
    request: record.payload.request,
    created_at: record.created_at,
  };
}

export const GET = protocolRoute(async (req: Request, context: RouteContext) => {
  const auth = await authenticateProtocolRequest(req);
  if (!auth.ok) return auth.response;

  const { id } = await context.params;
  const result = await listScoreHistory(id, auth.ctx.keyHash);
  if (!result) {
    return protocolError(
      "not_found",
      "Historique introuvable — score session ou monitor invalide",
      404
    );
  }

  const entries = result.entries.map(toHistoryEntry);
  const payload = {
    score_id: id,
    kind: result.kind,
    total: entries.length,
    entries,
    meta: {
      version: "1.0" as const,
      computed_at: new Date().toISOString(),
    },
  };

  const parsed = scoreHistoryResponseSchema.safeParse(payload);
  if (!parsed.success) {
    return protocolError("internal_error", "Invalid history payload", 500);
  }

  await logProtocolUsage(auth.ctx.keyHash, `/api/v1/score/${id}/history`, "GET", 200);

  return protocolJson(parsed.data);
});
