"use client";

import { useMemo, useState } from "react";

type Tab = "spot" | "perps" | "options";

const SPOT = [
  { symbol: "akWh-FR", last: 0.121, change: "+1.2%", vol: "120k" },
  { symbol: "akWh-TX", last: 0.082, change: "-0.4%", vol: "340k" },
  { symbol: "H2O-CA", last: 0.0021, change: "+0.8%", vol: "55k" },
  { symbol: "FLOP", last: 1.27, change: "+3.1%", vol: "88k" },
] as const;

/**
 * Demo trading terminal — mock orders only (HITL / no live execution).
 */
export function TradeTerminal() {
  const [tab, setTab] = useState<Tab>("perps");
  const [side, setSide] = useState<"long" | "short" | "buy" | "sell">("long");
  const [size, setSize] = useState("1000");
  const [leverage, setLeverage] = useState("5");
  const [log, setLog] = useState<string[]>([]);

  const chartBars = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => {
        const base = tab === "perps" ? 0.12 : tab === "options" ? 0.118 : 0.12;
        return Math.max(0.02, base * (1 + Math.sin(i / 3) * 0.08 + (i % 5) * 0.004));
      }),
    [tab]
  );
  const maxBar = Math.max(...chartBars);

  function submit() {
    const line = `[demo] ${tab} ${side} size=${size} lev=${leverage}x · not executed on-chain`;
    setLog((prev) => [line, ...prev].slice(0, 8));
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-wide">
        {(["spot", "perps", "options"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded border px-3 py-1.5 ${
              tab === t
                ? "border-white/40 bg-white/10 text-white"
                : "border-white/10 text-white/45 hover:border-white/25"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          <p className="font-mono text-[11px] text-white/40">Index · mock sparkline (24h)</p>
          <div className="flex h-40 items-end gap-1 border border-white/10 bg-white/[0.02] px-3 py-3">
            {chartBars.map((v, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm bg-white/35"
                style={{ height: `${(v / maxBar) * 100}%` }}
              />
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-white/60">
              <thead className="font-mono text-[10px] uppercase text-white/35">
                <tr>
                  <th className="py-2">Market</th>
                  <th>Last</th>
                  <th>24h</th>
                  <th>Vol</th>
                </tr>
              </thead>
              <tbody>
                {SPOT.map((r) => (
                  <tr key={r.symbol} className="border-t border-white/8">
                    <td className="py-2 font-mono text-white/80">{r.symbol}</td>
                    <td>{r.last}</td>
                    <td>{r.change}</td>
                    <td>{r.vol}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4 border border-white/10 bg-white/[0.03] p-4">
          <p className="font-display text-base text-white">Order ticket · demo</p>
          <div className="flex gap-2">
            {(tab === "perps" ? (["long", "short"] as const) : (["buy", "sell"] as const)).map(
              (s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSide(s)}
                  className={`flex-1 rounded border py-2 text-sm ${
                    side === s
                      ? "border-white/40 bg-white/10 text-white"
                      : "border-white/10 text-white/50"
                  }`}
                >
                  {s}
                </button>
              )
            )}
          </div>
          <label className="block text-xs text-white/45">
            Size
            <input
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="mt-1 w-full rounded border border-white/15 bg-black/30 px-3 py-2 text-sm text-white"
            />
          </label>
          {tab === "perps" ? (
            <label className="block text-xs text-white/45">
              Leverage (1–10)
              <input
                value={leverage}
                onChange={(e) => setLeverage(e.target.value)}
                className="mt-1 w-full rounded border border-white/15 bg-black/30 px-3 py-2 text-sm text-white"
              />
            </label>
          ) : null}
          <button
            type="button"
            onClick={submit}
            className="w-full rounded border border-white/25 bg-white/10 py-2.5 text-sm text-white hover:bg-white/15"
          >
            Simulate order
          </button>
          <p className="font-mono text-[10px] text-white/35">
            HITL — no live wallet execution in this preview.
          </p>
          <ul className="space-y-1 font-mono text-[10px] text-white/40">
            {log.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
