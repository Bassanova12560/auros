import type { Metadata } from "next";

import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { absoluteUrl } from "@/lib/comparators/site";
import { GREEN_PRATICIEN_EXAM_ROUTE } from "@/lib/green";

import { GreenPraticienExamView } from "../../_components/GreenPraticienExamView";

export const metadata: Metadata = {
  title: "Examen Praticien Green | AUROS Green",
  description:
    "Quiz RTMS Praticien Green — badge expert vérifiable. FR / EN / ES.",
  alternates: { canonical: GREEN_PRATICIEN_EXAM_ROUTE },
  robots: { index: false, follow: false },
  openGraph: {
    title: "Green Praticien exam | AUROS Green",
    url: absoluteUrl(GREEN_PRATICIEN_EXAM_ROUTE),
    type: "website",
  },
};

export default function GreenPraticienExamPage() {
  return (
    <>
      <AiFirstPageJsonLd path={GREEN_PRATICIEN_EXAM_ROUTE} />
      <GreenPraticienExamView />
    </>
  );
}
