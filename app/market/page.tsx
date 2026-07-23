import type { Metadata } from "next";
import Link from "next/link";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
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
          <div className="mb-8 flex flex-wrap gap-3">
            <PrimaryButton href="/lab">1 · Mint (Lab)</PrimaryButton>
            <PrimaryButton href="/producer" variant="ghost">
              2 · Wrap (Producer)
            </PrimaryButton>
            <PrimaryButton href="/trade?market=kwh-france" variant="ghost">
              3 · Spot (Trade)
            </PrimaryButton>
            <PrimaryButton href="/agent" variant="ghost">
              Agent hedge
            </PrimaryButton>
          </div>
          <MarketTable />
          <p className="mt-6 font-mono text-[11px] text-white/40">
            New here?{" "}
            <Link href="/builders" className="underline-offset-2 hover:underline">
              5-minute site demo
            </Link>
            {" · "}
            <Link href="/status" className="underline-offset-2 hover:underline">
              /status
            </Link>
          </p>
        </ContentPageLayout>
      </FocusPageShell>
    </>
  );
}
