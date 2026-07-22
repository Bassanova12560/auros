import { resolveAurosAsset } from "@/lib/toll";
import {
  parseJsonBody,
  protocolError,
  protocolJson,
  tollMeteredGuard,
} from "@/lib/toll/http";

export const runtime = "nodejs";

/** GET /api/v1/toll/resolve?q= — Mandatory Lookup (metered) */
export async function GET(request: Request) {
  const guard = await tollMeteredGuard(request, "resolve");
  if (!guard.ok) return guard.response;
  const q = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (!q) {
    return protocolError("invalid_query", "Missing q", 400);
  }
  const result = await resolveAurosAsset({ q });
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

/** POST /api/v1/toll/resolve { q } */
export async function POST(request: Request) {
  const guard = await tollMeteredGuard(request, "resolve");
  if (!guard.ok) return guard.response;
  const parsed = await parseJsonBody(request);
  if (!parsed.ok) return parsed.response;
  const q = String(parsed.body.q ?? parsed.body.id ?? "").trim();
  if (!q) {
    return protocolError("invalid_query", "Missing q", 400);
  }
  const result = await resolveAurosAsset({ q });
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
