import type { Metadata } from "next";

import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";

import { InvestorsPageContent } from "./_components/InvestorsPageContent";

export const metadata: Metadata = {
  title: "Investors — AUROS diligence desk",
  description:
    "Investor one-pager for AUROS: thesis, live product surfaces, stack, labeled business model, honest risks. No invented TVL, partners, or audit badges.",
};

export default function InvestorsPage() {
  return (
    <>
      <AiFirstPageJsonLd path="/investors" />
      <FocusPageShell path="/investors" width="3xl">
        <InvestorsPageContent />
      </FocusPageShell>
    </>
  );
}
