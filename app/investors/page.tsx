import type { Metadata } from "next";
import Link from "next/link";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { NextStepStrip } from "@/app/_components/NextStepStrip";
import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";

export const metadata: Metadata = {
  title: "Investors — AUROS diligence desk",
  description:
    "Investor one-pager for AUROS: thesis, live product surfaces, stack, labeled business model, honest risks. No invented TVL, partners, or audit badges.",
};

const SURFACES = [
  { href: "/resource-layer", label: "Vision", status: "Shipped marketing + roadmap" },
  { href: "/lab", label: "Energy Lab", status: "Live lab ledger · mint" },
  { href: "/producer", label: "Producer", status: "Live · mint + wrap WATT" },
  { href: "/trade", label: "Trade", status: "Live spot · advanced = session toy" },
  { href: "/agent", label: "Agent", status: "Lab spot hedge (not a cleared forward)" },
  { href: "/market", label: "Market", status: "Labeled marks · not live volume" },
  { href: "/watt", label: "WATT", status: "Unit of account · lab wrap" },
  { href: "/earn", label: "Earn", status: "Preview · not a yield product" },
  { href: "/builders", label: "Builders", status: "Architecture · repo · testnet path" },
  { href: "/status", label: "Status", status: "Public probes · not an SLA" },
] as const;

export default function InvestorsPage() {
  return (
    <>
      <AiFirstPageJsonLd path="/investors" />
      <FocusPageShell path="/investors" width="3xl">
        <ContentPageLayout
          product="AUROS"
          eyebrow="Investors"
          title="The liquidity engine for tokenized resources"
          intro="Meters in, tradable units out. Diligence without invented ARR, fake logos, or closed-round theater — Morpho/Ondo-style clarity, AUROS honesty."
        >
          <div className="space-y-12 text-sm leading-relaxed text-white/65">
            <section className="flex flex-wrap gap-3">
              <PrimaryButton href="mailto:resources@getauros.com?subject=AUROS%20diligence">
                Request diligence pack
              </PrimaryButton>
              <PrimaryButton href="/lab" variant="ghost">
                Run the lab loop
              </PrimaryButton>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl text-white">Thesis</h2>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong className="font-medium text-white/90">$RWA issuance</strong> is crowded;{" "}
                  <strong className="font-medium text-white/90">resource liquidity</strong> (kWh,
                  water, compute-linked power) is not.
                </li>
                <li>
                  AI data centers need programmatic hedges; solar sites need real-time monetization
                  of surplus.
                </li>
                <li>
                  ARL connects both with oracle-gated units + agent API under{" "}
                  <strong className="font-medium text-white/90">HITL</strong> settlement — no fake
                  volume badges.
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="font-display text-xl text-white">Live product surfaces</h2>
              <p className="text-white/50">
                Exercise the shared lab ledger yourself. Spot sells akWh; wrapped WATT auto-redeems
                1:1 before sell.
              </p>
              <ul className="divide-y divide-white/[0.06] border border-white/[0.08]">
                {SURFACES.map((s) => (
                  <li
                    key={s.href}
                    className="grid gap-1 px-4 py-3 sm:grid-cols-[10rem_1fr_1fr] sm:items-center sm:gap-4"
                  >
                    <Link
                      href={s.href}
                      className="font-mono text-[11px] text-white/80 underline-offset-2 hover:underline"
                    >
                      {s.href}
                    </Link>
                    <span className="text-white/85">{s.label}</span>
                    <span className="font-mono text-[10px] text-white/40">{s.status}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl text-white">Two products, one engine</h2>
              <ol className="list-decimal space-y-2 pl-5">
                <li>
                  <Link href="/start" className="underline-offset-2 hover:underline">
                    RWA dossier
                  </Link>{" "}
                  — admission score, data room, jurisdiction path for issuers.
                </li>
                <li>
                  <Link href="/resource-layer" className="underline-offset-2 hover:underline">
                    Resource Layer (ARL)
                  </Link>{" "}
                  — meter → mint → wrap → spot / agent hedges (lab today, pilots HITL).
                </li>
              </ol>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl text-white">Stack</h2>
              <pre className="overflow-x-auto border border-white/[0.08] bg-black/40 p-4 font-mono text-[10px] leading-5 text-white/55">
{`protocol/     Solidity (Hardhat, OZ UUPS)
agent-api/    TypeScript · Express · ethers v6
iot-bridge/   MQTT → oracle pipeline
app/          Next.js · getauros.com + lab ledger`}
              </pre>
              <p className="font-mono text-[10px] text-white/35">
                Repo ·{" "}
                <a
                  href="https://github.com/Bassanova12560/auros"
                  className="underline-offset-2 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  github.com/Bassanova12560/auros
                </a>
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl text-white">Business model</h2>
              <p className="font-mono text-[10px] uppercase tracking-wider text-amber-200/70">
                Hypothesis · not guidance
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>Protocol fee on mint / settlement volume (pilot-tier bps)</li>
                <li>SaaS for agent-api + monitoring (enterprise)</li>
                <li>RFQ / liquidity partner rev-share after HITL pilots</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl text-white">Moat</h2>
              <ol className="list-decimal space-y-2 pl-5">
                <li>Combined issuer + flow story (dossier + liquidity)</li>
                <li>Agent-first API with safety gates</li>
                <li>IoT + oracle path — not PDF-only RWAs</li>
              </ol>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl text-white">Risks (honest)</h2>
              <ul className="list-disc space-y-2 pl-5">
                <li>Regulatory variance by region</li>
                <li>Oracle / device trust</li>
                <li>Liquidity cold-start — mitigated via HITL RFQ, not fake volume</li>
                <li>
                  No third-party audit badge claimed yet — see{" "}
                  <Link href="/builders" className="underline-offset-2 hover:underline">
                    /builders
                  </Link>
                </li>
              </ul>
            </section>

            <section className="space-y-3 border-t border-white/10 pt-8">
              <h2 className="font-display text-xl text-white">Ask / contact</h2>
              <p>
                Seed extension / strategic conversations for protocol engineers, IoT, and MM partner
                onboarding. Use of funds narrative: Sepolia → mainnet pilot, security review,
                producer #1 — details on written request.
              </p>
              <ul className="space-y-2 font-mono text-[12px]">
                <li>
                  <a
                    href="mailto:resources@getauros.com"
                    className="underline-offset-2 hover:underline"
                  >
                    resources@getauros.com
                  </a>{" "}
                  — product & diligence
                </li>
                <li>
                  <a href="mailto:legal@auros.app" className="underline-offset-2 hover:underline">
                    legal@auros.app
                  </a>{" "}
                  — entity pack on written request
                </li>
              </ul>
              <p className="font-mono text-[10px] text-white/35">
                Not an offer to sell securities. Green listing diligence:{" "}
                <Link href="/green/investors" className="underline-offset-2 hover:underline">
                  /green/investors
                </Link>
                .
              </p>
            </section>

            <NextStepStrip preset="company" />
          </div>
        </ContentPageLayout>
      </FocusPageShell>
    </>
  );
}
