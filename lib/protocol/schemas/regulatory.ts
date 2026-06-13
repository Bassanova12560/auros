import { z } from "zod";

import { REGULATORY_TAGS } from "../regulatory/feed";

export const regulatoryFeedQuerySchema = z.object({
  jurisdiction: z.string().min(2).max(64).optional(),
  tag: z.enum(REGULATORY_TAGS).optional(),
  since: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export const regulatorySubscribeSchema = z.object({
  jurisdictions: z.array(z.string().min(2).max(64)).min(1).default(["eu"]),
  tags: z.array(z.enum(REGULATORY_TAGS)).optional(),
  webhook_url: z.string().url().optional(),
  email: z.string().email().optional(),
});

export const regulatoryFeedItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  source: z.string(),
  jurisdiction: z.string(),
  published_at: z.string(),
  url: z.string().url(),
  summary: z.string(),
  tags: z.array(z.enum(REGULATORY_TAGS)),
  severity: z.enum(["low", "medium", "high"]),
  event_type: z.enum(["regulation_update", "new_requirement", "deadline_approaching"]),
  deadline: z.string().nullable().optional(),
});

export type RegulatoryFeedQuery = z.infer<typeof regulatoryFeedQuerySchema>;
export type RegulatorySubscribeRequest = z.infer<typeof regulatorySubscribeSchema>;
