import type { Metadata } from "next";

import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { CHARGEFLOW_ROUTE } from "@/lib/chargeflow/constants";
import { metadataFromPath } from "@/lib/seo/metadata";

import { ChargeflowPitchView } from "./ChargeflowPitchView";

export const metadata: Metadata = {
  ...metadataFromPath(CHARGEFLOW_ROUTE),
  title: "AUROS ChargeFlow | CFU-E",
  description:
    "Standard institutionnel pour enregistrer une session de charge kWh en unité de flux vérifiable (CFU-E) — hash, HMAC, Watt companion.",
};

export default function GreenChargeflowPage() {
  return (
    <>
      <AiFirstPageJsonLd path={CHARGEFLOW_ROUTE} />
      <div className="page-inner page-inner--3xl mx-auto px-4 pb-20 pt-12 md:px-6 md:pt-14">
        <ChargeflowPitchView />
      </div>
    </>
  );
}
