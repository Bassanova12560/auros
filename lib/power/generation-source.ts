import { z } from "zod";

/** Shared generation technology claim — not a GO/REC and not Green Verified. */
export const GENERATION_SOURCES = [
  "solar",
  "wind",
  "hydro",
  "nuclear",
  "battery",
  "mixed",
  "unknown",
] as const;

export type GenerationSource = (typeof GENERATION_SOURCES)[number];

export const generationSourceSchema = z.enum(GENERATION_SOURCES);

export const GENERATION_SOURCE_DISCLAIMER =
  "generation_source is an indicative technology claim for low-carbon / power prep — not a GO/REC, EU Taxonomy alignment, or AUROS Green Verified label.";
