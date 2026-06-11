import { enrichPage } from "../enrich";
import type { AiFirstPage } from "../types";
import {
  GLOSSARY_ROUTE,
  GLOSSARY_TERMS,
  getDefaultTermFaq,
  glossaryTermPath,
} from "@/lib/glossary";

export const glossaryIndexPage = enrichPage({
  id: "glossary",
  path: GLOSSARY_ROUTE,
  title: "Glossaire RWA | Définitions tokenisation & MiCA",
  description:
    "Glossaire éducatif AUROS : 80+ termes RWA, MiCA, ERC-3643, SPV, ESG et marchés — définitions claires pour émetteurs et investisseurs.",
  summary:
    "Index glossaire AUROS — termes tokenisation actifs réels, régulation européenne MiCA, standards techniques, structures juridiques, marchés et finance verte. Contenu indicatif, counsel requis avant émission.",
  contentType: "guide",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-06-11",
  keywords: [
    "glossaire RWA",
    "définition tokenisation",
    "lexique MiCA",
    "ERC-3643 définition",
    "vocabulaire actifs réels",
  ],
  intents: [
    "Qu'est-ce qu'un RWA ?",
    "Définition MiCA",
    "Comprendre ERC-3643",
    "Lexique tokenisation immobilier",
  ],
  audience: ["émetteurs", "investisseurs", "consultants", "juristes"],
  facts: [
    { key: "Termes", value: `${GLOSSARY_TERMS.length} définitions indexables` },
    { key: "Catégories", value: "MiCA · Standards · Structures · Marchés · Green/ESG" },
    { key: "Outils liés", value: "MiCA checker · Yield calculator · Jurisdiction picker · Cost estimator" },
  ],
  relatedPaths: [
    "/ressources",
    "/tools",
    "/wizard",
    "/compare",
  ],
});

export function buildGlossaryCatalogPages(): AiFirstPage[] {
  return GLOSSARY_TERMS.map((term) => {
    const path = glossaryTermPath(term.slug);
    const faq = getDefaultTermFaq(term);
    return enrichPage({
      id: `glossary-${term.slug}`,
      path,
      title: `${term.title} — Définition | Glossaire RWA AUROS`,
      description: `${term.shortDefinition} Guide éducatif AUROS — tokenisation et conformité indicatives.`,
      summary: `${term.shortDefinition} ${term.extended}`,
      contentType: "guide",
      language: "multi",
      indexable: true,
      lastUpdated: "2026-06-11",
      keywords: [term.title, "définition RWA", "glossaire tokenisation", term.slug],
      intents: [`Qu'est-ce que ${term.title} ?`, `Définition ${term.title} RWA`],
      audience: ["émetteurs", "investisseurs", "analystes"],
      facts: [
        { key: "Catégorie", value: term.category },
        ...(term.relatedTerms.length > 0
          ? [{ key: "Termes liés", value: term.relatedTerms.slice(0, 4).join(", ") }]
          : []),
      ],
      faq,
      breadcrumbs: [
        { name: "Ressources", path: "/ressources" },
        { name: "Glossaire", path: GLOSSARY_ROUTE },
      ],
      relatedPaths: [
        GLOSSARY_ROUTE,
        "/ressources",
        ...term.internalLinks.map((l) => l.href),
        ...term.relatedTerms.slice(0, 3).map((s) => glossaryTermPath(s)),
      ],
    });
  });
}

export const glossaryPages: AiFirstPage[] = [
  glossaryIndexPage,
  ...buildGlossaryCatalogPages(),
];
