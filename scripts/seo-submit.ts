/**
 * Ping Bing/Yandex via IndexNow and print Google Search Console steps.
 * Usage: npx tsx scripts/seo-submit.ts
 */
import {
  INDEXNOW_KEY,
  indexNowKeyLocation,
  seoSubmissionTargets,
} from "../lib/ai-first/seo-submit";
import { getIndexablePages } from "../lib/ai-first";

async function submitIndexNow(urls: string[]): Promise<void> {
  const { indexNowEndpoint } = seoSubmissionTargets();
  const body = {
    host: new URL(seoSubmissionTargets().sitemap).host,
    key: INDEXNOW_KEY,
    keyLocation: indexNowKeyLocation(),
    urlList: urls.slice(0, 10_000),
  };

  const res = await fetch(indexNowEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });

  console.log(`IndexNow: HTTP ${res.status} ${res.statusText}`);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    if (text) console.log(text);
  }
}

async function main() {
  const targets = seoSubmissionTargets();
  const pages = getIndexablePages();
  const priorityUrls = [
    targets.sitemap,
    ...pages
      .filter((p) =>
        ["/", "/about", "/academy", "/academy/fondamentaux", "/jurisdictions", "/jurisdictions/starter-kit"].includes(
          p.path
        )
      )
      .map((p) => p.canonicalUrl),
    ...pages
      .filter((p) => p.contentType === "landing")
      .slice(0, 5)
      .map((p) => p.canonicalUrl),
  ];

  console.log("AUROS SEO submission\n");
  console.log("Sitemap:", targets.sitemap);
  console.log("Indexable pages:", pages.length);
  console.log("IndexNow key file:", targets.indexNowKeyLocation);
  console.log("");

  try {
    await submitIndexNow(priorityUrls);
  } catch (err) {
    console.error("IndexNow failed (network):", err);
  }

  console.log("\n--- Manual steps (one-time) ---\n");
  console.log("Google Search Console:");
  console.log("  1. https://search.google.com/search-console");
  console.log("  2. Add property:", new URL(targets.sitemap).origin);
  console.log("  3. Sitemaps → submit:", targets.sitemap);
  console.log("  Direct:", targets.googleSearchConsole);
  console.log("");
  console.log("Bing Webmaster Tools:");
  console.log("  1. https://www.bing.com/webmasters");
  console.log("  2. Add site → submit sitemap:", targets.sitemap);
  console.log("  Direct:", targets.bingWebmaster);
}

main();
