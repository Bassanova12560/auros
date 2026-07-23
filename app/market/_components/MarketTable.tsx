"use client";

import Link from "next/link";

import { ArlLabWallet } from "@/app/_components/arl/ArlLabWallet";
import { DemoDisclaimer } from "@/app/_components/arl/DemoDisclaimer";
import { AurosButton } from "@/app/_components/AurosButton";
import { SPOT_MARKETS } from "@/lib/arl/trade-engine";

function fmtPrice(n: number, id: string): string {
  if (id === "h2o-ca") return `€ ${n.toFixed(4)} / L`;
  if (id === "flop") return `€ ${n.toFixed(2)} / unit`;
  return `€ ${n.toFixed(3)} / kWh`;
}

/**
 * Marketplace — same index as trade engine + lab wallet; Trade opens spot with market preselected.
 */
export function MarketTable() {
  return (
    <div className="space-y-6">
      <ArlLabWallet step="sell" />
      <DemoDisclaimer />
      <div className="overflow-x-auto rounded-xl border border-white/[0.08]">
        <table className="w-full min-w-[640px] text-left text-sm text-white/60">
          <thead className="font-mono text-[10px] uppercase text-white/35">
            <tr className="border-b border-white/[0.06]">
              <th className="px-4 py-3 font-normal">Resource</th>
              <th className="px-4 py-3 font-normal">Mark</th>
              <th className="px-4 py-3 font-normal">24h</th>
              <th className="px-4 py-3 font-normal">Vol label</th>
              <th className="px-4 py-3 font-normal" />
            </tr>
          </thead>
          <tbody>
            {SPOT_MARKETS.map((m) => (
              <tr key={m.id} className="border-b border-white/[0.04]">
                <td className="px-4 py-3 font-medium text-white">{m.symbol}</td>
                <td className="px-4 py-3 font-mono text-white/70">{fmtPrice(m.last, m.id)}</td>
                <td className="px-4 py-3">
                  {m.changeBps >= 0 ? "+" : ""}
                  {(m.changeBps / 10).toFixed(1)}%
                </td>
                <td className="px-4 py-3">{m.volLabel}</td>
                <td className="px-4 py-3">
                  <AurosButton href={`/trade?market=${m.id}`} variant="ghost">
                    Trade spot
                  </AurosButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-white/45">
        Spot settles in <span className="text-white/70">EUR</span> against your{" "}
        <Link href="/lab" className="underline hover:text-white">
          lab wallet
        </Link>{" "}
        on{" "}
        <Link href="/trade" className="underline hover:text-white">
          /trade
        </Link>
        . Perps/options stay session-local. 24h % and volumes are labels, not claimed exchange data.
      </p>
    </div>
  );
}
