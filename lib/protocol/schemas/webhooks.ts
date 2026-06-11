import { z } from "zod";

import { ALERT_TYPES } from "./monitor";

export const webhookRegisterSchema = z.object({
  url: z.string().url(),
  events: z.array(z.enum(ALERT_TYPES)).min(1).default([...ALERT_TYPES]),
});

export const webhookItemSchema = z.object({
  id: z.string(),
  url: z.string(),
  events: z.array(z.string()),
  active: z.boolean(),
  created_at: z.string(),
});

export type WebhookRegisterRequest = z.infer<typeof webhookRegisterSchema>;
export type WebhookItem = z.infer<typeof webhookItemSchema>;
