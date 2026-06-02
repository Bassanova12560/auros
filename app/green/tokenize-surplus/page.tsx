import type { Metadata } from "next";

import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { absoluteUrl } from "@/lib/comparators/site";
import { GREEN_GUIDE_ROUTE } from "@/lib/green";

import { GreenGuideView } from "../_components/GreenGuideView";

export const metadata: Metadata = {
  title: "Tokeniser un surplus énergétique | AUROS Green",
  description:
    "Guide éducatif — tokenisation d'un surplus énergétique : étapes, risques, liens wizard AUROS.",
  alternates: { canonical: GREEN_GUIDE_ROUTE },
  openGraph: {
    title: "Tokenizing energy surplus | AUROS Green",
    url: absoluteUrl(GREEN_GUIDE_ROUTE),
    type: "website",
  },
};

export default function GreenGuidePage() {
  return (
    <>
      <AiFirstPageJsonLd path={GREEN_GUIDE_ROUTE} />
      <GreenGuideView />
    </>
  );
}
