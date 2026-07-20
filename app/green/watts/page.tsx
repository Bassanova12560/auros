import type { Metadata } from "next";

import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { WATTS_HUB_ROUTE } from "@/lib/watts";
import { metadataFromPath } from "@/lib/seo/metadata";

import { WattsHubView } from "./WattsHubView";

export const metadata: Metadata = {
  ...metadataFromPath(WATTS_HUB_ROUTE),
  title: "AUROS Watts | Booking engine des watts",
  description:
    "Réserver, prouver et préparer la finance des watts critiques — matching, CFU, inventaire, secondaire. Indicatif, pas un marché réglementé.",
};

export default function WattsHubPage() {
  return (
    <>
      <AiFirstPageJsonLd path={WATTS_HUB_ROUTE} />
      <div className="page-inner page-inner--3xl mx-auto px-4 pb-20 pt-12 md:px-6 md:pt-16">
        <WattsHubView />
      </div>
    </>
  );
}
