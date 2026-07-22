import { evaluateTollPolicy, resolveAurosAsset } from "@/lib/toll";
import { listProofStreamEventsAsync } from "@/lib/proof-stream";
import {
  parseJsonBody,
  protocolError,
  protocolJson,
  tollMeteredGuard,
} from "@/lib/toll/http";

export const runtime = "nodejs";

/** POST /api/v1/toll/policy — Bearer + credits */
export async function POST(request: Request) {
  const guard = await tollMeteredGuard(request, "policy", { requireAuth: true });
  if (!guard.ok) return guard.response;
  const parsed = await parseJsonBody(request);
  if (!parsed.ok) return parsed.response;
  const q = String(
    parsed.body.q ?? parsed.body.assetDnaId ?? parsed.body.id ?? ""
  ).trim();
  if (!q) {
    return protocolError("invalid_query", "Missing q or assetDnaId", 400);
  }
  const resolved = await resolveAurosAsset({ q });
  const dna = resolved.resolved ? resolved.dna : null;
  const events = dna
    ? await listProofStreamEventsAsync(dna.id, 50)
    : undefined;
  const decision = evaluateTollPolicy({ dna, events });
  return protocolJson({
    ok: true,
    query: q,
    resolved: resolved.resolved,
    ...decision,
    meter: {
      remaining: guard.meter.remaining,
      limit: guard.meter.limit,
      cost: guard.meter.cost,
    },
  });
}
