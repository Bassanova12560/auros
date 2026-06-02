import { absoluteUrl, SITE_URL } from "@/lib/comparators/site";
import { AUROS_ORG } from "./org";

export function buildHumansTxt(): string {
  return [
    "/* TEAM */",
    `Contact: ${AUROS_ORG.contactEmail}`,
    "Founder: Adrien Balitrand",
    "Product: AUROS — plateforme B2B tokenisation RWA",
    "Expertise: comparateur juridictions, admission actif, Starter Kit phase 0, AUROS Academy",
    "Languages: fr, en, es",
    "",
    "/* SITE */",
    `URL: ${AUROS_ORG.url}`,
    `Sitemap: ${absoluteUrl("/sitemap.xml")}`,
    `LLMs: ${absoluteUrl("/llms.txt")}`,
    `AI catalog: ${absoluteUrl("/ai-first/index.json")}`,
    `RAG: ${absoluteUrl("/ai-first/rag")}`,
    "",
    "/* DISCLAIMER */",
    "Analyses indicatives — validation counsel requise avant émission.",
    "",
  ].join("\n");
}

export const INDEXNOW_KEY =
  process.env.INDEXNOW_KEY?.trim() || "auros7idx2026";

export function indexNowKeyLocation(): string {
  return `${SITE_URL}/${INDEXNOW_KEY}.txt`;
}

export function seoSubmissionTargets() {
  const sitemap = absoluteUrl("/sitemap.xml");
  return {
    sitemap,
    googleSearchConsole: `https://search.google.com/search-console/sitemaps?resource_id=${encodeURIComponent(SITE_URL)}`,
    bingWebmaster: "https://www.bing.com/webmasters/sitemaps",
    indexNowEndpoint: "https://api.indexnow.org/indexnow",
    indexNowKey: INDEXNOW_KEY,
    indexNowKeyLocation: indexNowKeyLocation(),
  };
}
