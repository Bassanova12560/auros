import { z } from "zod";

export const jurisdictionsQuerySchema = z.object({
  asset_type: z
    .enum(["real_estate", "bonds", "private_credit", "funds", "all"])
    .optional()
    .default("all"),
  investor_type: z
    .enum(["professional", "retail", "mixed", "all"])
    .optional()
    .default("all"),
  timeline_months: z.coerce.number().int().min(1).max(36).optional(),
  budget: z.coerce.number().int().min(0).optional(),
});

export const jurisdictionItemSchema = z.object({
  id: z.string(),
  score: z.number(),
  rationale: z.string(),
  fee_min_eur: z.number(),
  fee_max_eur: z.number(),
  license_max_months: z.number(),
  asset_types: z.array(z.string()),
  kyc_level: z.string(),
});

export const jurisdictionsResponseSchema = z.object({
  disclaimer: z.string(),
  jurisdictions: z.array(jurisdictionItemSchema),
  query: jurisdictionsQuerySchema,
});

export type JurisdictionsQuery = z.infer<typeof jurisdictionsQuerySchema>;
