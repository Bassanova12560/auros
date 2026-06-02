import { absoluteUrl } from "@/lib/comparators/site";

import { buildPageJsonLd } from "./json-ld";
import type { AiFirstPage, AiFirstPageExport } from "./types";

const CATALOG_VERSION = "1.0.0";

export function enrichPage(
  page: Omit<AiFirstPage, "canonicalUrl" | "machineUrl">
): AiFirstPage {
  const canonicalUrl = absoluteUrl(page.path);
  const machineUrl =
    page.id.startsWith("comparator-") && page.liveDataUrl
      ? absoluteUrl(page.liveDataUrl)
      : absoluteUrl(`/ai-first/page.json?path=${encodeURIComponent(page.path)}`);

  return { ...page, canonicalUrl, machineUrl };
}

export function toPageExport(page: AiFirstPage): AiFirstPageExport {
  const { ...rest } = page;
  return {
    ...rest,
    jsonLd: buildPageJsonLd(page),
  };
}

export function catalogVersion(): string {
  return CATALOG_VERSION;
}
