import type { Metadata } from "next";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";

import { TradeTerminal } from "./_components/TradeTerminal";

export const metadata: Metadata = {
  title: "Trade — Auros Resource Layer | AUROS",
  description: "Demo trading terminal for resource spot, perps, and options.",
};

export default function TradePage() {
  return (
    <>
      <AiFirstPageJsonLd path="/trade" />
      <FocusPageShell path="/trade" width="6xl">
        <ContentPageLayout
          product="Resource Layer"
          eyebrow="Terminal · Demo"
          title="Trade resources, perps & options"
          intro="Unified ticket for tokenized kWh, compute FLOP, and Phase 3 derivatives. Orders here are simulated — production routing goes through agent-api and on-chain settlements."
        >
          <TradeTerminal />
        </ContentPageLayout>
      </FocusPageShell>
    </>
  );
}
