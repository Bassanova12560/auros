import type { MetadataRoute } from "next";

import { getIndexablePages } from "@/lib/ai-first";
import { SITE_URL } from "@/lib/comparators/site";

const PRIORITY: Record<string, number> = {
  "/": 1,
  "/green": 0.92,
  "/green/market": 0.91,
  "/green/register": 0.87,
  "/green/compare": 0.88,
  "/green/standards": 0.86,
  "/green/label": 0.85,
  "/green/praticien": 0.84,
  "/jurisdictions": 0.9,
  "/jurisdictions/starter-kit": 0.85,
  "/compare": 0.9,
  "/stablecoins": 0.95,
  "/real-estate": 0.95,
  "/bonds": 0.95,
  "/commodities": 0.95,
  "/private-credit": 0.95,
  "/wizard": 0.8,
  "/partners": 0.6,
};

const FREQUENCY: Record<string, MetadataRoute.Sitemap[number]["changeFrequency"]> = {
  "/compare": "hourly",
  "/stablecoins": "hourly",
  "/real-estate": "hourly",
  "/bonds": "hourly",
  "/commodities": "hourly",
  "/private-credit": "hourly",
  "/jurisdictions": "weekly",
  "/": "weekly",
};

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = getIndexablePages();

  return pages.map((page) => ({
    url: `${SITE_URL}${page.path === "/" ? "" : page.path}`,
    lastModified: now,
    changeFrequency:
      FREQUENCY[page.path] ??
      (page.contentType === "landing" ? "monthly" : "weekly"),
    priority: PRIORITY[page.path] ?? (page.contentType === "landing" ? 0.75 : 0.7),
  }));
}
