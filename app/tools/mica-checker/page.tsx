import type { Metadata } from "next";

import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { MICA_CHECKER_FAQ } from "@/lib/mica-checker/faq";
import { MICA_CHECKER_ROUTE } from "@/lib/mica-checker/types";
import { metadataFromPath } from "@/lib/seo/metadata";
import { withOgImage } from "@/lib/seo/og";

import { MicaCheckerView } from "./MicaCheckerView";

export const metadata: Metadata = withOgImage(
  metadataFromPath(MICA_CHECKER_ROUTE),
  MICA_CHECKER_ROUTE,
  "Test MiCA indicatif"
);

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: MICA_CHECKER_FAQ.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function MicaCheckerPage() {
  return (
    <FocusPageShell path={MICA_CHECKER_ROUTE} width="3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <MicaCheckerView />
    </FocusPageShell>
  );
}
