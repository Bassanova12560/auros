import type { Metadata } from "next";

import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";

import { WhyPageContent } from "./_components/WhyPageContent";

export const metadata: Metadata = {
  title: "Why Auros — liquidity for critical resources | AUROS",
  description:
    "Why institutions, producers, and builders choose AUROS: one liquidity engine for digital assets and tokenized energy, water, and compute.",
};

export default function WhyPage() {
  return (
    <>
      <AiFirstPageJsonLd path="/why" />
      <FocusPageShell path="/why" width="3xl">
        <WhyPageContent />
      </FocusPageShell>
    </>
  );
}
