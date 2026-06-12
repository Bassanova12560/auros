import { enrichPage } from "../enrich";
import type { AiFirstPage } from "../types";
import { PROTOCOL_CHANGELOG_ROUTE } from "@/lib/protocol/changelog";
import {
  PROTOCOL_DOC_PAGES,
  PROTOCOL_DOCS_ROUTE,
  protocolDocPath,
} from "@/lib/protocol/docs";

export const protocolDocsIndexPage = enrichPage({
  id: "developers-docs",
  path: PROTOCOL_DOCS_ROUTE,
  title: "Documentation AUROS Protocol API | Référence v1",
  description:
    "Documentation API AUROS Protocol : quickstart, authentification Bearer, endpoints score/products/jurisdictions/checklist/keys et guides d'intégration.",
  summary:
    "Hub documentation développeurs AUROS Protocol v1 — démarrage rapide, auth, 5 endpoints REST, 3 guides (immobilier, dashboard compliance, onboarding).",
  contentType: "guide",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-06-11",
  keywords: [
    "documentation AUROS Protocol",
    "API RWA référence",
    "MiCA API docs",
    "intégration tokenisation",
  ],
  intents: [
    "Comment utiliser l'API AUROS Protocol",
    "Documentation endpoint score MiCA",
    "Authentification clé API AUROS",
  ],
  audience: ["développeurs", "fintech", "intégrateurs"],
  facts: [
    { key: "Endpoints", value: "5 (score, products, jurisdictions, checklist, keys)" },
    { key: "SDK", value: "@adrien1212balitrand/auros-protocol · auros-protocol (Python)" },
    { key: "OpenAPI", value: "/auros-openapi.yaml" },
    { key: "Postman", value: "/auros-postman.json" },
  ],
  relatedPaths: ["/developers", PROTOCOL_CHANGELOG_ROUTE, "/tools/mica-checker", "/compare"],
});

export const protocolChangelogPage = enrichPage({
  id: "developers-changelog",
  path: PROTOCOL_CHANGELOG_ROUTE,
  title: "AUROS Protocol API Changelog | Releases v1",
  description:
    "Changelog public AUROS Protocol v1 — status page, Postman, compare endpoint, headers branding ; feed JSON /api/v1/changelog.",
  summary:
    "Historique releases API AUROS Protocol — roadmap items 1–4 publiés, item 5 rate limit headers à venir.",
  contentType: "guide",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-06-12",
  keywords: [
    "AUROS Protocol changelog",
    "API releases",
    "RWA API updates",
  ],
  intents: [
    "Quelles nouveautés AUROS Protocol API",
    "Changelog endpoint compare",
  ],
  audience: ["développeurs", "fintech", "intégrateurs"],
  facts: [
    { key: "JSON feed", value: "/api/v1/changelog" },
    { key: "Dernière release", value: "POST /api/v1/compare" },
  ],
  breadcrumbs: [
    { name: "Développeurs", path: "/developers" },
    { name: "Changelog", path: PROTOCOL_CHANGELOG_ROUTE },
  ],
  relatedPaths: ["/developers", PROTOCOL_DOCS_ROUTE, "/status", "/api/v1/changelog"],
});

export function buildProtocolDocCatalogPages(): AiFirstPage[] {
  return PROTOCOL_DOC_PAGES.map((doc) =>
    enrichPage({
      id: `protocol-doc-${doc.slug}`,
      path: protocolDocPath(doc.slug),
      title: `${doc.title} | AUROS Protocol API`,
      description: doc.description,
      summary: doc.description,
      contentType: "guide",
      language: "multi",
      indexable: true,
      lastUpdated: "2026-06-11",
      keywords: [doc.title, "AUROS Protocol", doc.category, doc.slug],
      intents: [doc.title],
      audience: ["développeurs", "fintech"],
      facts: [{ key: "Catégorie", value: doc.categoryLabel }],
      breadcrumbs: [
        { name: "Développeurs", path: "/developers" },
        { name: "Documentation", path: PROTOCOL_DOCS_ROUTE },
      ],
      relatedPaths: [
        PROTOCOL_DOCS_ROUTE,
        "/developers",
        ...doc.relatedSlugs.map((s) => protocolDocPath(s)),
      ],
    })
  );
}

export const protocolDocsPages: AiFirstPage[] = [
  protocolDocsIndexPage,
  protocolChangelogPage,
  ...buildProtocolDocCatalogPages(),
];
