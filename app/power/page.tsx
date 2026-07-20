import type { Metadata } from "next";

import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { metadataFromPath } from "@/lib/seo/metadata";

import { PowerHubView } from "./PowerHubView";

export const POWER_HUB_ROUTE = "/power";

export const metadata: Metadata = {
  ...metadataFromPath(POWER_HUB_ROUTE),
  title: "AUROS Power | Low-carbon & nucléaire",
  description:
    "Verticale low-carbon power AUROS — nucléaire et bas-carbone via Watts + ChargeFlow, hors Green Verified. Indicatif, pas un GO/REC.",
};

export default function PowerHubPage() {
  return (
    <>
      <AiFirstPageJsonLd path={POWER_HUB_ROUTE} />
      <div className="page-inner page-inner--3xl mx-auto px-4 pb-20 pt-12 md:px-6 md:pt-16">
        <PowerHubView />
      </div>
    </>
  );
}
