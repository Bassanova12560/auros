import { z } from "zod";

import { protocolMetaSchema } from "./common";

export const COMPARE_MIN_PRODUCTS = 2;
export const COMPARE_MAX_PRODUCTS = 4;

const riskTierSchema = z.enum(["conservative", "core", "advanced"]);

const categorySchema = z.enum([
  "stablecoins",
  "real_estate",
  "bonds",
  "commodities",
  "private_credit",
  "all",
]);

export const compareRequestSchema = z
  .object({
    product_ids: z
      .array(z.string().trim().min(1))
      .min(COMPARE_MIN_PRODUCTS)
      .max(COMPARE_MAX_PRODUCTS)
      .optional(),
    category: categorySchema.optional().default("all"),
    yield_min: z.number().min(0).optional(),
    risk_tier: riskTierSchema.optional(),
    jurisdiction: z.string().max(64).optional(),
    limit: z
      .number()
      .int()
      .min(COMPARE_MIN_PRODUCTS)
      .max(COMPARE_MAX_PRODUCTS)
      .optional()
      .default(COMPARE_MAX_PRODUCTS),
  })
  .strict();

export const compareCellHighlightSchema = z.enum(["best", "worst"]).nullable();

export const compareProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  platform: z.string(),
  category: z.string(),
  asset_class: z.string(),
  sub_category: z.string(),
  risk_tier: riskTierSchema,
  apy: z.number(),
  tvl_usd: z.number(),
  chains: z.array(z.string()),
  jurisdiction: z.string().nullable(),
  affiliate_url: z.string(),
  min_investment_usd: z.number().nullable(),
  liquidity_days: z.number(),
  fees: z.string(),
  accredited_only: z.boolean(),
  live: z.boolean(),
});

export const compareResponseSchema = z.object({
  disclaimer: z.string(),
  mode: z.enum(["product_ids", "filter"]),
  products: z.array(compareProductSchema).min(COMPARE_MIN_PRODUCTS).max(COMPARE_MAX_PRODUCTS),
  comparison: z.object({
    product_count: z.number().int(),
    share_url: z.string().url(),
    product_ids: z.array(z.string()).optional(),
    filters: z
      .object({
        category: categorySchema,
        yield_min: z.number().optional(),
        risk_tier: riskTierSchema.optional(),
        jurisdiction: z.string().optional(),
        limit: z.number().int(),
      })
      .optional(),
    highlights: z.object({
      apy: z.array(compareCellHighlightSchema),
      tvl_usd: z.array(compareCellHighlightSchema),
      min_investment_usd: z.array(compareCellHighlightSchema),
      liquidity_days: z.array(compareCellHighlightSchema),
    }),
  }),
  fetched_at: z.string(),
  meta: protocolMetaSchema,
});

export type CompareRequest = z.infer<typeof compareRequestSchema>;
export type CompareProduct = z.infer<typeof compareProductSchema>;
export type CompareResponse = z.infer<typeof compareResponseSchema>;
