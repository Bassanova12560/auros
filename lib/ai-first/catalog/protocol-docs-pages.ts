import { enrichPage } from "../enrich";
import type { AiFirstPage } from "../types";
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
    { key: "SDK", value: "@auros/protocol · auros-protocol (Python)" },
    { key: "OpenAPI", value: "/auros-openapi.yaml" },
  ],
  relatedPaths: ["/developers", "/tools/mica-checker", "/compare"],
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
  ...buildProtocolDocCatalogPages(),
];
