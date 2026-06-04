import { absoluteUrl } from "@/lib/comparators/site";

import { buildComparatorPages } from "./comparator-pages";
import { academyPages } from "./academy-pages";
import { greenPages } from "./green-pages";
import {
  dashboardPage,
  dossierPage,
  homePage,
  wizardPage,
} from "./core-pages";
import {
  jurisdictionsPage,
  starterKitPage,
} from "./jurisdictions-pages";
import { miscPages } from "./misc-pages";
import { buildSeoLandingPages } from "./seo-landing-pages";
import { contentPages } from "./content-pages";
import { AUROS_ORG } from "../org";
import { catalogVersion } from "../enrich";
import type { AiFirstCatalog, AiFirstPage } from "../types";

let cachedPages: AiFirstPage[] | null = null;

export function getAllAiFirstPages(): AiFirstPage[] {
  if (cachedPages) return cachedPages;
  cachedPages = [
    homePage,
    wizardPage,
    dossierPage,
    dashboardPage,
    jurisdictionsPage,
    starterKitPage,
    ...buildComparatorPages(),
    ...buildSeoLandingPages(),
    ...academyPages,
    ...greenPages,
    ...contentPages,
    ...miscPages,
  ];
  return cachedPages;
}

export function getAiFirstPageByPath(path: string): AiFirstPage | null {
  const normalized = path === "" ? "/" : path.startsWith("/") ? path : `/${path}`;
  const withoutTrailing = normalized.replace(/\/$/, "") || "/";
  return (
    getAllAiFirstPages().find(
      (p) => p.path === withoutTrailing || p.path === normalized
    ) ?? null
  );
}

export function getAiFirstPageById(id: string): AiFirstPage | null {
  return getAllAiFirstPages().find((p) => p.id === id) ?? null;
}

export function getIndexablePages(): AiFirstPage[] {
  return getAllAiFirstPages().filter((p) => p.indexable);
}

export function buildAiFirstCatalog(): AiFirstCatalog {
  const pages = getAllAiFirstPages();
  return {
    version: catalogVersion(),
    generatedAt: new Date().toISOString(),
    site: {
      name: AUROS_ORG.name,
      url: AUROS_ORG.url,
      description: AUROS_ORG.description,
      organization: {
        name: AUROS_ORG.name,
        url: AUROS_ORG.url,
        logo: AUROS_ORG.logo,
        sameAs: [...AUROS_ORG.sameAs],
      },
    },
    discovery: {
      llmsTxt: absoluteUrl("/llms.txt"),
      llmsFullTxt: absoluteUrl("/llms-full.txt"),
      catalogIndex: absoluteUrl("/ai-first/index.json"),
      ragSearch: absoluteUrl("/ai-first/rag"),
      sitemap: absoluteUrl("/sitemap.xml"),
    },
    pages: pages.map((p) => ({
      id: p.id,
      path: p.path,
      title: p.title,
      description: p.description,
      summary: p.summary,
      contentType: p.contentType,
      language: p.language,
      indexable: p.indexable,
      lastUpdated: p.lastUpdated,
      keywords: p.keywords,
      intents: p.intents,
      audience: p.audience,
      facts: p.facts,
      faq: p.faq,
      offers: p.offers,
      relatedPaths: p.relatedPaths,
      liveDataUrl: p.liveDataUrl,
      canonicalUrl: p.canonicalUrl,
      machineUrl: p.machineUrl,
    })),
  };
}
