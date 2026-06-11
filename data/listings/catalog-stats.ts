#!/usr/bin/env node
/** Pre-computed catalog stats — refresh via `npm run listings:generate`. */
export const LISTING_CATALOG_STATS = {
  totalProducts: 92,
  uniquePlatforms: 47,
  defillamaSlugs: 53,
  manualEntries: 48,
  byAssetClass: {
    bonds: 35,
    real_estate: 18,
    private_credit: 20,
    stablecoins: 11,
    commodities: 10,
  },
  note: "Compare hub /compare deduplicates and merges live DeFiLlama pools; expect 120+ at runtime.",
} as const;
