import { getValidationTrail } from "@/lib/toll";
import {
  parseJsonBody,
  protocolError,
  protocolJson,
  tollMeteredGuard,
} from "@/lib/toll/http";

export const runtime = "nodejs";

/** POST /api/v1/toll/trail { assetDnaId, limit? } */
export async function POST(request: Request) {
  const guard = await tollMeteredGuard(request, "trail");
  if (!guard.ok) return guard.response;
  const parsed = await parseJsonBody(request);
  if (!parsed.ok) return parsed.response;
  const assetDnaId = String(
    parsed.body.assetDnaId ?? parsed.body.id ?? ""
  ).trim();
  if (!assetDnaId) {
    return protocolError("invalid_query", "Missing assetDnaId", 400);
  }
  const result = await getValidationTrail({
    assetDnaId,
    limit: typeof parsed.body.limit === "number" ? parsed.body.limit : 50,
  });
  if ("error" in result) {
    return protocolError(result.error, "Invalid Asset DNA id", 400);
  }
  return protocolJson({
    ok: true,
    ...result,
    meter: {
      remaining: guard.meter.remaining,
      limit: guard.meter.limit,
      cost: guard.meter.cost,
    },
  });
}
