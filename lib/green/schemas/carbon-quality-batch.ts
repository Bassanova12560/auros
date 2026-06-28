import { z } from "zod";

export const CQS_BATCH_MIN_ITEMS = 1;
export const CQS_BATCH_MAX_ITEMS = 50;

export const carbonQualityBatchItemSchema = z
  .object({
    id: z.string().min(1).optional(),
    text: z.string().min(10).optional(),
    registry: z.string().min(2).optional(),
    serial: z.string().min(2).optional(),
  })
  .refine(
    (item) =>
      item.id != null ||
      item.text != null ||
      (item.registry != null && item.serial != null) ||
      item.serial != null,
    {
      message:
        "Each item needs id, text, serial (e.g. VCS-674), or registry+serial",
    }
  );

export const carbonQualityBatchRequestSchema = z.object({
  items: z
    .array(carbonQualityBatchItemSchema)
    .min(CQS_BATCH_MIN_ITEMS)
    .max(CQS_BATCH_MAX_ITEMS),
});

export type CarbonQualityBatchRequest = z.infer<typeof carbonQualityBatchRequestSchema>;
