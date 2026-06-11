import type { Metadata } from "next";

import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { JURISDICTION_PICKER_FAQ } from "@/lib/jurisdiction-picker/faq";
import { JURISDICTION_PICKER_ROUTE } from "@/lib/jurisdiction-picker/types";
import { metadataFromPath } from "@/lib/seo/metadata";
import { withOgImage } from "@/lib/seo/og";

import { JurisdictionPickerView } from "./JurisdictionPickerView";

export const metadata: Metadata = withOgImage(
  metadataFromPath(JURISDICTION_PICKER_ROUTE),
  JURISDICTION_PICKER_ROUTE,
  "Sélecteur juridiction tokenisation"
);

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: JURISDICTION_PICKER_FAQ.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function JurisdictionPickerPage() {
  return (
    <FocusPageShell path={JURISDICTION_PICKER_ROUTE} width="3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <JurisdictionPickerView />
    </FocusPageShell>
  );
}
