import type { Metadata } from "next";

import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { absoluteUrl } from "@/lib/comparators/site";
import { GREEN_REGISTER_ROUTE } from "@/lib/green";

import { GreenRegisterFormServer } from "../_components/GreenRegisterFormServer";
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
      <noscript>
        <div className="page-inner page-inner--3xl mx-auto px-4 py-12 md:px-6">
          <GreenRegisterFormServer />
        </div>
      </noscript>
      <GreenRegisterView />
    </>
  );
}
