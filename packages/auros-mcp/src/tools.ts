import { z } from "zod";

import type { AurosApiClient } from "./client.js";

function jsonResult(data: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
  };
}

function toolError(err: unknown) {
  const message = err instanceof Error ? err.message : String(err);
  return {
    content: [{ type: "text" as const, text: `AUROS API error: ${message}` }],
    isError: true as const,
  };
}

const assetType = z
  .enum([
    "real_estate",
    "private_fund",
    "bonds",
    "private_credit",
    "commodities",
    "stablecoins",
    "other",
  ])
  .optional();

export const AUROS_MCP_TOOLS = [
  {
    name: "score",
    description:
      "Score MiCA readiness 0–100 for a tokenization project. Pass a free-text description or structured fields (asset_type, jurisdiction, investor_type, etc.).",
    schema: {
      description: z.string().optional().describe("Free-text project description"),
      asset_type: assetType,
      issuer_type: z
        .enum(["company_spv", "existing_fund", "individual", "unsure"])
        .optional(),
      asset_class: z
        .enum(["financial_instrument", "art_utility", "e_money", "unsure"])
        .optional(),
      eu_nexus: z
        .enum(["issuer_eu", "asset_eu", "investors_eu", "no_eu", "unsure"])
        .optional(),
      whitepaper: z.enum(["ready", "draft", "none", "unsure"]).optional(),
      investor_type: z.enum(["professional", "retail", "mixed", "unsure"]).optional(),
      value_eur: z.number().optional(),
      jurisdiction: z.string().optional(),
      has_kyc: z.boolean().optional(),
      has_data_room: z.boolean().optional(),
      documents_count: z.number().optional(),
      record_history: z.boolean().optional(),
    },
    handler: (client: AurosApiClient, args: Record<string, unknown>) => client.score(args),
  },
  {
    name: "score_batch",
    description:
      "Score up to 20 assets in one call. Each item accepts the same fields as score. Counts as 1 quota unit.",
    schema: {
      items: z
        .array(
          z.object({
            description: z.string().optional(),
            asset_type: assetType,
            issuer_type: z
              .enum(["company_spv", "existing_fund", "individual", "unsure"])
              .optional(),
            jurisdiction: z.string().optional(),
            investor_type: z.enum(["professional", "retail", "mixed", "unsure"]).optional(),
          })
        )
        .min(1)
        .max(20)
        .describe("Array of score requests (max 20)"),
      record_history: z.boolean().optional(),
    },
    handler: (client: AurosApiClient, args: Record<string, unknown>) =>
      client.scoreBatch(args),
  },
  {
    name: "products",
    description:
      "Browse the AUROS RWA product catalog (120+ tokenized products). Filter by category, chain, yield, jurisdiction.",
    schema: {
      category: z
        .enum([
          "stablecoins",
          "real_estate",
          "bonds",
          "commodities",
          "private_credit",
          "all",
        ])
        .optional(),
      jurisdiction: z.string().optional(),
      chain: z.string().optional(),
      yield_min: z.number().optional(),
      yield_max: z.number().optional(),
      sort: z.enum(["apy", "tvl", "name"]).optional(),
      limit: z.number().int().min(1).max(100).optional(),
    },
    handler: (client: AurosApiClient, args: Record<string, unknown>) => client.products(args),
  },
  {
    name: "jurisdictions",
    description:
      "Rank tokenization jurisdictions by regulatory fit for an asset type, budget, and timeline.",
    schema: {
      asset_type: assetType,
      investor_type: z.enum(["professional", "retail", "mixed", "unsure"]).optional(),
      timeline_months: z.number().optional(),
      budget: z.number().optional(),
      structure: z.string().optional(),
    },
    handler: (client: AurosApiClient, args: Record<string, unknown>) =>
      client.jurisdictions(args),
  },
  {
    name: "checklist",
    description:
      "Generate a compliance checklist (20+ items) for a tokenization project by asset type and jurisdiction.",
    schema: {
      asset_type: z
        .enum([
          "real_estate",
          "private_fund",
          "bonds",
          "private_credit",
          "commodities",
          "stablecoins",
          "other",
        ])
        .describe("Asset type"),
      jurisdiction: z.string().describe("Target jurisdiction (e.g. luxembourg, france)"),
      structure: z.string().optional().describe("Legal structure (e.g. spv, fund)"),
      investor_type: z.enum(["professional", "retail", "mixed", "unsure"]).optional(),
    },
    handler: (client: AurosApiClient, args: Record<string, unknown>) => client.checklist(args),
  },
  {
    name: "compare",
    description:
      "Side-by-side comparison of 2–4 RWA products by explicit product_ids or filter criteria.",
    schema: {
      product_ids: z
        .array(z.string())
        .min(2)
        .max(4)
        .optional()
        .describe("2–4 product IDs to compare"),
      category: z.string().optional(),
      yield_min: z.number().optional(),
      risk_tier: z.string().optional(),
      jurisdiction: z.string().optional(),
      limit: z.number().int().optional(),
    },
    handler: (client: AurosApiClient, args: Record<string, unknown>) => client.compare(args),
  },
  {
    name: "green_watt_score",
    description:
      "Free public Watt Score (0–100) for an AUROS Green energy compare reference (solar, wind, REC, PPA). No auth required.",
    schema: {
      id: z.string().describe("Compare reference id, e.g. sunexchange"),
    },
    handler: (client: AurosApiClient, args: Record<string, unknown>) =>
      client.greenWattScore(String(args.id)),
  },
  {
    name: "green_carbon_quality",
    description:
      "Free public Carbon Quality Score (CQS, 0–100) for an AUROS Green carbon compare reference. No auth required.",
    schema: {
      id: z.string().describe("Compare reference id, e.g. toucan"),
    },
    handler: (client: AurosApiClient, args: Record<string, unknown>) =>
      client.greenCarbonQuality(String(args.id)),
  },
  {
    name: "green_watt_batch",
    description:
      "Batch Watt Scores for up to 50 energy assets. Each item: id (compare ref) or text (free-form). Counts as 1 quota unit.",
    schema: {
      items: z
        .array(
          z.object({
            id: z.string().optional(),
            text: z.string().min(10).optional(),
          })
        )
        .min(1)
        .max(50),
    },
    handler: (client: AurosApiClient, args: Record<string, unknown>) =>
      client.greenWattBatch(args),
  },
  {
    name: "green_carbon_quality_batch",
    description:
      "Batch Carbon Quality Scores for up to 50 carbon credits. Each item: id or text. Counts as 1 quota unit.",
    schema: {
      items: z
        .array(
          z.object({
            id: z.string().optional(),
            text: z.string().min(10).optional(),
          })
        )
        .min(1)
        .max(50),
    },
    handler: (client: AurosApiClient, args: Record<string, unknown>) =>
      client.greenCarbonQualityBatch(args),
  },
  {
    name: "regulatory_feed",
    description:
      "Curated MiCA/ESMA/AMF/BaFin regulatory feed (premium key required). Filter by jurisdiction, tag, since date.",
    schema: {
      jurisdiction: z.string().optional(),
      tag: z.enum(["mica", "esma", "amf", "bafin"]).optional(),
      since: z.string().optional().describe("ISO date — items published on or after"),
      limit: z.number().int().min(1).max(100).optional(),
    },
    handler: (client: AurosApiClient, args: Record<string, unknown>) =>
      client.regulatoryFeed(args),
  },
  {
    name: "status",
    description:
      "AUROS Protocol API health — service probes, version, deployed commit. No auth required.",
    schema: {},
    handler: (client: AurosApiClient) => client.status(),
  },
] as const;

export function registerAurosTools(
  server: {
    registerTool: (
      name: string,
      config: { description: string; inputSchema: Record<string, z.ZodTypeAny> },
      handler: (args: Record<string, unknown>) => Promise<{
        content: Array<{ type: "text"; text: string }>;
        isError?: boolean;
      }>
    ) => void;
  },
  client: AurosApiClient
) {
  for (const tool of AUROS_MCP_TOOLS) {
    server.registerTool(
      tool.name,
      {
        description: tool.description,
        inputSchema: tool.schema,
      },
      async (args) => {
        try {
          const data = await tool.handler(client, args);
          return jsonResult(data);
        } catch (err) {
          return toolError(err);
        }
      }
    );
  }
}
