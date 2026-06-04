import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/comparators/site";

export default function robots(): MetadataRoute.Robots {
  const aiBots = [
    "GPTBot",
    "ChatGPT-User",
    "OAI-SearchBot",
    "ClaudeBot",
    "Claude-Web",
    "PerplexityBot",
    "Google-Extended",
  ] as const;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/starter/", "/api/dev/"],
      },
      ...aiBots.map((userAgent) => ({
        userAgent,
        allow: ["/", "/llms.txt", "/llms-full.txt", "/humans.txt", "/about", "/academy", "/ai-first/", "/jurisdictions", "/green", "/faq", "/ressources", "/how-it-works", "/discover", "/trust"],
        disallow: ["/starter/", "/api/dev/"],
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
