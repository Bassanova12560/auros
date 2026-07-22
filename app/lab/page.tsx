import type { Metadata } from "next";
import Link from "next/link";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { EnergyLabSimulator } from "./_components/EnergyLabSimulator";

export const metadata: Metadata = {
  title: "Energy Lab — Simulate producer revenue | AUROS",
  description:
    "Interactive sandbox: tokenize daily kWh, apply a mock market price, estimate lab revenue. Educational only — not a PPA.",
};

export default function EnergyLabPage() {
  return (
    <>
      <AiFirstPageJsonLd path="/lab" />
      <FocusPageShell path="/lab" width="6xl">
        <ContentPageLayout
          product="Resource Layer"
          eyebrow="Energy Lab"
          title="Simulate mint → sell"
          intro="You produce electricity. Slide the knobs. See how many resource tokens and how much illustrative revenue a mock mid-price would imply — then talk to us about a real pilot."
        >
          <div className="space-y-12">
            <EnergyLabSimulator />

            <section className="space-y-3 border-t border-white/10 pt-8 text-sm text-white/60">
              <h2 className="font-display text-xl text-white">Why this lab exists</h2>
              <p>
                Producers leave vision pages when they can’t picture cashflow. This sandbox is the
                bridge — still labeled lab, still HITL for settlement.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <PrimaryButton href="/resource-layer">Resource Layer</PrimaryButton>
                <PrimaryButton href="/builders" variant="ghost">
                  Builders
                </PrimaryButton>
                <PrimaryButton href="/producer" variant="ghost">
                  Producer demo
                </PrimaryButton>
              </div>
              <p className="font-mono text-[10px] text-white/35">
                Not financial advice · not an offtake agreement ·{" "}
                <Link href="/legal" className="underline hover:text-white/60">
                  legal
                </Link>
              </p>
            </section>
          </div>
        </ContentPageLayout>
      </FocusPageShell>
    </>
  );
}
