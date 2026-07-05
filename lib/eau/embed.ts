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

export function buildEauEmbedListenerSnippet(): string {
  return `window.addEventListener("message", (event) => {
  const data = event.data;
  if (!data || data.source !== "auros-embed") return;
  switch (data.type) {
    case "auros:h2o:ready":
      console.log("AUROS H₂O widget ready", data.partner);
      break;
    case "auros:h2o:score":
      console.log("H₂O preview", data.payload.rating, data.payload.tier);
      break;
    case "auros:h2o:passport":
      console.log("Passport CTA clicked", data.payload.partner);
      break;
  }
});`;
}

export function buildEauEmbedScriptSnippet(
  options: EauEmbedOptions & { width?: number; height?: number } = {},
): string {
  const src = buildEauEmbedUrl(options);
  const width = options.width ?? 420;
  const height = options.height ?? 580;
  const containerId = "auros-h2o-embed";
  return `<div id="${containerId}"></div>
<script>
(function () {
  var container = document.getElementById("${containerId}");
  if (!container) return;
  var iframe = document.createElement("iframe");
  iframe.src = ${JSON.stringify(src)};
  iframe.title = "AUROS H₂O Score — hydrological readiness";
  iframe.width = "${width}";
  iframe.height = "${height}";
  iframe.loading = "lazy";
  iframe.referrerPolicy = "strict-origin-when-cross-origin";
  iframe.style.cssText = "border:0;border-radius:16px;max-width:100%;background:#030303;";
  container.appendChild(iframe);
  ${buildEauEmbedListenerSnippet().replace(/^/gm, "  ")}
})();
</script>`;
}
