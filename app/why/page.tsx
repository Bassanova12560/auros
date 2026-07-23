import type { Metadata } from "next";
import Link from "next/link";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";

export const metadata: Metadata = {
  title: "Why Auros — liquidity for critical resources | AUROS",
  description:
    "Why institutions, producers, and builders choose AUROS: one liquidity engine for digital assets and tokenized energy, water, and compute.",
};

const BENEFITS = [
  {
    who: "Institution / exchange",
    why: "Risk-disciplined liquidity and labeled demos — no fake “trusted by” theater.",
  },
  {
    who: "Energy / water producer",
    why: "Sell metered production as units with a clear path: mint → wrap → spot — HITL for real settlement.",
  },
  {
    who: "Developer / AI agent",
    why: "Protocol + agent API + lab wallet you can exercise today without connecting MetaMask.",
  },
] as const;

export default function WhyPage() {
  return (
    <>
      <AiFirstPageJsonLd path="/why" />
      <FocusPageShell path="/why" width="3xl">
        <ContentPageLayout
          product="AUROS"
          eyebrow="Why Auros"
          title="One liquidity engine. Critical resources."
          intro="Benefit first — then how it works. We build institutional markets for digital assets and the settlement layer for tokenized energy, water, and compute."
        >
          <div className="space-y-12 text-sm leading-relaxed text-white/65">
            <section className="space-y-4">
              <h2 className="font-display text-xl text-white">Why us</h2>
              <ul className="space-y-4">
                {BENEFITS.map((b) => (
                  <li key={b.who} className="border-t border-white/10 pt-4">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                      {b.who}
                    </p>
                    <p className="mt-1 text-white/75">{b.why}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section className="space-y-3 border border-white/[0.08] bg-white/[0.02] px-5 py-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                Illustrative scenario · not a client case · not a guaranteed outcome
              </p>
              <h2 className="font-display text-lg text-white">
                Solar farm · 10 MW · projection
              </h2>
              <p>
                A 10 MW solar site that today sells surplus via opaque OTC quotes can, in the Auros
                lab path, mint attested kWh → wrap to WATT → offer spot to a data-center agent. The
                economic story is shorter discovery and labeled settlement —{" "}
                <strong className="font-medium text-white/85">not</strong> a promise of −12% costs.
                Real savings depend on offtake, grid fees, and counsel.
              </p>
              <PrimaryButton href="/lab">Run the Energy Lab</PrimaryButton>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl text-white">How it works (short)</h2>
              <ol className="list-decimal space-y-2 pl-5 text-white/60">
                <li>Meter / oracle attests production</li>
                <li>Resource units mint into a lab or pilot wallet</li>
                <li>Optional wrap to WATT (1:1 energy unit of account)</li>
                <li>Spot / agent hedges settle with caps — humans approve paid paths</li>
              </ol>
              <div className="mt-4 flex flex-wrap gap-2">
                <PrimaryButton href="/lab">1 · Mint</PrimaryButton>
                <PrimaryButton href="/producer" variant="ghost">
                  2 · Wrap
                </PrimaryButton>
                <PrimaryButton href="/trade?market=kwh-france" variant="ghost">
                  3 · Spot
                </PrimaryButton>
                <PrimaryButton href="/agent" variant="ghost">
                  Agent hedge
                </PrimaryButton>
              </div>
              <p className="font-mono text-[11px] text-white/40">
                Deep dive:{" "}
                <Link href="/resource-layer" className="underline-offset-2 hover:underline">
                  /resource-layer
                </Link>
                {" · "}
                <Link href="/builders" className="underline-offset-2 hover:underline">
                  /builders
                </Link>
                {" · "}
                <Link href="/status" className="underline-offset-2 hover:underline">
                  /status
                </Link>
                {" · "}
                <Link href="/blog/cross-exchange-risk-engine" className="underline-offset-2 hover:underline">
                  risk essay
                </Link>
              </p>
            </section>

            <section className="flex flex-wrap gap-3">
              <PrimaryButton href="mailto:resources@getauros.com?subject=Why%20Auros">
                Talk to the team
              </PrimaryButton>
              <PrimaryButton href="/#solutions" variant="ghost">
                Choose your path
              </PrimaryButton>
            </section>
          </div>
        </ContentPageLayout>
      </FocusPageShell>
    </>
  );
}
