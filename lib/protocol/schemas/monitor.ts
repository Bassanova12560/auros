import { z } from "zod";

export const ALERT_TYPES = [
  "score_change",
  "regulation_update",
  "new_requirement",
  "deadline_approaching",
] as const;

export const monitorRequestSchema = z.object({
  asset_type: z.enum([
    "real_estate",
    "private_fund",
    "bonds",
    "private_credit",
    "commodities",
    "stablecoins",
    "other",
  ]),
  jurisdiction: z.string().min(2).max(64),
  structure: z.enum(["spv", "fund", "trust", "other"]).default("spv"),
  webhook_url: z.string().url().optional(),
  email: z.string().email().optional(),
  alert_on: z
    .array(z.enum(ALERT_TYPES))
    .min(1)
    .default(["score_change", "regulation_update"]),
  baseline_score: z.number().int().min(0).max(100).optional(),
});

export const monitorResponseSchema = z.object({
  id: z.string(),
  status: z.enum(["active", "paused"]),
  asset_type: z.string(),
  jurisdiction: z.string(),
  structure: z.string(),
  alert_on: z.array(z.string()),
  webhook_url: z.string().nullable(),
  email: z.string().nullable(),
  baseline_score: z.number().nullable(),
  created_at: z.string(),
  pricing: z.record(z.unknown()).optional(),
});

export type MonitorRequest = z.infer<typeof monitorRequestSchema>;
export type MonitorResponse = z.infer<typeof monitorResponseSchema>;
