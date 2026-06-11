import type { Metadata } from "next";

import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { absoluteUrl } from "@/lib/comparators/site";
import { AUROS_ORG } from "@/lib/ai-first/org";
import { getRwaIndexPayload, RWA_INDEX_FAQ, RWA_INDEX_ROUTE } from "@/lib/rwa-index";
import { formatEditionLabel } from "@/lib/rwa-index/i18n";
import { metadataFromPath } from "@/lib/seo/metadata";

import { RwaIndexView } from "./RwaIndexView";

export const metadata: Metadata = metadataFromPath(RWA_INDEX_ROUTE);

export const revalidate = 3600;

function buildFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: RWA_INDEX_FAQ.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

function buildDatasetJsonLd(
  editionIso: string,
  generatedAt: string,
  totalProducts: number
) {
  const editionLabel = formatEditionLabel(editionIso, "fr");
  const temporalCoverage = editionIso.slice(0, 7);

  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "AUROS RWA Index",
    description:
      "Indice mensuel des rendements tokenisés RWA en Europe — APY moyens par classe d'actif, volume produits et juridictions actives. Source indicative AUROS.",
    url: absoluteUrl(RWA_INDEX_ROUTE),
    creator: {
      "@type": "Organization",
      name: AUROS_ORG.name,
      url: AUROS_ORG.url,
    },
    datePublished: editionIso,
    dateModified: generatedAt,
    temporalCoverage,
    keywords: [
      "RWA yields Europe",
      "tokenized asset returns",
      "AUROS RWA Index",
      "rendements RWA",
    ],
    variableMeasured: [
      "Average APY by asset class",
      "Product count per category",
      "Active jurisdictions count",
    ],
    distribution: {
      "@type": "DataDownload",
      encodingFormat: "text/csv",
      contentUrl: absoluteUrl(RWA_INDEX_ROUTE),
    },
    measurementTechnique:
      "Aggregation of AUROS /compare comparator hub (manual JSON + DefiLlama pools)",
    size: `${totalProducts} products tracked`,
    license: "https://creativecommons.org/licenses/by/4.0/",
  };
}

export default async function RwaIndexPage() {
  const payload = await getRwaIndexPayload();
  const faqJsonLd = buildFaqJsonLd();
  const datasetJsonLd = buildDatasetJsonLd(
    payload.editionIso,
    payload.generatedAt,
    payload.totalProducts
  );

  return (
    <FocusPageShell path={RWA_INDEX_ROUTE} width="3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetJsonLd) }}
      />
      <RwaIndexView payload={payload} />
    </FocusPageShell>
  );
}
