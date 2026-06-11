import type { Metadata } from "next";

import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { COST_ESTIMATOR_FAQ } from "@/lib/cost-estimator/faq";
import { COST_ESTIMATOR_ROUTE } from "@/lib/cost-estimator/types";
import { metadataFromPath } from "@/lib/seo/metadata";
import { withOgImage } from "@/lib/seo/og";

import { CostEstimatorView } from "./CostEstimatorView";

export const metadata: Metadata = withOgImage(
  metadataFromPath(COST_ESTIMATOR_ROUTE),
  COST_ESTIMATOR_ROUTE,
  "Estimateur coût tokenisation RWA"
);

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: COST_ESTIMATOR_FAQ.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function CostEstimatorPage() {
  return (
    <FocusPageShell path={COST_ESTIMATOR_ROUTE} width="3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <CostEstimatorView />
    </FocusPageShell>
  );
}
