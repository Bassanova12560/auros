import { z } from "zod";

export const checklistRequestSchema = z.object({
  asset_type: z.enum([
    "real_estate",
    "private_fund",
    "bonds",
    "private_credit",
    "low_carbon_power",
  ]),
  jurisdiction: z.string().min(2).max(64),
  structure: z.enum(["spv", "fund", "trust", "other"]).optional().default("spv"),
});

export const checklistItemSchema = z.object({
  id: z.string(),
  category: z.string(),
  title: z.string(),
  regulatory_reference: z.string(),
  required: z.boolean(),
  estimated_time_days: z.number(),
  estimated_cost_eur: z.number(),
  dependencies: z.array(z.string()),
  auros_tip: z.string(),
});

export const checklistResponseSchema = z.object({
  disclaimer: z.string(),
  asset_type: z.string(),
  jurisdiction: z.string(),
  structure: z.string(),
  items: z.array(checklistItemSchema),
  total_items: z.number(),
  estimated_total_days: z.number(),
  estimated_total_cost_eur: z.number(),
});

export type ChecklistRequest = z.infer<typeof checklistRequestSchema>;
