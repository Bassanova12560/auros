import Link from "next/link";

import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";

import { ResourceLayerLab } from "./_components/ResourceLayerLab";

export const metadata = {
  title: "Auros Resource Layer | The Liquidity Engine for the Tokenized World",
  description:
    "Institutional market making for tokenized energy, water, carbon — and the machine economy. Powered by WATT.",
};

const PILLARS = [
  {
    title: "Tokenize Any Resource",
    body: "Resource Tokenization Protocol turns physical units (kWh, litres, carbon) into upgradeable on-chain ERC-20s with IoT Proof-of-Resource minting.",
  },
  {
    title: "Instant Liquidity",
    body: "Every new resource token can be bootstrapped into a deep Uniswap V3 market seeded by the Auros liquidity engine.",
  },
  {
    title: "Machine-Ready API",
    body: "AI agents, robots, and data centers place spot and forward orders over a signed agent API — settlement stays on-chain.",
  },
] as const;

const FOR_YOU = [
  {
    who: "Solar / energy producer",
    plain:
      "You connect a verified meter. When you produce electricity, the system can mint tokens that represent those kWh. You sell them on the Auros market instead of waiting for opaque OTC quotes.",
    jargon: "tokenization · oracle · mint",
  },
  {
    who: "Data center or AI operator",
    plain:
      "You forecast tomorrow’s load, then lock energy ahead of time through the agent API — like a forward purchase order, settled in energy units.",
    jargon: "forward order · hedge · agent API",
  },
  {
    who: "IoT / OEM manufacturer",
    plain:
      "Your devices sign production readings. Auros registers them so only trusted hardware can create resource tokens.",
    jargon: "DeviceRegistry · Proof-of-Resource",
  },
] as const;

export default function ResourceLayerPage() {
  return (
    <>
      <AiFirstPageJsonLd path="/resource-layer" />
      <FocusPageShell path="/resource-layer" width="6xl">
        <ContentPageLayout
          product="Resource Layer"
          eyebrow="Auros Resource Layer"
          title="The Liquidity Engine for the Tokenized World"
          intro="Auros expands its institutional market making to tokenized physical resources: energy (kWh), water, carbon, and beyond."
        >
          <div className="space-y-14 text-sm leading-relaxed text-white/65">
            <ResourceLayerLab />

            <section className="space-y-3">
              <h2 className="font-display text-xl text-white">Manifesto</h2>
              <p>
                We are building the settlement layer for the machine economy. AI
                agents, robots, and autonomous devices will trade resources
                on-chain with deep liquidity provided by Auros.
              </p>
              <p>
                Powered by{" "}
                <Link
                  href="/resource-layer/faq#watt"
                  className="text-white/85 underline-offset-2 hover:text-white hover:underline"
                >
                  WATT
                </Link>
                — the energy stablecoin designed to become the unit of account
                for machines.{" "}
                <Link
                  href="/resource-layer/faq#watt"
                  className="font-mono text-[11px] text-white/40 underline-offset-2 hover:text-white/70 hover:underline"
                >
                  WATT notes →
                </Link>
              </p>
            </section>

            <section className="grid gap-8 md:grid-cols-3">
              {PILLARS.map((p) => (
                <div key={p.title} className="space-y-2 border-t border-white/10 pt-4">
                  <h3 className="font-display text-base text-white">{p.title}</h3>
                  <p>{p.body}</p>
                </div>
              ))}
            </section>

            <section id="get-started" className="space-y-4 scroll-mt-28">
              <h2 className="font-display text-xl text-white">Get started</h2>
              <p>
                Don’t leave with a brochure. Enter the lab, mint a demo unit, or
                apply for a pilot — human review on every paid path.
              </p>
              <div className="flex flex-wrap gap-3">
                <PrimaryButton href="/trade">Open trading terminal</PrimaryButton>
                <PrimaryButton href="/producer" variant="ghost">
                  Mint your first kWh (demo)
                </PrimaryButton>
                <PrimaryButton href="/careers" variant="ghost">
                  Hiring · join the build
                </PrimaryButton>
                <a
                  href="mailto:resources@getauros.com?subject=ARL%20early%20access"
                  className="inline-flex items-center font-mono text-[11px] text-white/50 underline-offset-4 hover:text-white hover:underline"
                >
                  Apply for early access →
                </a>
              </div>
              <p className="font-mono text-[10px] text-white/35">
                Local stack: see ARL-README.md · Run agent-api + protocol Hardhat
                node for a full testnet loop.
              </p>
            </section>

            <section className="space-y-6">
              <div>
                <h2 className="font-display text-xl text-white">
                  What does this mean for you?
                </h2>
                <p className="mt-2">
                  Plain language for operators who don’t live in crypto jargon.
                </p>
              </div>
              <ul className="space-y-6">
                {FOR_YOU.map((row) => (
                  <li key={row.who} className="border-t border-white/10 pt-4">
                    <h3 className="font-display text-base text-white">{row.who}</h3>
                    <p className="mt-2">{row.plain}</p>
                    <p className="mt-2 font-mono text-[10px] uppercase tracking-wide text-white/30">
                      {row.jargon}
                    </p>
                  </li>
                ))}
              </ul>
              <Link
                href="/resource-layer/faq"
                className="inline-block font-mono text-[11px] text-white/45 underline-offset-2 hover:text-white hover:underline"
              >
                Full FAQ & lexicon →
              </Link>
            </section>

            <section className="space-y-3 border-t border-white/10 pt-8">
              <h2 className="font-display text-xl text-white">Team & hiring</h2>
              <p>
                The Resource Layer is not a side project — we are staffing
                markets and IoT integration now.
              </p>
              <ul className="space-y-2 text-white/70">
                <li>
                  <span className="text-white/90">Head of Resource Markets</span>
                  {" — "}
                  <span className="font-mono text-[11px] text-white/45">Hiring</span>
                </li>
                <li>
                  <span className="text-white/90">IoT Integration Lead</span>
                  {" — "}
                  <span className="font-mono text-[11px] text-white/45">Hiring</span>
                </li>
              </ul>
              <PrimaryButton href="/careers" variant="ghost">
                View open roles
              </PrimaryButton>
            </section>

            <section className="border border-white/10 bg-white/[0.03] px-5 py-4">
              <p className="text-white/80">
                Collaborators welcome: energy producers, IoT hardware makers,
                blockchain developers.
              </p>
              <a
                href="mailto:resources@getauros.com"
                className="mt-2 inline-block font-mono text-xs text-white/50 underline-offset-4 hover:text-white hover:underline"
              >
                resources@getauros.com
              </a>
            </section>
          </div>
        </ContentPageLayout>
      </FocusPageShell>
    </>
  );
}
