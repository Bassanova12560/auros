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
  riskTiers?: RiskTier[];
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

function productDedupeKey(product: HubProduct): string {
  const platform = product.row.platform.trim().toLowerCase();
  const name = product.row.product.trim().toLowerCase();
  const apy = product.row.apy.toFixed(4);
  return `${platform}::${name}::${apy}`;
}

function dedupeHubProducts(products: HubProduct[]): HubProduct[] {
  const map = new Map<string, HubProduct>();
  for (const product of products) {
    const key = productDedupeKey(product);
    const existing = map.get(key);
    if (!existing) {
      map.set(key, { ...product, riskTiers: [product.riskTier] });
      continue;
    }
    const riskTiers = [...new Set([...(existing.riskTiers ?? [existing.riskTier]), product.riskTier])];
    if (product.row.apy > existing.row.apy) {
      map.set(key, { ...product, riskTiers });
    } else {
      map.set(key, { ...existing, riskTiers });
    }
  }
  return [...map.values()];
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

  const products = dedupeHubProducts([
    ...toHubProducts(stablecoins.rows, "stablecoins"),
    ...toHubProducts(immobilier.rows, "immobilier"),
    ...toHubProducts(bonds.rows, "obligations"),
    ...toHubProducts(commodities.rows, "matieres-premieres"),
    ...toHubProducts(privateCredit.rows, "private-credit"),
  ]).sort((a, b) => b.row.apy - a.row.apy);

  return {
    products,
    tiers: buildTierHighlights(products),
    fetchedAt,
    totalProducts: products.length,
  };
}
