import type { Metadata } from "next";

import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { WATTS_SECONDARY_ROUTE } from "@/lib/watts";
import { metadataFromPath } from "@/lib/seo/metadata";

import { WattsSecondaryView } from "./WattsSecondaryView";

export const metadata: Metadata = {
  ...metadataFromPath(WATTS_SECONDARY_ROUTE),
  title: "AUROS Watts Secondary | Positions & RWA prep",
  description:
    "Listings secondaires indicatifs de positions watts, lien compare_ref_id vers le comparateur RWA. Pas un marché réglementé.",
};

export default function WattsSecondaryPage() {
  return (
    <>
      <AiFirstPageJsonLd path={WATTS_SECONDARY_ROUTE} />
      <div className="page-inner page-inner--3xl mx-auto px-4 pb-20 pt-12 md:px-6 md:pt-14">
        <WattsSecondaryView />
      </div>
    </>
  );
}
