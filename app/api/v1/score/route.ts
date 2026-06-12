import {
  attachRecommendedPlatforms,
  authenticateProtocolRequest,
  computeProtocolScore,
  parseDescription,
  protocolError,
  protocolJson,
  protocolRoute,
  recordScoreHistory,
  resolveScoreSessionId,
  scoreRequestSchema,
} from "@/lib/protocol";
import { topPlatformsForAsset } from "@/lib/protocol/products/adapter";
import { logProtocolUsage } from "@/lib/protocol/usage/log";
import { SITE_URL } from "@/lib/comparators/site";

export const POST = protocolRoute(async (req: Request) => {
  const auth = await authenticateProtocolRequest(req);
  if (!auth.ok) return auth.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return protocolError("invalid_json", "Request body must be valid JSON", 400);
  }

  const parsed = scoreRequestSchema.safeParse(body);
  if (!parsed.success) {
    return protocolError(
      "validation_error",
      parsed.error.issues.map((i) => i.message).join("; "),
      400
    );
  }

  const session = await resolveScoreSessionId(parsed.data, auth.ctx.keyHash);
  if (!session.ok) {
    return protocolError(session.code, session.message, session.code === "not_found" ? 404 : 400);
  }

  const result = computeProtocolScore(parsed.data);
  const assetType =
    parsed.data.asset_type ??
    (parsed.data.description
      ? parseDescription(parsed.data.description).assetType
      : "other");
  const platforms = await topPlatformsForAsset(assetType);
  const enriched = await attachRecommendedPlatforms(result, platforms);

  const shouldRecord =
    !auth.ctx.isDemo &&
    parsed.data.record_history !== false;

  if (shouldRecord) {
    await recordScoreHistory(
      auth.ctx.keyHash,
      session.scoreId,
      parsed.data,
      enriched,
      session.monitorId
    );
  }

  const historyUrl = `${SITE_URL}/api/v1/score/${session.scoreId}/history`;

  await logProtocolUsage(auth.ctx.keyHash, "/api/v1/score", "POST", 200);

  return protocolJson({
    ...enriched,
    score_id: session.scoreId,
    history_url: historyUrl,
  });
});
