import { JURISDICTIONS } from "@/lib/jurisdictions/data";
import type { Jurisdiction } from "@/lib/jurisdictions/types";

import type {
  AssetFilter,
  JurisdictionPickerResult,
  JurisdictionPriorities,
  JurisdictionRecommendation,
  RationaleId,
} from "./types";

const TAX_SCORES: Record<string, number> = {
  zeroPvHolding: 95,
  zeroIsPv: 92,
  zeroIs: 88,
  zeroPvIs17: 78,
  is10: 72,
  is125: 58,
  cantonVariable: 52,
  flatTax30: 32,
};

const LICENSE_MIN = 2;
const LICENSE_MAX = 9;
const COST_MIN = 10_000;
const COST_MAX = 40_000;

function licenseSpeedScore(licenseMaxMonths: number): number {
  const t = (licenseMaxMonths - LICENSE_MIN) / (LICENSE_MAX - LICENSE_MIN);
  return Math.round(100 * (1 - Math.min(1, Math.max(0, t))));
}

function costEfficiencyScore(totalCostMid: number): number {
  const t = (totalCostMid - COST_MIN) / (COST_MAX - COST_MIN);
  return Math.round(100 * (1 - Math.min(1, Math.max(0, t))));
}

function normalizeWeights(priorities: JurisdictionPriorities): {
  speed: number;
  cost: number;
  tax: number;
} {
  const raw = {
    speed: 0.2 + (priorities.speed / 100) * 0.5,
    cost: 0.2 + (priorities.cost / 100) * 0.5,
    tax: 0.2 + (priorities.tax / 100) * 0.5,
  };
  const sum = raw.speed + raw.cost + raw.tax;
  return {
    speed: raw.speed / sum,
    cost: raw.cost / sum,
    tax: raw.tax / sum,
  };
}

function pickRationale(
  j: Jurisdiction,
  priorities: JurisdictionPriorities,
  asset: AssetFilter,
  speedS: number,
  costS: number,
  taxS: number
): RationaleId {
  if (asset !== "all" && j.assetTypes.includes(asset)) {
    return "asset_fit";
  }
  if (priorities.tax >= 65 && taxS >= 75) return "tax_favorable";
  if (priorities.speed >= 65 && j.licenseMaxMonths <= 3) return "fast_track";
  if (priorities.cost >= 65 && j.totalCostMid <= 15_000) return "cost_efficient";
  if (j.id === "ireland" || j.id === "france") return "eu_passport";
  if (priorities.speed < 45 && j.stabilityTier === "high") return "stability";
  if (j.id === "luxembourg" || j.id === "singapore") return "institutional";

  const ranked: { id: RationaleId; weight: number }[] = [
    { id: "fast_track", weight: speedS * (priorities.speed / 100) },
    { id: "cost_efficient", weight: costS * (priorities.cost / 100) },
    { id: "tax_favorable", weight: taxS * (priorities.tax / 100) },
  ];
  ranked.sort((a, b) => b.weight - a.weight);
  return ranked[0]?.id ?? "stability";
}

function scoreJurisdiction(
  j: Jurisdiction,
  priorities: JurisdictionPriorities,
  asset: AssetFilter,
  weights: ReturnType<typeof normalizeWeights>
): JurisdictionRecommendation | null {
  if (asset !== "all" && !j.assetTypes.includes(asset)) {
    return null;
  }

  const speedS = licenseSpeedScore(j.licenseMaxMonths);
  const costS = costEfficiencyScore(j.totalCostMid);
  const taxS = TAX_SCORES[j.taxKey] ?? 50;

  let bonus = 0;
  if (priorities.speed < 45) {
    bonus += j.stabilityLevel * 2.5;
  }
  if (priorities.cost > 55 && j.bestValue) {
    bonus += 6;
  }
  if (priorities.speed > 55 && j.recommended) {
    bonus += 5;
  }

  const weighted =
    speedS * weights.speed + costS * weights.cost + taxS * weights.tax + bonus;

  const score = Math.round(Math.min(100, Math.max(0, weighted)));
  const rationaleId = pickRationale(
    j,
    priorities,
    asset,
    speedS,
    costS,
    taxS
  );

  return { id: j.id, score, rationaleId };
}

export function rankJurisdictions(
  priorities: JurisdictionPriorities,
  asset: AssetFilter = "all"
): JurisdictionPickerResult {
  const weights = normalizeWeights(priorities);

  const scored: JurisdictionRecommendation[] = [];
  for (const j of JURISDICTIONS) {
    const row = scoreJurisdiction(j, priorities, asset, weights);
    if (row) scored.push(row);
  }

  scored.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));

  return { recommendations: scored.slice(0, 3) };
}
