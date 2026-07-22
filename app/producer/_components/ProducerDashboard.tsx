"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import { DemoDisclaimer } from "@/app/_components/arl/DemoDisclaimer";
import { AurosButton } from "@/app/_components/AurosButton";
import {
  fetchArlAccount,
  getOrCreateArlAccountId,
  postArlMint,
  postArlWatt,
  type ArlClientSnapshot,
} from "@/lib/arl/client";

const DEVICES = [
  { id: "pv-north-01", label: "PV North Array", status: "online", kw: 420 },
  { id: "bess-yard", label: "BESS Yard", status: "online", kw: 180 },
  { id: "meter-grid", label: "Grid Export Meter", status: "online", kw: 0 },
] as const;

function fmt(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US", { maximumFractionDigits: digits });
}

export function ProducerDashboard() {
  const [accountId, setAccountId] = useState<string | null>(null);
  const [snap, setSnap] = useState<ArlClientSnapshot | null>(null);
  const [deviceId, setDeviceId] = useState<string>(DEVICES[0].id);
  const [mintAmount, setMintAmount] = useState("250");
  const [wattAmount, setWattAmount] = useState("100");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (id: string) => {
    const next = await fetchArlAccount(id);
    setSnap(next);
  }, []);

  useEffect(() => {
    const id = getOrCreateArlAccountId();
    setAccountId(id);
    refresh(id).catch((e) => setError(e instanceof Error ? e.message : "Load failed"));
  }, [refresh]);

  async function run(action: () => Promise<ArlClientSnapshot>, okMsg: string) {
    if (!accountId) return;
    setBusy(true);
    setError(null);
    try {
      const next = await action();
      setSnap(next);
      setNote(okMsg);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Action failed");
    } finally {
      setBusy(false);
    }
  }

  function onMint() {
    if (!accountId) return;
    const amount = Number(mintAmount);
    void run(
      () => postArlMint({ accountId, amount, deviceId }),
      `Minted ${amount} akWh from ${deviceId}`,
    );
  }

  function onWrapWatt() {
    if (!accountId) return;
    const amount = Number(wattAmount);
    void run(
      () => postArlWatt({ accountId, amount, action: "mint" }),
      `Wrapped ${amount} akWh → WATT (1:1 vault)`,
    );
  }

  function onRedeemWatt() {
    if (!accountId) return;
    const amount = Number(wattAmount);
    void run(
      () => postArlWatt({ accountId, amount, action: "redeem" }),
      `Redeemed ${amount} WATT → akWh`,
    );
  }

  const b = snap?.account.balances;

  return (
    <div className="space-y-8">
      <DemoDisclaimer />

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "akWh balance", value: b ? fmt(b.akWh, 2) : "…" },
          { label: "WATT balance", value: b ? fmt(b.WATT, 2) : "…" },
          {
            label: "Lifetimeed lifetime",
            value: snap ? fmt(snap.account.mintedAkWhTotal, 0) : "…",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-4"
          >
            <p className="font-mono text-[10px] uppercase text-white/40">{stat.label}</p>
            <p className="mt-1 font-display text-2xl font-medium text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <p className="font-mono text-[10px] text-white/35">
        Lab account <span className="text-white/55">{accountId ?? "…"}</span>
        {snap ? ` · ${snap.backend}` : null}
        {" · "}
        <Link href="/trade" className="text-white/55 underline-offset-2 hover:text-white hover:underline">
          Trade with balances →
        </Link>
      </p>

      <section className="space-y-3">
        <h2 className="font-display text-base font-medium text-white">Devices</h2>
        <ul className="divide-y divide-white/[0.06] rounded-xl border border-white/[0.08]">
          {DEVICES.map((d) => (
            <li key={d.id}>
              <button
                type="button"
                onClick={() => setDeviceId(d.id)}
                className={`flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm ${
                  deviceId === d.id ? "bg-white/[0.04] text-white" : "text-white/60"
                }`}
              >
                <div>
                  <p className="font-medium text-white">{d.label}</p>
                  <p className="font-mono text-[10px] text-white/35">{d.id}</p>
                </div>
                <span className="font-mono text-[11px] uppercase text-emerald-400/80">{d.status}</span>
                <span className="font-mono text-white/50">{d.kw ? `${d.kw} kW` : "—"}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 rounded-xl border border-white/[0.08] px-4 py-4">
        <h2 className="font-display text-base font-medium text-white">Mint akWh</h2>
        <p className="text-xs text-white/45">
          Oracle-gated on-chain; here the lab ledger credits your producer account from the selected
          meter.
        </p>
        <div className="flex flex-wrap items-end gap-3">
          <label className="space-y-1 font-mono text-[10px] uppercase text-white/40">
            Amount (kWh)
            <input
              value={mintAmount}
              onChange={(e) => setMintAmount(e.target.value)}
              className="block w-32 rounded border border-white/15 bg-black/40 px-2 py-1.5 text-sm text-white"
            />
          </label>
          <AurosButton type="button" onClick={onMint} disabled={busy}>
            Mint from {deviceId}
          </AurosButton>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-white/[0.08] px-4 py-4">
        <h2 className="font-display text-base font-medium text-white">WATT (1:1 collateral)</h2>
        <p className="text-xs text-white/45">
          Same economics as WattCoin.sol — lock akWh in vault, mint WATT; redeem burns WATT and
          returns akWh.
        </p>
        <div className="flex flex-wrap items-end gap-3">
          <label className="space-y-1 font-mono text-[10px] uppercase text-white/40">
            Amount
            <input
              value={wattAmount}
              onChange={(e) => setWattAmount(e.target.value)}
              className="block w-32 rounded border border-white/15 bg-black/40 px-2 py-1.5 text-sm text-white"
            />
          </label>
          <AurosButton type="button" onClick={onWrapWatt} disabled={busy}>
            Wrap → WATT
          </AurosButton>
          <button
            type="button"
            onClick={onRedeemWatt}
            disabled={busy}
            className="rounded border border-white/20 px-4 py-2 font-mono text-[11px] uppercase tracking-wide text-white/70 hover:border-white/40 hover:text-white disabled:opacity-40"
          >
            Redeem → akWh
          </button>
        </div>
        {snap ? (
          <p className="font-mono text-[10px] text-white/35">
            Protocol vault {fmt(snap.vaultAkWh, 2)} akWh · supply {fmt(snap.wattSupply, 2)} WATT
          </p>
        ) : null}
      </section>

      {error ? <p className="text-xs text-rose-300/90">{error}</p> : null}
      {note ? <p className="text-xs text-emerald-300/80">{note}</p> : null}

      {snap?.recent?.length ? (
        <section className="space-y-2">
          <h2 className="font-display text-base font-medium text-white">Recent</h2>
          <ul className="space-y-1 font-mono text-[10px] text-white/45">
            {snap.recent.slice(0, 6).map((ev) => (
              <li key={ev.id}>
                [{ev.kind}] {ev.detail}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
