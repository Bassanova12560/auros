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
