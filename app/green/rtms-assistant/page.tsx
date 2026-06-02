import type { Metadata } from "next";

import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { absoluteUrl } from "@/lib/comparators/site";
import { GREEN_RTMS_ASSISTANT_ROUTE } from "@/lib/green";

import { GreenRtmsAssistantView } from "../_components/GreenRtmsAssistantView";

export const metadata: Metadata = {
  title: "Assistant RTMS préliminaire | AUROS Green",
  description:
    "Grille RTMS indicative à partir de votre résumé de projet — éducatif, pas certification. FR / EN / ES.",
  alternates: { canonical: GREEN_RTMS_ASSISTANT_ROUTE },
  openGraph: {
    title: "Preliminary RTMS assistant | AUROS Green",
    description: "Indicative RTMS grid from your project summary — not certification.",
    url: absoluteUrl(GREEN_RTMS_ASSISTANT_ROUTE),
    type: "website",
  },
};

export default function GreenRtmsAssistantPage() {
  return (
    <>
      <AiFirstPageJsonLd path={GREEN_RTMS_ASSISTANT_ROUTE} />
      <GreenRtmsAssistantView />
    </>
  );
}
