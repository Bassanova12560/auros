import { AUROS_LISTING } from "./auros-listing";

const BASE = "https://getauros.com";

export const RAPIDAPI_LISTING = {
  name: "AUROS Protocol",
  slug: "auros-protocol",
  version: "1.0",
  category: "Finance",
  subcategory: "Financial Data",
  description:
    "The RWA Intelligence Layer — score MiCA readiness (0–100), browse 120+ tokenized RWA products, rank jurisdictions, and generate compliance checklists. Static rules, <200ms, no LLM. Indicative only.",
  shortDescription:
    "MiCA scoring, RWA catalog, jurisdiction ranking & compliance checklists for tokenized assets.",
  website: BASE,
  documentationUrl: `${BASE}/developers/docs`,
  openapiUrl: `${BASE}/auros-openapi.yaml`,
  termsOfUse: `${BASE}/trust`,
  logoUrl: `${BASE}/auros-logo.svg`,
  contactEmail: AUROS_LISTING.contactEmail,
  baseUrl: BASE,
  authentication: {
    type: "bearer",
    header: "Authorization",
    format: "Bearer auros_pk_live_* or auros_pk_test_*",
    demoKey: "auros_pk_test_demo",
    keyCreationEndpoint: `${BASE}/api/v1/keys`,
  },
  endpoints: [
    {
      name: "Score",
      method: "POST",
      path: "/api/v1/score",
      description: "MiCA intelligence score 0–100 with grade, breakdown, gaps, recommendations",
    },
    {
      name: "Products",
      method: "GET",
      path: "/api/v1/products",
      description: "Paginated RWA product catalog with APY, TVL, chains, jurisdiction filters",
    },
    {
      name: "Public Compare Screener",
      method: "GET",
      path: "/api/compare",
      description:
        "Indicative RWA screener / shortlist snapshot with entity_id, source citations, HMAC proof (auros-compare:v1:). Rate-limited; APY never invented.",
      authRequired: false,
    },
    {
      name: "Compare Eligibility",
      method: "GET",
      path: "/api/compare/eligibility",
      description:
        "Indicative eligibility composite (MiCA-oriented × jurisdiction × Green CQS/CSRD when data exists). Not legal advice.",
      authRequired: false,
    },
    {
      name: "Compare Verify",
      method: "POST",
      path: "/api/compare/verify",
      description: "Verify compare snapshot / report content_hash + HMAC signature",
      authRequired: false,
    },
    {
      name: "Jurisdictions",
      method: "GET",
      path: "/api/v1/jurisdictions",
      description: "Regulatory jurisdiction ranking by asset type, investor profile, timeline, budget",
    },
    {
      name: "Checklist",
      method: "POST",
      path: "/api/v1/checklist",
      description: "20+ compliance checklist items per asset type and jurisdiction",
    },
    {
      name: "Create Key",
      method: "POST",
      path: "/api/v1/keys",
      description: "Create free-tier API key (no auth required)",
      authRequired: false,
    },
    {
      name: "Monitor (Premium)",
      method: "POST",
      path: "/api/v1/monitor",
      description:
        "Create regulatory monitor — requires premium-tier API key (Bearer auros_pk_* with tier=premium). GET/DELETE /api/v1/monitor/:id for status and unsubscribe.",
      authRequired: true,
      premium: true,
    },
  ],
  pricingTiers: [
    {
      name: "Free",
      monthlyQuota: 100,
      priceUsd: 0,
      description: "100 requests/month — score, products, jurisdictions, checklist",
    },
    {
      name: "Premium Monitor",
      monthlyQuota: 10_000,
      priceUsd: 199,
      description:
        "POST/GET/DELETE /api/v1/monitor — regulatory change alerts (requires premium API key)",
      available: true,
    },
    {
      name: "Pro",
      monthlyQuota: 10_000,
      priceUsd: 49,
      description: "Phase 3 — higher quota, webhooks, dossier sync (planned)",
      available: false,
    },
    {
      name: "Enterprise",
      monthlyQuota: null,
      priceUsd: null,
      description: "Custom SLA, dedicated support, on-prem options (contact sales)",
      available: false,
    },
  ],
  sdks: [
    { language: "TypeScript", package: "@adrien1212balitrand/auros-protocol", install: "npm install @adrien1212balitrand/auros-protocol" },
    { language: "Python", package: "auros-protocol", install: "pip install auros-protocol" },
  ],
  tags: ["RWA", "MiCA", "tokenization", "compliance", "real-world-assets", "fintech", "regulatory"],
} as const;

export const RAPIDAPI_SUBMISSION_PAYLOAD = {
  api: {
    name: RAPIDAPI_LISTING.name,
    description: RAPIDAPI_LISTING.description,
    category: RAPIDAPI_LISTING.category,
    documentation: RAPIDAPI_LISTING.documentationUrl,
    termsOfUse: RAPIDAPI_LISTING.termsOfUse,
    baseUrl: RAPIDAPI_LISTING.baseUrl,
  },
  endpoints: RAPIDAPI_LISTING.endpoints.map((ep) => ({
    name: ep.name,
    method: ep.method,
    path: ep.path,
    description: ep.description,
  })),
  pricing: RAPIDAPI_LISTING.pricingTiers.filter((t) => t.priceUsd === 0 || t.available !== false),
  authentication: RAPIDAPI_LISTING.authentication,
} as const;
