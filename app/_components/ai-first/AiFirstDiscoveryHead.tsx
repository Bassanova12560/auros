import { absoluteUrl } from "@/lib/comparators/site";
import { organizationJsonLd, webSiteJsonLd } from "@/lib/ai-first/json-ld";

/** Global JSON-LD + AI-first discovery link tags for crawlers. */
export function AiFirstDiscoveryHead() {
  const org = organizationJsonLd();
  const site = webSiteJsonLd();

  return (
    <>
      <link
        rel="alternate"
        type="application/json"
        href={absoluteUrl("/ai-first/index.json")}
        title="AUROS machine-readable catalog"
      />
      <link
        rel="alternate"
        type="text/plain"
        href={absoluteUrl("/llms.txt")}
        title="AUROS llms.txt"
      />
      <meta name="ai-content-declaration" content="machine-readable catalog at /ai-first/index.json" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(site) }}
      />
    </>
  );
}
