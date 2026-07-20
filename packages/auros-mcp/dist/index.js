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
  async greenScore(id) {
    return this.request("GET", `/api/green/score/${encodeURIComponent(id)}`, void 0, void 0, false);
  }
  async greenRegistry(serial) {
    return this.request("GET", "/api/green/registry", void 0, { serial }, false);
  }
  async greenNatureIndex() {
    return this.request("GET", "/api/green/nature-index", void 0, void 0, false);
  }
  async greenApiStatus() {
    return this.request("GET", "/api/green/status", void 0, void 0, false);
  }
  async greenWattScore(id) {
    return this.request("GET", `/api/green/watt/${encodeURIComponent(id)}`, void 0, void 0, false);
  }
  async greenCarbonQuality(id) {
    return this.request(
      "GET",
      `/api/green/carbon-quality/${encodeURIComponent(id)}`,
      void 0,
      void 0,
      false
    );
  }
  async greenWattBatch(body) {
    return this.request("POST", "/api/v1/green/watt/batch", body);
  }
  async greenCarbonQualityBatch(body) {
    return this.request("POST", "/api/v1/green/carbon-quality/batch", body);
  }
  async greenH2oScore(id) {
    return this.request("GET", `/api/green/h2o/${encodeURIComponent(id)}`, void 0, void 0, false);
  }
  async greenH2oBatch(body) {
    return this.request("POST", "/api/v1/green/h2o/batch", body);
  }
  async eauCheck(body) {
    return this.request("POST", "/api/eau/check", body, void 0, false);
  }
  async listChargeflow(query = {}) {
    return this.request("GET", "/api/v1/chargeflow", void 0, query);
  }
  async createChargeflowE(body) {
    return this.request("POST", "/api/v1/chargeflow", body);
  }
  async createChargeflowFromOcpi(body) {
    return this.request("POST", "/api/v1/chargeflow/from-ocpi", body);
  }
  async listChargeflowPartners() {
    return this.request(
      "GET",
      "/api/v1/chargeflow/partners",
      void 0,
      void 0,
      false
    );
  }
  async syncChargeflowPartner(body) {
    return this.request("POST", "/api/v1/chargeflow/partners/sync", body);
  }
  async getChargeflow(id) {
    return this.request(
      "GET",
      `/api/v1/chargeflow/${encodeURIComponent(id)}`,
      void 0,
      void 0,
      false
    );
  }
  async retireChargeflow(id, body = {}) {
    return this.request(
      "POST",
      `/api/v1/chargeflow/${encodeURIComponent(id)}/retire`,
      body
    );
  }
  async wattsReserve(body) {
    return this.request("POST", "/api/v1/watts/reserve", body);
  }
  async wattsReservation(id) {
    return this.request(
      "GET",
      `/api/v1/watts/reserve/${encodeURIComponent(id)}`
    );
  }
  async wattsConfirm(id) {
    return this.request(
      "POST",
      `/api/v1/watts/reserve/${encodeURIComponent(id)}/confirm`,
      {}
    );
  }
  async wattsSettle(id, body = {}) {
    return this.request(
      "POST",
      `/api/v1/watts/reserve/${encodeURIComponent(id)}/settle`,
      body
    );
  }
  async wattsCreateOffer(body) {
    return this.request("POST", "/api/v1/watts/offers", body);
  }
  async wattsOffers(query = {}) {
    return this.request("GET", "/api/v1/watts/offers", void 0, query);
  }
  async wattsMatchOffers(body) {
    return this.request("POST", "/api/v1/watts/offers/match", body);
  }
  async wattsSecondaryList(body) {
    return this.request("POST", "/api/v1/watts/secondary", body);
  }
  async wattsSecondary(query = {}) {
    return this.request("GET", "/api/v1/watts/secondary", void 0, query);
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
    name: "green_watt_score",
    description: "Free public Watt Score (0\u2013100) for an AUROS Green energy compare reference (solar, wind, REC, PPA). No auth required.",
    schema: {
      id: z.string().describe("Compare reference id, e.g. sunexchange")
    },
    handler: (client2, args) => client2.greenWattScore(String(args.id))
  },
  {
    name: "green_carbon_quality",
    description: "Free public Carbon Quality Score (CQS, 0\u2013100) for an AUROS Green carbon compare reference. No auth required.",
    schema: {
      id: z.string().describe("Compare reference id, e.g. toucan")
    },
    handler: (client2, args) => client2.greenCarbonQuality(String(args.id))
  },
  {
    name: "green_watt_batch",
    description: "Batch Watt Scores for up to 50 energy assets (premium key required). Each item: id (compare ref) or text (free-form). Counts as 1 quota unit.",
    schema: {
      items: z.array(
        z.object({
          id: z.string().optional(),
          text: z.string().min(10).optional()
        })
      ).min(1).max(50)
    },
    handler: (client2, args) => client2.greenWattBatch(args)
  },
  {
    name: "green_carbon_quality_batch",
    description: "Batch Carbon Quality Scores \u2014 free tier: 10 items, premium: 50. Each item: id, text, or serial. Counts as 1 quota unit.",
    schema: {
      items: z.array(
        z.object({
          id: z.string().optional(),
          text: z.string().min(10).optional()
        })
      ).min(1).max(50)
    },
    handler: (client2, args) => client2.greenCarbonQualityBatch(args)
  },
  {
    name: "green_h2o_score",
    description: "Free public H\u2082O Score (0\u2013100) for a hydrological catalog reference (concession, water rights, desalination, blue bond). No auth required.",
    schema: {
      id: z.string().describe("Hydrological compare reference id, e.g. pilot-concession-france")
    },
    handler: (client2, args) => client2.greenH2oScore(String(args.id))
  },
  {
    name: "green_h2o_batch",
    description: "Batch H\u2082O Scores for hydrological assets (premium key required). Each item: id (catalog ref) or text (free-form). Counts as 1 quota unit.",
    schema: {
      items: z.array(
        z.object({
          id: z.string().optional(),
          text: z.string().min(10).optional()
        })
      ).min(1).max(50)
    },
    handler: (client2, args) => client2.greenH2oBatch(args)
  },
  {
    name: "eau_check",
    description: "Public hydrological readiness check from free text (min 10 chars). Returns H\u2082O Score preview and passport unlock path. No auth required.",
    schema: {
      text: z.string().min(10).describe("Project description mentioning m\xB3, concession, water rights, etc.")
    },
    handler: (client2, args) => client2.eauCheck({ text: args.text })
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
  },
  {
    name: "green_score",
    description: "AUROS Green unified score (CQS + Watt + Nature + benchmark) for a catalog id (e.g. toucan, moss). Free public read.",
    schema: {
      id: z.string().describe("Green compare catalog id")
    },
    handler: (client2, args) => client2.greenScore(String(args.id))
  },
  {
    name: "green_registry",
    description: "Registry Connect \u2014 Verra/Gold Standard/Puro serial to CQS + Nature Score. Free public read.",
    schema: {
      serial: z.string().describe("Registry serial e.g. VCS-674")
    },
    handler: (client2, args) => client2.greenRegistry(String(args.serial))
  },
  {
    name: "green_nature_index",
    description: "AUROS Nature Score Index ranking \u2014 biodiversity & nature-based assets.",
    schema: {},
    handler: (client2) => client2.greenNatureIndex()
  },
  {
    name: "green_api_status",
    description: "AUROS Green API health probes (score, registry, nature-index, openapi).",
    schema: {},
    handler: (client2) => client2.greenApiStatus()
  },
  {
    name: "chargeflow_list",
    description: "List ChargeFlow CFU units for the API key (Premium). Filter by kind (e|w|f), status, operator_id.",
    schema: {
      kind: z.enum(["e", "w", "f"]).optional(),
      status: z.enum(["active", "retired"]).optional(),
      operator_id: z.string().optional(),
      limit: z.number().int().min(1).max(100).optional(),
      offset: z.number().int().min(0).optional()
    },
    handler: (client2, args) => client2.listChargeflow(args)
  },
  {
    name: "chargeflow_create_e",
    description: "Mint a CFU-E charge session unit (Premium). Pass session + optional attributes.",
    schema: {
      session: z.object({
        external_session_id: z.string(),
        started_at: z.string(),
        ended_at: z.string(),
        energy_kwh: z.number(),
        operator_id: z.string().optional(),
        source_format: z.enum(["ocpi", "ocpp_summary", "csv", "json_custom"]).optional(),
        location: z.object({
          country: z.string().optional(),
          site_id: z.string().optional(),
          connector_id: z.string().optional()
        }).optional(),
        vehicle_ref: z.string().optional()
      }).describe("Charge session payload"),
      attributes: z.object({
        renewable_claim: z.enum(["none", "go", "rec", "ppa_matched", "unknown"]).optional(),
        grid_mix_note: z.string().optional(),
        compare_ref_id: z.string().optional()
      }).optional()
    },
    handler: (client2, args) => client2.createChargeflowE(args)
  },
  {
    name: "chargeflow_from_ocpi",
    description: "Offline OCPI CDR / CSV rows \u2192 CFU-E batch (Premium). Not a live OCPI client. Max 50 items.",
    schema: {
      cdrs: z.array(
        z.object({
          id: z.string(),
          start_date_time: z.string(),
          end_date_time: z.string(),
          total_energy: z.number(),
          country: z.string().optional(),
          location_id: z.string().optional(),
          cpo_id: z.string().optional(),
          party_id: z.string().optional(),
          auth_id: z.string().optional()
        })
      ).optional(),
      csv_rows: z.array(
        z.object({
          external_session_id: z.string(),
          started_at: z.string(),
          ended_at: z.string(),
          energy_kwh: z.number(),
          country: z.string().optional(),
          site_id: z.string().optional(),
          operator_id: z.string().optional()
        })
      ).optional(),
      default_operator_id: z.string().optional()
    },
    handler: (client2, args) => client2.createChargeflowFromOcpi(args)
  },
  {
    name: "chargeflow_partners",
    description: "List ChargeFlow partner connectors (Tesla Fleet / TotalEnergies / generic OCPI). Public catalogue.",
    schema: {},
    handler: (client2) => client2.listChargeflowPartners()
  },
  {
    name: "chargeflow_partner_sync",
    description: "Sync partner sessions to CFU-E (Premium). mode=sandbox (fixtures) or live (credentials required). Not an official Tesla/Total partnership.",
    schema: {
      partner: z.enum(["tesla_fleet", "total_energies", "generic_ocpi"]),
      mode: z.enum(["sandbox", "live"]).optional(),
      operator_id: z.string().optional(),
      limit: z.number().int().min(1).max(50).optional(),
      credentials: z.object({
        access_token: z.string().optional(),
        vin: z.string().optional(),
        base_url: z.string().optional(),
        token: z.string().optional(),
        party_id: z.string().optional()
      }).optional()
    },
    handler: (client2, args) => client2.syncChargeflowPartner(args)
  },
  {
    name: "chargeflow_get",
    description: "Get a ChargeFlow unit by id (public verify).",
    schema: {
      id: z.string().describe("cfu_e_* / cfu_w_* / cfu_f_*")
    },
    handler: (client2, args) => client2.getChargeflow(String(args.id))
  },
  {
    name: "chargeflow_retire",
    description: "Retire an active ChargeFlow unit (Premium, same API key).",
    schema: {
      id: z.string(),
      reason: z.string().optional()
    },
    handler: (client2, args) => client2.retireChargeflow(String(args.id), {
      reason: args.reason
    })
  },
  {
    name: "watts_reserve",
    description: "Create a Watts Reserve intent (Premium). Deterministic match_score \u2014 no CFU mint. Confirm separately.",
    schema: {
      window: z.object({
        start: z.string(),
        end: z.string()
      }),
      energy_kwh: z.number().optional(),
      capacity_kw: z.number().optional(),
      zone: z.object({
        country: z.string(),
        zone_id: z.string().optional()
      }),
      carbon_intensity_max_gco2_kwh: z.number().optional(),
      firmness: z.enum(["firm", "flex"]).optional(),
      buyer_ref: z.string().optional()
    },
    handler: (client2, args) => client2.wattsReserve(args)
  },
  {
    name: "watts_get",
    description: "Get a Watts reservation by id (Premium).",
    schema: {
      id: z.string().describe("reservation uuid")
    },
    handler: (client2, args) => client2.wattsReservation(String(args.id))
  },
  {
    name: "watts_confirm",
    description: "Confirm a Watts reservation \u2014 mints CFU-E or CFU-F linked to reservation_id (Premium). Explicit only.",
    schema: {
      id: z.string().describe("reservation uuid")
    },
    handler: (client2, args) => client2.wattsConfirm(String(args.id))
  },
  {
    name: "watts_settle",
    description: "Settle a confirmed Watts reservation on delivery \u2014 retires linked CFU (Premium). Explicit only.",
    schema: {
      id: z.string().describe("reservation uuid"),
      delivery_ref: z.string().optional(),
      energy_kwh_delivered: z.number().optional(),
      capacity_kw_delivered: z.number().optional(),
      reason: z.string().optional()
    },
    handler: (client2, args) => {
      const { id, ...body } = args;
      return client2.wattsSettle(String(id), body);
    }
  },
  {
    name: "watts_list_offers",
    description: "List open producer capacity offers (Premium). Optional filters: country, firmness, mine.",
    schema: {
      country: z.string().optional(),
      firmness: z.enum(["firm", "flex"]).optional(),
      mine: z.boolean().optional()
    },
    handler: (client2, args) => client2.wattsOffers(args)
  },
  {
    name: "watts_create_offer",
    description: "Publish a producer capacity window to Watts inventory (Premium). Indicative \u2014 not a PPA.",
    schema: {
      window: z.object({ start: z.string(), end: z.string() }),
      capacity_kw: z.number().optional(),
      energy_kwh: z.number().optional(),
      zone: z.object({
        country: z.string(),
        zone_id: z.string().optional()
      }),
      carbon_intensity_gco2_kwh: z.number().optional(),
      firmness: z.enum(["firm", "flex"]).optional(),
      label: z.string().optional(),
      producer_ref: z.string().optional()
    },
    handler: (client2, args) => client2.wattsCreateOffer(args)
  },
  {
    name: "watts_match_offers",
    description: "Rank open capacity offers against a buyer profile (Premium). Deterministic \u2014 no auto-reserve.",
    schema: {
      window: z.object({ start: z.string(), end: z.string() }),
      energy_kwh: z.number().optional(),
      capacity_kw: z.number().optional(),
      zone: z.object({
        country: z.string(),
        zone_id: z.string().optional()
      }),
      carbon_intensity_max_gco2_kwh: z.number().optional(),
      firmness: z.enum(["firm", "flex"]).optional()
    },
    handler: (client2, args) => client2.wattsMatchOffers(args)
  },
  {
    name: "watts_secondary_book",
    description: "List open secondary listings (Premium). Optional mine=true for own listings.",
    schema: {
      mine: z.boolean().optional()
    },
    handler: (client2, args) => client2.wattsSecondary(args)
  },
  {
    name: "watts_secondary_list",
    description: "Create an indicative secondary listing (Premium). Optional compare_ref_id \u2192 /compare. Not a securities exchange.",
    schema: {
      reservation_id: z.string().uuid().optional(),
      indicative_price_eur: z.number().positive(),
      compare_ref_id: z.string().optional(),
      label: z.string().optional(),
      note: z.string().optional(),
      energy_kwh: z.number().optional(),
      capacity_kw: z.number().optional(),
      zone: z.object({
        country: z.string(),
        zone_id: z.string().optional()
      }).optional(),
      firmness: z.enum(["firm", "flex"]).optional()
    },
    handler: (client2, args) => client2.wattsSecondaryList(args)
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
