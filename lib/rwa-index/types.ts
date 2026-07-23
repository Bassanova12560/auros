import type { ComparatorId } from "@/lib/comparators/registry";

export const RWA_INDEX_ROUTE = "/data/rwa-index";

export type RwaIndexCategoryId =
  | "bonds"
  | "stablecoins"
  | "real_estate"
  | "private_credit"
  | "commodities"
  | "private_equity"
  | "art"
  | "green";

export const RWA_INDEX_CATEGORY_ORDER: RwaIndexCategoryId[] = [
  "bonds",
  "stablecoins",
  "real_estate",
  "private_credit",
  "commodities",
  "private_equity",
  "art",
  "green",
];

export const COMPARATOR_TO_INDEX_CATEGORY: Record<ComparatorId, RwaIndexCategoryId> = {
  obligations: "bonds",
  stablecoins: "stablecoins",
  immobilier: "real_estate",
  "private-credit": "private_credit",
  "matieres-premieres": "commodities",
  "private-equity": "private_equity",
  "art-collectibles": "art",
};

export type ApyStats = {
  min: number | null;
  max: number | null;
  median: number | null;
  average: number | null;
  productCount: number;
  productsWithYield: number;
};

export type CategoryIndexRow = {
  id: RwaIndexCategoryId;
  compareHref: string;
  stats: ApyStats;
  sourceNote: string;
  /** True when APY range is illustrative (green, commodities without live coupon). */
  isIllustrative: boolean;
};

export type DossierTrendIndicative = {
  wizardStartsEstimate: number;
  monthOverMonthPct: number;
  note: string;
};

export type RwaIndexPayload = {
  editionIso: string;
  generatedAt: string;
  dataFetchedAt: string;
  categories: CategoryIndexRow[];
  totalProducts: number;
  activeJurisdictions: number;
  dossierTrends: DossierTrendIndicative;
};
