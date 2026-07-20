import type { Metadata } from "next";

import { getAiFirstPageByPath } from "@/lib/ai-first";
import type { AiFirstPage } from "@/lib/ai-first/types";
import { absoluteUrl } from "@/lib/comparators/site";
import { ogImageMetadata, ogTitleForPath } from "@/lib/seo/og";

function ogImageUrlString(img: string | URL | { url: string | URL }): string {
  if (typeof img === "string") return img;
  if (img instanceof URL) return img.toString();
  return typeof img.url === "string" ? img.url : img.url.toString();
}

function hreflangAlternates(path: string): Metadata["alternates"] {
  const canonical = path.startsWith("/") ? path : `/${path}`;
  // Locale is cookie-based (same URL for fr/en/es) — do not fake per-locale URLs.
  return {
    canonical,
    languages: {
      "x-default": absoluteUrl(canonical),
      fr: absoluteUrl(canonical),
    },
  };
}

export function buildPageMetadata(page: AiFirstPage): Metadata {
  const ogDisplayTitle = ogTitleForPath(page.path, page.title);
  const ogImagesRaw = ogImageMetadata(page.path, ogDisplayTitle);
  const ogImages = Array.isArray(ogImagesRaw) ? ogImagesRaw : ogImagesRaw ? [ogImagesRaw] : [];
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
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: ogImages.map(ogImageUrlString),
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
