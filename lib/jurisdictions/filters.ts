import type {
  AssetFilter,
  BudgetFilter,
  DelayFilter,
  Jurisdiction,
  QuickFilter,
} from "./types";

export function applyQuickFilter(
  jurisdictions: Jurisdiction[],
  quick: QuickFilter
): Jurisdiction[] {
  if (quick === "all") return jurisdictions;
  if (quick === "bestCost") {
    return [...jurisdictions].sort((a, b) => a.totalCostMid - b.totalCostMid);
  }
  return jurisdictions.filter((j) => j.licenseMaxMonths < 6);
}

export function matchesAssetFilter(
  jurisdiction: Jurisdiction,
  filter: AssetFilter
): boolean {
  if (filter === "all") return true;
  return jurisdiction.assetTypes.includes(filter);
}

export function matchesBudgetFilter(
  jurisdiction: Jurisdiction,
  filter: BudgetFilter
): boolean {
  if (filter === "all") return true;

  const { feeMinEur, feeMaxEur } = jurisdiction;

  switch (filter) {
    case "under15k":
      return feeMinEur < 15_000;
    case "mid15_40":
      return feeMinEur <= 40_000 && feeMaxEur >= 15_000;
    case "over40":
      return feeMaxEur >= 40_000;
    default:
      return true;
  }
}

export function matchesDelayFilter(
  jurisdiction: Jurisdiction,
  filter: DelayFilter
): boolean {
  if (filter === "all") return true;

  const { delayMinMonths, delayMaxMonths } = jurisdiction;

  switch (filter) {
    case "under3":
      return delayMaxMonths <= 3;
    case "mid3_6":
      return delayMinMonths <= 6 && delayMaxMonths >= 3;
    case "over6":
      return delayMaxMonths >= 6;
    default:
      return true;
  }
}

export function filterJurisdictions(
  jurisdictions: Jurisdiction[],
  asset: AssetFilter,
  budget: BudgetFilter,
  delay: DelayFilter,
  quick: QuickFilter = "all"
): Jurisdiction[] {
  const base = jurisdictions.filter(
    (item) =>
      matchesAssetFilter(item, asset) &&
      matchesBudgetFilter(item, budget) &&
      matchesDelayFilter(item, delay)
  );
  return applyQuickFilter(base, quick);
}
