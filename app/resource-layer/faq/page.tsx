import type { Metadata } from "next";
import Link from "next/link";

import {
  ContentFaqList,
  ContentPageLayout,
} from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";

export const metadata: Metadata = {
  title: "ARL FAQ — Auros Resource Layer | AUROS",
  description:
    "Plain-language FAQ: tokenization, oracles, WATT, and what ARL means for producers and operators.",
};

const FAQ = [
  {
    question: "What is Auros Resource Layer (ARL)?",
    answer:
      "ARL connects metered physical resources (energy, water, compute hours) to on-chain units you can trade, with APIs for machines and dashboards for humans. It sits alongside AUROS RWA dossier tools: readiness for issuance vs. liquidity for resources.",
  },
  {
    question: "What does “tokenization” mean in plain English?",
    answer:
      "It means turning a measured unit — one kilowatt-hour, one litre under a right, one GPU-hour — into a digital token that can be transferred and settled under clear rules. The physical asset still exists in the real world; the token is the claim/accounting layer.",
  },
  {
    question: "What is an “oracle”?",
    answer:
      "A bridge from meters and sensors to the blockchain. Only authorized devices/oracles can create (mint) or destroy (burn) resource tokens, so production claims stay tied to attested data — not free minting.",
  },
  {
    question: "What is a machine-ready API?",
    answer:
      "An HTTP interface that AI agents, robots, or data-center software can call (with an agent ID) to place spot or forward orders, without a human clicking a UI for every trade. Humans still approve sensitive or regulated steps (HITL).",
  },
  {
    question: "What is WATT?",
    answer:
      "WATT is AUROS’s energy stablecoin design: collateralized by verified energy resource tokens (1:1 MVP). The aim is a unit of account for machines whose “survival cost” is electricity. Speculative targets live in docs/WHITEPAPER.md — not an offer to the public.",
  },
  {
    question: "Are producer / agent / market pages live production systems?",
    answer:
      "No. They are labeled demos with mock or local data. Withdrawals, trades, and hedges need credentials and human approval. Nothing implies a verified certificate or guaranteed settlement.",
  },
  {
    question: "I’m a solar producer — what do I do first?",
    answer:
      "Open the producer demo to see the flow, then email resources@getauros.com with meter type and geography. Pilots start with device registration and attested mint — not overnight mainnet volume.",
  },
  {
    question: "Who should I contact?",
    answer:
      "Pilots & markets: resources@getauros.com · Roles: careers@getauros.com · Careers page lists Head of Resource Markets and IoT Integration Lead as hiring.",
  },
] as const;

export default function ResourceLayerFaqPage() {
  return (
    <>
      <AiFirstPageJsonLd path="/resource-layer/faq" />
      <FocusPageShell path="/resource-layer/faq" width="3xl">
        <ContentPageLayout
          product="Resource Layer"
          eyebrow="FAQ · Lexicon"
          title="Auros Resource Layer — plain answers"
          intro="For energy operators and industrials as much as crypto-natives. No jargon without a translation."
        >
          <div id="watt" className="scroll-mt-28" />
          <ContentFaqList items={[...FAQ]} />
          <p className="mt-10 text-sm text-white/50">
            <Link href="/resource-layer" className="underline hover:text-white">
              ← Back to Resource Layer
            </Link>
            {" · "}
            <Link href="/careers" className="underline hover:text-white">
              Hiring
            </Link>
          </p>
        </ContentPageLayout>
      </FocusPageShell>
    </>
  );
}
