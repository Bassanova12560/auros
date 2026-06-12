import { SITE_URL } from "@/lib/comparators/site";

import { parseDescription } from "../nlp/parse-description";
import { topPlatformsForAsset } from "../products/adapter";
import type { ScoreRequest } from "../schemas/score";
import { scoreRequestSchema } from "../schemas/score";
import { attachRecommendedPlatforms, computeProtocolScore } from "./compute-score";
import type { ProtocolScoreResult } from "./compute-score";
import { recordScoreHistory, resolveScoreSessionId } from "./history";

export type ProcessScoreContext = {
  keyHash: string;
  isDemo: boolean;
  recordHistoryDefault?: boolean;
};

export type ProcessedScoreResult = ProtocolScoreResult & {
  score_id: string;
  history_url: string;
};

export type ProcessScoreSuccess = {
  ok: true;
  result: ProcessedScoreResult;
};

export type ProcessScoreFailure = {
  ok: false;
  code: string;
  message: string;
};

export type ProcessScoreOutcome = ProcessScoreSuccess | ProcessScoreFailure;

export function validateScoreRequest(
  input: unknown
): { ok: true; data: ScoreRequest } | { ok: false; message: string } {
  const parsed = scoreRequestSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues.map((i) => i.message).join("; "),
    };
  }
  return { ok: true, data: parsed.data };
}

export async function processScoreItem(
  rawItem: ScoreRequest,
  ctx: ProcessScoreContext
): Promise<ProcessScoreOutcome> {
  const item: ScoreRequest = {
    ...rawItem,
    record_history:
      rawItem.record_history !== undefined
        ? rawItem.record_history
        : ctx.recordHistoryDefault,
  };

  const session = await resolveScoreSessionId(item, ctx.keyHash);
  if (!session.ok) {
    return { ok: false, code: session.code, message: session.message };
  }

  const result = computeProtocolScore(item);
  const assetType =
    item.asset_type ??
    (item.description ? parseDescription(item.description).assetType : "other");
  const platforms = await topPlatformsForAsset(assetType);
  const enriched = await attachRecommendedPlatforms(result, platforms);

  const shouldRecord = !ctx.isDemo && item.record_history !== false;

  if (shouldRecord) {
    await recordScoreHistory(
      ctx.keyHash,
      session.scoreId,
      item,
      enriched,
      session.monitorId
    );
  }

  const historyUrl = `${SITE_URL}/api/v1/score/${session.scoreId}/history`;

  return {
    ok: true,
    result: {
      ...enriched,
      score_id: session.scoreId,
      history_url: historyUrl,
    },
  };
}
