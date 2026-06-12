import {
  highlightNumericRow,
} from "@/lib/comparators/compare-highlights";
import { getCompareHubPayload, type HubProduct } from "@/lib/comparators/compare-hub";
import {
  buildCompareHubShareUrl,
  normalizeCompareProductIds,
} from "@/lib/comparators/compare-selection";
import type { RiskTier } from "@/lib/comparators/risk";

import type { CompareProduct, CompareRequest } from "../schemas/compare";
import { COMPARE_MIN_PRODUCTS } from "../schemas/compare";
import {
  hubToProductItem,
  matchesProductQuery,
  sortProtocolProducts,
} from "../products/adapter";
import type { ProductsQuery } from "../schemas/products";

export type CompareBuildResult =
  | { ok: true; data: Omit<CompareBuildPayload, "meta"> }
  | { ok: false; code: string; message: string; status: number };

export type CompareBuildPayload = {
  mode: "product_ids" | "filter";
  products: CompareProduct[];
  comparison: {
    product_count: number;
    share_url: string;
    product_ids?: string[];
    filters?: {
      category: CompareRequest["category"];
      yield_min?: number;
      risk_tier?: RiskTier;
      jurisdiction?: string;
      limit: number;
    };
    highlights: {
      apy: ReturnType<typeof highlightNumericRow>;
      tvl_usd: ReturnType<typeof highlightNumericRow>;
      min_investment_usd: ReturnType<typeof highlightNumericRow>;
      liquidity_days: ReturnType<typeof highlightNumericRow>;
    };
  };
  fetched_at: string;
};

function hubToCompareProduct(product: HubProduct): CompareProduct {
  const base = hubToProductItem(product);
  return {
    ...base,
    asset_class: base.category,
    sub_category: product.row.category,
    risk_tier: product.riskTier,
    liquidity_days: product.meta.liquidityDays,
    fees: product.meta.fees,
    accredited_only: product.meta.accreditedOnly,
  };
}

function matchesRiskTier(product: HubProduct, tier: RiskTier): boolean {
  const tiers = product.riskTiers ?? [product.riskTier];
  return tiers.includes(tier);
}

function buildHighlights(products: CompareProduct[]) {
  return {
    apy: highlightNumericRow(
      products.map((p) => p.apy),
      true
    ),
    tvl_usd: highlightNumericRow(
      products.map((p) => p.tvl_usd),
      true
    ),
    min_investment_usd: highlightNumericRow(
      products.map((p) => p.min_investment_usd ?? Number.POSITIVE_INFINITY),
      false
    ),
    liquidity_days: highlightNumericRow(
      products.map((p) => p.liquidity_days),
      false
    ),
  };
}

function asProductsQuery(input: CompareRequest): ProductsQuery {
  return {
    category: input.category,
    yield_min: input.yield_min,
    jurisdiction: input.jurisdiction,
    page: 1,
    limit: input.limit,
    sort: "apy",
  };
}

export async function buildProtocolCompare(
  input: CompareRequest
): Promise<CompareBuildResult> {
  const hub = await getCompareHubPayload();

  if (input.product_ids?.length) {
    const ids = normalizeCompareProductIds(input.product_ids);
    if (ids.length < COMPARE_MIN_PRODUCTS) {
      return {
        ok: false,
        code: "validation_error",
        message: `product_ids must contain ${COMPARE_MIN_PRODUCTS}–4 unique IDs`,
        status: 400,
      };
    }

    const byId = new Map(hub.products.map((p) => [p.row.id, p]));
    const unknown = ids.filter((id) => !byId.has(id));
    if (unknown.length > 0) {
      return {
        ok: false,
        code: "not_found",
        message: `Unknown product IDs: ${unknown.join(", ")}`,
        status: 404,
      };
    }

    const selected = ids.map((id) => byId.get(id)!);
    const products = selected.map(hubToCompareProduct);

    return {
      ok: true,
      data: {
        mode: "product_ids",
        products,
        comparison: {
          product_count: products.length,
          share_url: buildCompareHubShareUrl(ids, "https://getauros.com"),
          product_ids: ids,
          highlights: buildHighlights(products),
        },
        fetched_at: hub.fetchedAt,
      },
    };
  }

  const query = asProductsQuery(input);
  let candidates = hub.products.filter((product) => {
    const item = hubToProductItem(product);
    if (!matchesProductQuery(item, query)) return false;
    if (input.risk_tier && !matchesRiskTier(product, input.risk_tier)) return false;
    return true;
  });

  const sortedItems = sortProtocolProducts(
    candidates.map(hubToProductItem),
    "apy"
  );
  const sortedIds = sortedItems.map((item) => item.id);
  const byId = new Map(candidates.map((p) => [p.row.id, p]));
  candidates = sortedIds
    .slice(0, input.limit)
    .map((id) => byId.get(id))
    .filter((p): p is HubProduct => Boolean(p));

  if (candidates.length < COMPARE_MIN_PRODUCTS) {
    return {
      ok: false,
      code: "validation_error",
      message: `Filter matched fewer than ${COMPARE_MIN_PRODUCTS} products — broaden criteria`,
      status: 400,
    };
  }

  const products = candidates.map(hubToCompareProduct);
  const productIds = products.map((p) => p.id);

  return {
    ok: true,
    data: {
      mode: "filter",
      products,
      comparison: {
        product_count: products.length,
        share_url: buildCompareHubShareUrl(productIds, "https://getauros.com"),
        filters: {
          category: input.category,
          yield_min: input.yield_min,
          risk_tier: input.risk_tier,
          jurisdiction: input.jurisdiction,
          limit: input.limit,
        },
        highlights: buildHighlights(products),
      },
      fetched_at: hub.fetchedAt,
    },
  };
}
