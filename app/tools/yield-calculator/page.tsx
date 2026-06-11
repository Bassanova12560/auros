import type { Metadata } from "next";

import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { YIELD_CALCULATOR_FAQ } from "@/lib/yield-calculator/faq";
import { YIELD_CALCULATOR_ROUTE } from "@/lib/yield-calculator/types";
import { metadataFromPath } from "@/lib/seo/metadata";
import { withOgImage } from "@/lib/seo/og";

import { YieldCalculatorView } from "./YieldCalculatorView";

export const metadata: Metadata = withOgImage(
  metadataFromPath(YIELD_CALCULATOR_ROUTE),
  YIELD_CALCULATOR_ROUTE,
  "Calculateur rendement RWA"
);

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: YIELD_CALCULATOR_FAQ.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function YieldCalculatorPage() {
  return (
    <FocusPageShell path={YIELD_CALCULATOR_ROUTE} width="3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <YieldCalculatorView />
    </FocusPageShell>
  );
}
