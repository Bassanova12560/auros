import type { Metadata } from "next";

import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { absoluteUrl } from "@/lib/comparators/site";
import { GREEN_PRATICIEN_ROUTE } from "@/lib/green";

import { GreenPraticienView } from "../_components/GreenPraticienView";

export const metadata: Metadata = {
  title: "Praticien Green | AUROS Green",
  description:
    "Parcours Praticien Green — spécialisation audit RTMS pour experts RWA verts. Liste d'attente FR / EN / ES.",
  alternates: { canonical: GREEN_PRATICIEN_ROUTE },
  openGraph: {
    title: "Green Praticien track | AUROS Green",
    url: absoluteUrl(GREEN_PRATICIEN_ROUTE),
    type: "website",
  },
};

export default function GreenPraticienPage() {
  return (
    <>
      <AiFirstPageJsonLd path={GREEN_PRATICIEN_ROUTE} />
      <GreenPraticienView />
    </>
  );
}
