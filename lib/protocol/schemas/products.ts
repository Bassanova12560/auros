import { z } from "zod";

export const productsQuerySchema = z.object({
  category: z
    .enum([
      "stablecoins",
      "real_estate",
      "bonds",
      "commodities",
      "private_credit",
      "all",
    ])
    .optional()
    .default("all"),
  jurisdiction: z.string().max(64).optional(),
  chain: z.string().max(64).optional(),
  yield_min: z.coerce.number().min(0).optional(),
  yield_max: z.coerce.number().min(0).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  sort: z.enum(["apy", "tvl", "name"]).optional().default("apy"),
});

export const productItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  platform: z.string(),
  category: z.string(),
  apy: z.number(),
  tvl_usd: z.number(),
  chains: z.array(z.string()),
  jurisdiction: z.string().nullable(),
  affiliate_url: z.string(),
  min_investment_usd: z.number().nullable(),
  live: z.boolean(),
});

export const productsResponseSchema = z.object({
  disclaimer: z.string(),
  products: z.array(productItemSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    total_pages: z.number(),
  }),
  fetched_at: z.string(),
});

export type ProductsQuery = z.infer<typeof productsQuerySchema>;
export type ProductItem = z.infer<typeof productItemSchema>;
