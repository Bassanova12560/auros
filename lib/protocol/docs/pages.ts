import { DEMO_API_KEY } from "../constants";
import type { ProtocolDocPage } from "./types";

const BASE = "https://getauros.com";

export const PROTOCOL_DOC_PAGES: ProtocolDocPage[] = [
  {
    slug: "quickstart",
    title: "Démarrage rapide (< 5 min)",
    description:
      "Intégrez AUROS Protocol en moins de 5 minutes : clé API gratuite, premier appel score, SDK npm/pip.",
    category: "getting-started",
    categoryLabel: "Démarrage",
    relatedSlugs: ["authentication", "endpoint-score", "guide-onboarding-integration"],
    sections: [
      {
        heading: "1. Obtenir une clé API",
        paragraphs: [
          "Le tier gratuit offre 100 requêtes/mois. Créez une clé via le playground ou l'endpoint keys — aucune carte requise.",
        ],
        code: `curl -X POST ${BASE}/api/v1/keys \\
  -H "Content-Type: application/json" \\
  -d '{"email":"vous@entreprise.com"}'`,
        language: "bash",
      },
      {
        heading: "2. Premier appel score",
        paragraphs: [
          "Envoyez une description libre ou des champs structurés. La réponse inclut score 0–100, grade, breakdown MiCA et recommandations.",
        ],
        code: `curl -X POST ${BASE}/api/v1/score \\
  -H "Authorization: Bearer ${DEMO_API_KEY}" \\
  -H "Content-Type: application/json" \\
  -d '{"description":"Entrepôt retail Luxembourg €2.5M SPV investisseurs professionnels"}'`,
        language: "bash",
      },
      {
        heading: "3. SDK officiel",
        paragraphs: [
          "Préférez le SDK TypeScript ou Python pour des types stricts et une gestion d'erreurs unifiée.",
        ],
        code: `npm install @adrien1212balitrand/auros-protocol`,
        language: "bash",
        links: [
          { href: "/developers", label: "Page développeurs" },
          { href: "/auros-openapi.yaml", label: "OpenAPI spec" },
          { href: "/auros-postman.json", label: "Postman collection" },
        ],
      },
      {
        heading: "TypeScript",
        paragraphs: ["Exemple minimal avec la clé démo :"],
        code: `import { AurosProtocol } from "@adrien1212balitrand/auros-protocol";

const client = new AurosProtocol({ apiKey: "${DEMO_API_KEY}" });
const result = await client.score({
  description: "Entrepôt retail Luxembourg €2.5M SPV",
});
console.log(result.score, result.grade);`,
        language: "typescript",
      },
    ],
  },
  {
    slug: "authentication",
    title: "Authentification",
    description:
      "Clés API Bearer, formats auros_pk_live/test, quota gratuit 100 req/mois, variables d'environnement Vercel.",
    category: "getting-started",
    categoryLabel: "Démarrage",
    relatedSlugs: ["quickstart", "endpoint-keys"],
    sections: [
      {
        heading: "Header Authorization",
        paragraphs: [
          "Tous les endpoints protégés exigent `Authorization: Bearer <api_key>`. Chaque réponse inclut `X-AUROS-Protocol-Version: 1.0` et `X-AUROS-Logo: https://getauros.com/auros-logo.svg`.",
        ],
        code: `Authorization: Bearer auros_pk_live_xxxxxxxx`,
        language: "bash",
      },
      {
        heading: "Formats de clé",
        paragraphs: [
          "• `auros_pk_live_*` — production",
          "• `auros_pk_test_*` — environnement de test",
          `• \`${DEMO_API_KEY}\` — clé démo publique (quota partagé, développement uniquement)`,
        ],
      },
      {
        heading: "Quota & rate limiting",
        paragraphs: [
          "Tier gratuit : 100 requêtes/mois par clé. Dépassement → HTTP 429 `quota_exceeded`.",
          "POST /api/v1/score/batch compte comme **1 requête** quota (max 20 scores par batch).",
          "Burst IP : 30 req/min. Création de clé : 5 req/heure par IP.",
          "Chaque réponse authentifiée inclut les headers Stripe-style : `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset` (timestamp Unix — reset quota mensuel au 1er du mois UTC).",
          "Chaque réponse authentifiée inclut les headers Stripe-style : `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset` (timestamp Unix — reset quota mensuel au 1er du mois UTC).",
        ],
      },
      {
        heading: "Sous-domaine api.getauros.com",
        paragraphs: [
          "Les endpoints sont disponibles sur `https://getauros.com/api/v1/*` et sur `https://api.getauros.com/v1/*` (même backend).",
          "Configuration Vercel : ajoutez `api.getauros.com` dans Settings → Domains, puis un enregistrement DNS CNAME `api` pointant vers `cname.vercel-dns.com` (valeur affichée par Vercel).",
          "La racine `api.getauros.com/` redirige vers `/developers`. Le SDK utilise `https://getauros.com` par défaut — passez `baseUrl: \"https://api.getauros.com\"` si vous préférez le sous-domaine dédié.",
        ],
      },
      {
        heading: "Variables Vercel (production)",
        paragraphs: [
          "Pour persister les clés API en production, configurez sur Vercel :",
          "• `NEXT_PUBLIC_SUPABASE_URL` — URL projet Supabase",
          "• `SUPABASE_SECRET_KEY` — clé service role (server-only)",
          "• `DATABASE_URL` — optionnel, détecté comme signal Supabase actif",
          "Sans Supabase, fallback fichier `.data/protocol-api-keys.json` (dev uniquement).",
        ],
        links: [{ href: "/trust", label: "Confiance & sécurité AUROS" }],
      },
    ],
  },
  {
    slug: "endpoint-score",
    title: "POST /api/v1/score",
    description: "Score MiCA indicatif 0–100 avec grade, breakdown 5 dimensions, gaps et recommandations.",
    category: "endpoints",
    categoryLabel: "Endpoints",
    relatedSlugs: ["endpoint-score", "guide-score-real-estate", "endpoint-checklist"],
    sections: [
      {
        heading: "Requête",
        paragraphs: ["Texte libre et/ou champs structurés. Au moins `description` ou `asset_type`/`issuer_type` requis."],
        code: `{
  "description": "Entrepôt retail Luxembourg €2.5M SPV investisseurs professionnels",
  "asset_type": "real_estate",
  "issuer_type": "company_spv",
  "whitepaper": "draft",
  "has_kyc": true
}`,
        language: "json",
      },
      {
        heading: "Réponse (extrait)",
        paragraphs: ["Chaque réponse inclut `disclaimer` et `meta.full_report_url` vers le wizard AUROS."],
        code: `{
  "score_id": "scr_a1b2c3d4e5f6789012345678",
  "history_url": "${BASE}/api/v1/score/scr_a1b2c3d4e5f6789012345678/history",
  "score": 72,
  "grade": "B-",
  "status": "progress",
  "mica_classification": "financial_instrument",
  "breakdown": {
    "legal_structure": 78,
    "kyc_aml": 65,
    "mica_compliance": 70,
    "data_room": 55,
    "investor_protection": 80
  },
  "critical_gaps": ["Compléter le whitepaper avant distribution retail"],
  "recommendations": ["..."],
  "recommended_jurisdictions": [{ "id": "luxembourg", "score": 88 }],
  "meta": { "version": "1.0", "computed_at": "...", "full_report_url": "${BASE}/wizard" }
}`,
        language: "json",
      },
      {
        heading: "cURL",
        code: `curl -X POST ${BASE}/api/v1/score \\
  -H "Authorization: Bearer ${DEMO_API_KEY}" \\
  -H "Content-Type: application/json" \\
  -d '{"description":"Entrepôt retail Luxembourg €2.5M SPV professionnels"}'`,
        language: "bash",
        paragraphs: [],
      },
    ],
  },
  {
    slug: "endpoint-score-batch",
    title: "POST /api/v1/score/batch",
    description:
      "Score jusqu'à 20 actifs en un appel — succès partiel par item, 1 unité de quota par batch.",
    category: "endpoints",
    categoryLabel: "Endpoints",
    relatedSlugs: ["endpoint-score", "endpoint-score-history", "authentication"],
    sections: [
      {
        heading: "Requête",
        paragraphs: [
          "Tableau `items` (1–20) : chaque élément accepte le même schéma que POST /score.",
          "Option batch `record_history` s'applique à tous les items sauf override par item.",
          "**Quota :** 1 batch = **1 requête** mensuelle (pas N items) — avantage institutionnel vs appels unitaires.",
        ],
        code: `{
  "record_history": true,
  "items": [
    { "description": "Entrepôt retail Luxembourg €2.5M SPV professionnels" },
    {
      "asset_type": "bonds",
      "issuer_type": "company_spv",
      "whitepaper": "draft",
      "has_kyc": true
    }
  ]
}`,
        language: "json",
      },
      {
        heading: "Succès partiel",
        paragraphs: [
          "HTTP 200 même si certains items échouent la validation.",
          "Items valides : résultat score complet + `score_id` + `history_url`.",
          "Items invalides : `{ \"index\": N, \"ok\": false, \"error\": { \"code\", \"message\" } }`.",
        ],
        code: `{
  "total": 2,
  "succeeded": 1,
  "failed": 1,
  "items": [
    {
      "index": 0,
      "ok": true,
      "score_id": "scr_a1b2c3d4e5f6789012345678",
      "history_url": "${BASE}/api/v1/score/scr_a1b2c3d4e5f6789012345678/history",
      "score": 72,
      "grade": "B-"
    },
    {
      "index": 1,
      "ok": false,
      "error": {
        "code": "validation_error",
        "message": "Provide description or structured asset/compliance fields"
      }
    }
  ]
}`,
        language: "json",
      },
      {
        heading: "cURL",
        code: `curl -X POST ${BASE}/api/v1/score/batch \\
  -H "Authorization: Bearer ${DEMO_API_KEY}" \\
  -H "Content-Type: application/json" \\
  -d '{"items":[{"description":"Entrepôt Luxembourg SPV professionnels"},{"asset_type":"bonds","issuer_type":"company_spv"}]}'`,
        language: "bash",
        paragraphs: [],
      },
      {
        heading: "SDK",
        code: `const batch = await client.scoreBatch({
  items: [
    { description: "Entrepôt Luxembourg SPV professionnels" },
    { asset_type: "bonds", issuer_type: "company_spv" },
  ],
});
console.log(batch.succeeded, batch.items[0]?.score_id);`,
        language: "typescript",
        paragraphs: [],
      },
    ],
  },
  {
    slug: "endpoint-green-carbon-quality",
    title: "Carbon Quality Score (CQS) — Green API",
    description:
      "Score indicatif 0–100 par crédit carbone — lecture publique gratuite par id, batch jusqu'à 50 items avec clé API.",
    category: "endpoints",
    categoryLabel: "Endpoints",
    relatedSlugs: ["endpoint-score-batch", "authentication", "endpoint-compare"],
    sections: [
      {
        heading: "GET public (gratuit)",
        paragraphs: [
          "Une référence comparateur Green (`toucan`, `moss`, `klim`…) — pas d'authentification.",
          "Usage presse, due diligence rapide, intégration widget.",
        ],
        code: `curl ${BASE}/api/green/carbon-quality/toucan`,
        language: "bash",
      },
      {
        heading: "POST batch (clé API)",
        paragraphs: [
          "Jusqu'à **50 crédits** par appel — portfolio corporate ou pipeline M&A.",
          "`id` = référence comparateur AUROS, ou `text` = description libre (min 10 caractères).",
          "Compte au quota mensuel Protocol — licence volume : /partners.",
        ],
        code: `curl -X POST ${BASE}/api/v1/green/carbon-quality/batch \\
  -H "Authorization: Bearer ${DEMO_API_KEY}" \\
  -H "Content-Type: application/json" \\
  -d '{"items":[{"id":"toucan"},{"text":"Gold Standard forestry credits retired 2024 Verra"}]}'`,
        language: "bash",
      },
      {
        heading: "Réponse batch (extrait)",
        code: `{
  "total": 2,
  "succeeded": 2,
  "items": [
    { "index": 0, "ok": true, "id": "toucan", "carbon_quality": { "score": 62, "tier": "acceptable" } }
  ]
}`,
        language: "json",
        paragraphs: [
          "Le CQS est un signal AUROS — pas une certification ICVCM/Verra. Voir aussi /data/green-index.",
        ],
      },
    ],
  },
  {
    slug: "endpoint-score-history",
    title: "GET /api/v1/score/{id}/history",
    description:
      "Historique chronologique des scores pour une session (`scr_…`) ou un monitor premium (`mon_…`).",
    category: "endpoints",
    categoryLabel: "Endpoints",
    relatedSlugs: ["endpoint-score", "endpoint-monitor"],
    sections: [
      {
        heading: "Persistance automatique",
        paragraphs: [
          "Chaque POST /api/v1/score avec une clé authentifiée (hors clé démo) enregistre un snapshot dans `protocol_score_history`.",
          "La réponse score inclut `score_id` et `history_url`. Repassez `score_id` pour accumuler l'historique d'un même dossier.",
          "Désactiver : `\"record_history\": false` dans le corps POST /score.",
        ],
      },
      {
        heading: "Réponse",
        code: `{
  "score_id": "scr_a1b2c3d4e5f6789012345678",
  "kind": "session",
  "total": 2,
  "entries": [
    {
      "id": 1,
      "score": 68,
      "grade": "C+",
      "status": "progress",
      "breakdown": { "legal_structure": 70, "kyc_aml": 60, "mica_compliance": 65, "data_room": 50, "investor_protection": 75 },
      "mica_classification": "financial_instrument",
      "created_at": "2026-06-12T10:00:00.000Z"
    }
  ],
  "meta": { "version": "1.0", "computed_at": "2026-06-12T11:00:00.000Z" }
}`,
        language: "json",
        paragraphs: [],
      },
      {
        heading: "cURL",
        code: `curl "${BASE}/api/v1/score/scr_VOTRE_SESSION_ID/history" \\
  -H "Authorization: Bearer ${DEMO_API_KEY}"`,
        language: "bash",
        paragraphs: [
          "Remplacez `scr_VOTRE_SESSION_ID` par le `score_id` retourné par POST /score. Pour un monitor premium, utilisez l'id `mon_…`.",
        ],
      },
      {
        heading: "SDK",
        code: `const result = await client.score({ description: "..." });
const history = await client.scoreHistory(result.score_id!);`,
        language: "typescript",
        paragraphs: [],
      },
    ],
  },
  {
    slug: "endpoint-products",
    title: "GET /api/v1/products",
    description: "Catalogue paginé de 120+ produits RWA tokenisés — APY, TVL, chains, juridiction.",
    category: "endpoints",
    categoryLabel: "Endpoints",
    relatedSlugs: ["endpoint-benchmarks", "guide-compliance-dashboard"],
    sections: [
      {
        heading: "Paramètres query",
        paragraphs: [
          "`category` (stablecoins|real_estate|bonds|commodities|private_credit|all), `jurisdiction`, `chain`, `yield_min`, `yield_max`, `page`, `limit` (max 100), `sort` (apy|tvl|name).",
        ],
      },
      {
        heading: "cURL",
        code: `curl "${BASE}/api/v1/products?category=bonds&yield_min=4&limit=10" \\
  -H "Authorization: Bearer ${DEMO_API_KEY}"`,
        language: "bash",
        paragraphs: [],
      },
      {
        heading: "Réponse (extrait)",
        code: `{
  "products": [{
    "id": "maple-usdc",
    "name": "Maple USDC Pool",
    "platform": "Maple",
    "category": "private_credit",
    "apy": 8.2,
    "tvl_usd": 45000000,
    "chains": ["Ethereum"],
    "jurisdiction": "Cayman Islands",
    "live": true
  }],
  "pagination": { "page": 1, "limit": 10, "total": 48, "total_pages": 5 },
  "fetched_at": "2026-06-11T10:00:00.000Z"
}`,
        language: "json",
        paragraphs: [],
      },
    ],
  },
  {
    slug: "endpoint-benchmarks",
    title: "GET /api/v1/benchmarks",
    description:
      "Benchmarks sectoriels RWA — médiane APY, quartiles P25/P75 et nombre de produits par catégorie (hub live ou repli statique).",
    category: "endpoints",
    categoryLabel: "Endpoints",
    relatedSlugs: ["endpoint-products", "endpoint-compare", "guide-compliance-dashboard"],
    sections: [
      {
        heading: "Paramètres query",
        paragraphs: [
          "`category` (requis) — bonds, stablecoins, real_estate, private_credit ou commodities.",
          "`jurisdiction` (optionnel) — filtre partiel sur la juridiction des produits (ex. EU, US, CH, Luxembourg).",
          "Les métriques sont calculées depuis le hub `/compare`. Si moins de 3 produits avec rendement positif dans la tranche, un benchmark statique curaté est renvoyé.",
        ],
      },
      {
        heading: "cURL",
        code: `curl "${BASE}/api/v1/benchmarks?category=bonds&jurisdiction=EU" \\
  -H "Authorization: Bearer ${DEMO_API_KEY}"`,
        language: "bash",
        paragraphs: [],
      },
      {
        heading: "Réponse (extrait)",
        code: `{
  "disclaimer": "Indicative intelligence only — not legal, tax, or investment advice.",
  "category": "bonds",
  "jurisdiction": "EU",
  "metrics": {
    "median_apy": 4.45,
    "p25_apy": 4.2,
    "p75_apy": 4.7,
    "product_count": 9
  },
  "as_of": "2026-06-30"
}`,
        language: "json",
        paragraphs: [],
      },
    ],
  },
  {
    slug: "endpoint-compare",
    title: "POST /api/v1/compare",
    description:
      "Comparaison side-by-side de 2–4 produits RWA — par IDs explicites ou filtres (category, yield, risk tier, jurisdiction).",
    category: "endpoints",
    categoryLabel: "Endpoints",
    relatedSlugs: ["endpoint-products", "guide-compliance-dashboard"],
    sections: [
      {
        heading: "Modes de requête",
        paragraphs: [
          "**Par IDs** — `product_ids` (2–4 IDs du catalogue, ordre conservé).",
          "**Par filtres** — omettez `product_ids` et passez `category`, `yield_min`, `risk_tier`, `jurisdiction`, `limit` (2–4, défaut 4). Les produits sont triés par APY décroissant.",
        ],
      },
      {
        heading: "cURL (par IDs)",
        code: `curl -X POST ${BASE}/api/v1/compare \\
  -H "Authorization: Bearer ${DEMO_API_KEY}" \\
  -H "Content-Type: application/json" \\
  -d '{"product_ids":["maple-usdc","realt-portfolio","backed-bib01"]}'`,
        language: "bash",
        paragraphs: [],
      },
      {
        heading: "cURL (par filtres)",
        code: `curl -X POST ${BASE}/api/v1/compare \\
  -H "Authorization: Bearer ${DEMO_API_KEY}" \\
  -H "Content-Type: application/json" \\
  -d '{"category":"bonds","yield_min":4,"risk_tier":"core","limit":3}'`,
        language: "bash",
        paragraphs: [],
      },
      {
        heading: "Réponse (extrait)",
        code: `{
  "mode": "product_ids",
  "products": [{
    "id": "maple-usdc",
    "name": "Maple USDC Pool",
    "platform": "Maple",
    "category": "private_credit",
    "asset_class": "private_credit",
    "sub_category": "prime",
    "risk_tier": "core",
    "apy": 8.2,
    "tvl_usd": 45000000,
    "jurisdiction": "Cayman Islands",
    "liquidity_days": 7,
    "fees": "1%",
    "accredited_only": false,
    "live": true
  }],
  "comparison": {
    "product_count": 3,
    "share_url": "${BASE}/compare?compare=maple-usdc,realt-portfolio,backed-bib01",
    "highlights": { "apy": ["best", null, "worst"], "tvl_usd": [null, null, null] }
  },
  "fetched_at": "2026-06-11T10:00:00.000Z",
  "meta": { "version": "1.0", "computed_at": "..." }
}`,
        language: "json",
        paragraphs: [
          "Les champs `comparison.highlights` reprennent la logique du panneau /compare (`best` / `worst` par métrique).",
        ],
        links: [{ href: "/compare", label: "Comparateur RWA AUROS" }],
      },
      {
        heading: "SDK",
        code: `const result = await client.compare({
  product_ids: ["maple-usdc", "realt-portfolio"],
});`,
        language: "typescript",
        paragraphs: [],
      },
    ],
  },
  {
    slug: "endpoint-jurisdictions",
    title: "GET /api/v1/jurisdictions",
    description: "Classement réglementaire des juridictions selon actif, profil investisseur, délai et budget.",
    category: "endpoints",
    categoryLabel: "Endpoints",
    relatedSlugs: ["endpoint-checklist", "guide-score-real-estate"],
    sections: [
      {
        heading: "Paramètres query",
        paragraphs: [
          "`asset_type` (real_estate|bonds|private_credit|funds|all), `investor_type` (professional|retail|mixed|all), `timeline_months` (1–36), `budget` (EUR).",
        ],
      },
      {
        heading: "cURL",
        code: `curl "${BASE}/api/v1/jurisdictions?asset_type=real_estate&investor_type=professional&timeline_months=6" \\
  -H "Authorization: Bearer ${DEMO_API_KEY}"`,
        language: "bash",
        paragraphs: [],
      },
      {
        heading: "Réponse (extrait)",
        code: `{
  "jurisdictions": [{
    "id": "luxembourg",
    "score": 88,
    "rationale": "Cadre SPV/fonds solide pour immobilier professionnel.",
    "fee_min_eur": 15000,
    "fee_max_eur": 45000,
    "license_max_months": 6,
    "asset_types": ["real_estate", "funds"],
    "kyc_level": "enhanced"
  }],
  "query": { "asset_type": "real_estate", "investor_type": "professional" }
}`,
        language: "json",
        paragraphs: [],
      },
    ],
  },
  {
    slug: "endpoint-checklist",
    title: "POST /api/v1/checklist",
    description: "Checklist 20+ items de conformité par type d'actif, juridiction et structure juridique.",
    category: "endpoints",
    categoryLabel: "Endpoints",
    relatedSlugs: ["endpoint-score", "guide-compliance-dashboard"],
    sections: [
      {
        heading: "Requête",
        code: `{
  "asset_type": "real_estate",
  "jurisdiction": "luxembourg",
  "structure": "spv"
}`,
        language: "json",
        paragraphs: ["`structure` : spv (défaut) | fund | trust | other."],
      },
      {
        heading: "cURL",
        code: `curl -X POST ${BASE}/api/v1/checklist \\
  -H "Authorization: Bearer ${DEMO_API_KEY}" \\
  -H "Content-Type: application/json" \\
  -d '{"asset_type":"real_estate","jurisdiction":"luxembourg","structure":"spv"}'`,
        language: "bash",
        paragraphs: [],
      },
      {
        heading: "Réponse (extrait)",
        code: `{
  "items": [{
    "id": "spv-incorporation",
    "category": "legal_structure",
    "title": "Constitution SPV Luxembourg",
    "required": true,
    "estimated_time_days": 21,
    "estimated_cost_eur": 8000,
    "auros_tip": "Anticipez le pacte d'actionnaires avant le KYC investisseurs."
  }],
  "total_items": 24,
  "estimated_total_days": 180,
  "estimated_total_cost_eur": 65000
}`,
        language: "json",
        paragraphs: [],
      },
    ],
  },
  {
    slug: "endpoint-keys",
    title: "POST /api/v1/keys",
    description: "Création de clé API gratuite — 100 req/mois, sans authentification, rate-limit IP.",
    category: "endpoints",
    categoryLabel: "Endpoints",
    relatedSlugs: ["authentication", "quickstart"],
    sections: [
      {
        heading: "Requête",
        code: `{ "email": "developpeur@entreprise.com" }`,
        language: "json",
        paragraphs: ["Aucun header Authorization requis."],
      },
      {
        heading: "cURL",
        code: `curl -X POST ${BASE}/api/v1/keys \\
  -H "Content-Type: application/json" \\
  -d '{"email":"developpeur@entreprise.com"}'`,
        language: "bash",
        paragraphs: [],
      },
      {
        heading: "Réponse",
        paragraphs: [
          "La clé brute n'est affichée qu'une fois. Stockez-la dans un secret manager (Vercel, AWS, etc.).",
        ],
        code: `{
  "ok": true,
  "api_key": "auros_pk_live_...",
  "tier": "free",
  "monthly_limit": 100,
  "message": "Store this key securely — it will not be shown again."
}`,
        language: "json",
      },
    ],
  },
  {
    slug: "guide-score-real-estate",
    title: "Guide : scorer un actif immobilier",
    description:
      "Workflow complet pour scorer un projet immobilier tokenisé : description, champs structurés, checklist et juridictions.",
    category: "guides",
    categoryLabel: "Guides",
    relatedSlugs: ["endpoint-score", "endpoint-jurisdictions", "endpoint-checklist"],
    sections: [
      {
        heading: "Contexte",
        paragraphs: [
          "Vous tokenisez un entrepôt retail à Luxembourg, SPV, investisseurs professionnels, whitepaper en cours. L'API score combine NLP et règles statiques — pas de LLM, réponse < 200 ms.",
        ],
      },
      {
        heading: "Étape 1 — Score initial",
        code: `const score = await client.score({
  description: "Entrepôt retail Luxembourg €2.5M SPV professionnels whitepaper brouillon",
  asset_type: "real_estate",
  issuer_type: "company_spv",
  investor_type: "professional",
  whitepaper: "draft",
  value_eur: 2500000,
  jurisdiction: "luxembourg",
});`,
        language: "typescript",
        paragraphs: ["Analysez `critical_gaps` et `breakdown.data_room` pour prioriser les actions."],
      },
      {
        heading: "Étape 2 — Juridictions",
        paragraphs: ["Validez le choix Luxembourg vs alternatives avec le ranking contextualisé."],
        code: `const ranking = await client.jurisdictions({
  asset_type: "real_estate",
  investor_type: "professional",
  timeline_months: 6,
  budget: 50000,
});`,
        language: "typescript",
      },
      {
        heading: "Étape 3 — Checklist opérationnelle",
        code: `const checklist = await client.checklist({
  asset_type: "real_estate",
  jurisdiction: "luxembourg",
  structure: "spv",
});`,
        language: "typescript",
        paragraphs: [
          "Exportez `items` vers votre outil projet (Notion, Jira) — chaque item inclut coût et délai indicatifs.",
        ],
        links: [
          { href: "/wizard", label: "Wizard dossier AUROS" },
          { href: "/tools/mica-checker", label: "Test MiCA interactif" },
        ],
      },
    ],
  },
  {
    slug: "guide-compliance-dashboard",
    title: "Guide : tableau de bord conformité",
    description:
      "Construire un dashboard compliance avec score, checklist et catalogue RWA — agrégation multi-actifs.",
    category: "guides",
    categoryLabel: "Guides",
    relatedSlugs: ["endpoint-benchmarks", "endpoint-products", "endpoint-compare", "endpoint-checklist", "endpoint-score"],
    sections: [
      {
        heading: "Architecture",
        paragraphs: [
          "Un dashboard compliance typique agrège : score MiCA par dossier, checklist en cours, et benchmark marché via le catalogue products.",
          "Planifiez un cron (quotidien) pour rafraîchir le catalogue — les APY/TVL évoluent.",
        ],
      },
      {
        heading: "Agrégation multi-dossiers",
        code: `// Pseudo-code dashboard
const dossiers = ["warehouse-lu", "fund-fr", "bond-de"];
const scores = await Promise.all(
  dossiers.map((d) => client.score({ description: descriptions[d] }))
);
const avgScore = scores.reduce((s, r) => s + r.score, 0) / scores.length;`,
        language: "typescript",
        paragraphs: [],
      },
      {
        heading: "Benchmark marché",
        code: `const market = await client.products({
  category: "real_estate",
  sort: "apy",
  limit: 20,
});`,
        language: "typescript",
        paragraphs: [
          "Croisez `market.products` avec vos scores internes pour identifier les écarts de maturité MiCA vs pairs du marché.",
        ],
        links: [{ href: "/compare", label: "Comparateur RWA AUROS" }],
      },
    ],
  },
  {
    slug: "guide-onboarding-integration",
    title: "Guide : intégrer dans l'onboarding",
    description:
      "Brancher AUROS Protocol dans un flux d'onboarding émetteur — score automatique à la soumission du dossier.",
    category: "guides",
    categoryLabel: "Guides",
    relatedSlugs: ["quickstart", "authentication", "endpoint-score"],
    sections: [
      {
        heading: "Point d'intégration",
        paragraphs: [
          "À la soumission du formulaire onboarding (description actif + montant + juridiction cible), appelez `/api/v1/score` côté serveur.",
          "Ne exposez jamais la clé API côté client — proxy via votre backend.",
        ],
      },
      {
        heading: "Backend Next.js (route handler)",
        code: `import { AurosProtocol } from "@adrien1212balitrand/auros-protocol";

const auros = new AurosProtocol({ apiKey: process.env.AUROS_API_KEY! });

export async function POST(req: Request) {
  const { description, assetType } = await req.json();
  const result = await auros.score({ description, asset_type: assetType });
  return Response.json({
    admissionScore: result.score,
    grade: result.grade,
    gaps: result.critical_gaps,
    reportUrl: result.meta.full_report_url,
  });
}`,
        language: "typescript",
        paragraphs: [],
      },
      {
        heading: "UX recommandée",
        paragraphs: [
          "Affichez max 3 priorités (`critical_gaps`) — pas les 15 étapes du wizard.",
          "Proposez un lien vers `meta.full_report_url` pour approfondir.",
          "Ton rassurant : « indicatif, counsel requis avant émission ».",
        ],
        links: [
          { href: "/wizard", label: "Wizard AUROS" },
          { href: "/developers#playground", label: "Playground" },
        ],
      },
    ],
  },
  {
    slug: "mcp-server",
    title: "MCP server (Cursor & Claude Desktop)",
    description:
      "Exposez AUROS Protocol comme serveur MCP — 8 outils pour agents IA : score MiCA, catalogue RWA, juridictions, compare.",
    category: "getting-started",
    categoryLabel: "Démarrage",
    relatedSlugs: ["quickstart", "authentication", "endpoint-score"],
    sections: [
      {
        heading: "Installation",
        paragraphs: [
          "Le package npm `@adrien1212balitrand/auros-mcp` encapsule l'API REST en outils MCP compatibles Cursor et Claude Desktop.",
          "Authentification via variable d'environnement `AUROS_API_KEY` — clé démo publique par défaut.",
        ],
        code: `npm install -g @adrien1212balitrand/auros-mcp`,
        language: "bash",
      },
      {
        heading: "Configuration Cursor",
        paragraphs: [
          "Ajoutez à `.cursor/mcp.json` (projet) ou aux paramètres MCP globaux, puis redémarrez Cursor.",
        ],
        code: `{
  "mcpServers": {
    "auros-protocol": {
      "command": "npx",
      "args": ["-y", "@adrien1212balitrand/auros-mcp"],
      "env": {
        "AUROS_API_KEY": "${DEMO_API_KEY}"
      }
    }
  }
}`,
        language: "json",
      },
      {
        heading: "Configuration Claude Desktop",
        paragraphs: [
          "Éditez `claude_desktop_config.json` (Windows : %APPDATA%\\Claude\\, macOS : ~/Library/Application Support/Claude/).",
        ],
        code: `{
  "mcpServers": {
    "auros-protocol": {
      "command": "npx",
      "args": ["-y", "@adrien1212balitrand/auros-mcp"],
      "env": {
        "AUROS_API_KEY": "${DEMO_API_KEY}"
      }
    }
  }
}`,
        language: "json",
      },
      {
        heading: "Outils disponibles",
        paragraphs: [
          "• `score` — POST /api/v1/score (description libre ou champs structurés)",
          "• `score_batch` — POST /api/v1/score/batch (max 20 items, 1 unité quota)",
          "• `products` — GET /api/v1/products (catalogue 120+ produits RWA)",
          "• `jurisdictions` — GET /api/v1/jurisdictions (classement réglementaire)",
          "• `checklist` — POST /api/v1/checklist (20+ items compliance)",
          "• `compare` — POST /api/v1/compare (2–4 produits side-by-side)",
          "• `regulatory_feed` — GET /api/v1/regulatory/feed (premium, feed ESMA/AMF/BaFin)",
          "• `status` — GET /api/v1/status (santé API, sans auth)",
        ],
      },
      {
        heading: "Variables d'environnement",
        paragraphs: [
          `• \`AUROS_API_KEY\` — Bearer token (défaut : \`${DEMO_API_KEY}\`)`,
          "• `AUROS_BASE_URL` — base URL API (défaut : https://getauros.com)",
          "Obtenez une clé gratuite (100 req/mois) via POST /api/v1/keys ou le playground /developers.",
        ],
        links: [
          { href: "/developers#playground", label: "Playground développeurs" },
          { href: "/status", label: "Statut API" },
        ],
      },
      {
        heading: "Exemples de prompts agent",
        paragraphs: [
          "« Score ce SPV immobilier Luxembourg €2.5M, investisseurs professionnels, whitepaper brouillon. »",
          "« Compare maple-usdc, realt-portfolio et backed-bib01. »",
          "« Quelles juridictions pour des obligations tokenisées avec un délai de 6 mois ? »",
        ],
      },
    ],
  },
  {
    slug: "regulatory-feed",
    title: "Feed réglementaire ESMA/AMF/BaFin (Premium)",
    description:
      "Feed curaté MiCA — GET /api/v1/regulatory/feed, abonnements par juridiction, webhook regulatory.update.",
    category: "endpoints",
    categoryLabel: "Endpoints",
    relatedSlugs: ["endpoint-monitor", "endpoint-webhooks", "guide-monitor-mica"],
    sections: [
      {
        heading: "Premium requis",
        paragraphs: [
          "Clé `auros_pk_live_*` ou tier premium/monitor/enterprise.",
          "v1 = feed statique curaté (18 références ESMA, AMF, BaFin, EC). v2 ajoutera le polling live.",
        ],
      },
      {
        heading: "Consulter le feed",
        paragraphs: [
          "Filtres optionnels : `jurisdiction`, `tag` (mica|esma|amf|bafin), `since` (ISO date), `limit` (max 100).",
        ],
        code: `curl "${BASE}/api/v1/regulatory/feed?jurisdiction=france&tag=amf&limit=10" \\
  -H "Authorization: Bearer auros_pk_live_xxx"`,
        language: "bash",
      },
      {
        heading: "S'abonner aux alertes",
        paragraphs: [
          "POST /api/v1/regulatory/subscribe — filtre par juridictions et tags.",
          "GET/DELETE /api/v1/regulatory/subscribe/:id — statut et désinscription.",
          "Enregistrez aussi POST /api/v1/webhooks avec l'événement `regulatory.update` pour un endpoint global.",
        ],
        code: `curl -X POST ${BASE}/api/v1/regulatory/subscribe \\
  -H "Authorization: Bearer auros_pk_live_xxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "jurisdictions": ["france", "eu"],
    "tags": ["amf", "mica"],
    "webhook_url": "https://your.app/hooks/auros-regulatory"
  }'`,
        language: "bash",
      },
      {
        heading: "Webhook regulatory.update",
        paragraphs: [
          "Déclenché par le cron daily `/api/cron/protocol-monitor` (Authorization: Bearer $CRON_SECRET).",
          "Payload signé HMAC — même format que les autres webhooks Protocol.",
        ],
        code: `{
  "event": "regulatory.update",
  "severity": "high",
  "impact_on_score": -7,
  "summary": "AMF — transition PSAN vers agrément MiCA CASP",
  "details": {
    "feed_item": {
      "id": "amf-2025-psan-transition",
      "title": "...",
      "source": "AMF",
      "url": "https://www.amf-france.org/...",
      "tags": ["amf", "mica"]
    },
    "subscription_id": "regsub_abc123"
  },
  "timestamp": "2026-06-13T06:00:00.000Z",
  "disclaimer": "Indicative intelligence only..."
}`,
        language: "json",
      },
    ],
  },
  {
    slug: "endpoint-monitor",
    title: "POST /api/v1/monitor (Premium)",
    description:
      "Enregistrer un profil d'actif à surveiller — alertes MiCA, webhooks, feed ESMA curaté.",
    category: "endpoints",
    categoryLabel: "Endpoints",
    relatedSlugs: ["guide-monitor-mica", "endpoint-webhooks"],
    sections: [
      {
        heading: "Premium requis",
        paragraphs: [
          "Clé `auros_pk_live_*` ou tier premium/monitor/enterprise. Tier gratuit → HTTP 403 `premium_required`.",
          "Tarifs indicatifs : 49€/mo (5 actifs), 199€/mo (25 actifs).",
        ],
      },
      {
        heading: "Créer un monitor",
        paragraphs: [],
        code: `curl -X POST ${BASE}/api/v1/monitor \\
  -H "Authorization: Bearer auros_pk_live_xxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "asset_type": "real_estate",
    "jurisdiction": "luxembourg",
    "structure": "spv",
    "webhook_url": "https://your.app/hooks/auros",
    "alert_on": ["score_change", "regulation_update", "deadline_approaching"]
  }'`,
        language: "bash",
      },
      {
        heading: "Statut & suppression",
        paragraphs: [
          "GET /api/v1/monitor/:id — statut, dernière vérification, dernière alerte.",
          "DELETE /api/v1/monitor/:id — désinscription.",
        ],
      },
    ],
  },
  {
    slug: "endpoint-dossier",
    title: "POST /api/v1/dossier (Premium)",
    description:
      "Générer un rapport institutionnel PDF/JSON — score, checklist, juridictions.",
    category: "endpoints",
    categoryLabel: "Endpoints",
    relatedSlugs: ["guide-institutional-reports", "endpoint-score"],
    sections: [
      {
        heading: "Requête",
        paragraphs: [],
        code: `curl -X POST ${BASE}/api/v1/dossier \\
  -H "Authorization: Bearer auros_pk_live_xxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "score": {
      "description": "Entrepôt retail Luxembourg €2.5M SPV professionnels",
      "asset_type": "real_estate"
    },
    "format": "pdf",
    "sections": ["executive_summary", "score_breakdown", "checklist", "disclaimers"],
    "branding": { "company_name": "Ma Société" }
  }'`,
        language: "bash",
      },
      {
        heading: "Réponse PDF",
        paragraphs: [
          "Retourne `download_url` signé HMAC (24h) → GET /api/v1/dossier/pdf?token=…",
          "Lien wizard : `full_report_url` si le score référence un dossier AUROS complet.",
          "Indicatif uniquement — pas un avis juridique.",
        ],
      },
    ],
  },
  {
    slug: "endpoint-webhooks",
    title: "POST /api/v1/webhooks (Premium)",
    description: "Enregistrer des endpoints webhook signés HMAC pour alertes Protocol.",
    category: "endpoints",
    categoryLabel: "Endpoints",
    relatedSlugs: ["endpoint-monitor", "guide-monitor-mica"],
    sections: [
      {
        heading: "Enregistrer",
        paragraphs: [],
        code: `curl -X POST ${BASE}/api/v1/webhooks \\
  -H "Authorization: Bearer auros_pk_live_xxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://your.app/hooks/auros",
    "events": ["regulation_update", "new_requirement", "regulatory.update"]
  }'`,
        language: "bash",
      },
      {
        heading: "Signature",
        paragraphs: [
          "Chaque payload POST inclut `X-AUROS-Signature: sha256=<hmac>` signé avec `WEBHOOK_SECRET` (côté AUROS).",
          "GET /api/v1/webhooks — liste. DELETE /api/v1/webhooks/:id — suppression.",
          "Événement `regulatory.update` — voir /developers/docs/regulatory-feed.",
        ],
      },
      {
        heading: "Journal des livraisons",
        paragraphs: [
          "Chaque tentative est enregistrée — statuts : pending, delivered, failed, dead_letter (après 5 échecs).",
          "GET /api/v1/webhooks/:id/deliveries?limit=20&offset=0&status=dead_letter — log paginé.",
          "Retry automatique via cron /api/cron/protocol-monitor — backoff 1m, 5m, 15m, 1h, 4h.",
          "Dashboard premium : /developers/dashboard?key=… — 15 dernières livraisons.",
        ],
      },
      {
        heading: "Replay",
        paragraphs: [],
        code: `# Relancer une delivery
curl -X POST ${BASE}/api/v1/webhooks/deliveries/whd_abc123/replay \\
  -H "Authorization: Bearer auros_pk_live_xxx"

# Relancer toutes les dead_letter d'un webhook
curl -X POST ${BASE}/api/v1/webhooks/wh_abc123/replay \\
  -H "Authorization: Bearer auros_pk_live_xxx"`,
        language: "bash",
      },
      {
        heading: "Payload exemple",
        paragraphs: [],
        code: `{
  "event": "regulation_update",
  "severity": "high",
  "impact_on_score": -8,
  "monitor_id": "mon_abc123",
  "asset_type": "real_estate",
  "jurisdiction": "luxembourg",
  "summary": "MiCA CASP authorisation deadline reminder",
  "timestamp": "2026-06-11T12:00:00.000Z",
  "disclaimer": "Indicative intelligence only..."
}`,
        language: "json",
      },
    ],
  },
  {
    slug: "guide-monitor-mica",
    title: "Guide : surveiller les changements MiCA",
    description:
      "Automatiser la veille réglementaire ESMA/MiCA via monitors et webhooks AUROS Protocol.",
    category: "guides",
    categoryLabel: "Guides",
    relatedSlugs: ["endpoint-monitor", "endpoint-webhooks", "regulatory-feed"],
    sections: [
      {
        heading: "Architecture",
        paragraphs: [
          "1. Créez un monitor par actif/juridiction via POST /api/v1/monitor.",
          "2. Enregistrez un webhook global via POST /api/v1/webhooks (optionnel si webhook_url par monitor).",
          "3. Planifiez le cron AUROS (feed ESMA statique) — daily via Vercel Cron ou Trigger.dev.",
        ],
      },
      {
        heading: "Cron Vercel",
        paragraphs: [],
        code: `# vercel.json
{
  "crons": [{
    "path": "/api/cron/protocol-monitor",
    "schedule": "0 6 * * *"
  }]
}
# Header: Authorization: Bearer $CRON_SECRET`,
        language: "json",
      },
      {
        heading: "SDK",
        paragraphs: [],
        code: `const monitor = await client.monitor({
  asset_type: "bonds",
  jurisdiction: "luxembourg",
  alert_on: ["regulation_update", "deadline_approaching"],
});`,
        language: "typescript",
      },
    ],
  },
  {
    slug: "guide-institutional-reports",
    title: "Guide : rapports institutionnels",
    description:
      "Générer des PDF MiCA readiness pour comités investissement, data rooms et audits internes.",
    category: "guides",
    categoryLabel: "Guides",
    relatedSlugs: ["endpoint-dossier", "endpoint-score"],
    sections: [
      {
        heading: "Cas d'usage",
        paragraphs: [
          "Due diligence interne avant émission RWA tokenisée.",
          "Annexe indicatif au memo juridique (non substitut).",
          "Export JSON pour intégration BI/compliance dashboard.",
        ],
      },
      {
        heading: "Flux recommandé",
        paragraphs: [],
        code: `const score = await client.score({ description: "..." });
const dossier = await client.dossier({
  score: { description: "...", asset_type: "real_estate" },
  format: "pdf",
  sections: ["executive_summary", "score_breakdown", "checklist", "disclaimers"],
});
// Télécharger dossier.download_url dans les 24h`,
        language: "typescript",
      },
      {
        heading: "Sections disponibles",
        paragraphs: [
          "executive_summary, score_breakdown, mica_classification, checklist, jurisdictions, platforms, disclaimers",
        ],
      },
    ],
  },
];

export function getProtocolDoc(slug: string): ProtocolDocPage | undefined {
  return PROTOCOL_DOC_PAGES.find((p) => p.slug === slug);
}

export function getAllProtocolDocSlugs(): string[] {
  return PROTOCOL_DOC_PAGES.map((p) => p.slug);
}

export function getProtocolDocsByCategory(
  category: ProtocolDocPage["category"]
): ProtocolDocPage[] {
  return PROTOCOL_DOC_PAGES.filter((p) => p.category === category);
}
