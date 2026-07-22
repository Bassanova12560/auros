import type { Metadata } from "next";
import Link from "next/link";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { AurosButton } from "@/app/_components/AurosButton";

export const metadata: Metadata = {
  title: "Careers — Auros Resource Layer | AUROS",
  description:
    "Open roles: Head of IoT Integration, Protocol Engineer (Energy Markets), markets lead — Auros Resource Layer.",
};

const ROLES = [
  {
    title: "Head of IoT Integration",
    team: "iot-bridge · hiring now",
    summary:
      "Own device attestation end-to-end: OEM partnerships, meter/inverter firmware hooks, MQTT → ECDSA Proof-of-Resource pipelines, and the security bar that keeps unauthorized hardware from minting.",
    impact:
      "You make “resource tokens” real — only trusted devices create supply. Without this role, Resource Layer is a deck.",
    stack:
      "Edge Linux · Mosquitto / MQTT TLS · industrial protocols · device keys · Node or Rust · Soft skills: OEM diligence",
    apply:
      "Subject: Head of IoT Integration — include prior industrial IoT or metering work + a short threat model for replay.",
  },
  {
    title: "Protocol Engineer — Energy Markets",
    team: "protocol · Solidity",
    summary:
      "Ship and harden EnergyFutures, ResourceOptions, lending, and parametric insurance: UUPS upgrades, circuit-breakers, position caps, pause paths, and audit-ready Hardhat suites.",
    impact:
      "You turn metered units into tradeable risk — without fake Verified badges or uncapped OI.",
    stack:
      "Solidity ^0.8.24 · OpenZeppelin UUPS · Reentrancy / Pausable · Hardhat · ethers v6 · Prefer DeFi risk literacy",
    apply:
      "Subject: Protocol Engineer – Energy Markets — link a repo with tests; note any audit participation.",
  },
  {
    title: "Head of Resource Markets",
    team: "markets · hiring",
    summary:
      "Own ARL market design (kWh, water, compute), LP relationships, and honest pilot narrative — no fake volume badges.",
    impact: "Institutions judge us on clarity of depth and labels, not slogans.",
    stack: "Energy markets · RWA / crypto fluency · EU time zones",
    apply: "Subject: Head of Resource Markets — one-pager on a past market design or LP program.",
  },
  {
    title: "AI agent & markets engineer",
    team: "agent-api",
    summary:
      "Consumption forecasting, hedge cron jobs, and safe automation with HITL gates for forward energy orders.",
    impact: "Agents that can order kWh without becoming an unsupervised risk engine.",
    stack: "TypeScript · Express · ethers v6 · time-series models · rate limits / auth",
    apply: "Subject: Agent & markets engineer — sample of a hedging or forecasting system.",
  },
] as const;

export default function CareersPage() {
  return (
    <>
      <AiFirstPageJsonLd path="/careers" />
      <FocusPageShell path="/careers" width="3xl">
        <ContentPageLayout
          product="AUROS"
          eyebrow="Careers"
          title="Build the resource liquidity layer"
          intro="Small team, high bar for safety and honesty. Remote-friendly (EU time zones preferred). We ship demos clearly labeled — no fake certifications."
        >
          <ul className="space-y-6">
            {ROLES.map((role) => (
              <li
                key={role.title}
                className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-6"
              >
                <p className="font-mono text-[10px] uppercase text-white/40">{role.team}</p>
                <h2 className="mt-1 font-display text-lg font-medium text-white">{role.title}</h2>
                <p className="mt-2 text-sm text-white/60">{role.summary}</p>
                <p className="mt-3 text-sm text-white/45">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-white/30">
                    Impact ·{" "}
                  </span>
                  {role.impact}
                </p>
                <p className="mt-3 font-mono text-[11px] text-white/40">{role.stack}</p>
                <p className="mt-4 font-mono text-[10px] text-white/30">{role.apply}</p>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-sm text-white/55">
            Intro + GitHub or protocol sample:{" "}
            <a
              href="mailto:careers@getauros.com"
              className="text-white/80 underline decoration-white/25 hover:text-white"
            >
              careers@getauros.com
            </a>
            . Stack walkthrough:{" "}
            <Link href="/builders" className="underline hover:text-white">
              /builders
            </Link>
            ,{" "}
            <Link href="/resource-layer" className="underline hover:text-white">
              ARL vision
            </Link>
            ,{" "}
            <Link
              href="/blog/cross-exchange-risk-engine"
              className="underline hover:text-white"
            >
              risk engine essay
            </Link>
            .
          </p>
          <p className="mt-6">
            <AurosButton href="mailto:careers@getauros.com">Apply by email</AurosButton>
          </p>
        </ContentPageLayout>
      </FocusPageShell>
    </>
  );
}
