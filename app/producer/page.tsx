import type { Metadata } from "next";
import Link from "next/link";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";

import { ProducerDashboard } from "./_components/ProducerDashboard";

export const metadata: Metadata = {
  title: "Producer dashboard — Auros Resource Layer | AUROS",
  description: "Preview dashboard for energy producers: devices, production, minted resource tokens.",
};

export default function ProducerPage() {
  return (
    <>
      <AiFirstPageJsonLd path="/producer" />
      <FocusPageShell path="/producer" width="6xl">
        <ContentPageLayout
          product="Resource Layer"
          eyebrow="Producer · Demo"
          title="Energy producer console"
          intro="Surplus kWh flows from meters into oracle-gated mints. Mint akWh here, wrap to WATT 1:1, then settle spot on /trade — shared lab ledger across producer, lab, and trade."
        >
          <p className="mb-6 flex flex-wrap gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-wider text-white/40">
            <Link href="/lab" className="hover:text-white/70">
              Energy Lab →
            </Link>
            <Link href="/builders" className="hover:text-white/70">
              Builders →
            </Link>
            <Link href="/resource-layer" className="hover:text-white/70">
              Vision →
            </Link>
          </p>
          <ProducerDashboard />
        </ContentPageLayout>
      </FocusPageShell>
    </>
  );
}
