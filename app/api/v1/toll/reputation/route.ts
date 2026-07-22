import { isValidAssetDnaId, resolveAssetDna } from "@/lib/asset-dna";
import { listProofStreamEventsAsync } from "@/lib/proof-stream";
import {
  computeRealityReputation,
  REALITY_REPUTATION_DISCLAIMER,
} from "@/lib/toll/reputation";
import { listProvenanceForAsset } from "@/lib/toll/provenance";
import { listSourceAttestations } from "@/lib/toll/source-attestation";
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

async function reputationForAsset(assetDnaId: string) {
  const id = assetDnaId.trim();
  if (!isValidAssetDnaId(id)) {
    return { error: "invalid_id" as const };
  }
  const dna = await resolveAssetDna(id);
  if (!dna) {
    return { error: "not_found" as const };
  }
  const events = await listProofStreamEventsAsync(id, 80);
  const provenance = listProvenanceForAsset(id);
  const provenanceCount = provenance.length;
  const linkedSourceIds = new Set(
    provenance
      .map((p) => p.attestationSourceId)
      .filter((x): x is string => Boolean(x))
  );
  const activeSources = listSourceAttestations().filter(
    (s) => s.status === "active" && linkedSourceIds.has(s.id)
  );
  const sourceCount =
    linkedSourceIds.size > 0
      ? Math.max(linkedSourceIds.size, activeSources.length)
      : 0;

  const reputation = computeRealityReputation({
    dna,
    events,
    provenanceCount,
    sourceCount,
  });

  return {
    assetDnaId: id,
    reputation,
    signals: {
      eventCount: events.length,
      provenanceCount,
      sourceCount,
    },
  };
}

/**
 * GET /api/v1/toll/reputation?assetDnaId=
 * — policy credits, Bearer required.
 */
export async function GET(request: Request) {
  const guard = await tollMeteredGuard(request, "policy", {
    requireAuth: true,
  });
  if (!guard.ok) return guard.response;

  const url = new URL(request.url);
  const assetDnaId = (url.searchParams.get("assetDnaId") ?? "").trim();
  if (!assetDnaId) {
    return protocolError("invalid_id", "Missing assetDnaId", 400);
  }

  const result = await reputationForAsset(assetDnaId);
  if ("error" in result) {
    if (result.error === "invalid_id") {
      return protocolError("invalid_id", "Invalid assetDnaId", 400);
    }
    return protocolError("not_found", "Asset DNA not found", 404);
  }

  return protocolJson({
    ok: true,
    ...result,
    meter: meterPayload(guard.meter),
    disclaimer: REALITY_REPUTATION_DISCLAIMER,
  });
}

/**
 * POST /api/v1/toll/reputation
 * Body: { assetDnaId, provenanceCount?, sourceCount? }
 * — research credits, Bearer required.
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
  if (!assetDnaId) {
    return protocolError("invalid_id", "Missing assetDnaId", 400);
  }

  const result = await reputationForAsset(assetDnaId);
  if ("error" in result) {
    if (result.error === "invalid_id") {
      return protocolError("invalid_id", "Invalid assetDnaId", 400);
    }
    return protocolError("not_found", "Asset DNA not found", 404);
  }

  // Optional overrides for desk / issuer improvement sims
  const overrideProv =
    typeof parsed.body.provenanceCount === "number"
      ? Math.max(0, parsed.body.provenanceCount)
      : undefined;
  const overrideSrc =
    typeof parsed.body.sourceCount === "number"
      ? Math.max(0, parsed.body.sourceCount)
      : undefined;

  let reputation = result.reputation;
  if (overrideProv != null || overrideSrc != null) {
    const dna = await resolveAssetDna(assetDnaId);
    const events = await listProofStreamEventsAsync(assetDnaId, 80);
    reputation = computeRealityReputation({
      dna,
      events,
      provenanceCount: overrideProv ?? result.signals.provenanceCount,
      sourceCount: overrideSrc ?? result.signals.sourceCount,
    });
  }

  return protocolJson({
    ok: true,
    assetDnaId: result.assetDnaId,
    reputation,
    signals: {
      ...result.signals,
      provenanceCount: overrideProv ?? result.signals.provenanceCount,
      sourceCount: overrideSrc ?? result.signals.sourceCount,
    },
    meter: meterPayload(guard.meter),
    disclaimer: REALITY_REPUTATION_DISCLAIMER,
  });
}
