import { JURISDICTIONS } from "@/lib/jurisdictions/data";
import { rankJurisdictions } from "@/lib/jurisdiction-picker/scoring";
import type { AssetFilter, JurisdictionPriorities } from "@/lib/jurisdiction-picker/types";

import type { JurisdictionsQuery } from "../schemas/jurisdictions";

function prioritiesFromQuery(query: JurisdictionsQuery): JurisdictionPriorities {
  let speed = 50;
  let cost = 50;
  let tax = 45;

  if (query.timeline_months !== undefined) {
    if (query.timeline_months <= 3) speed = 90;
    else if (query.timeline_months <= 6) speed = 70;
    else speed = 35;
  }

  if (query.budget !== undefined) {
    if (query.budget <= 15_000) cost = 90;
    else if (query.budget <= 40_000) cost = 55;
    else cost = 25;
  }

  if (query.investor_type === "retail") {
    tax = 40;
    speed = Math.min(100, speed + 10);
  } else if (query.investor_type === "professional") {
    tax = 55;
  }

  return { speed, cost, tax };
}

export function rankProtocolJurisdictions(query: JurisdictionsQuery) {
  const asset = (query.asset_type ?? "all") as AssetFilter;
  const priorities = prioritiesFromQuery(query);
  const ranked = rankJurisdictions(priorities, asset);

  const byId = new Map(JURISDICTIONS.map((j) => [j.id, j]));

  return ranked.recommendations.map((rec) => {
    const j = byId.get(rec.id);
    return {
      id: rec.id,
      score: rec.score,
      rationale: rec.rationaleId,
      fee_min_eur: j?.feeMinEur ?? 0,
      fee_max_eur: j?.feeMaxEur ?? 0,
      license_max_months: j?.licenseMaxMonths ?? 0,
      asset_types: j?.assetTypes ?? [],
      kyc_level: j?.kycLevel ?? "medium",
    };
  });
}
