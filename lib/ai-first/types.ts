export type AiFirstContentType =
  | "home"
  | "tool"
  | "comparator"
  | "guide"
  | "product"
  | "landing"
  | "legal"
  | "app"
  | "academy";

export type AiFirstFact = {
  key: string;
  value: string;
};

export type AiFirstFaq = {
  question: string;
  answer: string;
};

export type AiFirstOffer = {
  name: string;
  price: string;
  priceCurrency: string;
  description: string;
  url: string;
};

/** Machine-readable page record — source of truth for AI crawlers & JSON-LD. */
export type AiFirstPage = {
  id: string;
  path: string;
  title: string;
  description: string;
  /** 2–4 sentences — optimized for LLM citation. */
  summary: string;
  contentType: AiFirstContentType;
  language: "fr" | "en" | "multi";
  indexable: boolean;
  lastUpdated: string;
  keywords: string[];
  /** User intents / questions this page answers. */
  intents: string[];
  audience: string[];
  facts: AiFirstFact[];
  faq?: AiFirstFaq[];
  offers?: AiFirstOffer[];
  relatedPaths: string[];
  /** Optional live-data endpoint (comparators). */
  liveDataUrl?: string;
  /** Human HTML canonical page. */
  canonicalUrl: string;
  /** Machine-readable JSON for this page. */
  machineUrl: string;
};

export type AiFirstCatalog = {
  version: string;
  generatedAt: string;
  site: {
    name: string;
    url: string;
    description: string;
    organization: {
      name: string;
      url: string;
      logo: string;
      sameAs: string[];
    };
  };
  discovery: {
    llmsTxt: string;
    llmsFullTxt: string;
    catalogIndex: string;
    ragSearch: string;
    sitemap: string;
  };
  pages: AiFirstPage[];
};

export type AiFirstPageExport = Omit<
  AiFirstPage,
  "canonicalUrl" | "machineUrl"
> & {
  canonicalUrl: string;
  machineUrl: string;
  jsonLd: Record<string, unknown>[];
};
