import type { Metadata } from "next";
import Link from "next/link";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { AurosButton } from "@/app/_components/AurosButton";

export const metadata: Metadata = {
  title: "Careers — Auros Resource Layer | AUROS",
  description: "Open roles: IoT bridge, Solidity protocol, AI agent systems for Auros Resource Layer.",
};

const ROLES = [
  {
    title: "Head of Resource Markets",
    team: "markets · hiring",
    summary:
      "Own ARL market design (kWh, water, compute), LP relationships, and honest pilot narrative — no fake volume badges.",
    stack: "Energy markets, RWA / crypto fluency, EU time zones",
  },
  {
    title: "IoT Integration Lead",
    team: "iot-bridge · hiring",
    summary:
      "Device attestation, MQTT → oracle pipelines, OEM partnerships for Proof-of-Resource meters.",
    stack: "Edge Linux, Mosquitto, TLS, industrial protocols",
  },
  {
    title: "IoT & edge engineer",
    team: "iot-bridge",
    summary:
      "MQTT ingestion, device attestation hooks, and resilient telemetry paths from inverters and meters into oracle pipelines.",
    stack: "Node/Rust-friendly, Mosquitto, TLS, Linux edge",
  },
  {
    title: "Solidity protocol engineer",
    team: "protocol",
    summary:
      "Upgradeable resource tokens, oracle roles, pausability, and audit-ready tests on Hardhat.",
    stack: "Solidity 0.8.x, OpenZeppelin UUPS, Hardhat",
  },
  {
    title: "AI agent & markets engineer",
    team: "agent-api",
    summary:
      "Consumption forecasting, hedge cron jobs, and safe automation with HITL gates for forward energy orders.",
    stack: "TypeScript, Express, ethers v6, time-series models",
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
                <p className="mt-3 font-mono text-[11px] text-white/40">{role.stack}</p>
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
            . Learn the stack in{" "}
            <Link href="/resource-layer" className="underline hover:text-white">
              ARL vision
            </Link>{" "}
            and{" "}
            <Link href="/blog/future-of-energy-trading-on-chain" className="underline hover:text-white">
              on-chain energy essay
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
