"use client";

import Link from "next/link";

import { ArlLabWallet } from "@/app/_components/arl/ArlLabWallet";
import { DemoDisclaimer } from "@/app/_components/arl/DemoDisclaimer";

const CARDS = [
  {
    title: "Spot inventory",
    body: "Hold akWh / WATT in the lab wallet — mint on /lab, wrap on /producer, sell on /trade.",
    href: "/trade",
    badge: "Live lab",
  },
  {
    title: "Perps LP",
    body: "EnergyFutures quote vaults are on the roadmap. Trade Advanced perps are session-local toys — they do not move the lab wallet.",
    href: "/trade",
    badge: "Roadmap",
  },
  {
    title: "Insurance capital",
    body: "Parametric shortfall underwriting is specified in protocol docs — no on-site buy flow yet.",
    href: "/insure",
    badge: "Preview",
  },
] as const;

export function EarnPanel() {
  return (
    <div className="space-y-8">
      <ArlLabWallet step="convert" />
      <DemoDisclaimer />
      <p className="text-sm text-white/55">
        Earn is not a yield product today. Spot fees already accrue on lab fills; LP / insurance
        capital remain labeled previews — no invented APY.
      </p>
      <ul className="space-y-4">
        {CARDS.map((c) => (
          <li key={c.title} className="border-t border-white/10 pt-4">
            <div className="flex flex-wrap items-baseline gap-2">
              <Link href={c.href} className="font-display text-base text-white hover:underline">
                {c.title}
              </Link>
              <span className="font-mono text-[10px] uppercase tracking-wider text-amber-200/70">
                {c.badge}
              </span>
            </div>
            <p className="mt-1 text-sm text-white/55">{c.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
