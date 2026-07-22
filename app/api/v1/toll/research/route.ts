import { researchAurosAsset } from "@/lib/toll";
import {
  parseJsonBody,
  protocolError,
  protocolJson,
  tollMeteredGuard,
} from "@/lib/toll/http";

export const runtime = "nodejs";

/** POST /api/v1/toll/research — Bearer + credits */
export async function POST(request: Request) {
  const guard = await tollMeteredGuard(request, "research", {
    requireAuth: true,
  });
  if (!guard.ok) return guard.response;
  const parsed = await parseJsonBody(request);
  if (!parsed.ok) return parsed.response;
  const q = String(parsed.body.q ?? parsed.body.id ?? "").trim();
  if (!q) {
    return protocolError("invalid_query", "Missing q", 400);
  }
  const result = await researchAurosAsset({ q });
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
