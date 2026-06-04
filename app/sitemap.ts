import type { MetadataRoute } from "next";

import { getIndexablePages } from "@/lib/ai-first";
import { getAllGreenBlogSlugs, greenBlogArticlePath } from "@/lib/green/blog/articles";
import { SITE_URL } from "@/lib/comparators/site";
import { listGreenMarketActorSitemapIds, listGreenMarketOfferSitemapIds } from "@/lib/green/market/green-market-db";
import { greenMarketActorPath } from "@/lib/green/market/actor-routes";
import { greenMarketOfferPath } from "@/lib/green/market/offer-routes";
import { listGreenRegistryProjectSitemapIds } from "@/lib/green/green-registry";
import { greenRegistryProjectPath } from "@/lib/green/registry-routes";

const PRIORITY: Record<string, number> = {
  "/": 1,
  "/green": 0.92,
  "/green/market": 0.91,
  "/green/market/offer": 0.89,
  "/green/market/actor": 0.88,
  "/green/register": 0.87,
  "/green/compare": 0.88,
  "/green/registry/project": 0.84,
  "/green/rtms-assistant": 0.84,
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
  "/green/blog": 0.86,
  "/green/faq": 0.85,
  "/green/comment-ca-marche": 0.84,
  "/faq": 0.82,
  "/ressources": 0.81,
  "/how-it-works": 0.8,
  "/discover": 0.78,
  "/trust": 0.78,
  "/estimate": 0.77,
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const pages = getIndexablePages();

  const staticEntries: MetadataRoute.Sitemap = pages.map((page) => ({
    url: `${SITE_URL}${page.path === "/" ? "" : page.path}`,
    lastModified: now,
    changeFrequency:
      FREQUENCY[page.path] ??
      (page.contentType === "landing" ? "monthly" : "weekly"),
    priority: PRIORITY[page.path] ?? (page.contentType === "landing" ? 0.75 : 0.7),
  }));

  let offerEntries: MetadataRoute.Sitemap = [];
  let actorEntries: MetadataRoute.Sitemap = [];
  let registryProjectEntries: MetadataRoute.Sitemap = [];
  try {
    const offers = await listGreenMarketOfferSitemapIds();
    offerEntries = offers.slice(0, 100).map((o) => ({
      url: `${SITE_URL}${greenMarketOfferPath(o.id)}`,
      lastModified: new Date(o.createdAt),
      changeFrequency: "weekly" as const,
      priority: PRIORITY["/green/market/offer"] ?? 0.8,
    }));
    const actors = await listGreenMarketActorSitemapIds();
    actorEntries = actors.slice(0, 100).map((a) => ({
      url: `${SITE_URL}${greenMarketActorPath(a.id)}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: PRIORITY["/green/market/actor"] ?? 0.78,
    }));
    const registryProjects = await listGreenRegistryProjectSitemapIds();
    registryProjectEntries = registryProjects.slice(0, 100).map((p) => ({
      url: `${SITE_URL}${greenRegistryProjectPath(p.id)}`,
      lastModified: new Date(p.certifiedAt),
      changeFrequency: "monthly" as const,
      priority: PRIORITY["/green/registry/project"] ?? 0.82,
    }));
  } catch {
    /* demo / build without DB */
  }

  const blogEntries: MetadataRoute.Sitemap = getAllGreenBlogSlugs().map((slug) => ({
    url: `${SITE_URL}${greenBlogArticlePath(slug)}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: PRIORITY["/green/blog"] ?? 0.8,
  }));

  return [...staticEntries, ...offerEntries, ...actorEntries, ...registryProjectEntries, ...blogEntries];
}
