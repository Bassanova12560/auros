export const YIELD_CALCULATOR_ROUTE = "/tools/yield-calculator";

/** Asset classes aligned with AUROS compare hub categories. */
export type YieldAssetClass =
  | "tbills"
  | "stablecoins"
  | "real_estate"
  | "private_credit"
  | "commodities"
  | "green_carbon";

export type YieldCalculatorInput = {
  amountEur: number;
  assetClass: YieldAssetClass;
  /** Holding period in months — defaults to 12 when omitted. */
  holdingMonths?: number;
};

export type YieldEstimate = {
  assetClass: YieldAssetClass;
  apyMin: number;
  apyMax: number;
  apyMid: number;
  annualReturnMinEur: number;
  annualReturnMaxEur: number;
  monthlyReturnMinEur: number;
  monthlyReturnMaxEur: number;
  inflationApy: number;
  beatsInflationMin: boolean;
  beatsInflationMax: boolean;
  holdingMonths: number;
  compareHref: string;
  sourceNote: string;
};
