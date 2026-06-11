import type { Metadata } from "next";

import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { absoluteUrl } from "@/lib/comparators/site";
import { AUROS_ORG } from "@/lib/ai-first/org";
import {
  getQuarterStartIso,
  getStateOfRwaIssuersPayload,
  STATE_OF_RWA_ISSUERS_FAQ,
  STATE_OF_RWA_ISSUERS_ROUTE,
} from "@/lib/state-of-rwa-issuers";
import { metadataFromPath } from "@/lib/seo/metadata";

import { StateOfRwaIssuersView } from "./StateOfRwaIssuersView";

export const metadata: Metadata = metadataFromPath(STATE_OF_RWA_ISSUERS_ROUTE);

export const revalidate = 3600;

function buildFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: STATE_OF_RWA_ISSUERS_FAQ.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

function buildReportJsonLd(
  edition: string,
  quarterStartIso: string,
  generatedAt: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "Report",
    name: `AUROS State of RWA Issuers — ${edition}`,
    description:
      "Rapport trimestriel AUROS sur les émetteurs RWA en Europe : mix d'actifs, signaux MiCA indicatifs, blocages courants et répartition juridictionnelle. Données propriétaires complétées par l'AUROS RWA Index.",
    url: absoluteUrl(STATE_OF_RWA_ISSUERS_ROUTE),
    author: {
      "@type": "Organization",
      name: AUROS_ORG.name,
      url: AUROS_ORG.url,
    },
    publisher: {
      "@type": "Organization",
      name: AUROS_ORG.name,
      url: AUROS_ORG.url,
    },
    datePublished: quarterStartIso,
    dateModified: generatedAt,
    temporalCoverage: edition,
    keywords: [
      "State of RWA Issuers",
      "RWA issuer report Europe",
      "tokenization quarterly report",
      "rapport émetteurs RWA",
      "MiCA readiness",
    ],
    distribution: {
      "@type": "DataDownload",
      encodingFormat: "application/pdf",
      contentUrl: absoluteUrl(STATE_OF_RWA_ISSUERS_ROUTE),
    },
    inLanguage: ["fr", "en", "es"],
    license: "https://creativecommons.org/licenses/by/4.0/",
  };
}

export default async function StateOfRwaIssuersPage() {
  const payload = await getStateOfRwaIssuersPayload();
  const faqJsonLd = buildFaqJsonLd();
  const reportJsonLd = buildReportJsonLd(
    payload.edition,
    getQuarterStartIso(payload.edition),
    payload.generatedAt
  );

  return (
    <FocusPageShell path={STATE_OF_RWA_ISSUERS_ROUTE} width="3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reportJsonLd) }}
      />
      <StateOfRwaIssuersView payload={payload} />
    </FocusPageShell>
  );
}
