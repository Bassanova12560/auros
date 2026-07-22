import type { Metadata } from "next";

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
          intro="Surplus kWh flows from meters and inverters into oracle-gated mints. This console previews how a site operator sees devices, production, and token balance."
        >
          <ProducerDashboard />
        </ContentPageLayout>
      </FocusPageShell>
    </>
  );
}
