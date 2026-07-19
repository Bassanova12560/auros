import type { Metadata } from "next";

import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { CHARGEFLOW_W_ROUTE } from "@/lib/chargeflow/constants";
import { metadataFromPath } from "@/lib/seo/metadata";

import { ChargeflowWPitchView } from "./ChargeflowWPitchView";

export const metadata: Metadata = {
  ...metadataFromPath(CHARGEFLOW_W_ROUTE),
  title: "AUROS ChargeFlow CFU-W | Eau",
  description:
    "Standard institutionnel pour enregistrer un flux hydrique m³ en unité de flux vérifiable (CFU-W) — hash, HMAC, H₂O companion.",
};

export default function EauChargeflowPage() {
  return (
    <>
      <AiFirstPageJsonLd path={CHARGEFLOW_W_ROUTE} />
      <div className="page-inner page-inner--3xl mx-auto px-4 pb-20 pt-12 md:px-6 md:pt-14">
        <ChargeflowWPitchView />
      </div>
    </>
  );
}
