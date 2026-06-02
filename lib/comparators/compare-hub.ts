import { COMPARATOR_ROUTES } from "./constants";
import { getBondRows } from "./bonds";
import { getCommodityRows } from "./commodities";
import { getImmobilierRows } from "./immobilier";
import { getPrivateCreditRows } from "./private-credit";
import { getStablecoinRows } from "./stablecoins";
import { resolveProductMeta, type ResolvedProductMeta } from "./product-meta";
import { resolveRiskTier, RISK_TIER_ORDER, type RiskTier } from "./risk";
import type { ComparatorId } from "./registry";
import type { ComparatorProductRow } from "./types";

export type HubProduct = {
  row: ComparatorProductRow;
  comparatorId: ComparatorId;
  comparatorHref: string;
  riskTier: RiskTier;
  meta: ResolvedProductMeta;
};

export type TierHighlight = {
  tier: RiskTier;
  best: HubProduct | null;
  productCount: number;
};

export type CompareHubPayload = {
  products: HubProduct[];
  tiers: TierHighlight[];
  fetchedAt: string;
  totalProducts: number;
};

const COMPARATOR_HREFS: Record<ComparatorId, string> = {
  stablecoins: COMPARATOR_ROUTES.stablecoins,
  immobilier: COMPARATOR_ROUTES.realEstate,
  obligations: COMPARATOR_ROUTES.bonds,
  "matieres-premieres": COMPARATOR_ROUTES.commodities,
  "private-credit": COMPARATOR_ROUTES.privateCredit,
};

function toHubProducts(
  rows: ComparatorProductRow[],
  comparatorId: ComparatorId
): HubProduct[] {
  return rows.map((row) => ({
    row,
    comparatorId,
    comparatorHref: COMPARATOR_HREFS[comparatorId],
    riskTier: resolveRiskTier(comparatorId, row.category),
    meta: resolveProductMeta(comparatorId, row),
  }));
}

function buildTierHighlights(products: HubProduct[]): TierHighlight[] {
  return RISK_TIER_ORDER.map((tier) => {
    const scoped = products.filter((p) => p.riskTier === tier);
    const withYield = scoped.filter((p) => p.row.apy > 0);
    const best =
      withYield.length > 0
        ? withYield.reduce((a, b) => (a.row.apy > b.row.apy ? a : b))
        : null;

    return {
      tier,
      best,
      productCount: scoped.length,
    };
  });
}

export async function getCompareHubPayload(): Promise<CompareHubPayload> {
  const [stablecoins, immobilier, bonds, commodities, privateCredit] =
    await Promise.all([
      getStablecoinRows(),
      getImmobilierRows(),
      getBondRows(),
      getCommodityRows(),
      getPrivateCreditRows(),
    ]);

  const fetchedAt = [
    stablecoins.fetchedAt,
    immobilier.fetchedAt,
    bonds.fetchedAt,
    commodities.fetchedAt,
    privateCredit.fetchedAt,
  ].sort((a, b) => b.localeCompare(a))[0];

  const products = [
    ...toHubProducts(stablecoins.rows, "stablecoins"),
    ...toHubProducts(immobilier.rows, "immobilier"),
    ...toHubProducts(bonds.rows, "obligations"),
    ...toHubProducts(commodities.rows, "matieres-premieres"),
    ...toHubProducts(privateCredit.rows, "private-credit"),
  ].sort((a, b) => b.row.apy - a.row.apy);

  return {
    products,
    tiers: buildTierHighlights(products),
    fetchedAt,
    totalProducts: products.length,
  };
}
