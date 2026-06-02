import type { Metadata } from "next";

import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { absoluteUrl } from "@/lib/comparators/site";
import { GREEN_STANDARDS_ROUTE } from "@/lib/green";

import { GreenStandardsView } from "../_components/GreenStandardsView";

export const metadata: Metadata = {
  title: "Standards RTMS | AUROS Green",
  description:
    "Grille RTMS AUROS Green — Réel, Transparent, Mesurable, Sain. Critères pour évaluer un actif vert tokenisé.",
  alternates: { canonical: GREEN_STANDARDS_ROUTE },
  openGraph: {
    title: "RTMS standards | AUROS Green",
    url: absoluteUrl(GREEN_STANDARDS_ROUTE),
    type: "website",
  },
};

export default function GreenStandardsPage() {
  return (
    <>
      <AiFirstPageJsonLd path={GREEN_STANDARDS_ROUTE} />
      <GreenStandardsView />
    </>
  );
}
