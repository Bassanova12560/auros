import { z } from "zod";

import { ALERT_TYPES } from "./monitor";

export const WEBHOOK_EVENT_TYPES = [
  ...ALERT_TYPES,
  "regulatory.update",
  "green.index.changelog",
  "chargeflow.unit.minted",
  "chargeflow.unit.retired",
] as const;

export const webhookRegisterSchema = z.object({
  url: z.string().url(),
  events: z
    .array(z.enum(WEBHOOK_EVENT_TYPES))
    .min(1)
    .default([...WEBHOOK_EVENT_TYPES]),
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
