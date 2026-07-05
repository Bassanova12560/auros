import { z } from "zod";

export const H2O_BATCH_MIN_ITEMS = 1;
export const H2O_BATCH_MAX_ITEMS = 50;

export const h2oBatchItemSchema = z
  .object({
    id: z.string().min(1).optional(),
    text: z.string().min(10).optional(),
  })
  .refine((item) => item.id != null || item.text != null, {
    message:
      "Each item needs id (water compare reference) or text (free-form hydrological description)",
  });

export const h2oBatchRequestSchema = z.object({
  items: z
    .array(h2oBatchItemSchema)
    .min(H2O_BATCH_MIN_ITEMS)
    .max(H2O_BATCH_MAX_ITEMS),
});

export type H2oBatchRequest = z.infer<typeof h2oBatchRequestSchema>;
