import { absoluteUrl } from "@/lib/comparators/site";

import {
  GREEN_ANON_BULK_MAX_IDS,
  GREEN_ANON_DAILY_LIMIT,
  GREEN_API_OPENAPI_PATH,
  GREEN_FREE_BATCH_MAX_ITEMS,
  GREEN_FREE_BULK_MAX_IDS,
} from "./constants";
import { listGreenScoreCatalogIds } from "./score-lookup";

export function buildGreenApiOpenApiSpec() {
  const base = absoluteUrl("");
  return {
    openapi: "3.0.3",
    info: {
      title: "AUROS Green API",
      version: "1.0.0",
      description:
        "Free public API for Carbon Quality Score (CQS), Watt Score and AUROS Green Index data. Anonymous: 100 req/day. Free API key: 1000 req/month + batch.",
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
      "/api/green/index": { get: { summary: "Green RWA Index JSON feed" } },
      "/api/green/changelog": { get: { summary: "Monthly index movers" } },
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
          summary: `Batch CQS (API key required, max ${GREEN_FREE_BATCH_MAX_ITEMS} free)`,
          security: [{ bearerAuth: [] }],
        },
      },
      "/api/v1/keys": {
        post: { summary: "Create free API key (1000 req/month)" },
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
    },
    "x-openapi-self": absoluteUrl(GREEN_API_OPENAPI_PATH),
  };
}
