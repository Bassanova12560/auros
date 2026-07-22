import type { Metadata } from "next";
import Link from "next/link";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";

import { TradeTerminal } from "./_components/TradeTerminal";

export const metadata: Metadata = {
  title: "Trade — Auros Resource Layer | AUROS",
  description: "Demo trading terminal for resource spot, perps, and options.",
};

export default function TradePage() {
  return (
    <>
      <AiFirstPageJsonLd path="/trade" />
      <FocusPageShell path="/trade" width="6xl">
        <ContentPageLayout
          product="Resource Layer"
          eyebrow="Terminal · Demo"
          title="Trade resources, perps & options"
          intro="Spot settles on the shared ARL lab ledger (mint → WATT → trade). Perps and options use the hardened session engine. Not live venue execution — HITL for production settlement."
        >
          <div className="mb-6">
            <p className="rounded-lg border border-amber-500/20 bg-amber-500/[0.06] px-4 py-3 font-mono text-[11px] leading-relaxed text-amber-200/80">
              Lab balances are shared with /producer and /lab. Spot fills move EUR and resource
              tokens. Perps remain browser-local with leverage caps and circuit-breaker.
            </p>
          </div>
          <p className="mb-6 flex flex-wrap gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-wider text-white/40">
            <Link href="/builders" className="hover:text-white/70">
              Protocol →
            </Link>
            <Link href="/lab" className="hover:text-white/70">
              Energy Lab →
            </Link>
            <Link href="/market" className="hover:text-white/70">
              Market →
            </Link>
          </p>
          <TradeTerminal />
        </ContentPageLayout>
      </FocusPageShell>
    </>
  );
}
