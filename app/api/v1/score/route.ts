import {
  authenticateProtocolRequest,
  protocolError,
  protocolJson,
  protocolRoute,
  scoreRequestSchema,
} from "@/lib/protocol";
import { findKeyRecord } from "@/lib/protocol/auth/keys";
import { assertCustomScoringAllowed } from "@/lib/protocol/scoring/assert-custom-scoring";
import { processScoreItem } from "@/lib/protocol/scoring/process-score-item";
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

  const parsed = scoreRequestSchema.safeParse(body);
  if (!parsed.success) {
    return protocolError(
      "validation_error",
      parsed.error.issues.map((i) => i.message).join("; "),
      400
    );
  }

  const rawKey = req.headers.get("authorization")?.slice(7).trim() ?? "";
  const record = await findKeyRecord(auth.ctx.keyHash);
  const weightGate = assertCustomScoringAllowed(rawKey, record, auth.ctx.isDemo, {
    profile: parsed.data.profile,
    weights: parsed.data.weights,
  });
  if (!weightGate.ok) return weightGate.response;

  const outcome = await processScoreItem(parsed.data, {
    keyHash: auth.ctx.keyHash,
    isDemo: auth.ctx.isDemo,
  });

  if (!outcome.ok) {
    return protocolError(
      outcome.code,
      outcome.message,
      outcome.code === "not_found" ? 404 : 400
    );
  }

  await logProtocolUsage(auth.ctx.keyHash, "/api/v1/score", "POST", 200);

  return protocolJson(outcome.result);
});
