"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import {
  ARL_LEDGER_EVENT,
  fetchArlAccount,
  getOrCreateArlAccountId,
  type ArlClientSnapshot,
} from "@/lib/arl/client";

export type ArlJourneyStep = "produce" | "convert" | "sell";

const STEPS: Array<{
  id: ArlJourneyStep;
  n: string;
  label: string;
  href: string;
  hint: string;
}> = [
  { id: "produce", n: "1", label: "Produce", href: "/lab", hint: "Mint akWh" },
  { id: "convert", n: "2", label: "Convert", href: "/producer", hint: "Wrap → WATT 1:1" },
  { id: "sell", n: "3", label: "Sell", href: "/trade", hint: "Spot (akWh · auto-redeem)" },
];

function fmt(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US", { maximumFractionDigits: digits });
}

function shortId(id: string): string {
  if (id.length <= 14) return id;
  return `${id.slice(0, 8)}…${id.slice(-4)}`;
}

/**
 * Lab wallet — shared ARL account balances + 3-step journey.
 * Not MetaMask / not mainnet: same browser ledger as /lab, /producer, /trade.
 */
export function ArlLabWallet({ step }: { step: ArlJourneyStep }) {
  const [snap, setSnap] = useState<ArlClientSnapshot | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const refresh = useCallback(async () => {
    const id = getOrCreateArlAccountId();
    setAccountId(id);
    try {
      const next = await fetchArlAccount(id);
      setSnap(next);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Wallet load failed");
    }
  }, []);

  useEffect(() => {
    void refresh();
    const onUpdate = () => void refresh();
    window.addEventListener(ARL_LEDGER_EVENT, onUpdate);
    return () => window.removeEventListener(ARL_LEDGER_EVENT, onUpdate);
  }, [refresh]);

  async function copyId() {
    if (!accountId) return;
    try {
      await navigator.clipboard.writeText(accountId);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  }

  const b = snap?.account.balances;

  return (
    <section
      className="space-y-4 rounded-xl border border-white/[0.1] bg-gradient-to-br from-white/[0.04] to-transparent px-4 py-4"
      aria-label="AUROS lab wallet"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
            Lab wallet · not MetaMask · not mainnet
          </p>
          <p className="mt-1 font-display text-lg text-white">Your resource account</p>
          <p className="mt-1 max-w-xl text-xs leading-relaxed text-white/45">
            Same wallet on Lab, Producer, and Trade. Mint akWh → optional wrap to WATT → spot sell
            (sells akWh; wrapped WATT auto-redeems 1:1).
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] text-white/40">
          <span title={accountId ?? undefined}>{accountId ? shortId(accountId) : "…"}</span>
          <button
            type="button"
            onClick={() => void copyId()}
            className="rounded border border-white/15 px-2 py-1 text-white/55 hover:border-white/30 hover:text-white"
          >
            {copied ? "Copied" : "Copy ID"}
          </button>
          <button
            type="button"
            onClick={() => void refresh()}
            className="rounded border border-white/15 px-2 py-1 text-white/55 hover:border-white/30 hover:text-white"
          >
            Refresh
          </button>
          {snap ? <span className="text-white/30">{snap.backend}</span> : null}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {[
          { label: "EUR", value: b ? fmt(b.EUR, 2) : "…", tip: "Lab cash for spot" },
          { label: "akWh", value: b ? fmt(b.akWh, 2) : "…", tip: "Minted energy" },
          { label: "WATT", value: b ? fmt(b.WATT, 2) : "…", tip: "1:1 vault wrap" },
          { label: "H2O", value: b ? fmt(b.H2O, 4) : "…", tip: "Water" },
          { label: "FLOP", value: b ? fmt(b.FLOP, 2) : "…", tip: "Compute" },
        ].map((row) => (
          <div key={row.label} className="rounded-lg border border-white/[0.07] bg-black/30 px-3 py-2">
            <p className="font-mono text-[9px] uppercase tracking-wider text-white/35" title={row.tip}>
              {row.label}
            </p>
            <p className="mt-0.5 font-display text-base tabular-nums text-white">{row.value}</p>
          </div>
        ))}
      </div>

      {error ? <p className="text-xs text-rose-300/90">{error}</p> : null}

      <nav aria-label="Lab journey" className="grid gap-2 sm:grid-cols-3">
        {STEPS.map((s) => {
          const active = s.id === step;
          return (
            <Link
              key={s.id}
              href={s.href}
              className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 transition ${
                active
                  ? "border-white/35 bg-white/[0.08] text-white"
                  : "border-white/[0.08] text-white/50 hover:border-white/20 hover:text-white/80"
              }`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-[11px] ${
                  active ? "bg-white text-black" : "bg-white/10 text-white/60"
                }`}
              >
                {s.n}
              </span>
              <span>
                <span className="block font-display text-sm">{s.label}</span>
                <span className="font-mono text-[9px] uppercase tracking-wider text-white/35">
                  {s.hint}
                </span>
              </span>
            </Link>
          );
        })}
      </nav>
    </section>
  );
}
