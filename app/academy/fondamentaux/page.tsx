import type { Metadata } from "next";

import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { absoluteUrl } from "@/lib/comparators/site";
import { ACADEMY_FUNDAMENTALS_ROUTE } from "@/lib/academy";

import { FundamentalsCertView } from "../_components/FundamentalsCertView";

export const metadata: Metadata = {
  title: "Certification RWA gratuite | AUROS Academy Fondamentaux",
  description:
    "Certification RWA gratuite — quiz 10 questions, attestation nominative vérifiable. Formation tokenisation actifs réels par AUROS Academy.",
  alternates: { canonical: ACADEMY_FUNDAMENTALS_ROUTE },
  openGraph: {
    title: "Certification RWA gratuite | AUROS Academy",
    url: absoluteUrl(ACADEMY_FUNDAMENTALS_ROUTE),
    siteName: "AUROS Academy",
    type: "website",
  },
  keywords: [
    "certification RWA gratuite",
    "formation tokenisation gratuite",
    "quiz RWA",
    "attestation tokenisation",
  ],
};

export default function AcademyFundamentalsPage() {
  return (
    <>
      <AiFirstPageJsonLd path={ACADEMY_FUNDAMENTALS_ROUTE} />
      <div className="page-inner page-inner--3xl mx-auto px-4 pb-16 pt-10 md:px-6">
        <FundamentalsCertView />
      </div>
    </>
  );
}
