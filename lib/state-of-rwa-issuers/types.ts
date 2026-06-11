import type { CategoryIndexRow, DossierTrendIndicative, RwaIndexCategoryId } from "@/lib/rwa-index/types";

export const STATE_OF_RWA_ISSUERS_ROUTE = "/data/state-of-rwa-issuers";

/** Current quarterly edition identifier. */
export const CURRENT_EDITION = "2026-Q2";

export type AssetMixRow = {
  categoryId: RwaIndexCategoryId;
  productCount: number;
  sharePct: number;
};

export type MicaReadinessSignal = {
  id: string;
  scorePct: number;
};

export type BlockerRow = {
  id: string;
  sharePct: number;
};

export type JurisdictionBreakdownRow = {
  jurisdictionId: string;
  sharePct: number;
  totalCostMid: number;
  licenseMaxMonths: number;
};

export type StateOfRwaIssuersPayload = {
  edition: string;
  quarterStartIso: string;
  generatedAt: string;
  rwaIndexEditionIso: string;
  totalProducts: number;
  activeJurisdictions: number;
  assetMix: AssetMixRow[];
  micaReadiness: {
    avgScorePct: number;
    signals: MicaReadinessSignal[];
    note: string;
  };
  blockers: BlockerRow[];
  jurisdictionBreakdown: JurisdictionBreakdownRow[];
  dossierTrends: DossierTrendIndicative;
  rwaIndexCategories: CategoryIndexRow[];
};
