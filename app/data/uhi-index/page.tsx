import type { Metadata } from "next";

import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { absoluteUrl } from "@/lib/comparators/site";
import { AUROS_ORG } from "@/lib/ai-first/org";
import {
  getUhiIndexPayload,
  UHI_INDEX_FAQ,
  UHI_INDEX_ROUTE,
  formatUhiEditionLabel,
} from "@/lib/uhi-index";
import { metadataFromPath } from "@/lib/seo/metadata";

import { UhiIndexView } from "./UhiIndexView";

export const metadata: Metadata = metadataFromPath(UHI_INDEX_ROUTE);

export const revalidate = 3600;

function buildFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: UHI_INDEX_FAQ.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

function buildDatasetJsonLd(
  editionIso: string,
  generatedAt: string,
  count: number
) {
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "AUROS UHI Index",
    description:
      "Indice mensuel indicatif des actifs tokenisés productifs — énergie, trésorerie et crédit RWA en Europe.",
    url: absoluteUrl(UHI_INDEX_ROUTE),
    creator: {
      "@type": "Organization",
      name: AUROS_ORG.name,
      url: AUROS_ORG.url,
    },
    datePublished: editionIso,
    dateModified: generatedAt,
    temporalCoverage: editionIso.slice(0, 7),
    keywords: [
      "AUROS UHI Index",
      "Universal High Income",
      "tokenized productive assets",
      "Watt Score",
    ],
    size: `${count} ranked references`,
    license: "https://creativecommons.org/licenses/by/4.0/",
  };
}

export default async function UhiIndexPage() {
  const payload = await getUhiIndexPayload();
  const editionLabel = formatUhiEditionLabel(payload.editionIso, "fr");

  return (
    <FocusPageShell path={UHI_INDEX_ROUTE} width="3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildDatasetJsonLd(
              payload.editionIso,
              payload.generatedAt,
              payload.entries.length
            )
          ),
        }}
      />
      <UhiIndexView payload={payload} />
      <p className="sr-only">{editionLabel}</p>
    </FocusPageShell>
  );
}
