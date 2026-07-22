"use client";

import { useState } from "react";

import { DemoDisclaimer } from "@/app/_components/arl/DemoDisclaimer";
import { AurosButton } from "@/app/_components/AurosButton";

const FORWARD_ORDERS = [
  { id: "FO-1021", window: "2026-07-24 06:00–10:00 UTC", mwh: 12, status: "open" },
  { id: "FO-1018", window: "2026-07-23 18:00–22:00 UTC", mwh: 8, status: "filled" },
] as const;

export function AgentDashboard() {
  const [mwh, setMwh] = useState("6");
  const [start, setStart] = useState("2026-07-25T06:00");
  const [message, setMessage] = useState<string | null>(null);

  function scheduleForwardBuy(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(
      `Forward buy (${mwh} MWh from ${start}) submitted to agent-api queue — operator HITL before settlement.`
    );
  }

  return (
    <div className="space-y-8">
      <DemoDisclaimer />

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
          <p className="font-mono text-[10px] uppercase text-white/40">Predicted consumption (24h)</p>
          <p className="mt-1 font-display text-2xl text-white">38.4 MWh</p>
          <p className="mt-1 text-xs text-white/45">Model v0.3 · training data mock</p>
        </div>
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
          <p className="font-mono text-[10px] uppercase text-white/40">Hedge ratio</p>
          <p className="mt-1 font-display text-2xl text-white">72%</p>
          <p className="mt-1 text-xs text-white/45">Target 85% · rebalance suggested</p>
        </div>
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
          <p className="font-mono text-[10px] uppercase text-white/40">Hedge status</p>
          <p className="mt-1 font-display text-lg text-amber-200/90">Under-hedged</p>
          <p className="mt-1 text-xs text-white/45">Next cron check in ~5 min (demo)</p>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="font-display text-base font-medium text-white">Forward orders</h2>
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
              {FORWARD_ORDERS.map((o) => (
                <tr key={o.id} className="border-b border-white/[0.04]">
                  <td className="px-4 py-3 font-mono text-white/70">{o.id}</td>
                  <td className="px-4 py-3">{o.window}</td>
                  <td className="px-4 py-3">{o.mwh}</td>
                  <td className="px-4 py-3 capitalize">{o.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
        <h2 className="font-display text-base font-medium text-white">Schedule forward buy</h2>
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={scheduleForwardBuy}>
          <label className="block space-y-1.5">
            <span className="font-mono text-[10px] uppercase text-white/40">MWh</span>
            <input
              value={mwh}
              onChange={(e) => setMwh(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black px-3 py-2.5 text-sm text-white"
            />
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
            <AurosButton type="submit">Submit to agent-api</AurosButton>
            {message ? <p className="mt-3 text-xs text-white/50">{message}</p> : null}
          </div>
        </form>
      </section>
    </div>
  );
}
