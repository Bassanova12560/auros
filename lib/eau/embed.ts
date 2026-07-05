import { siteOrigin } from "@/lib/emails/constants";
import { normalizePartnerCode } from "@/lib/partner-attribution";

import { EAU_EMBED_ROUTE } from "./constants";

export type EauEmbedOptions = {
  partner?: string | null;
  locale?: string | null;
  origin?: string;
};

export function buildEauEmbedUrl(options: EauEmbedOptions = {}): string {
  const origin = options.origin ?? siteOrigin();
  const url = new URL(EAU_EMBED_ROUTE, origin);
  const partner = normalizePartnerCode(options.partner ?? null);
  if (partner) url.searchParams.set("partner", partner);
  if (options.locale?.trim()) {
    url.searchParams.set("locale", options.locale.trim().slice(0, 2));
  }
  return url.toString();
}

export function buildHydrologicalPassportUrl(
  options: EauEmbedOptions = {}
): string {
  const origin = options.origin ?? siteOrigin();
  const url = new URL("/wizard", origin);
  url.searchParams.set("type", "green");
  url.searchParams.set("asset", "renewable");
  const partner = normalizePartnerCode(options.partner ?? null);
  if (partner) url.searchParams.set("partner", partner);
  return url.toString();
}

export function buildEauEmbedIframeSnippet(
  options: EauEmbedOptions & { width?: number; height?: number } = {}
): string {
  const src = buildEauEmbedUrl(options);
  const width = options.width ?? 420;
  const height = options.height ?? 580;
  return `<iframe
  src="${src}"
  title="AUROS H₂O Score — hydrological readiness"
  width="${width}"
  height="${height}"
  style="border:0;border-radius:16px;max-width:100%;background:#030303;"
  loading="lazy"
  referrerpolicy="strict-origin-when-cross-origin"
></iframe>`;
}

export function buildEauCheckApiSnippet(origin?: string): string {
  const base = origin ?? siteOrigin();
  return `curl -X POST ${base}/api/eau/check \\
  -H "Content-Type: application/json" \\
  -d '{"text":"Concession eau potable 15 ans 2 Mm³/an SPV France audit hydrologique"}'`;
}
