import type { Metadata } from "next";
import Link from "next/link";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { NextStepStrip } from "@/app/_components/NextStepStrip";
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
          intro="Indicative marks from the same index as /trade. Open a row to settle spot on your lab wallet — volumes are labels, not claimed exchange volume."
        >
          <MarketTable />
          <NextStepStrip preset="afterTrade" />
          <p className="mt-4 font-mono text-[10px] text-white/30">
            Walkthrough:{" "}
            <Link href="/builders" className="underline-offset-2 hover:underline">
              5-minute site demo
            </Link>
          </p>
        </ContentPageLayout>
      </FocusPageShell>
    </>
  );
}
