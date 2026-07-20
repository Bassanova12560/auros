import { absoluteUrl } from "@/lib/comparators/site";

import { AUROS_ORG } from "./org";
import type { AiFirstPage } from "./types";

export function organizationJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: AUROS_ORG.name,
    url: AUROS_ORG.url,
    logo: AUROS_ORG.logo,
    description: AUROS_ORG.description,
    email: AUROS_ORG.contactEmail,
    areaServed: AUROS_ORG.areaServed,
    knowsAbout: AUROS_ORG.knowsAbout,
    sameAs: AUROS_ORG.sameAs,
  };
}

export function webSiteJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: AUROS_ORG.name,
    url: AUROS_ORG.url,
    description: AUROS_ORG.description,
    publisher: { "@type": "Organization", name: AUROS_ORG.name },
    potentialAction: [
      {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${AUROS_ORG.url}/ai-first/rag?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
      {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${AUROS_ORG.url}/jurisdictions#comparator`,
        },
        "query-input": "required name=search_term_string",
      },
    ],
  };
}

export function softwareApplicationJsonLd(
  page: AiFirstPage
): Record<string, unknown> | null {
  if (page.path !== "/developers" && page.path !== "/green/api") return null;
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: page.path === "/green/api" ? "AUROS Green API" : "AUROS Protocol API",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: page.canonicalUrl,
    description: page.description,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
      description: "Clé gratuite avec quota mensuel",
    },
    provider: {
      "@type": "Organization",
      name: AUROS_ORG.name,
      url: AUROS_ORG.url,
    },
  };
}

export function webPageJsonLd(page: AiFirstPage): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": page.canonicalUrl,
    url: page.canonicalUrl,
    name: page.title,
    description: page.description,
    inLanguage: page.language === "multi" ? ["fr", "en", "es"] : page.language,
    isPartOf: { "@type": "WebSite", url: AUROS_ORG.url, name: AUROS_ORG.name },
    about: page.keywords.slice(0, 8).map((k) => ({ "@type": "Thing", name: k })),
    dateModified: page.lastUpdated,
  };
}

export function faqJsonLd(page: AiFirstPage): Record<string, unknown> | null {
  if (!page.faq?.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function courseJsonLd(page: AiFirstPage): Record<string, unknown> | null {
  if (page.contentType !== "academy") return null;
  const isFree = page.path.includes("fondamentaux");
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: page.title,
    description: page.description,
    provider: {
      "@type": "Organization",
      name: "AUROS Academy",
      url: AUROS_ORG.url,
    },
    isAccessibleForFree: isFree,
    inLanguage: ["fr", "en", "es"],
    url: page.canonicalUrl,
  };
}

export function productJsonLd(page: AiFirstPage): Record<string, unknown> | null {
  const offer = page.offers?.[0];
  if (!offer) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: offer.name,
    description: offer.description,
    brand: { "@type": "Brand", name: AUROS_ORG.name },
    offers: {
      "@type": "Offer",
      price: offer.price.replace(/[^\d.]/g, "") || "5000",
      priceCurrency: offer.priceCurrency,
      availability: "https://schema.org/InStock",
      url: offer.url,
    },
  };
}

export function breadcrumbJsonLd(
  items: { name: string; url: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function articleJsonLd(page: AiFirstPage): Record<string, unknown> | null {
  if (page.contentType !== "article" || !page.article) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.title,
    description: page.description,
    url: page.canonicalUrl,
    datePublished: page.article.publishedAt,
    dateModified: page.article.modifiedAt,
    author: {
      "@type": "Organization",
      name: page.article.author,
      url: AUROS_ORG.url,
    },
    publisher: {
      "@type": "Organization",
      name: AUROS_ORG.name,
      url: AUROS_ORG.url,
      logo: { "@type": "ImageObject", url: AUROS_ORG.logo },
    },
    inLanguage: page.language === "multi" ? "fr" : page.language,
    keywords: page.keywords.join(", "),
    mainEntityOfPage: { "@type": "WebPage", "@id": page.canonicalUrl },
  };
}

export function buildPageJsonLd(page: AiFirstPage): Record<string, unknown>[] {
  const blocks: Record<string, unknown>[] = [webPageJsonLd(page)];
  const faq = faqJsonLd(page);
  if (faq) blocks.push(faq);
  const course = courseJsonLd(page);
  if (course) blocks.push(course);
  const product = productJsonLd(page);
  if (product) blocks.push(product);
  const software = softwareApplicationJsonLd(page);
  if (software) blocks.push(software);
  const article = articleJsonLd(page);
  if (article) blocks.push(article);
  if (page.breadcrumbs?.length) {
    const crumbs = [
      { name: "AUROS", url: AUROS_ORG.url },
      ...page.breadcrumbs.map((b) => ({
        name: b.name,
        url: absoluteUrl(b.path),
      })),
      { name: page.title.split("|")[0]?.trim() ?? page.title, url: page.canonicalUrl },
    ];
    blocks.push(breadcrumbJsonLd(crumbs));
  }
  return blocks;
}
