import type { Metadata } from "next";
import { Suspense } from "react";

import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { getAiFirstPageByPath } from "@/lib/ai-first";
import { buildPageJsonLd } from "@/lib/ai-first/json-ld";
import { GREEN_IMPACT_REPORT_ROUTE } from "@/lib/green/constants";
import { metadataFromPath } from "@/lib/seo/metadata";
import { withOgImage } from "@/lib/seo/og";

import { GreenImpactReportView } from "./_components/GreenImpactReportView";

export const metadata: Metadata = withOgImage(
  metadataFromPath(GREEN_IMPACT_REPORT_ROUTE),
  GREEN_IMPACT_REPORT_ROUTE,
  "Rapport d'impact Green — PDF EU Taxonomy + RTMS"
);

const impactReportJsonLd = buildPageJsonLd(
  getAiFirstPageByPath(GREEN_IMPACT_REPORT_ROUTE)!
);

export default function GreenImpactReportPage() {
  return (
    <FocusPageShell path={GREEN_IMPACT_REPORT_ROUTE} width="3xl">
      {impactReportJsonLd.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
      <Suspense fallback={null}>
        <GreenImpactReportView />
      </Suspense>
    </FocusPageShell>
  );
}
