import { rankJurisdictions } from "@/lib/jurisdiction-picker/scoring";
import type { AssetFilter } from "@/lib/jurisdiction-picker/types";
import { JURISDICTIONS } from "@/lib/jurisdictions/data";
import type { Jurisdiction } from "@/lib/jurisdictions/types";

import type {
  CostAssetType,
  CostBreakdownLine,
  CostEstimate,
  CostEstimatorInput,
  CostLineId,
  DealSizeRange,
  JurisdictionChoice,
} from "./types";

/**
 * One-time setup split — documented assumptions (counsel + regulator + audit).
 * Sums to 1.0; applied to setupMin/setupMax after jurisdiction base costs.
 */
export const SETUP_SPLIT: Record<Exclude<CostLineId, "ongoing">, number> = {
  legal: 0.32,
  licensing: 0.43,
  audit: 0.25,
};

/** Complexity uplift vs bonds baseline — see inline comments in tests. */
export const ASSET_MULTIPLIER: Record<CostAssetType, number> = {
  real_estate: 1.15,
  funds: 1.1,
  bonds: 1.0,
  private_credit: 1.12,
  green_carbon: 1.08,
};

export const DEAL_SIZE_MULTIPLIER: Record<DealSizeRange, number> = {
  under_500k: 1.0,
  "500k_2m": 1.1,
  "2m_10m": 1.28,
  over_10m: 1.55,
};

/** Midpoint AUM (€) per bucket — used for ongoing compliance scaling. */
export const DEAL_SIZE_MID_EUR: Record<DealSizeRange, number> = {
  under_500k: 250_000,
  "500k_2m": 1_000_000,
  "2m_10m": 5_000_000,
  over_10m: 25_000_000,
};

export const JURISDICTION_IDS = JURISDICTIONS.map((j) => j.id);

function toAssetFilter(asset: CostAssetType): AssetFilter {
  if (asset === "green_carbon") return "all";
  return asset;
}

function resolveJurisdiction(
  choice: JurisdictionChoice,
  asset: CostAssetType
): { jurisdiction: Jurisdiction; recommended: boolean } {
  if (choice !== "recommend") {
    const found = JURISDICTIONS.find((j) => j.id === choice);
    if (found) return { jurisdiction: found, recommended: false };
  }

  const ranked = rankJurisdictions(
    { speed: 50, cost: 65, tax: 45 },
    toAssetFilter(asset)
  );
  const topId = ranked.recommendations[0]?.id ?? "dubai-difc";
  const jurisdiction = JURISDICTIONS.find((j) => j.id === topId) ?? JURISDICTIONS[0]!;
  return { jurisdiction, recommended: choice === "recommend" };
}

function roundEur(value: number): number {
  return Math.round(value / 500) * 500;
}

function splitSetup(setupMin: number, setupMax: number): CostBreakdownLine[] {
  const ids: Exclude<CostLineId, "ongoing">[] = ["legal", "licensing", "audit"];
  const lines: CostBreakdownLine[] = [];
  let minAllocated = 0;
  let maxAllocated = 0;

  for (let i = 0; i < ids.length; i++) {
    const id = ids[i]!;
    const isLast = i === ids.length - 1;
    const remainingLines = ids.length - 1 - i;
    const minReserve = remainingLines * 500;

    if (isLast) {
      lines.push({
        id,
        minEur: setupMin - minAllocated,
        maxEur: setupMax - maxAllocated,
      });
      break;
    }

    const minEur = Math.min(
      roundEur(setupMin * SETUP_SPLIT[id]),
      Math.max(0, setupMin - minReserve - minAllocated)
    );
    const maxEur = Math.min(
      roundEur(setupMax * SETUP_SPLIT[id]),
      Math.max(minEur, setupMax - minReserve - maxAllocated)
    );
    minAllocated += minEur;
    maxAllocated += maxEur;
    lines.push({ id, minEur, maxEur });
  }

  return lines;
}

export function computeCostEstimate(input: CostEstimatorInput): CostEstimate {
  const { jurisdiction, recommended } = resolveJurisdiction(
    input.jurisdiction,
    input.assetType
  );

  const assetMult = ASSET_MULTIPLIER[input.assetType];
  const dealMult = DEAL_SIZE_MULTIPLIER[input.dealSize];
  const dealMid = DEAL_SIZE_MID_EUR[input.dealSize];
  const combined = assetMult * dealMult;

  const setupMin = roundEur(
    Math.max(jurisdiction.feeMinEur, jurisdiction.totalCostMid * 0.62) * combined
  );
  const setupMax = roundEur(
    Math.max(jurisdiction.feeMaxEur, jurisdiction.totalCostMid * 1.42) * combined
  );

  const breakdown = splitSetup(setupMin, setupMax);

  const ongoingMin = roundEur(
    jurisdiction.totalCostMid * 0.06 * dealMult + dealMid * 0.0008
  );
  const ongoingMax = roundEur(
    jurisdiction.totalCostMid * 0.14 * dealMult + dealMid * 0.0025
  );

  const sourceNote = recommended
    ? `Juridiction recommandée via sélecteur AUROS (pondération coût) — base ${jurisdiction.id} · lib/jurisdictions/data.ts`
    : `Base ${jurisdiction.id} — frais et délais comparateur AUROS (lib/jurisdictions/data.ts)`;

  return {
    jurisdictionId: jurisdiction.id,
    jurisdictionRecommended: recommended,
    setupMinEur: setupMin,
    setupMaxEur: setupMax,
    breakdown,
    ongoingMinEur: ongoingMin,
    ongoingMaxEur: ongoingMax,
    totalFirstYearMinEur: setupMin + ongoingMin,
    totalFirstYearMaxEur: setupMax + ongoingMax,
    delayMinMonths: jurisdiction.delayMinMonths,
    delayMaxMonths: jurisdiction.delayMaxMonths,
    sourceNote,
  };
}

export function formatCostEur(value: number, locale = "fr-FR"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}
