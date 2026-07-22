"use client";

import { useState } from "react";

import { DemoDisclaimer } from "@/app/_components/arl/DemoDisclaimer";
import { AurosButton } from "@/app/_components/AurosButton";

const MARKETS = [
  {
    id: "kwh-fr",
    resource: "kWh · France (AKWH)",
    price: "€ 0.142 / kWh",
    volume: "2.4M",
    liquidity: "High",
  },
  {
    id: "kwh-tx",
    resource: "kWh · Texas (AKWH-US)",
    price: "$ 0.068 / kWh",
    volume: "8.1M",
    liquidity: "High",
  },
  {
    id: "h2o-ca",
    resource: "Water · California (AH2O)",
    price: "$ 0.0042 / L",
    volume: "420K",
    liquidity: "Medium",
  },
  {
    id: "kwh-de",
    resource: "kWh · Germany (AKWH)",
    price: "€ 0.158 / kWh",
    volume: "1.1M",
    liquidity: "Medium",
  },
] as const;

export function MarketTable() {
  const [tradeMsg, setTradeMsg] = useState<string | null>(null);

  function onTrade(id: string) {
    setTradeMsg(`Trade intent for ${id} logged — routing & HITL not enabled in this demo.`);
  }

  return (
    <div className="space-y-6">
      <DemoDisclaimer />
      <div className="overflow-x-auto rounded-xl border border-white/[0.08]">
        <table className="w-full min-w-[640px] text-left text-sm text-white/60">
          <thead className="font-mono text-[10px] uppercase text-white/35">
            <tr className="border-b border-white/[0.06]">
              <th className="px-4 py-3 font-normal">Resource</th>
              <th className="px-4 py-3 font-normal">Price</th>
              <th className="px-4 py-3 font-normal">Volume (30d)</th>
              <th className="px-4 py-3 font-normal">Liquidity</th>
              <th className="px-4 py-3 font-normal" />
            </tr>
          </thead>
          <tbody>
            {MARKETS.map((m) => (
              <tr key={m.id} className="border-b border-white/[0.04]">
                <td className="px-4 py-3 font-medium text-white">{m.resource}</td>
                <td className="px-4 py-3 font-mono text-white/70">{m.price}</td>
                <td className="px-4 py-3">{m.volume}</td>
                <td className="px-4 py-3">{m.liquidity}</td>
                <td className="px-4 py-3">
                  <AurosButton type="button" variant="ghost" onClick={() => onTrade(m.id)}>
                    Trade
                  </AurosButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {tradeMsg ? <p className="text-xs text-white/50">{tradeMsg}</p> : null}
    </div>
  );
}
