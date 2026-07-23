"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { ArlLabWallet } from "@/app/_components/arl/ArlLabWallet";
import { DemoDisclaimer } from "@/app/_components/arl/DemoDisclaimer";
import { AurosButton } from "@/app/_components/AurosButton";
import { getOrCreateArlAccountId, postArlSpot } from "@/lib/arl/client";

type ForwardRow = {
  id: string;
  window: string;
  mwh: number;
  status: "open" | "filled" | "rejected";
  detail?: string;
};

const SEED_ORDERS: ForwardRow[] = [
  { id: "FO-1021", window: "2026-07-24 06:00–10:00 UTC", mwh: 12, status: "open" },
  { id: "FO-1018", window: "2026-07-23 18:00–22:00 UTC", mwh: 8, status: "filled" },
];

/**
 * Agent console — lab wallet + hedge that buys akWh on the shared ledger (HITL-labeled).
 */
export function AgentDashboard() {
  const [mwh, setMwh] = useState("2");
  const [start, setStart] = useState("2026-07-25T06:00");
  const [orders, setOrders] = useState<ForwardRow[]>(SEED_ORDERS);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const kwhPreview = useMemo(() => {
    const n = Number(mwh);
    if (!Number.isFinite(n) || n <= 0) return 0;
    return Math.round(n * 1000);
  }, [mwh]);

  async function scheduleForwardBuy(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const mwhNum = Number(mwh);
      if (!Number.isFinite(mwhNum) || mwhNum <= 0 || mwhNum > 50) {
        throw new Error("MWh must be between 0 and 50 for lab hedges");
      }
      const amountKwh = Math.round(mwhNum * 1000);
      const accountId = getOrCreateArlAccountId();
      const snap = await postArlSpot({
        accountId,
        marketId: "kwh-france",
        side: "buy",
        amount: amountKwh,
      });
      const id = `FO-${Date.now().toString(36).slice(-5).toUpperCase()}`;
      setOrders((prev) => [
        {
          id,
          window: `${start} · lab hedge`,
          mwh: mwhNum,
          status: "filled",
          detail: `Bought ${amountKwh} akWh @ ${snap.fill?.executionPrice ?? "—"}`,
        },
        ...prev,
      ]);
      setMessage(
        `Hedge filled on lab ledger: +${amountKwh} akWh (≈${mwhNum} MWh). Wallet EUR → akWh. HITL still required for production settlement.`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Hedge failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-8">
      <ArlLabWallet step="sell" />
      <DemoDisclaimer />

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
          <p className="font-mono text-[10px] uppercase text-white/40">Lab hedge mode</p>
          <p className="mt-1 font-display text-2xl text-white">Spot buy</p>
          <p className="mt-1 text-xs text-white/45">
            Not a cleared forward — EUR → akWh on the shared ledger
          </p>
        </div>
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
          <p className="font-mono text-[10px] uppercase text-white/40">Ticket cap</p>
          <p className="mt-1 font-display text-2xl text-white">≤50 MWh</p>
          <p className="mt-1 text-xs text-white/45">Lab guardrail · production needs HITL</p>
        </div>
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
          <p className="font-mono text-[10px] uppercase text-white/40">Next surfaces</p>
          <p className="mt-1 font-display text-lg text-white">API · wrap</p>
          <p className="mt-1 text-xs text-white/45">
            <Link href="/builders" className="underline hover:text-white">
              /builders
            </Link>
            {" · "}
            <Link href="/producer" className="underline hover:text-white">
              /producer
            </Link>
          </p>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="font-display text-base font-medium text-white">Forward / hedge book</h2>
        <div className="overflow-x-auto rounded-xl border border-white/[0.08]">
          <table className="w-full min-w-[480px] text-left text-sm text-white/60">
            <thead className="font-mono text-[10px] uppercase text-white/35">
              <tr className="border-b border-white/[0.06]">
                <th className="px-4 py-3 font-normal">ID</th>
                <th className="px-4 py-3 font-normal">Window</th>
                <th className="px-4 py-3 font-normal">MWh</th>
                <th className="px-4 py-3 font-normal">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-white/[0.04]">
                  <td className="px-4 py-3 font-mono text-white/70">{o.id}</td>
                  <td className="px-4 py-3">
                    {o.window}
                    {o.detail ? (
                      <span className="mt-0.5 block font-mono text-[10px] text-white/35">{o.detail}</span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">{o.mwh}</td>
                  <td className="px-4 py-3 capitalize">{o.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
        <h2 className="font-display text-base font-medium text-white">Schedule hedge (lab spot buy)</h2>
        <p className="text-xs text-white/45">
          Converts MWh → kWh and buys <span className="text-white/70">akWh-FR</span> with your wallet
          EUR. Caps: ≤50 MWh / ticket. Not a production PPA.
        </p>
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={(e) => void scheduleForwardBuy(e)}>
          <label className="block space-y-1.5">
            <span className="font-mono text-[10px] uppercase text-white/40">MWh</span>
            <input
              value={mwh}
              onChange={(e) => setMwh(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black px-3 py-2.5 text-sm text-white"
            />
            <span className="font-mono text-[10px] text-white/35">≈ {kwhPreview} akWh</span>
          </label>
          <label className="block space-y-1.5">
            <span className="font-mono text-[10px] uppercase text-white/40">Start (local)</span>
            <input
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black px-3 py-2.5 text-sm text-white"
            />
          </label>
          <div className="sm:col-span-2">
            <AurosButton type="submit" disabled={busy}>
              {busy ? "Hedging…" : "Buy hedge on ledger"}
            </AurosButton>
            {error ? <p className="mt-3 text-xs text-rose-300/90">{error}</p> : null}
            {message ? <p className="mt-3 text-xs text-emerald-300/80">{message}</p> : null}
          </div>
        </form>
      </section>

      <p className="font-mono text-[11px] text-white/40">
        Protocol / wrap:{" "}
        <Link href="/builders" className="underline-offset-2 hover:text-white hover:underline">
          /builders
        </Link>
        {" · "}
        <Link href="/producer" className="underline-offset-2 hover:text-white hover:underline">
          /producer
        </Link>
        {" · "}
        <Link href="/trade" className="underline-offset-2 hover:text-white hover:underline">
          /trade
        </Link>
      </p>
    </div>
  );
}
