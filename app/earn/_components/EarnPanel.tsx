"use client";

import Link from "next/link";

import { ArlLabWallet } from "@/app/_components/arl/ArlLabWallet";

const CARDS = [
  { title: "Perps LP", body: "Seed EnergyFutures / ComputeFutures quote vaults.", href: "/trade" },
  {
    title: "Spot inventory",
    body: "Hold akWh / WATT in your lab wallet — mint on /lab, convert on /producer.",
    href: "/producer",
  },
  { title: "Insurance capital", body: "Underwrite parametric production shortfall.", href: "/insure" },
] as const;

export function EarnPanel() {
  return (
    <div className="space-y-8">
      <ArlLabWallet step="convert" />
      <p className="text-sm text-white/55">
        Earn surfaces stay indicative. Your live lab balances sit in the wallet above — trade fees
        already accrue on spot fills.
      </p>
      <ul className="space-y-4">
        {CARDS.map((c) => (
          <li key={c.title} className="border-t border-white/10 pt-4">
            <Link href={c.href} className="font-display text-base text-white hover:underline">
              {c.title}
            </Link>
            <p className="mt-1 text-sm text-white/55">{c.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
