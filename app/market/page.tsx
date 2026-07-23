import type { Metadata } from "next";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";

import { MarketTable } from "./_components/MarketTable";

export const metadata: Metadata = {
  title: "Resource marketplace — Auros Resource Layer | AUROS",
  description: "Preview marketplace for tokenized kWh, water, and other resource units.",
};

export default function MarketPage() {
  return (
    <>
      <AiFirstPageJsonLd path="/market" />
      <FocusPageShell path="/market" width="6xl">
        <ContentPageLayout
          product="Resource Layer"
          eyebrow="Market · Demo"
          title="Resource marketplace"
          intro="Indicative marks from the same index as /trade. Spot opens your lab wallet terminal — volumes are labels, not claimed exchange volume."
        >
          <MarketTable />
        </ContentPageLayout>
      </FocusPageShell>
    </>
  );
}
