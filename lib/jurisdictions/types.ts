export type JurisdictionAssetType =
  | "real_estate"
  | "bonds"
  | "private_credit"
  | "funds";

export type KycLevel = "strong" | "medium" | "light";

export type StabilityTier = "high" | "medium" | "risky";

export type AssetFilter = "all" | JurisdictionAssetType;

export type BudgetFilter = "all" | "under15k" | "mid15_40" | "over40";

export type DelayFilter = "all" | "under3" | "mid3_6" | "over6";

export type QuickFilter = "all" | "bestCost" | "fastDelay";

export type Jurisdiction = {
  id: string;
  feeMinEur: number;
  feeMaxEur: number;
  /** Midpoint for cost sorting (€) */
  totalCostMid: number;
  delayMinMonths: number;
  delayMaxMonths: number;
  /** Max months for licence only — quick filter */
  licenseMaxMonths: number;
  licenseKey: string;
  kycLevel: KycLevel;
  assetsKey: string;
  assetTypes: JurisdictionAssetType[];
  taxKey: string;
  minInvestorsKey: string;
  audienceKey: string;
  score: number;
  stabilityLevel: number;
  stabilityTier: StabilityTier;
  recommended?: boolean;
  bestValue?: boolean;
};
