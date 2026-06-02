import type { Metadata } from "next";

import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { absoluteUrl } from "@/lib/comparators/site";
import { ACADEMY_ENTREPRISE_ROUTE } from "@/lib/academy";

import { AcademyEntrepriseView } from "../_components/AcademyEntrepriseView";

export const metadata: Metadata = {
  title: "Certification Entreprise RWA | AUROS Academy",
  description:
    "Institution RWA certificate €249 — AUROS Academy. Full team track not open yet.",
  alternates: { canonical: ACADEMY_ENTREPRISE_ROUTE },
  openGraph: {
    title: "Enterprise RWA Certification | AUROS Academy",
    url: absoluteUrl(ACADEMY_ENTREPRISE_ROUTE),
    siteName: "AUROS Academy",
  },
};

export default function AcademyEntreprisePage() {
  return (
    <>
      <AiFirstPageJsonLd path={ACADEMY_ENTREPRISE_ROUTE} />
      <AcademyEntrepriseView />
    </>
  );
}
