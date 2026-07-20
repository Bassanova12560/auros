import { z } from "zod";

import { DOSSIER_SECTIONS } from "../schemas/dossier";
import { scoreRequestSchema } from "../schemas/score";

/** Create attestation from inline score/dossier request (same shape as dossier). */
export const attestCreateRequestSchema = z
  .object({
    score_id: z.string().max(128).optional(),
    score: scoreRequestSchema.optional(),
    sections: z.array(z.enum(DOSSIER_SECTIONS)).optional(),
    locale: z.enum(["fr", "en", "es", "ar", "zh"]).default("fr"),
    /** Optional existing dossier id owned by the same API key */
    dossier_id: z.string().max(128).optional(),
  })
  .refine(
    (d) =>
      Boolean(d.dossier_id?.trim()) ||
      Boolean(d.score_id?.trim()) ||
      d.score !== undefined,
    { message: "Provide dossier_id, score_id, or inline score payload" }
  );

export type AttestCreateRequest = z.infer<typeof attestCreateRequestSchema>;
