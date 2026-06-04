import type { Metadata } from "next";

import { OG_HEIGHT, OG_WIDTH } from "@/lib/seo/og-constants";

export type AuditOgImage = {
  url: string;
  width: number;
  height: number;
  alt?: string;
};

export function auditOgImage(
  path: string,
  titleQuery: string,
  alt?: string
): AuditOgImage {
  return {
    url: `/api/og?title=${titleQuery}&path=${path}`,
    width: OG_WIDTH,
    height: OG_HEIGHT,
    ...(alt ? { alt } : {}),
  };
}

export function mergeAuditOg(
  base: Metadata,
  image: AuditOgImage,
  openGraphExtra?: Partial<NonNullable<Metadata["openGraph"]>>
): Metadata {
  const images = [image];
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      ...openGraphExtra,
      images,
    },
    twitter: {
      ...base.twitter,
      card: "summary_large_image",
      images: [image.url],
    },
  };
}
