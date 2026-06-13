import { z } from "zod";

export const BENCHMARK_CATEGORIES = [
  "bonds",
  "stablecoins",
  "real_estate",
  "private_credit",
  "commodities",
] as const;

export type BenchmarkCategory = (typeof BENCHMARK_CATEGORIES)[number];

export const benchmarksQuerySchema = z.object({
  category: z.enum(BENCHMARK_CATEGORIES),
  jurisdiction: z.string().max(64).optional(),
});

export const benchmarkMetricsSchema = z.object({
  median_apy: z.number(),
  p25_apy: z.number(),
  p75_apy: z.number(),
  product_count: z.number().int().min(0),
});

export const benchmarksResponseSchema = z.object({
  disclaimer: z.string(),
  category: z.enum(BENCHMARK_CATEGORIES),
  jurisdiction: z.string().optional(),
  metrics: benchmarkMetricsSchema,
  as_of: z.string(),
});

export type BenchmarksQuery = z.infer<typeof benchmarksQuerySchema>;
export type BenchmarksResponse = z.infer<typeof benchmarksResponseSchema>;
