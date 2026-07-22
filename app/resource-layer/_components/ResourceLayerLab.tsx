"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { ArlLabWallet } from "@/app/_components/arl/ArlLabWallet";
import { ARL_LEDGER_EVENT, fetchArlAccount, getOrCreateArlAccountId } from "@/lib/arl/client";

const MARKETS = [
  { id: "kwh-fr", label: "kWh France", base: 0.121 },
  { id: "h2o-ca", label: "Water California", base: 0.0021 },
  { id: "flop", label: "Compute GPU (FLOP)", base: 1.27 },
] as const;

/**
 * Living-lab strip — mock quotes + real lab wallet (no fake local mint).
 */
export function ResourceLayerLab() {
  const [tick, setTick] = useState(0);
  const [watt, setWatt] = useState<number | null>(null);

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 2800);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    function load() {
      const accountId = getOrCreateArlAccountId();
      fetchArlAccount(accountId)
        .then((snap) => setWatt(snap.account.balances.WATT))
        .catch(() => setWatt(null));
    }
    load();
    window.addEventListener(ARL_LEDGER_EVENT, load);
    return () => window.removeEventListener(ARL_LEDGER_EVENT, load);
  }, []);

  const quotes = MARKETS.map((m, i) => {
    const wobble = Math.sin(tick * 0.7 + i * 1.3) * 0.008;
    const price = m.base * (1 + wobble);
    return {
      ...m,
      price: Number(price.toFixed(m.id === "h2o-ca" ? 5 : 4)),
    };
  });

  return (
    <section className="space-y-6 border-y border-white/[0.08] bg-white/[0.02] py-6" aria-label="Living lab">
      <ArlLabWallet step="produce" />

      <div>
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <p className="font-mono text-[10px] uppercase tracking-wide text-white/40">
            Index quotes · mock mid (indicatif)
          </p>
          <p className="font-mono text-[11px] text-white/45">
            {watt == null ? "…" : `${watt.toFixed(2)} WATT`} in lab wallet —{" "}
            <Link href="/lab" className="text-white/70 underline-offset-2 hover:text-white hover:underline">
              mint for real →
            </Link>
          </p>
        </div>
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
      </div>
    </section>
  );
}
