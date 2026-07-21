import type { Metadata } from "next";

import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { absoluteUrl } from "@/lib/comparators/site";
import { GREEN_ASSISTANT_ROUTE } from "@/lib/green";

import { GreenAssistantView } from "../_components/GreenAssistantView";

export const metadata: Metadata = {
  title: "Assistant Green IA | AUROS",
  description:
    "Chatbot Green personnalisé et gratuit — RTMS, label, scores, eau-énergie. Indicatif. Premium API pour les entreprises.",
  alternates: { canonical: GREEN_ASSISTANT_ROUTE },
  openGraph: {
    title: "Green AI assistant | AUROS",
    description:
      "Personalized free Green chatbot — RTMS, label, scores. Enterprise API for scale.",
    url: absoluteUrl(GREEN_ASSISTANT_ROUTE),
    type: "website",
  },
};

export default function GreenAssistantPage() {
  return (
    <>
      <AiFirstPageJsonLd path={GREEN_ASSISTANT_ROUTE} />
      <GreenAssistantView />
    </>
  );
}
