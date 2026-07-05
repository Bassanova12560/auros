import { z } from "zod";

export const WATT_BATCH_MIN_ITEMS = 1;
export const WATT_BATCH_MAX_ITEMS = 50;

export const wattBatchItemSchema = z
  .object({
    id: z.string().min(1).optional(),
    text: z.string().min(10).optional(),
  })
  .refine((item) => item.id != null || item.text != null, {
    message: "Each item needs id (compare reference) or text (free-form energy description)",
  });

export const wattBatchRequestSchema = z.object({
  items: z
    .array(wattBatchItemSchema)
    .min(WATT_BATCH_MIN_ITEMS)
    .max(WATT_BATCH_MAX_ITEMS),
});

export type WattBatchRequest = z.infer<typeof wattBatchRequestSchema>;
