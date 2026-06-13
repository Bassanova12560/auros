import { z } from "zod";

import { protocolMetaSchema } from "./common";
import { scoreResponseSchema } from "./score";

/** Minimum items per batch request. */
export const SCORE_BATCH_MIN_ITEMS = 1;

/** Maximum items per batch request (institutional portfolios). */
export const SCORE_BATCH_MAX_ITEMS = 20;

/** Items are validated individually in the route for partial success. */
export const scoreBatchRequestSchema = z.object({
  items: z
    .array(z.unknown())
    .min(SCORE_BATCH_MIN_ITEMS, `At least ${SCORE_BATCH_MIN_ITEMS} item required`)
    .max(
      SCORE_BATCH_MAX_ITEMS,
      `At most ${SCORE_BATCH_MAX_ITEMS} items per batch`
    ),
  record_history: z.boolean().optional(),
});

export const scoreBatchSuccessItemSchema = scoreResponseSchema.extend({
  index: z.number().int().min(0),
  ok: z.literal(true),
});

export const scoreBatchErrorItemSchema = z.object({
  index: z.number().int().min(0),
  ok: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
});

export const scoreBatchResultItemSchema = z.discriminatedUnion("ok", [
  scoreBatchSuccessItemSchema,
  scoreBatchErrorItemSchema,
]);

export const scoreBatchResponseSchema = z.object({
  disclaimer: z.string(),
  total: z.number().int().min(0),
  succeeded: z.number().int().min(0),
  failed: z.number().int().min(0),
  items: z.array(scoreBatchResultItemSchema),
  meta: protocolMetaSchema,
});

export type ScoreBatchRequest = z.infer<typeof scoreBatchRequestSchema>;
export type ScoreBatchResponse = z.infer<typeof scoreBatchResponseSchema>;
export type ScoreBatchResultItem = z.infer<typeof scoreBatchResultItemSchema>;
