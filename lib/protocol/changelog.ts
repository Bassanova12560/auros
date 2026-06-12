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
  {
    id: "rate-limit-headers",
    date: "2026-06-12",
    title: "Rate limit response headers (à venir)",
    summary:
      "Headers X-RateLimit-Remaining, X-RateLimit-Limit et X-RateLimit-Reset sur toutes les routes /api/v1/*.",
    details: [
      "Visibilité quota mensuel par clé et burst IP sans parser le corps 429.",
      "Cohérent avec le tier gratuit 100 req/mois et limites keys/monitor.",
    ],
    tags: ["headers", "rate-limit"],
    status: "upcoming",
    roadmapItem: 5,
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
