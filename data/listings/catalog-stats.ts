#!/usr/bin/env node
/** Pre-computed catalog stats — refresh via `npm run listings:generate` + compare-hub-count. */
export const LISTING_CATALOG_STATS = {
  totalProducts: 114,
  uniquePlatforms: 59,
  defillamaSlugs: 65,
  manualEntries: 55,
  byAssetClass: {
    bonds: 26,
    real_estate: 18,
    private_credit: 20,
    private_equity: 15,
    art: 9,
    stablecoins: 14,
    commodities: 12,
  },
  /** Deduped hub runtime (DeFiLlama live + manuals) measured 2026-07-23. */
  liveHubProductCount: 92,
  note: "Compare hub /compare deduplicates live DeFiLlama pools + manuals across 7 classes.",
} as const;
