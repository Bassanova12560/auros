import type { Metadata } from "next";

import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { absoluteUrl } from "@/lib/comparators/site";
import { ACADEMY_ROUTE } from "@/lib/academy";

import { AcademyHomeView } from "./_components/AcademyHomeView";

function academyTallyUrl(): string | null {
  return process.env.TALLY_URL?.trim() || null;
}

export const metadata: Metadata = {
  title: "AUROS Academy | Certification RWA & formation tokenisation",
  description:
    "Certification RWA — AUROS Academy. Free Fundamentals track in FR/EN/ES. Verifiable 90-day certificate, optional PDF diploma.",
  alternates: { canonical: ACADEMY_ROUTE },
  openGraph: {
    title: "AUROS Academy | RWA Certification",
    description: "Free Fundamentals certification — FR / EN / ES. Verifiable certificate, optional PDF diploma.",
    url: absoluteUrl(ACADEMY_ROUTE),
    siteName: "AUROS Academy",
    type: "website",
  },
};

export default function AcademyPage() {
  return (
    <>
      <AiFirstPageJsonLd path={ACADEMY_ROUTE} />
      <AcademyHomeView tallyUrl={academyTallyUrl()} />
    </>
  );
}
