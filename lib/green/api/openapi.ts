import { absoluteUrl } from "@/lib/comparators/site";

import {
  GREEN_ANON_BULK_MAX_IDS,
  GREEN_ANON_DAILY_LIMIT,
  GREEN_API_OPENAPI_PATH,
  GREEN_FREE_BATCH_MAX_ITEMS,
  GREEN_FREE_BULK_MAX_IDS,
  GREEN_PREMIUM_BATCH_MAX_ITEMS,
} from "./constants";
import { listGreenScoreCatalogIds } from "./score-lookup";

export function buildGreenApiOpenApiSpec() {
  const base = absoluteUrl("");
  return {
    openapi: "3.0.3",
    info: {
      title: "AUROS Green API",
      version: "1.6.0",
      description:
        "Public API for Carbon Quality Score (CQS), Watt Score, H₂O Score, WELHR / continuity / ROI resilience screens, AUROS Green Index, Asset DNA, Proof Stream, Portfolio Console, air-gap export, and AUROS Toll (Resolve / Search / Research / Policy / Drift / Agent Protocol). Anonymous: 100 req/day. Free API key: 1000 req/month. Batch Watt/H₂O and large CQS batches require paid premium tier (not merely an auros_pk_live_* free key).",
      contact: { name: "AUROS", url: base },
    },
    servers: [{ url: base }],
    paths: {
      "/api/green/score/{id}": {
        get: {
          summary: "Unified Green score (CQS + Watt + composite)",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: { "200": { description: "Score payload" } },
        },
      },
      "/api/green/scores": {
        get: {
          summary: "Bulk scores by compare ids",
          parameters: [
            {
              name: "ids",
              in: "query",
              required: true,
              schema: { type: "string" },
              description: `Comma-separated ids (max ${GREEN_ANON_BULK_MAX_IDS} anon, ${GREEN_FREE_BULK_MAX_IDS} with key)`,
            },
          ],
        },
      },
      "/api/green/score/analyze": {
        post: {
          summary: "Score carbon credit from free text (CQS)",
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { text: { type: "string", minLength: 10 } },
                },
              },
            },
          },
        },
      },
      "/api/green/carbon-quality/{id}": {
        get: { summary: "Carbon Quality Score only (legacy)" },
      },
      "/api/green/watt/{id}": {
        get: {
          summary: "Watt Score for energy catalog id (public)",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        },
      },
      "/api/green/h2o/{id}": {
        get: {
          summary: "H₂O Score for hydrological catalog id (public)",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        },
      },
      "/api/green/index": { get: { summary: "Green RWA Index JSON feed" } },
      "/api/green/changelog": { get: { summary: "Monthly index movers" } },
      "/api/green/nature-index": { get: { summary: "Nature Score Index ranking (biodiversity)" } },
      "/api/green/dpp/{id}": {
        get: {
          summary: "DPP Bridge v0 — EU Digital Product Passport JSON-LD",
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
            { name: "format", in: "query", schema: { type: "string", enum: ["jsonld"] } },
          ],
        },
      },
      "/api/green/score/{id}/history": {
        get: {
          summary: "Monthly score history (Premium tier)",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        },
      },
      "/api/green/nature-score/{id}": {
        get: {
          summary: "Nature Score (TNFD LEAP-inspired) for nature-based assets",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        },
      },
      "/api/green/registry": {
        get: {
          summary: "Registry Connect — Verra/Gold Standard serial to CQS",
          parameters: [
            { name: "serial", in: "query", schema: { type: "string" }, example: "VCS-674" },
            { name: "registry", in: "query", schema: { type: "string" } },
            { name: "q", in: "query", schema: { type: "string" } },
          ],
        },
      },
      "/api/v1/green/carbon-quality/batch": {
        post: {
          summary: `Batch CQS (API key required; max ${GREEN_FREE_BATCH_MAX_ITEMS} free, ${GREEN_PREMIUM_BATCH_MAX_ITEMS} premium tier)`,
          security: [{ bearerAuth: [] }],
        },
      },
      "/api/v1/green/watt/batch": {
        post: {
          summary: `Batch Watt Score (premium tier required, max ${GREEN_PREMIUM_BATCH_MAX_ITEMS}) — free auros_pk_live_* keys are not enough`,
          security: [{ bearerAuth: [] }],
        },
      },
      "/api/v1/green/h2o/batch": {
        post: {
          summary: `Batch H₂O Score (premium tier required, max ${GREEN_PREMIUM_BATCH_MAX_ITEMS}) — free auros_pk_live_* keys are not enough`,
          security: [{ bearerAuth: [] }],
        },
      },
      "/api/v1/keys": {
        post: { summary: "Create free API key (1000 req/month)" },
      },
      "/api/v1/asset-dna/{id}": {
        get: {
          summary: "Asset DNA record (trust object for Green assets)",
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: { "200": { description: "Asset DNA JSON" }, "404": { description: "Not found" } },
        },
      },
      "/api/v1/asset-dna/{id}/stream": {
        get: {
          summary:
            "Proof Stream — append-only events (anon ≤20 · free key ≤50 · premium ≤100)",
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
            {
              name: "limit",
              in: "query",
              schema: { type: "integer", minimum: 1, maximum: 100 },
            },
          ],
          responses: { "200": { description: "Event list + meta.tier" } },
        },
      },
      "/api/v1/toll/schema": {
        get: { summary: "AUROS Metadata Standard (RWA schema v0)" },
      },
      "/api/v1/toll/resolve": {
        get: {
          summary: "Mandatory Lookup — resolve Asset DNA or unknown-risk",
          parameters: [
            { name: "q", in: "query", required: true, schema: { type: "string" } },
          ],
        },
        post: { summary: "Mandatory Lookup (JSON body { q })" },
      },
      "/api/v1/toll/search": {
        post: { summary: "Search Graph — DNA + Green market" },
      },
      "/api/v1/toll/research": {
        post: {
          summary: "Research pack + citations (Bearer required)",
          security: [{ bearerAuth: [] }],
        },
      },
      "/api/v1/toll/policy": {
        post: {
          summary: "Policy Engine decision (Bearer required)",
          security: [{ bearerAuth: [] }],
        },
      },
      "/api/v1/toll/drift": {
        post: { summary: "Drift Detection signals for an Asset DNA" },
      },
      "/api/v1/toll/trail": {
        post: { summary: "Validation Trail (Proof Stream)" },
      },
      "/api/v1/toll/agent": {
        post: {
          summary: "Agent Protocol tool dispatcher (Bearer required)",
          security: [{ bearerAuth: [] }],
        },
      },
      "/api/v1/green/portfolio": {
        get: {
          summary:
            "Portfolio Console snapshot (anon ≤20 · free key ≤50 · premium ≤100 DNA rows)",
          parameters: [
            {
              name: "limit",
              in: "query",
              schema: { type: "integer", minimum: 1, maximum: 100 },
            },
          ],
          responses: { "200": { description: "Portfolio snapshot JSON + meta.tier" } },
        },
      },
      "/api/v1/green/portfolio/watchlist": {
        post: {
          summary: "Subscribe to daily portfolio alert digest (max 20 DNA ids; empty = all)",
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email"],
                  properties: {
                    email: { type: "string", format: "email" },
                    assetDnaIds: {
                      type: "array",
                      items: { type: "string" },
                      maxItems: 20,
                    },
                    locale: { type: "string", enum: ["fr", "en", "es"] },
                  },
                },
              },
            },
          },
          responses: { "200": { description: "Watchlist upserted" } },
        },
      },
      "/api/v1/green/portfolio/airgap": {
        get: {
          summary:
            "Air-gapped portfolio pack (Clerk session, Premium+ API key, or CRON_SECRET)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "limit",
              in: "query",
              schema: { type: "integer", minimum: 1, maximum: 100 },
            },
            {
              name: "download",
              in: "query",
              schema: { type: "string", enum: ["1"] },
            },
          ],
          responses: { "200": { description: "Hash-only pack + contentHash" } },
        },
      },
      "/api/v1/green/institutional/request": {
        post: {
          summary:
            "HITL request — white-label branding or IdP metadata (ops review, no auto-activate)",
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["kind", "email", "companyName"],
                  properties: {
                    kind: { type: "string", enum: ["branding", "idp"] },
                    email: { type: "string", format: "email" },
                    companyName: { type: "string" },
                    partnerId: { type: "string" },
                    primaryColor: { type: "string" },
                    metadataUrl: { type: "string" },
                    idpProtocol: { type: "string", enum: ["saml", "oidc"] },
                  },
                },
              },
            },
          },
          responses: { "200": { description: "pending_hitl" } },
        },
      },
      "/api/green/status": { get: { summary: "Green API health probes (public)" } },
      "/api/green/eau/legal-risk": {
        post: {
          summary: "WELHR — water/energy legal & hydrological risk screen (indicatif)",
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["text"],
                  properties: {
                    text: { type: "string", minLength: 20 },
                    region: { type: "string" },
                    asset_hint: {
                      type: "string",
                      enum: [
                        "data_center",
                        "water_rights",
                        "energy",
                        "cooling",
                        "other",
                      ],
                    },
                  },
                },
              },
            },
          },
          responses: { "200": { description: "WELHR score + priorities" } },
        },
      },
      "/api/green/eau/continuity-playbook": {
        post: {
          summary: "Playbook continuité hydrique — 3 scénarios chiffrés (indicatif)",
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["text"],
                  properties: {
                    text: { type: "string", minLength: 20 },
                    region: { type: "string" },
                    project_label: { type: "string" },
                    mw_it: { type: "number", minimum: 1, maximum: 500 },
                    cooling: {
                      type: "string",
                      enum: ["tower", "closed_loop", "hybrid"],
                    },
                    include_markdown: { type: "boolean" },
                  },
                },
              },
            },
          },
          responses: { "200": { description: "WELHR + playbook scenarios" } },
        },
      },
      "/api/green/eau/roi": {
        post: {
          summary: "Simulateur ROI eau / OPEX (data center cooling — indicatif)",
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["mw_it"],
                  properties: {
                    mw_it: { type: "number", minimum: 1, maximum: 500 },
                    stress: {
                      type: "string",
                      enum: ["extreme", "high", "medium", "low", "unknown"],
                    },
                    water_eur_per_m3: { type: "number", minimum: 0.5, maximum: 8 },
                    target_closed_loop: { type: "boolean" },
                  },
                },
              },
            },
          },
          responses: { "200": { description: "Water savings + € bands" } },
        },
      },
      "/api/green/eau/resilience-brief": {
        post: {
          summary: "Resilience brief — score composite + max 3 priorités",
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["text"],
                  properties: {
                    text: { type: "string", minLength: 20 },
                    region: { type: "string" },
                    asset_hint: {
                      type: "string",
                      enum: [
                        "data_center",
                        "water_rights",
                        "energy",
                        "cooling",
                        "other",
                      ],
                    },
                  },
                },
              },
            },
          },
          responses: { "200": { description: "Brief + WELHR" } },
        },
      },
      "/api/green/eau/resilience": {
        get: {
          summary: "Discovery catalog — eau / resilience API + UI routes",
          responses: { "200": { description: "Endpoint index" } },
        },
      },
      "/api/green/eau/supplier-screen": {
        post: {
          summary: "Supplier ESG claim hygiene (anti-greenwashing, indicatif)",
          responses: { "200": { description: "Screen score + flags" } },
        },
      },
      "/api/green/eau/resource-signals": {
        get: {
          summary: "Indicative resource bands (power / lithium / cobalt / water)",
          responses: { "200": { description: "Snapshot signals" } },
        },
      },
      "/api/green/eau/connectors": {
        get: {
          summary: "BIM/ERP export-first connector contracts",
          responses: { "200": { description: "Connector specs + samples" } },
        },
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer" },
      },
    },
    "x-catalog_ids": listGreenScoreCatalogIds(),
    "x-rate_limits": {
      anonymous_daily: GREEN_ANON_DAILY_LIMIT,
      free_monthly: 1000,
      free_batch_max: GREEN_FREE_BATCH_MAX_ITEMS,
      premium_batch_max: GREEN_PREMIUM_BATCH_MAX_ITEMS,
      dna_portfolio_anon: 20,
      dna_portfolio_free: 50,
      dna_portfolio_premium: 100,
      dna_stream_anon: 20,
      dna_stream_free: 50,
      dna_stream_premium: 100,
    },
    "x-openapi-self": absoluteUrl(GREEN_API_OPENAPI_PATH),
  };
}
