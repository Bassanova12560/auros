#!/usr/bin/env node

// src/index.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// src/client.ts
var DEFAULT_BASE_URL = "https://getauros.com";
var DEFAULT_DEMO_KEY = "auros_pk_test_demo";
var AurosApiClient = class {
  apiKey;
  baseUrl;
  constructor(options = {}) {
    this.apiKey = (options.apiKey ?? process.env.AUROS_API_KEY ?? DEFAULT_DEMO_KEY).trim();
    this.baseUrl = (options.baseUrl ?? process.env.AUROS_BASE_URL ?? DEFAULT_BASE_URL).replace(
      /\/$/,
      ""
    );
    if (!this.apiKey) {
      throw new Error("AUROS_API_KEY is required");
    }
  }
  async score(body) {
    return this.request("POST", "/api/v1/score", body);
  }
  async scoreBatch(body) {
    return this.request("POST", "/api/v1/score/batch", body);
  }
  async products(query = {}) {
    return this.request("GET", "/api/v1/products", void 0, query);
  }
  async jurisdictions(query = {}) {
    return this.request("GET", "/api/v1/jurisdictions", void 0, query);
  }
  async checklist(body) {
    return this.request("POST", "/api/v1/checklist", body);
  }
  async compare(body) {
    return this.request("POST", "/api/v1/compare", body);
  }
  async regulatoryFeed(query = {}) {
    return this.request("GET", "/api/v1/regulatory/feed", void 0, query);
  }
  async status() {
    return this.request("GET", "/api/v1/status", void 0, void 0, false);
  }
  async request(method, path, body, query, auth = true) {
    const params = new URLSearchParams();
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value !== void 0 && value !== null) {
          params.set(key, String(value));
        }
      }
    }
    const qs = params.toString();
    const url = `${this.baseUrl}${path}${qs ? `?${qs}` : ""}`;
    const headers = {
      Accept: "application/json",
      "X-AUROS-Protocol-Version": "1.0"
    };
    if (body !== void 0) {
      headers["Content-Type"] = "application/json";
    }
    if (auth) {
      headers.Authorization = `Bearer ${this.apiKey}`;
    }
    const res = await fetch(url, {
      method,
      headers,
      body: body !== void 0 ? JSON.stringify(body) : void 0
    });
    const json = await res.json();
    if (!res.ok) {
      const err = typeof json === "object" && json !== null && "error" in json ? json.error : void 0;
      throw new Error(
        `[${err?.code ?? res.status}] ${err?.message ?? res.statusText} (${method} ${path})`
      );
    }
    return json;
  }
};

// src/tools.ts
import { z } from "zod";
function jsonResult(data) {
  return {
    content: [{ type: "text", text: JSON.stringify(data, null, 2) }]
  };
}
function toolError(err) {
  const message = err instanceof Error ? err.message : String(err);
  return {
    content: [{ type: "text", text: `AUROS API error: ${message}` }],
    isError: true
  };
}
var assetType = z.enum([
  "real_estate",
  "private_fund",
  "bonds",
  "private_credit",
  "commodities",
  "stablecoins",
  "other"
]).optional();
var AUROS_MCP_TOOLS = [
  {
    name: "score",
    description: "Score MiCA readiness 0\u2013100 for a tokenization project. Pass a free-text description or structured fields (asset_type, jurisdiction, investor_type, etc.).",
    schema: {
      description: z.string().optional().describe("Free-text project description"),
      asset_type: assetType,
      issuer_type: z.enum(["company_spv", "existing_fund", "individual", "unsure"]).optional(),
      asset_class: z.enum(["financial_instrument", "art_utility", "e_money", "unsure"]).optional(),
      eu_nexus: z.enum(["issuer_eu", "asset_eu", "investors_eu", "no_eu", "unsure"]).optional(),
      whitepaper: z.enum(["ready", "draft", "none", "unsure"]).optional(),
      investor_type: z.enum(["professional", "retail", "mixed", "unsure"]).optional(),
      value_eur: z.number().optional(),
      jurisdiction: z.string().optional(),
      has_kyc: z.boolean().optional(),
      has_data_room: z.boolean().optional(),
      documents_count: z.number().optional(),
      record_history: z.boolean().optional()
    },
    handler: (client2, args) => client2.score(args)
  },
  {
    name: "score_batch",
    description: "Score up to 20 assets in one call. Each item accepts the same fields as score. Counts as 1 quota unit.",
    schema: {
      items: z.array(
        z.object({
          description: z.string().optional(),
          asset_type: assetType,
          issuer_type: z.enum(["company_spv", "existing_fund", "individual", "unsure"]).optional(),
          jurisdiction: z.string().optional(),
          investor_type: z.enum(["professional", "retail", "mixed", "unsure"]).optional()
        })
      ).min(1).max(20).describe("Array of score requests (max 20)"),
      record_history: z.boolean().optional()
    },
    handler: (client2, args) => client2.scoreBatch(args)
  },
  {
    name: "products",
    description: "Browse the AUROS RWA product catalog (120+ tokenized products). Filter by category, chain, yield, jurisdiction.",
    schema: {
      category: z.enum([
        "stablecoins",
        "real_estate",
        "bonds",
        "commodities",
        "private_credit",
        "all"
      ]).optional(),
      jurisdiction: z.string().optional(),
      chain: z.string().optional(),
      yield_min: z.number().optional(),
      yield_max: z.number().optional(),
      sort: z.enum(["apy", "tvl", "name"]).optional(),
      limit: z.number().int().min(1).max(100).optional()
    },
    handler: (client2, args) => client2.products(args)
  },
  {
    name: "jurisdictions",
    description: "Rank tokenization jurisdictions by regulatory fit for an asset type, budget, and timeline.",
    schema: {
      asset_type: assetType,
      investor_type: z.enum(["professional", "retail", "mixed", "unsure"]).optional(),
      timeline_months: z.number().optional(),
      budget: z.number().optional(),
      structure: z.string().optional()
    },
    handler: (client2, args) => client2.jurisdictions(args)
  },
  {
    name: "checklist",
    description: "Generate a compliance checklist (20+ items) for a tokenization project by asset type and jurisdiction.",
    schema: {
      asset_type: z.enum([
        "real_estate",
        "private_fund",
        "bonds",
        "private_credit",
        "commodities",
        "stablecoins",
        "other"
      ]).describe("Asset type"),
      jurisdiction: z.string().describe("Target jurisdiction (e.g. luxembourg, france)"),
      structure: z.string().optional().describe("Legal structure (e.g. spv, fund)"),
      investor_type: z.enum(["professional", "retail", "mixed", "unsure"]).optional()
    },
    handler: (client2, args) => client2.checklist(args)
  },
  {
    name: "compare",
    description: "Side-by-side comparison of 2\u20134 RWA products by explicit product_ids or filter criteria.",
    schema: {
      product_ids: z.array(z.string()).min(2).max(4).optional().describe("2\u20134 product IDs to compare"),
      category: z.string().optional(),
      yield_min: z.number().optional(),
      risk_tier: z.string().optional(),
      jurisdiction: z.string().optional(),
      limit: z.number().int().optional()
    },
    handler: (client2, args) => client2.compare(args)
  },
  {
    name: "regulatory_feed",
    description: "Curated MiCA/ESMA/AMF/BaFin regulatory feed (premium key required). Filter by jurisdiction, tag, since date.",
    schema: {
      jurisdiction: z.string().optional(),
      tag: z.enum(["mica", "esma", "amf", "bafin"]).optional(),
      since: z.string().optional().describe("ISO date \u2014 items published on or after"),
      limit: z.number().int().min(1).max(100).optional()
    },
    handler: (client2, args) => client2.regulatoryFeed(args)
  },
  {
    name: "status",
    description: "AUROS Protocol API health \u2014 service probes, version, deployed commit. No auth required.",
    schema: {},
    handler: (client2) => client2.status()
  }
];
function registerAurosTools(server2, client2) {
  for (const tool of AUROS_MCP_TOOLS) {
    server2.registerTool(
      tool.name,
      {
        description: tool.description,
        inputSchema: tool.schema
      },
      async (args) => {
        try {
          const data = await tool.handler(client2, args);
          return jsonResult(data);
        } catch (err) {
          return toolError(err);
        }
      }
    );
  }
}

// src/index.ts
var server = new McpServer({
  name: "auros-protocol",
  version: "1.0.0"
});
var client = new AurosApiClient();
registerAurosTools(server, client);
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
main().catch((err) => {
  console.error("AUROS MCP server failed:", err);
  process.exit(1);
});
