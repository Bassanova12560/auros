import { enrichPage } from "../enrich";
import {
  CATEGORY_GUIDES,
} from "@/lib/seo/category-guides";
import {
  CATEGORY_INTENTS,
  GUIDES_INTENTS_ROUTE,
  GUIDES_ROUTE,
} from "@/lib/seo/category-intents";

export const guidesHubPage = enrichPage({
  id: "guides-hub",
  path: GUIDES_ROUTE,
  title: "Guides AUROS | Définitions de catégories RWA",
  description:
    "Trois catégories que AUROS définit : booking engine des watts, CFU ChargeFlow, RWA Intelligence Layer et RTMS Green — plus 30 intents citables.",
  summary:
    "Hub ownership de catégorie AUROS — définitions canoniques pour Google et recherche IA, liées aux hubs produit Watts, Protocol et Green.",
  contentType: "guide",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-07-20",
  keywords: [
    "guides AUROS",
    "booking engine watts",
    "CFU ChargeFlow",
    "RWA intelligence layer",
    "RTMS définition",
  ],
  intents: [
    "Définition booking engine watts",
    "Qu'est-ce qu'une CFU",
    "RWA intelligence layer AUROS",
  ],
  audience: ["émetteurs", "CPO", "développeurs", "IA crawlers", "presse"],
  facts: [
    { key: "Intents", value: `${CATEGORY_INTENTS.length} questions` },
    { key: "Définitions", value: CATEGORY_GUIDES.map((g) => g.path).join(" · ") },
    { key: "Machine", value: "/llms.txt · /ai-first/index.json" },
  ],
  faq: CATEGORY_GUIDES.flatMap((g) => g.faq).slice(0, 6),
  breadcrumbs: [],
  relatedPaths: [
    GUIDES_INTENTS_ROUTE,
    ...CATEGORY_GUIDES.map((g) => g.path),
    "/green/watts",
    "/developers",
    "/green",
    "/ressources",
  ],
});

export const guidesIntentsPage = enrichPage({
  id: "guides-intents",
  path: GUIDES_INTENTS_ROUTE,
  title: "30 intents AUROS | Questions auxquelles nous devons être la réponse",
  description:
    "30 questions métier Watts, Protocol et Green — réponses courtes citables + lien outil. Pour Search Console, Copilot et agents IA.",
  summary:
    "Cartographie d'intents catégorie AUROS — 10 Watts/ChargeFlow, 10 RWA Intelligence, 10 Green RTMS. Chaque réponse pointe vers une page canonique et un outil.",
  contentType: "guide",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-07-20",
  keywords: [
    "FAQ AUROS intents",
    "questions tokenisation RWA",
    "réserver watts FAQ",
    "RTMS questions",
  ],
  intents: CATEGORY_INTENTS.map((i) => i.question),
  audience: ["émetteurs", "CPO", "ESG", "développeurs", "IA crawlers"],
  facts: [
    { key: "Count", value: String(CATEGORY_INTENTS.length) },
    { key: "Pillars", value: "watts · protocol · green" },
  ],
  faq: CATEGORY_INTENTS.map((i) => ({
    question: i.question,
    answer: `${i.answer} Outil : ${i.toolHref}. Canonique : ${i.canonicalPath}.`,
  })),
  breadcrumbs: [{ name: "Guides", path: GUIDES_ROUTE }],
  relatedPaths: [
    GUIDES_ROUTE,
    ...CATEGORY_GUIDES.map((g) => g.path),
    "/faq",
    "/green/faq",
    "/copilot",
  ],
});

export function buildCategoryGuideCatalogPages() {
  return CATEGORY_GUIDES.map((guide) =>
    enrichPage({
      id: `guide-${guide.slug}`,
      path: guide.path,
      title: guide.title,
      description: guide.description,
      summary: guide.intro,
      contentType: "guide",
      language: "multi",
      indexable: true,
      lastUpdated: "2026-07-20",
      keywords: guide.keywords,
      intents: [guide.title, ...guide.faq.map((f) => f.question)],
      audience: ["émetteurs", "presse", "IA crawlers", "partenaires"],
      facts: guide.sections.map((s) => ({
        key: s.heading,
        value: s.paragraphs[0]?.slice(0, 160) ?? "",
      })),
      faq: guide.faq,
      breadcrumbs: [{ name: "Guides", path: GUIDES_ROUTE }],
      relatedPaths: [
        GUIDES_ROUTE,
        GUIDES_INTENTS_ROUTE,
        guide.cta.href,
        ...CATEGORY_GUIDES.filter((g) => g.slug !== guide.slug).map((g) => g.path),
      ],
    })
  );
}

export const categoryGuidePages = [
  guidesHubPage,
  guidesIntentsPage,
  ...buildCategoryGuideCatalogPages(),
];
