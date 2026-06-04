import type { Metadata } from "next";

import { getAiFirstPageByPath } from "@/lib/ai-first";
import type { AiFirstPage } from "@/lib/ai-first/types";
import { absoluteUrl } from "@/lib/comparators/site";

const HREFLANG_LOCALES = ["fr", "en", "es"] as const;

function hreflangAlternates(path: string): Metadata["alternates"] {
  const canonical = path.startsWith("/") ? path : `/${path}`;
  const languages: Record<string, string> = {};
  for (const locale of HREFLANG_LOCALES) {
    languages[locale] = absoluteUrl(canonical);
  }
  languages["x-default"] = absoluteUrl(canonical);
  return { canonical, languages };
}

/** Build Next.js Metadata from an AI-first catalog page — single source of truth. */
export function buildPageMetadata(page: AiFirstPage): Metadata {
  const ogType = page.contentType === "article" ? "article" : "website";
  const metadata: Metadata = {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    alternates: page.language === "multi" ? hreflangAlternates(page.path) : { canonical: page.path },
    openGraph: {
      title: page.title,
      description: page.description,
      url: page.canonicalUrl,
      siteName: page.path.startsWith("/green") ? "AUROS Green" : "AUROS",
      type: ogType,
      locale: page.language === "fr" ? "fr_FR" : page.language === "multi" ? "fr_FR" : "en_US",
      alternateLocale: page.language === "multi" ? ["en_US", "es_ES"] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
    },
    robots: page.indexable
      ? { index: true, follow: true }
      : { index: false, follow: false },
  };

  if (page.contentType === "article" && page.article) {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: "article",
      publishedTime: page.article.publishedAt,
      modifiedTime: page.article.modifiedAt,
      authors: [page.article.author],
    };
  }

  return metadata;
}

/** Resolve catalog page by path and return Metadata, or a minimal fallback. */
export function metadataFromPath(path: string): Metadata {
  const page = getAiFirstPageByPath(path);
  if (!page) {
    return {
      title: "AUROS",
      description: "Plateforme B2B de tokenisation RWA et écosystème énergie verte.",
    };
  }
  return buildPageMetadata(page);
}
