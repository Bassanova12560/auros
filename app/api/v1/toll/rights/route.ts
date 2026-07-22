import { isValidAssetDnaId, resolveAssetDna } from "@/lib/asset-dna";
import { buildIndicativeRightsModel } from "@/lib/toll/rights-engine";
import {
  parseJsonBody,
  protocolError,
  protocolJson,
  tollMeteredGuard,
} from "@/lib/toll/http";

export const runtime = "nodejs";

/** POST /api/v1/toll/rights { assetDnaId, revenueSharePct? } */
export async function POST(request: Request) {
  const guard = await tollMeteredGuard(request, "policy", { requireAuth: true });
  if (!guard.ok) return guard.response;
  const parsed = await parseJsonBody(request);
  if (!parsed.ok) return parsed.response;
  const assetDnaId = String(
    parsed.body.assetDnaId ?? parsed.body.id ?? ""
  ).trim();
  if (!isValidAssetDnaId(assetDnaId)) {
    return protocolError("invalid_id", "Invalid Asset DNA id", 400);
  }
  const dna = await resolveAssetDna(assetDnaId);
  const model = buildIndicativeRightsModel({
    assetDnaId,
    displayName: dna?.displayName,
    revenueSharePct:
      typeof parsed.body.revenueSharePct === "number"
        ? parsed.body.revenueSharePct
        : undefined,
  });
  return protocolJson({
    ok: true,
    model,
    meter: {
      remaining: guard.meter.remaining,
      limit: guard.meter.limit,
      cost: guard.meter.cost,
    },
  });
}
