import type { Metadata } from "next";

import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { WATTS_RESERVE_ROUTE } from "@/lib/watts";
import { metadataFromPath } from "@/lib/seo/metadata";

import { WattsReserveView } from "./WattsReserveView";

export const metadata: Metadata = {
  ...metadataFromPath(WATTS_RESERVE_ROUTE),
  title: "AUROS Watts Reserve | Réserver des watts",
  description:
    "Réservez un profil énergétique, matching déterministe, confirm explicite → mint CFU-E ou CFU-F. Pas de livraison réseau garantie.",
};

export default function WattsReservePage() {
  return (
    <>
      <AiFirstPageJsonLd path={WATTS_RESERVE_ROUTE} />
      <div className="page-inner page-inner--3xl mx-auto px-4 pb-20 pt-12 md:px-6 md:pt-14">
        <WattsReserveView />
      </div>
    </>
  );
}
