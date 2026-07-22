import {
  appendProvenanceRecord,
  getProvenanceChain,
  isDerivedProvenance,
  listProvenanceForAsset,
} from "@/lib/toll/provenance";
import {
  parseJsonBody,
  protocolError,
  protocolJson,
  tollMeteredGuard,
} from "@/lib/toll/http";

export const runtime = "nodejs";

function meterPayload(meter: {
  remaining: number;
  limit: number;
  cost: number;
}) {
  return {
    remaining: meter.remaining,
    limit: meter.limit,
    cost: meter.cost,
  };
}

/**
 * GET /api/v1/toll/provenance?assetDnaId=&fieldKey?
 * — list asset rows, or field chain when fieldKey set (policy credits).
 */
export async function GET(request: Request) {
  const guard = await tollMeteredGuard(request, "policy", {
    requireAuth: true,
  });
  if (!guard.ok) return guard.response;

  const url = new URL(request.url);
  const assetDnaId = (url.searchParams.get("assetDnaId") ?? "").trim();
  const fieldKey = (url.searchParams.get("fieldKey") ?? "").trim();
  if (!assetDnaId) {
    return protocolError("invalid_id", "Missing assetDnaId", 400);
  }

  if (fieldKey) {
    const chain = getProvenanceChain(fieldKey, assetDnaId);
    return protocolJson({
      ok: true,
      mode: "chain",
      assetDnaId,
      fieldKey,
      chain: chain.map((r) => ({
        ...r,
        kind: isDerivedProvenance(r) ? "derived" : "raw",
      })),
      meter: meterPayload(guard.meter),
      disclaimer:
        "Indicative provenance ledger — not an oracle. HITL for auditor citation.",
    });
  }

  const records = listProvenanceForAsset(assetDnaId).slice(0, 100).map((r) => ({
    ...r,
    kind: isDerivedProvenance(r) ? "derived" : "raw",
  }));
  return protocolJson({
    ok: true,
    mode: "list",
    assetDnaId,
    records,
    meter: meterPayload(guard.meter),
    disclaimer:
      "Indicative provenance ledger — not an oracle. HITL for auditor citation.",
  });
}

/**
 * POST /api/v1/toll/provenance — append row (research credits).
 * Body: { assetDnaId, fieldKey, valueSummary, originSystem, actor?, transformedFrom?, attestationSourceId? }
 */
export async function POST(request: Request) {
  const guard = await tollMeteredGuard(request, "research", {
    requireAuth: true,
  });
  if (!guard.ok) return guard.response;
  const parsed = await parseJsonBody(request);
  if (!parsed.ok) return parsed.response;

  const assetDnaId = String(
    parsed.body.assetDnaId ?? parsed.body.id ?? ""
  ).trim();
  const fieldKey = String(parsed.body.fieldKey ?? "").trim();
  const valueSummary = String(parsed.body.valueSummary ?? "").trim();
  const originSystem = String(parsed.body.originSystem ?? "").trim();
  if (!assetDnaId || !fieldKey || !valueSummary || !originSystem) {
    return protocolError(
      "invalid_input",
      "assetDnaId, fieldKey, valueSummary, originSystem required",
      400
    );
  }

  const record = appendProvenanceRecord({
    assetDnaId,
    fieldKey,
    valueSummary,
    originSystem,
    actor:
      typeof parsed.body.actor === "string" ? parsed.body.actor : undefined,
    transformedFrom:
      typeof parsed.body.transformedFrom === "string"
        ? parsed.body.transformedFrom
        : undefined,
    attestationSourceId:
      typeof parsed.body.attestationSourceId === "string"
        ? parsed.body.attestationSourceId
        : undefined,
  });

  return protocolJson({
    ok: true,
    record: {
      ...record,
      kind: isDerivedProvenance(record) ? "derived" : "raw",
    },
    meter: meterPayload(guard.meter),
    disclaimer:
      "Indicative provenance ledger — not an oracle. HITL for auditor citation.",
  });
}
