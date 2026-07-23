import { COMPARATOR_ROUTES } from "./constants";
import { getArtRows } from "./art";
import { getBondRows } from "./bonds";
import { getCommodityRows } from "./commodities";
import { getImmobilierRows } from "./immobilier";
import { getPrivateCreditRows } from "./private-credit";
import { getPrivateEquityRows } from "./private-equity";
import { getStablecoinRows } from "./stablecoins";
import { resolveProductMeta, type ResolvedProductMeta } from "./product-meta";
import {
  resolveRiskTier as resolveRisk,
  RISK_TIER_ORDER,
  type RiskTier,
} from "./risk";
import type { ComparatorId } from "./registry";
import type { ComparatorProductRow } from "./types";

export type HubProduct = {
  row: ComparatorProductRow;
  comparatorId: ComparatorId;
  comparatorIds?: ComparatorId[];
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

export const COMPARATOR_HREFS: Record<ComparatorId, string> = {
  stablecoins: COMPARATOR_ROUTES.stablecoins,
  immobilier: COMPARATOR_ROUTES.realEstate,
  obligations: COMPARATOR_ROUTES.bonds,
  "matieres-premieres": COMPARATOR_ROUTES.commodities,
  "private-credit": COMPARATOR_ROUTES.privateCredit,
  "private-equity": COMPARATOR_ROUTES.privateEquity,
  "art-collectibles": COMPARATOR_ROUTES.art,
};

export function rowsToHubProducts(
  rows: ComparatorProductRow[],
  comparatorId: ComparatorId
): HubProduct[] {
  return rows.map((row) => ({
    row,
    comparatorId,
    comparatorHref: COMPARATOR_HREFS[comparatorId],
    riskTier: resolveRisk(comparatorId, row.category),
    meta: resolveProductMeta(comparatorId, row),
  }));
}

function toHubProducts(
  rows: ComparatorProductRow[],
  comparatorId: ComparatorId
): HubProduct[] {
  return rowsToHubProducts(rows, comparatorId);
}

export function productDedupeKey(product: HubProduct): string {
  const platform = product.row.platform.trim().toLowerCase();
  const name = product.row.product.trim().toLowerCase();
  return `${platform}::${name}`;
}

function productHasTier(product: HubProduct, tier: RiskTier): boolean {
  const tiers = product.riskTiers ?? [product.riskTier];
  return tiers.includes(tier);
}

export function dedupeHubProducts(products: HubProduct[]): HubProduct[] {
  const map = new Map<string, HubProduct>();
  for (const product of products) {
    const key = productDedupeKey(product);
    const existing = map.get(key);
    if (!existing) {
      map.set(key, {
        ...product,
        riskTiers: [product.riskTier],
        comparatorIds: [product.comparatorId],
      });
      continue;
    }
    const riskTiers = [
      ...new Set([...(existing.riskTiers ?? [existing.riskTier]), product.riskTier]),
    ];
    const comparatorIds = [
      ...new Set([
        ...(existing.comparatorIds ?? [existing.comparatorId]),
        product.comparatorId,
      ]),
    ];
    if (product.row.apy > existing.row.apy) {
      map.set(key, { ...product, riskTiers, comparatorIds });
    } else {
      map.set(key, { ...existing, riskTiers, comparatorIds });
    }
  }
  return [...map.values()];
}

function buildTierHighlights(products: HubProduct[]): TierHighlight[] {
  return RISK_TIER_ORDER.map((tier) => {
    const scoped = products.filter((p) => productHasTier(p, tier));
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
  const [
    stablecoins,
    immobilier,
    bonds,
    commodities,
    privateCredit,
    privateEquity,
    art,
  ] = await Promise.all([
    getStablecoinRows(),
    getImmobilierRows(),
    getBondRows(),
    getCommodityRows(),
    getPrivateCreditRows(),
    getPrivateEquityRows(),
    getArtRows(),
  ]);

  const fetchedAt = [
    stablecoins.fetchedAt,
    immobilier.fetchedAt,
    bonds.fetchedAt,
    commodities.fetchedAt,
    privateCredit.fetchedAt,
    privateEquity.fetchedAt,
    art.fetchedAt,
  ].sort((a, b) => b.localeCompare(a))[0];

  const products = dedupeHubProducts([
    ...toHubProducts(stablecoins.rows, "stablecoins"),
    ...toHubProducts(immobilier.rows, "immobilier"),
    ...toHubProducts(bonds.rows, "obligations"),
    ...toHubProducts(commodities.rows, "matieres-premieres"),
    ...toHubProducts(privateCredit.rows, "private-credit"),
    ...toHubProducts(privateEquity.rows, "private-equity"),
    ...toHubProducts(art.rows, "art-collectibles"),
  ]).sort((a, b) => b.row.apy - a.row.apy);

  return {
    products,
    tiers: buildTierHighlights(products),
    fetchedAt,
    totalProducts: products.length,
  };
}
