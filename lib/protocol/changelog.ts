import { PROTOCOL_VERSION } from "./constants";

export const PROTOCOL_CHANGELOG_ROUTE = "/developers/changelog";

export type ChangelogEntryStatus = "released" | "upcoming";

export type ProtocolChangelogLink = {
  href: string;
  label: string;
};

export type ProtocolChangelogEntry = {
  id: string;
  date: string;
  title: string;
  summary: string;
  details?: string[];
  commit?: string;
  links?: ProtocolChangelogLink[];
  tags?: string[];
  status: ChangelogEntryStatus;
  roadmapItem?: number;
};

/** Single source for `/developers/changelog` and GET `/api/v1/changelog`. Newest first. */
export const PROTOCOL_CHANGELOG: ProtocolChangelogEntry[] = [
  {
    id: "chargeflow-cfu-f-sdk-fleets",
    date: "2026-07-19",
    title: "CFU-F flex + SDK ChargeFlow + tunnel fleets",
    summary:
      "POST /api/v1/chargeflow/f, méthodes SDK create/get/verify/retire, landing /green/chargeflow/fleets.",
    details: [
      "CFU-F : fenêtre kW + HMAC auros-cfu-f:v1: + Watt companion.",
      "SDK @adrien1212balitrand/auros-protocol — ChargeFlow E/W/F.",
      "Tunnel commercial flottes/CPO sans claim Tesla.",
    ],
    links: [
      { href: "/developers/docs/endpoint-chargeflow-f", label: "Docs CFU-F" },
      { href: "/green/chargeflow/fleets", label: "Tunnel fleets" },
    ],
    tags: ["chargeflow", "sdk", "premium"],
    status: "released",
  },
  {
    id: "chargeflow-v01-cfu-w",
    date: "2026-07-19",
    title: "ChargeFlow v0.1 — unicité, retirement & CFU-W",
    summary:
      "Anti double-count serveur, POST retire, OpenAPI ChargeFlow, et mint CFU-W (m³ + H₂O) sur la même table.",
    details: [
      "409 si unité active déjà présente pour (kind, clé, operator, external_ref).",
      "POST /api/v1/chargeflow/{id}/retire — status=retired sans re-signer le hash.",
      "POST /api/v1/chargeflow/w · UI /eau/chargeflow · HMAC auros-cfu-w:v1:.",
    ],
    links: [
      { href: "/developers/docs/endpoint-chargeflow", label: "Docs CFU-E" },
      { href: "/developers/docs/endpoint-chargeflow-w", label: "Docs CFU-W" },
      { href: "/auros-openapi.yaml", label: "OpenAPI" },
    ],
    tags: ["chargeflow", "green", "premium", "eau"],
    status: "released",
  },
  {
    id: "chargeflow-cfu-e-v0",
    date: "2026-07-19",
    title: "AUROS ChargeFlow CFU-E v0",
    summary:
      "POST /api/v1/chargeflow — enregistre une session kWh en CFU-E (hash + HMAC + Watt), verify public et page /chargeflow/{id}.",
    details: [
      "Standard public docs/CHARGEFLOW-STANDARD.md — off-chain only, pas de smart contract.",
      "Gate Protocol Premium (même SKU que attest). Demo sandbox : POST /api/v1/chargeflow/demo.",
      "UI pitch /green/chargeflow · docs developers endpoint-chargeflow.",
    ],
    links: [
      { href: "/developers/docs/endpoint-chargeflow", label: "Documentation ChargeFlow" },
      { href: "/green/chargeflow", label: "Pitch + demo" },
    ],
    tags: ["chargeflow", "green", "premium"],
    status: "released",
  },
  {
    id: "attest-api-v1",
    date: "2026-07-19",
    title: "Readiness Attestation API v1",
    summary:
      "POST /api/v1/attest — hash SHA-256 canonique + HMAC, vérification publique GET /api/v1/attest/verify et page /attest/{id}.",
    details: [
      "Snapshot sans branding ni PII (score, grade, MiCA, gaps, sections).",
      "Vérif par id ou hash+sig (stateless).",
      "Clé ATTEST_SIGNING_KEY (fallback GREEN_EXPORT_SIGNING_KEY / CRON_SECRET).",
    ],
    links: [
      { href: "/developers/docs/endpoint-attest", label: "Documentation attest" },
      { href: "/auros-openapi.yaml", label: "OpenAPI spec" },
    ],
    tags: ["endpoint", "premium", "attestation"],
    status: "released",
  },
  {
    id: "custom-scoring-weights",
    date: "2026-06-13",
    title: "Custom scoring weights & profiles",
    summary:
      "Pondérations personnalisables sur POST /api/v1/score et /score/batch — profils real_estate_fund et credit_fund (premium).",
    details: [
      "Champs optionnels `profile` et `weights` (5 dimensions, somme 100 %).",
      "Réponse inclut meta.weights_applied, weights_source, weights_normalized.",
      "Clé demo / free : poids par défaut uniquement — custom → 403 premium_required.",
    ],
    links: [{ href: "/developers/docs/endpoint-score", label: "Documentation score" }],
    tags: ["endpoint", "premium", "scoring"],
    status: "released",
    roadmapItem: 14,
  },
  {
    id: "dossier-white-label",
    date: "2026-06-13",
    title: "White-label PDF dossier",
    summary:
      "Branding client sur les dossiers premium — logo HTTPS, couleur primaire, masquage AUROS.",
    details: [
      "POST /api/v1/dossier — branding.company_name, logo_url, primary_color, hide_auros_branding.",
      "PDF généré avec en-tête client et footer « Powered by AUROS » optionnel.",
    ],
    links: [{ href: "/developers/docs/endpoint-dossier", label: "Documentation dossier" }],
    tags: ["premium", "pdf", "branding"],
    status: "released",
    roadmapItem: 13,
  },
  {
    id: "benchmarks-endpoint",
    date: "2026-06-13",
    title: "GET /api/v1/benchmarks",
    summary:
      "Benchmarks sectoriels RWA — médiane APY, quartiles P25/P75 et nombre de produits par catégorie, avec repli statique curaté si le hub live est sparse.",
    details: [
      "GET /api/v1/benchmarks — auth Bearer, paramètre requis `category` (bonds|stablecoins|real_estate|private_credit|commodities).",
      "Filtre optionnel `jurisdiction` (match partiel, ex. EU, US, Luxembourg).",
      "Métriques calculées depuis le hub `/compare` ; fallback statique si < 3 produits avec rendement positif.",
      "Réponse : median_apy, p25_apy, p75_apy, product_count, as_of + disclaimer standard.",
    ],
    links: [
      { href: "/developers/docs/endpoint-benchmarks", label: "Documentation benchmarks" },
      { href: "/auros-openapi.yaml", label: "OpenAPI spec" },
    ],
    tags: ["endpoint", "catalog", "market-data"],
    status: "released",
    roadmapItem: 12,
  },
  {
    id: "mcp-server",
    date: "2026-06-13",
    title: "MCP server for AUROS Protocol",
    summary:
      "Package @adrien1212balitrand/auros-mcp — 8 outils MCP (score, products, compare, …) pour Cursor et Claude Desktop.",
    details: [
      "Tools : score, score_batch, products, jurisdictions, checklist, compare, regulatory_feed, status.",
      "Auth via env AUROS_API_KEY (clé démo auros_pk_test_demo par défaut).",
      "Thin wrapper sur https://getauros.com/api/v1/* — aucune route HTTP nouvelle.",
      "Config Cursor/Claude Desktop documentée — npx @adrien1212balitrand/auros-mcp.",
    ],
    links: [
      { href: "/developers/docs/mcp-server", label: "Documentation MCP server" },
      { href: "/developers", label: "Portail développeurs" },
    ],
    tags: ["mcp", "tooling", "sdk"],
    status: "released",
    roadmapItem: 11,
  },
  {
    id: "webhook-replay-dlq",
    date: "2026-06-13",
    title: "Webhook replay, dead letter queue & delivery logs",
    summary:
      "Journal des livraisons webhook, retry exponentiel (5 tentatives), dead letter et endpoints replay — visible sur le dashboard développeurs.",
    details: [
      "Table protocol_webhook_deliveries — statuts pending, delivered, failed, dead_letter.",
      "GET /api/v1/webhooks/:id/deliveries — liste paginée des tentatives.",
      "POST /api/v1/webhooks/:id/replay et POST /api/v1/webhooks/deliveries/:delivery_id/replay — relance manuelle (premium).",
      "Cron /api/cron/protocol-monitor étendu — retry automatique avec backoff 1m → 4h.",
      "Section Webhook deliveries sur /developers/dashboard (tier premium).",
    ],
    links: [
      { href: "/developers/docs/endpoint-webhooks", label: "Documentation webhooks" },
      { href: "/auros-openapi.yaml", label: "OpenAPI spec" },
    ],
    tags: ["endpoint", "webhooks", "observability"],
    status: "released",
    roadmapItem: 9,
  },
  {
    id: "regulatory-feed-endpoint",
    date: "2026-06-13",
    title: "GET /api/v1/regulatory/feed",
    summary:
      "Feed réglementaire curaté ESMA/AMF/BaFin — 18 références MiCA, webhook `regulatory.update`, abonnements par juridiction.",
    details: [
      "GET /api/v1/regulatory/feed — premium, filtres jurisdiction/tag/since/limit.",
      "POST /api/v1/regulatory/subscribe — alertes feed par juridiction + tags mica/esma/amf/bafin.",
      "Webhook `regulatory.update` — cron /api/cron/protocol-monitor ou trigger manuel.",
      "v1 = feed statique curaté ; v2 = polling live ESMA/AMF/BaFin.",
    ],
    links: [
      { href: "/developers/docs/regulatory-feed", label: "Documentation feed réglementaire" },
      { href: "/auros-openapi.yaml", label: "OpenAPI spec" },
    ],
    tags: ["endpoint", "premium", "regulatory"],
    status: "released",
    roadmapItem: 10,
  },
  {
    id: "batch-score-endpoint",
    date: "2026-06-12",
    title: "POST /api/v1/score/batch",
    summary:
      "Score jusqu'à 20 actifs en un appel — succès partiel par item, quota 1 unité par batch (pas par item).",
    details: [
      "Corps : `{ \"items\": [ { description | champs structurés }, … ], \"record_history\"?: boolean }`.",
      "Chaque item retourne `score_id` + résultat complet ou `{ ok: false, error }` sans faire échouer le batch.",
      "SDK TypeScript/Python : `client.scoreBatch()` / `score_batch()`.",
      "Compte comme 1 requête quota mensuel (100/mois free tier) — documenté OpenAPI et docs auth.",
    ],
    links: [
      { href: "/developers/docs/endpoint-score-batch", label: "Documentation endpoint" },
      { href: "/auros-openapi.yaml", label: "OpenAPI spec" },
    ],
    tags: ["endpoint", "sdk", "institutional"],
    status: "released",
    roadmapItem: 8,
  },
  {
    id: "python-sdk-pypi",
    date: "2026-06-12",
    title: "Python SDK on PyPI",
    summary:
      "Package `auros-protocol` v1.0.0 publié sur PyPI — client httpx typé pour score, products, jurisdictions, checklist, compare et status.",
    details: [
      "Installation : pip install auros-protocol.",
      "Méthodes miroir du SDK TypeScript pour les endpoints publics v1.",
      "Clé démo auros_pk_test_demo documentée dans le README PyPI.",
    ],
    links: [
      { href: "https://pypi.org/project/auros-protocol/", label: "PyPI auros-protocol" },
      { href: "/developers", label: "Portail développeurs" },
    ],
    tags: ["sdk", "python"],
    status: "released",
    roadmapItem: 6,
  },
  {
    id: "rate-limit-headers",
    date: "2026-06-12",
    title: "Rate limit response headers",
    summary:
      "Headers X-RateLimit-Limit, X-RateLimit-Remaining et X-RateLimit-Reset sur toutes les réponses /api/v1/* authentifiées et routes limitées par IP.",
    details: [
      "Visibilité quota mensuel par clé (100 req/mois free, 50 demo) sans parser le corps 429.",
      "Burst IP (30/min) et création de clé (5/h/IP) exposent les mêmes headers avec fenêtre glissante.",
      "X-RateLimit-Reset : timestamp Unix — début du mois UTC suivant pour le quota clé.",
    ],
    links: [{ href: "/developers/docs/authentication", label: "Docs authentification" }],
    tags: ["headers", "rate-limit"],
    status: "released",
    roadmapItem: 5,
  },
  {
    id: "compare-endpoint",
    date: "2026-06-12",
    title: "POST /api/v1/compare",
    summary:
      "Comparaison side-by-side de 2–4 produits RWA — par IDs explicites ou filtres (category, yield, risk tier, jurisdiction).",
    details: [
      "Réponse avec comparison.highlights (best/worst par métrique, logique /compare).",
      "SDK TypeScript/Python : client.compare().",
      "Auth Bearer requise ; headers protocol standard sur chaque réponse.",
    ],
    commit: "92c5411",
    links: [
      { href: "/developers/docs/endpoint-compare", label: "Documentation endpoint" },
      { href: "/compare", label: "Comparateur web" },
    ],
    tags: ["endpoint", "sdk"],
    status: "released",
    roadmapItem: 3,
  },
  {
    id: "postman-collection",
    date: "2026-06-12",
    title: "Postman collection v2.1",
    summary:
      "Collection Postman publique couvrant tous les endpoints AUROS Protocol v1 — import direct, variables baseUrl et apiKey.",
    details: [
      "Fichier statique /auros-postman.json (sans auth).",
      "Exemples score, products, compare, jurisdictions, checklist, keys et endpoints premium.",
    ],
    commit: "0244f1d",
    links: [{ href: "/auros-postman.json", label: "Télécharger la collection" }],
    tags: ["docs", "tooling"],
    status: "released",
    roadmapItem: 2,
  },
  {
    id: "status-page",
    date: "2026-06-12",
    title: "Status page & X-Response-Time",
    summary:
      "Page statut publique /status et endpoint JSON GET /api/v1/status — probes scoring, catalogue, juridictions et stockage clés.",
    details: [
      "Header X-Response-Time sur toutes les routes /api/v1/* (via protocolRoute).",
      "Payload JSON : services, version protocol, commit déployé, timestamp.",
    ],
    commit: "1484a48",
    links: [
      { href: "/status", label: "Page statut" },
      { href: "/api/v1/status", label: "JSON /api/v1/status" },
    ],
    tags: ["observability", "endpoint"],
    status: "released",
    roadmapItem: 1,
  },
  {
    id: "logo-branding",
    date: "2026-06-12",
    title: "X-AUROS-Logo response header",
    summary:
      "Header X-AUROS-Logo: https://getauros.com/auros-logo.svg sur toutes les réponses API v1, OpenAPI x-logo et docs auth.",
    details: [
      "Complète X-AUROS-Protocol-Version sur chaque réponse protocolJson.",
      "Référence publique pour intégrateurs et attributions UI.",
    ],
    commit: "95534b1",
    links: [{ href: "/developers/docs/authentication", label: "Docs authentification" }],
    tags: ["branding", "headers"],
    status: "released",
    roadmapItem: 4,
  },
];

export function getReleasedChangelogEntries(): ProtocolChangelogEntry[] {
  return PROTOCOL_CHANGELOG.filter((e) => e.status === "released");
}

export function getUpcomingChangelogEntries(): ProtocolChangelogEntry[] {
  return PROTOCOL_CHANGELOG.filter((e) => e.status === "upcoming");
}

export type ProtocolChangelogPayload = {
  version: string;
  generated_at: string;
  page_url: string;
  entries: ProtocolChangelogEntry[];
  upcoming: ProtocolChangelogEntry[];
};

export function getProtocolChangelogPayload(): ProtocolChangelogPayload {
  return {
    version: PROTOCOL_VERSION,
    generated_at: new Date().toISOString(),
    page_url: PROTOCOL_CHANGELOG_ROUTE,
    entries: getReleasedChangelogEntries(),
    upcoming: getUpcomingChangelogEntries(),
  };
}
