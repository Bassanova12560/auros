"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { ArlLabWallet } from "@/app/_components/arl/ArlLabWallet";
import {
  getOrCreateArlAccountId,
  postArlMint,
  postArlWatt,
} from "@/lib/arl/client";

/**
 * Energy Lab — illustrative revenue sandbox + one-click mint into the shared ARL ledger.
 */
export function EnergyLabSimulator() {
  const [kwhPerDay, setKwhPerDay] = useState(420);
  const [priceEur, setPriceEur] = useState(0.11);
  const [uptime, setUptime] = useState(92);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const result = useMemo(() => {
    const effectiveKwh = kwhPerDay * (uptime / 100);
    const daily = effectiveKwh * priceEur;
    const monthly = daily * 30;
    const yearly = daily * 365;
    const tokens = Math.round(effectiveKwh);
    return { effectiveKwh, daily, monthly, yearly, tokens };
  }, [kwhPerDay, priceEur, uptime]);

  async function mintLabDay() {
    setBusy(true);
    setError(null);
    setNote(null);
    try {
      const accountId = getOrCreateArlAccountId();
      const minted = await postArlMint({
        accountId,
        amount: result.tokens,
        deviceId: "lab-simulator",
      });
      const wrapAmt = Math.min(result.tokens, minted.account.balances.akWh);
      let wattNote = "";
      if (wrapAmt > 0) {
        const wrapped = await postArlWatt({
          accountId,
          amount: Math.min(100, wrapAmt),
          action: "mint",
        });
        wattNote = ` · WATT ${wrapped.account.balances.WATT.toFixed(0)}`;
      }
      setNote(
        `Minted ${result.tokens} akWh into your lab wallet${wattNote}. Next: Producer (convert) or Trade (sell).`,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Mint failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-8">
      <ArlLabWallet step="produce" />

      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
        Lab sandbox · mint writes your lab wallet
      </p>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <label className="block space-y-2">
            <span className="flex justify-between font-mono text-[10px] uppercase tracking-wider text-white/45">
              <span>Daily production</span>
              <span className="tabular-nums text-white/70">{kwhPerDay} kWh</span>
            </span>
            <input
              type="range"
              min={50}
              max={5000}
              step={10}
              value={kwhPerDay}
              onChange={(e) => setKwhPerDay(Number(e.target.value))}
              className="w-full accent-white"
            />
          </label>
          <label className="block space-y-2">
            <span className="flex justify-between font-mono text-[10px] uppercase tracking-wider text-white/45">
              <span>Mock market price</span>
              <span className="tabular-nums text-white/70">€{priceEur.toFixed(3)} / kWh</span>
            </span>
            <input
              type="range"
              min={0.04}
              max={0.35}
              step={0.005}
              value={priceEur}
              onChange={(e) => setPriceEur(Number(e.target.value))}
              className="w-full accent-white"
            />
          </label>
          <label className="block space-y-2">
            <span className="flex justify-between font-mono text-[10px] uppercase tracking-wider text-white/45">
              <span>Uptime / deliverability</span>
              <span className="tabular-nums text-white/70">{uptime}%</span>
            </span>
            <input
              type="range"
              min={60}
              max={100}
              step={1}
              value={uptime}
              onChange={(e) => setUptime(Number(e.target.value))}
              className="w-full accent-white"
            />
          </label>
        </div>

        <div className="border border-white/[0.08] bg-white/[0.02] p-5">
          <p className="font-display text-lg text-white">Estimated lab revenue</p>
          <dl className="mt-5 space-y-4">
            <div className="flex justify-between border-b border-white/[0.06] pb-3">
              <dt className="font-mono text-[10px] uppercase text-white/40">Tokens minted / day</dt>
              <dd className="font-display text-xl tabular-nums text-white">
                {result.tokens.toLocaleString("en-US")} akWh
              </dd>
            </div>
            <div className="flex justify-between border-b border-white/[0.06] pb-3">
              <dt className="font-mono text-[10px] uppercase text-white/40">Daily</dt>
              <dd className="font-display text-xl tabular-nums text-white">
                €{result.daily.toFixed(0)}
              </dd>
            </div>
            <div className="flex justify-between border-b border-white/[0.06] pb-3">
              <dt className="font-mono text-[10px] uppercase text-white/40">Monthly (×30)</dt>
              <dd className="font-display text-xl tabular-nums text-white">
                €{result.monthly.toFixed(0)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-mono text-[10px] uppercase text-white/40">Yearly (×365)</dt>
              <dd className="font-display text-2xl tabular-nums text-white">
                €{result.yearly.toFixed(0)}
              </dd>
            </div>
          </dl>
          <p className="mt-5 text-xs leading-relaxed text-white/40">
            Story: solar farm mints ≈{result.tokens} akWh/day → wraps to WATT → sells on /trade.
          </p>
          <button
            type="button"
            disabled={busy}
            onClick={() => void mintLabDay()}
            className="mt-4 w-full rounded border border-white/25 bg-white/10 py-2.5 font-mono text-[11px] uppercase tracking-wide text-white hover:bg-white/15 disabled:opacity-40"
          >
            {busy ? "Minting…" : "Mint this lab day → wallet"}
          </button>
          {error ? <p className="mt-2 text-xs text-rose-300/90">{error}</p> : null}
          {note ? <p className="mt-2 text-xs text-emerald-300/80">{note}</p> : null}
          <div className="mt-4 flex flex-wrap gap-3 font-mono text-[10px] uppercase tracking-wider">
            <Link href="/producer" className="text-white/55 underline-offset-2 hover:text-white hover:underline">
              2. Convert →
            </Link>
            <Link href="/trade" className="text-white/55 underline-offset-2 hover:text-white hover:underline">
              3. Sell →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
