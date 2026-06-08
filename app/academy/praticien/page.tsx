import type { Metadata } from "next";

import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { absoluteUrl } from "@/lib/comparators/site";
import { ACADEMY_PRATICIEN_ROUTE } from "@/lib/academy";

import { AcademyPraticienView } from "../_components/AcademyPraticienView";

function academyTallyUrl(): string | null {
  return process.env.TALLY_URL?.trim() || null;
}

export const metadata: Metadata = {
  title: "Certification Praticien RWA | AUROS Academy",
  description:
    "Advanced RWA practitioner track — AUROS Academy. Not open yet — join the waitlist.",
  alternates: { canonical: ACADEMY_PRATICIEN_ROUTE },
  openGraph: {
    title: "RWA Practitioner Certification | AUROS Academy",
    url: absoluteUrl(ACADEMY_PRATICIEN_ROUTE),
    siteName: "AUROS Academy",
  },
};

export default function AcademyPraticienPage() {
  return (
    <>
      <AiFirstPageJsonLd path={ACADEMY_PRATICIEN_ROUTE} />
      <AcademyPraticienView tallyUrl={academyTallyUrl()} />
    </>
  );
}
