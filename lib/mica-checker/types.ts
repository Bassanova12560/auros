export const MICA_CHECKER_ROUTE = "/tools/mica-checker";

export type IssuerType = "company_spv" | "existing_fund" | "individual" | "unsure";
export type AssetClass =
  | "financial_instrument"
  | "art_utility"
  | "e_money"
  | "unsure";
export type EuNexus =
  | "issuer_eu"
  | "asset_eu"
  | "investors_eu"
  | "no_eu"
  | "unsure";
export type WhitepaperStatus = "ready" | "draft" | "none" | "unsure";
export type InvestorType = "professional" | "retail" | "mixed" | "unsure";

export type MicaAnswers = {
  issuerType: IssuerType | null;
  assetClass: AssetClass | null;
  euNexus: EuNexus | null;
  whitepaper: WhitepaperStatus | null;
  investorType: InvestorType | null;
};

export type MicaQuestionId = keyof MicaAnswers;

export type MicaTier = "early" | "progress" | "solid";

export type MicaRecommendation = {
  id: string;
  label: string;
};

export type MicaReadinessResult = {
  score: number;
  tier: MicaTier;
  recommendations: MicaRecommendation[];
};
