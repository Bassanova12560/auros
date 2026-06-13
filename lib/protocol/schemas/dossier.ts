import { z } from "zod";

import { scoreRequestSchema } from "./score";

export const DOSSIER_SECTIONS = [
  "executive_summary",
  "score_breakdown",
  "mica_classification",
  "checklist",
  "jurisdictions",
  "platforms",
  "disclaimers",
] as const;

export const dossierRequestSchema = z
  .object({
    score_id: z.string().max(128).optional(),
    score: scoreRequestSchema.optional(),
    format: z.enum(["pdf", "json", "zip"]).default("pdf"),
    sections: z.array(z.enum(DOSSIER_SECTIONS)).optional(),
    branding: z
      .object({
        company_name: z.string().max(120).optional(),
        logo_url: z
          .string()
          .url()
          .refine((u) => u.startsWith("https://"), "logo_url must be HTTPS")
          .optional(),
        primary_color: z
          .string()
          .regex(/^#[0-9A-Fa-f]{6}$/, "primary_color must be hex (#RRGGBB)")
          .optional(),
        hide_auros_branding: z.boolean().optional(),
      })
      .optional(),
    locale: z.enum(["fr", "en", "es"]).default("fr"),
  })
  .refine((d) => Boolean(d.score_id?.trim()) || d.score !== undefined, {
    message: "Provide score_id or inline score payload",
  });

export type DossierRequest = z.infer<typeof dossierRequestSchema>;
