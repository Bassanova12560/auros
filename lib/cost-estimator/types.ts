export const COST_ESTIMATOR_ROUTE = "/tools/cost-estimator";

/** Asset classes for tokenization cost modelling — aligned with compare hub + green. */
export type CostAssetType =
  | "real_estate"
  | "funds"
  | "bonds"
  | "private_credit"
  | "green_carbon";

export type DealSizeRange = "under_500k" | "500k_2m" | "2m_10m" | "over_10m";

export type JurisdictionChoice = "recommend" | string;

export type CostLineId = "legal" | "licensing" | "audit" | "ongoing";

export type CostBreakdownLine = {
  id: CostLineId;
  minEur: number;
  maxEur: number;
};

export type CostEstimatorInput = {
  assetType: CostAssetType;
  dealSize: DealSizeRange;
  jurisdiction: JurisdictionChoice;
};

export type CostEstimate = {
  jurisdictionId: string;
  jurisdictionRecommended: boolean;
  setupMinEur: number;
  setupMaxEur: number;
  breakdown: CostBreakdownLine[];
  ongoingMinEur: number;
  ongoingMaxEur: number;
  totalFirstYearMinEur: number;
  totalFirstYearMaxEur: number;
  delayMinMonths: number;
  delayMaxMonths: number;
  sourceNote: string;
};
