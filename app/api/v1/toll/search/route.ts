import { searchAurosAssets } from "@/lib/toll";
import {
  parseJsonBody,
  protocolJson,
  tollMeteredGuard,
} from "@/lib/toll/http";

export const runtime = "nodejs";

/** POST /api/v1/toll/search { q, limit? } */
export async function POST(request: Request) {
  const guard = await tollMeteredGuard(request, "search");
  if (!guard.ok) return guard.response;
  const parsed = await parseJsonBody(request);
  if (!parsed.ok) return parsed.response;
  const result = await searchAurosAssets({
    q: String(parsed.body.q ?? ""),
    limit: typeof parsed.body.limit === "number" ? parsed.body.limit : 20,
    boostReputation: parsed.body.boostReputation === true,
  });
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
