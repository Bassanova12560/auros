import type { Metadata } from "next";

import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { absoluteUrl } from "@/lib/comparators/site";
import { GREEN_REGISTER_ROUTE } from "@/lib/green";

import { GreenRegisterView } from "../_components/GreenRegisterView";

export const metadata: Metadata = {
  title: "Référencer un acteur | AUROS Green",
  description:
    "Inscrivez votre structure producteur, stockeur, rechargeur ou consommateur sur la place de marché énergie verte AUROS Green — couverture mondiale.",
  alternates: { canonical: GREEN_REGISTER_ROUTE },
  openGraph: {
    title: "Register a Green marketplace actor",
    url: absoluteUrl(GREEN_REGISTER_ROUTE),
    type: "website",
  },
};

export default function GreenRegisterPage() {
  return (
    <>
      <AiFirstPageJsonLd path={GREEN_REGISTER_ROUTE} />
      <GreenRegisterView />
    </>
  );
}
