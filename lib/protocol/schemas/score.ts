import { z } from "zod";

import { MICA_CLASSIFICATIONS } from "../scoring/rules";
import { protocolMetaSchema } from "./common";

const assetTypeSchema = z.enum([
  "real_estate",
  "private_fund",
  "bonds",
  "private_credit",
  "commodities",
  "stablecoins",
  "other",
]);

const issuerTypeSchema = z.enum([
  "company_spv",
  "existing_fund",
  "individual",
  "unsure",
]);

const assetClassSchema = z.enum([
  "financial_instrument",
  "art_utility",
  "e_money",
  "unsure",
]);

const euNexusSchema = z.enum([
  "issuer_eu",
  "asset_eu",
  "investors_eu",
  "no_eu",
  "unsure",
]);

const whitepaperSchema = z.enum(["ready", "draft", "none", "unsure"]);
const investorTypeSchema = z.enum(["professional", "retail", "mixed", "unsure"]);

export const scoreRequestSchema = z
  .object({
    description: z.string().min(10).max(4000).optional(),
    asset_type: assetTypeSchema.optional(),
    issuer_type: issuerTypeSchema.optional(),
    asset_class: assetClassSchema.optional(),
    eu_nexus: euNexusSchema.optional(),
    whitepaper: whitepaperSchema.optional(),
    investor_type: investorTypeSchema.optional(),
    value_eur: z.number().positive().optional(),
    jurisdiction: z.string().max(64).optional(),
    has_kyc: z.boolean().optional(),
    has_data_room: z.boolean().optional(),
    documents_count: z.number().int().min(0).max(100).optional(),
  })
  .refine(
    (data) =>
      Boolean(data.description?.trim()) ||
      data.asset_type !== undefined ||
      data.issuer_type !== undefined,
    { message: "Provide description or structured asset/compliance fields" }
  );

export const scoreResponseSchema = z.object({
  disclaimer: z.string(),
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
  critical_gaps: z.array(z.string()),
  recommendations: z.array(z.string()),
  recommended_jurisdictions: z.array(
    z.object({
      id: z.string(),
      score: z.number(),
      rationale: z.string(),
    })
  ),
  recommended_platforms: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      category: z.string(),
      apy: z.number(),
    })
  ),
  meta: protocolMetaSchema.extend({
    full_report_url: z.string().url(),
    parsed_keywords: z.array(z.string()),
  }),
});

export type ScoreRequest = z.infer<typeof scoreRequestSchema>;
export type ScoreResponse = z.infer<typeof scoreResponseSchema>;
