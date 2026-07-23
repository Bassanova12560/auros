import type { MetadataRoute } from "next";

import { getIndexablePages } from "@/lib/ai-first";
import { getAllGlossarySlugs, glossaryTermPath } from "@/lib/glossary";
import { getAllBlogSlugs, blogArticlePath } from "@/lib/blog";
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
  "/green/api": 0.87,
  "/green/press": 0.86,
  "/green/registry-connect": 0.86,
  "/green/dpp": 0.86,
  "/green/registry/project": 0.84,
  "/green/rtms-assistant": 0.84,
  "/green/assistant": 0.88,
  "/green/csrd-check": 0.89,
  "/green/impact-report": 0.88,
  "/green/standards": 0.86,
  "/green/label": 0.85,
  "/green/praticien": 0.84,
  "/jurisdictions": 0.9,
  "/jurisdictions/starter-kit": 0.85,
  "/compare": 0.98,
  "/green/chargeflow": 0.9,
  "/green/chargeflow/reserve": 0.89,
  "/green/chargeflow/inventory": 0.88,
  "/green/chargeflow/secondary": 0.87,
  "/green/watts": 0.91,
  "/power": 0.9,
  "/guides": 0.93,
  "/guides/intents": 0.92,
  "/guides/booking-engine-watts": 0.91,
  "/guides/chargeflow-cfu": 0.9,
  "/guides/rwa-intelligence-layer": 0.9,
  "/guides/green-rtms": 0.9,
  "/guides/low-carbon-power": 0.9,
  "/green/chargeflow/fleets": 0.88,
  "/copilot": 0.88,
  "/stablecoins": 0.95,
  "/real-estate": 0.95,
  "/bonds": 0.95,
  "/commodities": 0.95,
  "/private-credit": 0.95,
  "/private-equity": 0.94,
  "/art-collectibles": 0.9,
  "/blog": 0.87,
  "/blog/article": 0.85,
  "/green/blog": 0.86,
  "/green/faq": 0.85,
  "/green/comment-ca-marche": 0.84,
  "/faq": 0.82,
  "/ressources": 0.81,
  "/comment-tokeniser": 0.86,
  "/eau": 0.9,
  "/h2o-rwa": 0.91,
  "/demos/data-center-100mw": 0.88,
  "/eau/continuity": 0.87,
  "/eau/continuity/playbook": 0.86,
  "/compass": 0.87,
  "/compass/dashboard": 0.86,
  "/resilience": 0.9,
  "/eau/suppliers": 0.86,
  "/integrations": 0.85,
  "/data/resource-signals": 0.84,
  "/trust/quantum": 0.87,
  "/trust/capacity": 0.86,
  "/trust/passport": 0.86,
  "/trust/institutions": 0.85,
  "/verify": 0.88,
  "/green/hub": 0.91,
  "/eau/trust": 0.89,
  "/eau/risk": 0.88,
  "/trust/packs": 0.87,
  "/eau/embed": 0.88,
  "/glossary": 0.8,
  "/glossary/term": 0.72,
  "/how-it-works": 0.8,
  "/discover": 0.78,
  "/trust": 0.78,
  "/estimate": 0.77,
  "/developers": 0.82,
  "/developers/institutions": 0.84,
  "/developers/shield": 0.86,
  "/developers/dashboard": 0.72,
  "/developers/docs": 0.8,
  "/developers/docs/page": 0.76,
  "/developers/changelog": 0.78,
  "/resource-layer": 0.93,
  "/builders": 0.92,
  "/lab": 0.91,
  "/watt": 0.92,
  "/why": 0.9,
  "/investors": 0.88,
  "/presence": 0.87,
  "/status": 0.7,
  "/trade": 0.9,
  "/producer": 0.88,
  "/market": 0.88,
  "/agent": 0.86,
  "/earn": 0.84,
  "/careers": 0.86,
  "/press": 0.84,
  "/tools": 0.79,
  "/tools/mica-checker": 0.78,
  "/tools/yield-calculator": 0.78,
  "/tools/jurisdiction-picker": 0.78,
  "/tools/cost-estimator": 0.78,
  "/data/rwa-index": 0.82,
  "/data/green-index": 0.84,
  "/data/terminal": 0.86,
  "/data/licence": 0.72,
  "/data/nature-score": 0.83,
  "/data/uhi-index": 0.83,
  "/data/state-of-rwa-issuers": 0.81,
  "/pricing": 0.76,
  "/partners": 0.6,
};

const FREQUENCY: Record<string, MetadataRoute.Sitemap[number]["changeFrequency"]> = {
  "/compare": "hourly",
  "/data/rwa-index": "weekly",
  "/data/green-index": "weekly",
  "/data/terminal": "weekly",
  "/data/licence": "monthly",
  "/data/uhi-index": "weekly",
  "/data/state-of-rwa-issuers": "monthly",
  "/stablecoins": "hourly",
  "/real-estate": "hourly",
  "/bonds": "hourly",
  "/commodities": "hourly",
  "/private-credit": "hourly",
  "/private-equity": "hourly",
  "/art-collectibles": "daily",
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

  const greenBlogEntries: MetadataRoute.Sitemap = getAllGreenBlogSlugs().map((slug) => ({
    url: `${SITE_URL}${greenBlogArticlePath(slug)}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: PRIORITY["/green/blog"] ?? 0.8,
  }));

  const blogEntries: MetadataRoute.Sitemap = getAllBlogSlugs().map((slug) => ({
    url: `${SITE_URL}${blogArticlePath(slug)}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: PRIORITY["/blog/article"] ?? 0.85,
  }));

  const glossaryEntries: MetadataRoute.Sitemap = getAllGlossarySlugs().map((slug) => ({
    url: `${SITE_URL}${glossaryTermPath(slug)}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: PRIORITY["/glossary/term"] ?? 0.72,
  }));

  return [
    ...staticEntries,
    ...offerEntries,
    ...actorEntries,
    ...registryProjectEntries,
    ...greenBlogEntries,
    ...blogEntries,
    ...glossaryEntries,
  ];
}
