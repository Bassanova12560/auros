import { getCompareHubPayload, type HubProduct } from "@/lib/comparators/compare-hub";
import { buildCompareShareUrl } from "@/lib/comparators/compare-selection";
import type { ComparatorId } from "@/lib/comparators/registry";

import type { ProductItem, ProductsQuery } from "../schemas/products";

const CATEGORY_MAP: Record<string, ComparatorId | ComparatorId[]> = {
  stablecoins: "stablecoins",
  real_estate: "immobilier",
  bonds: "obligations",
  commodities: "matieres-premieres",
  private_credit: "private-credit",
  private_equity: "private-equity",
  art: "art-collectibles",
};

const COMPARATOR_TO_API_CATEGORY: Record<ComparatorId, string> = {
  stablecoins: "stablecoins",
  immobilier: "real_estate",
  obligations: "bonds",
  "matieres-premieres": "commodities",
  "private-credit": "private_credit",
  "private-equity": "private_equity",
  "art-collectibles": "art",
};

export function hubToProductItem(product: HubProduct): ProductItem {
  const affiliate =
    product.row.affiliate_link?.trim() ||
    product.row.link?.trim() ||
    buildCompareShareUrl("/compare", [product.row.id]);

  return {
    id: product.row.id,
    name: product.row.product,
    platform: product.row.platform,
    category: COMPARATOR_TO_API_CATEGORY[product.comparatorId],
    apy: product.row.apy,
    tvl_usd: product.row.tvlUsd,
    chains: product.row.chains,
    jurisdiction: product.meta.jurisdiction ?? product.row.jurisdiction ?? null,
    affiliate_url: affiliate,
    min_investment_usd: product.meta.minInvestmentUsd ?? null,
    live: product.row.live,
  };
}

export function matchesProductQuery(product: ProductItem, query: ProductsQuery): boolean {
  if (query.category !== "all" && product.category !== query.category) return false;

  if (query.jurisdiction) {
    const j = query.jurisdiction.toLowerCase();
    if (!product.jurisdiction?.toLowerCase().includes(j)) return false;
  }

  if (query.chain) {
    const c = query.chain.toLowerCase();
    if (!product.chains.some((chain) => chain.toLowerCase().includes(c))) return false;
  }

  if (query.yield_min !== undefined && product.apy < query.yield_min) return false;
  if (query.yield_max !== undefined && product.apy > query.yield_max) return false;

  return true;
}

export function sortProtocolProducts(products: ProductItem[], sort: ProductsQuery["sort"]): ProductItem[] {
  const copy = [...products];
  if (sort === "tvl") {
    copy.sort((a, b) => b.tvl_usd - a.tvl_usd);
  } else if (sort === "name") {
    copy.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    copy.sort((a, b) => b.apy - a.apy);
  }
  return copy;
}

export async function listProtocolProducts(query: ProductsQuery): Promise<{
  products: ProductItem[];
  pagination: { page: number; limit: number; total: number; total_pages: number };
  fetched_at: string;
}> {
  const hub = await getCompareHubPayload();
  let items = hub.products.map(hubToProductItem);

  if (query.category !== "all") {
    const mapped = CATEGORY_MAP[query.category];
    if (mapped) {
      const ids = Array.isArray(mapped) ? mapped : [mapped];
      items = hub.products
        .filter((p) => ids.includes(p.comparatorId))
        .map(hubToProductItem);
    }
  }

  items = items.filter((p) => matchesProductQuery(p, query));
  items = sortProtocolProducts(items, query.sort);

  const total = items.length;
  const total_pages = Math.max(1, Math.ceil(total / query.limit));
  const page = Math.min(query.page, total_pages);
  const start = (page - 1) * query.limit;
  const paged = items.slice(start, start + query.limit);

  return {
    products: paged,
    pagination: { page, limit: query.limit, total, total_pages },
    fetched_at: hub.fetchedAt,
  };
}

export async function topPlatformsForAsset(
  assetType: string
): Promise<{ id: string; name: string; category: string; apy: number }[]> {
  const category =
    assetType === "real_estate"
      ? "real_estate"
      : assetType === "bonds"
        ? "bonds"
        : assetType === "private_credit"
          ? "private_credit"
          : assetType === "stablecoins"
            ? "stablecoins"
            : "all";

  const result = await listProtocolProducts({
    category: category as ProductsQuery["category"],
    page: 1,
    limit: 5,
    sort: "apy",
  });

  return result.products.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    apy: p.apy,
  }));
}
