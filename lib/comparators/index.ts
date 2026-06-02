export type { ComparatorSummary } from "./stats";
export type {
  BondCategory,
  BondRow,
  CommodityCategory,
  CommodityRow,
  ComparatorProductRow,
  PrivateCreditCategory,
  PrivateCreditRow,
  RealEstateCategory,
  RealEstateRow,
  StablecoinCategory,
  StablecoinRow,
  SortDirection,
  SortField,
} from "./types";
export type { StablecoinsPayload } from "./stablecoins";
export type { ImmobilierPayload } from "./immobilier";
export type { BondsPayload } from "./bonds";
export type { CommoditiesPayload } from "./commodities";
export type { PrivateCreditPayload } from "./private-credit";
export type { ComparatorEntry, ComparatorId } from "./registry";
export type { ComparatorMessages } from "./i18n";
export type { ComparatorPageId } from "./constants";

export {
  COMPARATOR_ROUTES,
  DOSSIER_CTA,
  STABLECOINS_REVALIDATE_SECONDS,
  IMMOBILIER_REVALIDATE_SECONDS,
  BONDS_REVALIDATE_SECONDS,
  COMMODITIES_REVALIDATE_SECONDS,
  PRIVATE_CREDIT_REVALIDATE_SECONDS,
  LEGACY_COMPARATOR_REDIRECTS,
} from "./constants";

export {
  COMPARATOR_REGISTRY,
  getComparatorByPath,
  isComparatorPath,
  isCompareHubPath,
} from "./registry";

export {
  computeComparatorSummary,
  formatSummaryTvl,
} from "./stats";

export {
  filterRwaPools,
  formatTvl,
  groupPoolsByProduct,
  type DefiLlamaPool,
  type GroupedPool,
} from "./defillama";

export {
  buildStablecoinFallback,
  buildStablecoinPayload,
  resolvePlatformLink,
} from "./build-stablecoins";

export {
  buildImmobilierFallback,
  buildImmobilierPayload,
  resolveImmobilierLink,
} from "./build-immobilier";

export {
  buildBondsFallback,
  buildBondsPayload,
  resolveBondLink,
} from "./build-bonds";

export {
  buildCommoditiesFallback,
  buildCommoditiesPayload,
  resolveCommodityLink,
} from "./build-commodities";

export {
  buildPrivateCreditFallback,
  buildPrivateCreditPayload,
  resolvePrivateCreditLink,
} from "./build-private-credit";

export { getStablecoinRows } from "./stablecoins";
export { getImmobilierRows } from "./immobilier";
export { getBondRows } from "./bonds";
export { getCommodityRows } from "./commodities";
export { getPrivateCreditRows } from "./private-credit";
export { getCompareHubPayload } from "./compare-hub";
export type { CompareHubPayload, HubProduct, TierHighlight } from "./compare-hub";

export {
  resolveRiskTier,
  RISK_TIER_ORDER,
  COMPARATOR_CROSS_LINKS,
  type RiskTier,
} from "./risk";

export { resolveComparatorProductLink } from "./resolve-link";

export {
  resolveProductMeta,
  formatMinInvestment,
  formatLiquidity,
  matchesMinInvestmentFilter,
  type ResolvedProductMeta,
  type ProductHighlight,
} from "./product-meta";

export {
  getComparatorMessages,
  formatComparatorDate,
  tabLabelForId,
  assetTypeForId,
} from "./i18n";

export {
  getPageCopy,
  pageCopyForId,
  footerDisclaimerForId,
  comparatorIdToPageId,
} from "./page-copy";

export { parseManualPools, parseManualProducts } from "./validate";

export {
  STABLECOIN_PROJECTS,
  DEFILLAMA_PROJECT_SLUGS,
} from "./stablecoins.config";

export {
  IMMOBILIER_PROJECTS,
  DEFILLAMA_IMMOBILIER_SLUGS,
} from "./immobilier.config";

export { BOND_PROJECTS, DEFILLAMA_BOND_SLUGS } from "./bonds.config";

export {
  COMMODITY_PROJECTS,
  DEFILLAMA_COMMODITY_SLUGS,
} from "./commodities.config";

export {
  PRIVATE_CREDIT_PROJECTS,
  DEFILLAMA_PRIVATE_CREDIT_SLUGS,
} from "./private-credit.config";
