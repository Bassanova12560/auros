import type { Metadata } from "next";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { NextStepStrip } from "@/app/_components/NextStepStrip";

import { PresencePageContent } from "./_components/PresencePageContent";

export const metadata: Metadata = {
  title: "Presence — markets & green directories | AUROS",
  description:
    "Where AUROS shows up: DeFiLlama data, RWA.xyz, climate/ESG directories. Green-first presence board — submission-ready, no fake listed-on badges.",
};

export default function PresencePage() {
  return (
    <>
      <AiFirstPageJsonLd path="/presence" />
      <FocusPageShell path="/presence" width="3xl">
        <ContentPageLayout
          product="AUROS"
          eyebrow="Presence · markets"
          title="Green-first market presence"
          intro="Visibility and seriousness for the mandatory reporting wave — CSRD, EU Taxonomy, climate-linked RWA — without inventing partner logos."
        >
          <PresencePageContent />
          <div className="mt-12">
            <NextStepStrip preset="company" />
          </div>
        </ContentPageLayout>
      </FocusPageShell>
    </>
  );
}
