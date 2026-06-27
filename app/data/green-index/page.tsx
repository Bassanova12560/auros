import type { Metadata } from "next";

import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { absoluteUrl } from "@/lib/comparators/site";
import { AUROS_ORG } from "@/lib/ai-first/org";
import {
  getGreenIndexPayload,
  GREEN_INDEX_FAQ,
  GREEN_INDEX_ROUTE,
  formatGreenEditionLabel,
} from "@/lib/green-index";
import { metadataFromPath } from "@/lib/seo/metadata";

import { GreenIndexView } from "./GreenIndexView";

export const metadata: Metadata = metadataFromPath(GREEN_INDEX_ROUTE);

export const revalidate = 3600;

function buildFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: GREEN_INDEX_FAQ.map((item) => ({
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
    name: "AUROS Green RWA Index",
    description:
      "Indice mensuel indicatif des actifs climatiques tokenisés en Europe — Taxonomy EU, Carbon Quality Score et Watt Score.",
    url: absoluteUrl(GREEN_INDEX_ROUTE),
    creator: {
      "@type": "Organization",
      name: AUROS_ORG.name,
      url: AUROS_ORG.url,
    },
    datePublished: editionIso,
    dateModified: generatedAt,
    temporalCoverage: editionIso.slice(0, 7),
    keywords: [
      "Green RWA Index",
      "Carbon Quality Score",
      "Watt Score",
      "EU Taxonomy tokenized assets",
    ],
    size: `${count} ranked references`,
    license: "https://creativecommons.org/licenses/by/4.0/",
  };
}

export default async function GreenIndexPage() {
  const payload = await getGreenIndexPayload();
  const editionLabel = formatGreenEditionLabel(payload.editionIso, "fr");

  return (
    <FocusPageShell path={GREEN_INDEX_ROUTE} width="3xl">
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
      <GreenIndexView payload={payload} />
      <p className="sr-only">{editionLabel}</p>
    </FocusPageShell>
  );
}
