import type { Metadata } from "next";

import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { WATTS_INVENTORY_ROUTE } from "@/lib/watts";
import { metadataFromPath } from "@/lib/seo/metadata";

import { WattsInventoryView } from "./WattsInventoryView";

export const metadata: Metadata = {
  ...metadataFromPath(WATTS_INVENTORY_ROUTE),
  title: "AUROS Watts Inventory | Capacité producteur",
  description:
    "Inventaire de fenêtres de capacité producteur — publier, parcourir, matcher un profil acheteur. Indicatif, pas un PPA.",
};

export default function WattsInventoryPage() {
  return (
    <>
      <AiFirstPageJsonLd path={WATTS_INVENTORY_ROUTE} />
      <div className="page-inner page-inner--3xl mx-auto px-4 pb-20 pt-12 md:px-6 md:pt-14">
        <WattsInventoryView />
      </div>
    </>
  );
}
