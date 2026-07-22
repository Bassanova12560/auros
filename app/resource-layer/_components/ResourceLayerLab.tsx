"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const MARKETS = [
  { id: "kwh-fr", label: "kWh France", base: 0.121 },
  { id: "h2o-ca", label: "Water California", base: 0.0021 },
  { id: "flop", label: "Compute GPU (FLOP)", base: 1.27 },
] as const;

/**
 * Living-lab strip — mock testnet quotes + WATT counter.
 * Clearly demo: no claim of mainnet volume.
 */
export function ResourceLayerLab() {
  const [tick, setTick] = useState(0);
  const [demoMinted, setDemoMinted] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 2800);
    return () => window.clearInterval(id);
  }, []);

  // Deterministic jitter from tick (SSR-safe after mount)
  const quotes = MARKETS.map((m, i) => {
    const wobble = Math.sin(tick * 0.7 + i * 1.3) * 0.008;
    const price = m.base * (1 + wobble);
    return {
      ...m,
      price: Number(price.toFixed(m.id === "h2o-ca" ? 5 : 4)),
    };
  });

  // Near-zero “testnet” WATT + local demo mints
  const wattDisplay = (demoMinted + tick * 0.0001).toFixed(4);

  return (
    <section
      className="border-y border-white/[0.08] bg-white/[0.02] py-6"
      aria-label="Testnet living lab"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="font-mono text-[10px] uppercase tracking-wide text-white/40">
          Living lab · testnet quotes (mock)
        </p>
        <p className="font-mono text-[11px] text-white/45">
          {wattDisplay} WATT minted so far —{" "}
          <Link href="#get-started" className="text-white/70 underline-offset-2 hover:text-white hover:underline">
            join the testnet
          </Link>
        </p>
      </div>
      <p className="mt-3 text-sm text-white/55">
        Current testnet markets:{" "}
        <span className="text-white/80">kWh France, Water California, Compute GPU</span>.
      </p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-3">
        {quotes.map((q) => (
          <li key={q.id} className="border-t border-white/10 pt-3">
            <p className="font-mono text-[10px] uppercase text-white/35">{q.label}</p>
            <p className="mt-1 font-display text-lg text-white tabular-nums">
              ${q.price}
              <span className="ml-1 font-mono text-[10px] text-white/35">USD</span>
            </p>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => setDemoMinted((n) => n + 0.01)}
        className="mt-4 font-mono text-[11px] text-white/50 underline-offset-2 hover:text-white hover:underline"
      >
        + Mint 0.01 WATT (local demo only)
      </button>
    </section>
  );
}
