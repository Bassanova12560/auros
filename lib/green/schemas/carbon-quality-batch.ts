import { z } from "zod";

export const CQS_BATCH_MIN_ITEMS = 1;
export const CQS_BATCH_MAX_ITEMS = 50;

export const carbonQualityBatchItemSchema = z
  .object({
    id: z.string().min(1).optional(),
    text: z.string().min(10).optional(),
  })
  .refine((item) => item.id != null || item.text != null, {
    message: "Each item needs id (compare reference) or text (free-form description)",
  });

export const carbonQualityBatchRequestSchema = z.object({
  items: z
    .array(carbonQualityBatchItemSchema)
    .min(CQS_BATCH_MIN_ITEMS)
    .max(CQS_BATCH_MAX_ITEMS),
});

export type CarbonQualityBatchRequest = z.infer<typeof carbonQualityBatchRequestSchema>;
