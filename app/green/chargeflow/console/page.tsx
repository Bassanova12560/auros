import type { Metadata } from "next";

import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { CHARGEFLOW_CONSOLE_ROUTE } from "@/lib/chargeflow/constants";
import { metadataFromPath } from "@/lib/seo/metadata";

import { ChargeflowConsoleView } from "./ChargeflowConsoleView";

export const metadata: Metadata = {
  ...metadataFromPath(CHARGEFLOW_CONSOLE_ROUTE),
  title: "Console ChargeFlow | AUROS",
  description:
    "Listez et retirez vos unités CFU-E / CFU-W / CFU-F avec une clé Protocol Premium.",
};

export default function ChargeflowConsolePage() {
  return (
    <>
      <AiFirstPageJsonLd path={CHARGEFLOW_CONSOLE_ROUTE} />
      <div className="page-inner page-inner--4xl mx-auto px-4 pb-20 pt-12 md:px-6 md:pt-14">
        <ChargeflowConsoleView />
      </div>
    </>
  );
}
