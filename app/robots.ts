import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/comparators/site";

/** Bots IA / search-augmented — allow discovery surfaces for citation GEO. */
const AI_BOTS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "Claude-Web",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "GoogleOther",
  "Applebot-Extended",
  "Amazonbot",
  "Bytespider",
  "CCBot",
  "cohere-ai",
  "Meta-ExternalAgent",
  "Meta-ExternalFetcher",
  "MistralAI-User",
  "DuckAssistBot",
  "YouBot",
] as const;

const AI_ALLOW = [
  "/",
  "/llms.txt",
  "/llms-full.txt",
  "/ai.txt",
  "/humans.txt",
  "/about",
  "/academy",
  "/ai-first/",
  "/jurisdictions",
  "/pricing",
  "/green",
  "/green/assistant",
  "/green/watts",
  "/green/chargeflow",
  "/green/faq",
  "/green/blog",
  "/green/market",
  "/green/standards",
  "/eau",
  "/h2o-rwa",
  "/resilience",
  "/compass",
  "/eau/trust",
  "/eau/risk",
  "/eau/continuity",
  "/demos/data-center-100mw",
  "/faq",
  "/ressources",
  "/how-it-works",
  "/discover",
  "/trust",
  "/security",
  "/copilot",
  "/compare",
  "/tools",
  "/data/",
  "/glossary",
  "/blog",
  "/developers",
  "/developers/docs",
  "/developers/changelog",
  "/auros-openapi.yaml",
  "/status",
] as const;

const AI_DISALLOW = [
  "/starter/",
  "/api/",
  "/ops/",
  "/dashboard/",
  "/green/admin/",
  "/green/my/",
  "/developers/dashboard/",
  "/partners/dashboard/",
  "/platforms/dashboard/",
  "/sign-in",
  "/sign-up",
] as const;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [...AI_DISALLOW],
      },
      ...AI_BOTS.map((userAgent) => ({
        userAgent,
        allow: [...AI_ALLOW],
        disallow: [...AI_DISALLOW],
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
