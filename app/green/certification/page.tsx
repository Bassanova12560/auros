import type { Metadata } from "next";

import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { absoluteUrl } from "@/lib/comparators/site";
import { GREEN_CERTIFICATION_ROUTE } from "@/lib/green";

import { GreenCertificationView } from "../_components/GreenCertificationView";

export const metadata: Metadata = {
  title: "Certification individuelle Green | AUROS Green",
  description:
    "Parcours certification Green — commencez par AUROS Academy Fondamentaux. Spécialisation Praticien à venir.",
  alternates: { canonical: GREEN_CERTIFICATION_ROUTE },
  openGraph: {
    title: "Individual Green certification | AUROS Green",
    url: absoluteUrl(GREEN_CERTIFICATION_ROUTE),
    type: "website",
  },
};

export default function GreenCertificationPage() {
  return (
    <>
      <AiFirstPageJsonLd path={GREEN_CERTIFICATION_ROUTE} />
      <GreenCertificationView />
    </>
  );
}
