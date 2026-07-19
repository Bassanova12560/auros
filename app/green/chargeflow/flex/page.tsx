import type { Metadata } from "next";

import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { CHARGEFLOW_F_ROUTE } from "@/lib/chargeflow/constants";
import { metadataFromPath } from "@/lib/seo/metadata";

import { ChargeflowFPitchView } from "./ChargeflowFPitchView";

export const metadata: Metadata = {
  ...metadataFromPath(CHARGEFLOW_F_ROUTE),
  title: "AUROS ChargeFlow CFU-F | Flex",
  description:
    "Enregistrer une fenêtre de flexibilité kW en unité de flux vérifiable (CFU-F) — hash, HMAC, Watt companion.",
};

export default function GreenChargeflowFlexPage() {
  return (
    <>
      <AiFirstPageJsonLd path={CHARGEFLOW_F_ROUTE} />
      <div className="page-inner page-inner--3xl mx-auto px-4 pb-20 pt-12 md:px-6 md:pt-14">
        <ChargeflowFPitchView />
      </div>
    </>
  );
}
