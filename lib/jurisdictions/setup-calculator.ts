import { JURISDICTIONS } from "./data";
import type { JurisdictionAssetType } from "./types";

export type ProjectValueBand = "under1m" | "1to5m" | "5to20m" | "over20m";

const VALUE_MULTIPLIERS: Record<ProjectValueBand, number> = {
  under1m: 0.85,
  "1to5m": 1,
  "5to20m": 1.15,
  over20m: 1.35,
};

export const AUROS_STARTER_KIT_EUR = 5_000;

export type SetupBudgetEstimate = {
  jurisdictionId: string;
  stateMinEur: number;
  stateMaxEur: number;
  advisoryMinEur: number;
  advisoryMaxEur: number;
  aurosStarterEur: number;
  totalMinEur: number;
  totalMaxEur: number;
  delayMonthsMin: number;
  delayMonthsMax: number;
  licenseLabel: string;
};

function splitFees(totalMin: number, totalMax: number) {
  const stateRatio = 0.38;
  return {
    stateMinEur: Math.round(totalMin * stateRatio),
    stateMaxEur: Math.round(totalMax * stateRatio),
    advisoryMinEur: Math.round(totalMin * (1 - stateRatio)),
    advisoryMaxEur: Math.round(totalMax * (1 - stateRatio)),
  };
}

export function estimateSetupBudget(
  jurisdictionId: string,
  projectValue: ProjectValueBand = "1to5m"
): SetupBudgetEstimate | null {
  const jurisdiction = JURISDICTIONS.find((j) => j.id === jurisdictionId);
  if (!jurisdiction) return null;

  const multiplier = VALUE_MULTIPLIERS[projectValue] ?? 1;
  const totalMin = Math.round(jurisdiction.feeMinEur * multiplier);
  const totalMax = Math.round(jurisdiction.feeMaxEur * multiplier);
  const fees = splitFees(totalMin, totalMax);

  return {
    jurisdictionId,
    ...fees,
    aurosStarterEur: AUROS_STARTER_KIT_EUR,
    totalMinEur: totalMin + AUROS_STARTER_KIT_EUR,
    totalMaxEur: totalMax + AUROS_STARTER_KIT_EUR,
    delayMonthsMin: jurisdiction.delayMinMonths,
    delayMonthsMax: jurisdiction.delayMaxMonths,
    licenseLabel: jurisdiction.licenseKey,
  };
}

export function jurisdictionsForAsset(asset: JurisdictionAssetType) {
  return JURISDICTIONS.filter((j) => j.assetTypes.includes(asset));
}

export function formatEurRange(min: number, max: number, locale = "fr-FR"): string {
  const fmt = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });
  return `${fmt.format(min)} – ${fmt.format(max)}`;
}
