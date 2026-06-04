import type { Metadata } from "next";

import { getAiFirstPageByPath } from "@/lib/ai-first";
import { absoluteUrl } from "@/lib/comparators/site";
import { OG_HEIGHT, OG_WIDTH } from "@/lib/seo/og-constants";

export { OG_BG, OG_HEIGHT, OG_TAGLINE, OG_WIDTH } from "@/lib/seo/og-constants";

export function ogImageUrl(params: { title: string; path?: string }): string {
  const q = new URLSearchParams();
  q.set("title", params.title);
  if (params.path) q.set("path", params.path);
  return absoluteUrl(`/api/og?${q.toString()}`);
}

export function ogTitleForPath(path: string, fallback?: string): string {
  const page = getAiFirstPageByPath(path);
  if (page?.title) {
    return page.title.replace(/\s*\|\s*AUROS(\s+Green)?\s*$/i, "").trim() || page.title;
  }
  return fallback ?? "AUROS";
}

export function ogImageMetadata(path: string, title?: string): NonNullable<Metadata["openGraph"]>["images"] {
  const displayTitle = title ?? ogTitleForPath(path);
  return [
    {
      url: ogImageUrl({ title: displayTitle, path }),
      width: OG_WIDTH,
      height: OG_HEIGHT,
      alt: `${displayTitle} — AUROS`,
    },
  ];
}

function ogImageUrlString(img: string | URL | { url: string | URL }): string {
  if (typeof img === "string") return img;
  if (img instanceof URL) return img.toString();
  return typeof img.url === "string" ? img.url : img.url.toString();
}

export function withOgImage(metadata: Metadata, path: string, title?: string): Metadata {
  const images = ogImageMetadata(path, title);
  const imageList = Array.isArray(images) ? images : images ? [images] : [];
  return {
    ...metadata,
    openGraph: { ...metadata.openGraph, images: imageList },
    twitter: {
      ...metadata.twitter,
      card: "summary_large_image",
      images: imageList.map(ogImageUrlString),
    },
  };
}
