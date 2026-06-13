import { getCompareHubPayload, type HubProduct } from "@/lib/comparators/compare-hub";
import { hubToProductItem, matchesProductQuery } from "../products/adapter";
import type { ProductsQuery } from "../schemas/products";
import type { BenchmarksQuery } from "../schemas/benchmarks";
import { computeBenchmarkMetrics } from "./percentiles";
import { MIN_LIVE_YIELD_PRODUCTS, resolveStaticBenchmark } from "./static";

const CATEGORY_MAP: Record<BenchmarksQuery["category"], ProductsQuery["category"]> = {
  stablecoins: "stablecoins",
  real_estate: "real_estate",
  bonds: "bonds",
  commodities: "commodities",
  private_credit: "private_credit",
};

export type BenchmarkBuildResult = {
  category: BenchmarksQuery["category"];
  jurisdiction?: string;
  metrics: {
    median_apy: number;
    p25_apy: number;
    p75_apy: number;
    product_count: number;
  };
  as_of: string;
  source: "live" | "static_fallback";
};

function filterHubProducts(products: HubProduct[], query: BenchmarksQuery): HubProduct[] {
  const apiCategory = CATEGORY_MAP[query.category];
  return products.filter((product) => {
    const item = hubToProductItem(product);
    return matchesProductQuery(item, {
      category: apiCategory,
      jurisdiction: query.jurisdiction,
      page: 1,
      limit: 100,
      sort: "apy",
    });
  });
}

export async function buildProtocolBenchmarks(
  query: BenchmarksQuery
): Promise<BenchmarkBuildResult> {
  const hub = await getCompareHubPayload();
  const scoped = filterHubProducts(hub.products, query);
  const apys = scoped.map((product) => product.row.apy);
  const live = computeBenchmarkMetrics(apys);

  if (live && live.product_count >= MIN_LIVE_YIELD_PRODUCTS) {
    return {
      category: query.category,
      ...(query.jurisdiction ? { jurisdiction: query.jurisdiction } : {}),
      metrics: live,
      as_of: hub.fetchedAt,
      source: "live",
    };
  }

  const fallback = resolveStaticBenchmark(query.category, query.jurisdiction);
  return {
    category: query.category,
    ...(query.jurisdiction ? { jurisdiction: query.jurisdiction } : {}),
    metrics: fallback.metrics,
    as_of: fallback.as_of,
    source: "static_fallback",
  };
}
