import type { Metadata } from "next";

import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { CSRD_CHECKER_FAQ } from "@/lib/green/csrd-check/faq";
import { GREEN_CSRD_CHECK_ROUTE } from "@/lib/green/constants";
import { metadataFromPath } from "@/lib/seo/metadata";
import { withOgImage } from "@/lib/seo/og";

import { CsrdCheckView } from "./CsrdCheckView";

export const metadata: Metadata = withOgImage(
  metadataFromPath(GREEN_CSRD_CHECK_ROUTE),
  GREEN_CSRD_CHECK_ROUTE,
  "CSRD Checker — scope et préparation"
);

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: CSRD_CHECKER_FAQ.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export default function CsrdCheckPage() {
  return (
    <FocusPageShell path={GREEN_CSRD_CHECK_ROUTE} width="3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <CsrdCheckView />
    </FocusPageShell>
  );
}
