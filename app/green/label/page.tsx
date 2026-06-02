import type { Metadata } from "next";

import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { absoluteUrl } from "@/lib/comparators/site";
import { GREEN_LABEL_ROUTE } from "@/lib/green";

import { GreenLabelView } from "../_components/GreenLabelView";

export const metadata: Metadata = {
  title: "Label Auros Green Verified | AUROS Green",
  description:
    "Candidature au label Auros Green Verified — revue documentaire RTMS avant tout badge public.",
  alternates: { canonical: GREEN_LABEL_ROUTE },
  openGraph: {
    title: "Auros Green Verified label | AUROS Green",
    url: absoluteUrl(GREEN_LABEL_ROUTE),
    type: "website",
  },
};

export default function GreenLabelPage() {
  return (
    <>
      <AiFirstPageJsonLd path={GREEN_LABEL_ROUTE} />
      <GreenLabelView />
    </>
  );
}
