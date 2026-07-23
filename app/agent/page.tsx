import type { Metadata } from "next";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";

import { AgentDashboard } from "./_components/AgentDashboard";

export const metadata: Metadata = {
  title: "Agent dashboard — Auros Resource Layer | AUROS",
  description:
    "Preview console for AI agents and data centers: consumption forecasts, hedges, forward orders.",
};

export default function AgentPage() {
  return (
    <>
      <AiFirstPageJsonLd path="/agent" />
      <FocusPageShell path="/agent" width="6xl">
        <ContentPageLayout
          product="Resource Layer"
          eyebrow="Agent · Demo"
          title="AI & data-center agent console"
          intro="Agents predict load and buy hedges into the shared lab wallet (EUR → akWh). Production settlement stays human-gated."
        >
          <AgentDashboard />
        </ContentPageLayout>
      </FocusPageShell>
    </>
  );
}
