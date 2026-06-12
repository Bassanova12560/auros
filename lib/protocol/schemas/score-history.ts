import { z } from "zod";

import { MICA_CLASSIFICATIONS } from "../scoring/rules";
import { protocolMetaSchema } from "./common";

export const scoreHistoryEntrySchema = z.object({
  id: z.number().int().positive(),
  score: z.number().min(0).max(100),
  grade: z.string(),
  status: z.enum(["ready", "progress", "early"]),
  breakdown: z.object({
    legal_structure: z.number(),
    kyc_aml: z.number(),
    mica_compliance: z.number(),
    data_room: z.number(),
    investor_protection: z.number(),
  }),
  mica_classification: z.enum(MICA_CLASSIFICATIONS),
  request: z.record(z.string(), z.unknown()).optional(),
  created_at: z.string(),
});

export const scoreHistoryResponseSchema = z.object({
  score_id: z.string(),
  kind: z.enum(["session", "monitor"]),
  total: z.number().int().min(0),
  entries: z.array(scoreHistoryEntrySchema),
  meta: protocolMetaSchema,
});

export type ScoreHistoryEntry = z.infer<typeof scoreHistoryEntrySchema>;
export type ScoreHistoryResponse = z.infer<typeof scoreHistoryResponseSchema>;
