import { buildTollBenchmark } from "@/lib/toll/benchmark";
import {
  parseJsonBody,
  protocolJson,
  tollMeteredGuard,
} from "@/lib/toll/http";

export const runtime = "nodejs";

/**
 * POST /api/v1/toll/benchmark
 * Body: { kind?: green_index|segment|peer_rank, assetId?, segment?, topN? }
 * Bearer + search credits.
 */
export async function POST(request: Request) {
  const guard = await tollMeteredGuard(request, "search", {
    requireAuth: true,
  });
  if (!guard.ok) return guard.response;
  const parsed = await parseJsonBody(request);
  if (!parsed.ok) return parsed.response;

  const kindRaw = String(parsed.body.kind ?? "green_index").trim();
  const kind =
    kindRaw === "segment" || kindRaw === "peer_rank" || kindRaw === "green_index"
      ? kindRaw
      : "green_index";

  const pack = await buildTollBenchmark({
    kind,
    assetId:
      typeof parsed.body.assetId === "string"
        ? parsed.body.assetId
        : typeof parsed.body.id === "string"
          ? parsed.body.id
          : undefined,
    segment:
      typeof parsed.body.segment === "string"
        ? parsed.body.segment
        : undefined,
    topN:
      typeof parsed.body.topN === "number" ? parsed.body.topN : undefined,
  });

  return protocolJson({
    ok: true,
    ...pack,
    meter: {
      remaining: guard.meter.remaining,
      limit: guard.meter.limit,
      cost: guard.meter.cost,
    },
  });
}
