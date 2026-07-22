"use client";

import { useMemo, useState } from "react";

import { DemoDisclaimer } from "@/app/_components/arl/DemoDisclaimer";
import { AurosButton } from "@/app/_components/AurosButton";

const DEVICES = [
  { id: "pv-north-01", label: "PV North Array", status: "online", kw: 420 },
  { id: "bess-yard", label: "BESS Yard", status: "online", kw: 180 },
  { id: "meter-grid", label: "Grid Export Meter", status: "online", kw: 0 },
] as const;

const BAR_HEIGHTS = [42, 58, 71, 65, 80, 76, 88, 92, 85, 78, 70, 74];

export function ProducerDashboard() {
  const [withdrawNote, setWithdrawNote] = useState<string | null>(null);

  const totals = useMemo(
    () => ({
      minted: "12,480",
      revenue: "€ 4,216",
      todayKwh: "1,842",
    }),
    []
  );

  function onWithdraw() {
    setWithdrawNote(
      "Withdraw request queued for operator review (HITL). No funds move from this demo."
    );
  }

  return (
    <div className="space-y-8">
      <DemoDisclaimer />

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Minted (AKWH)", value: totals.minted },
          { label: "Revenue (30d, indicatif)", value: totals.revenue },
          { label: "Production today", value: `${totals.todayKwh} kWh` },
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

      <section className="space-y-3">
        <h2 className="font-display text-base font-medium text-white">Devices</h2>
        <ul className="divide-y divide-white/[0.06] rounded-xl border border-white/[0.08]">
          {DEVICES.map((d) => (
            <li
              key={d.id}
              className="flex items-center justify-between gap-4 px-4 py-3 text-sm text-white/60"
            >
              <div>
                <p className="font-medium text-white">{d.label}</p>
                <p className="font-mono text-[10px] text-white/35">{d.id}</p>
              </div>
              <span className="font-mono text-[11px] uppercase text-emerald-400/80">{d.status}</span>
              <span className="font-mono text-white/50">{d.kw ? `${d.kw} kW` : "—"}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-base font-medium text-white">Production (last 12 intervals)</h2>
        <div
          className="flex h-36 items-end gap-1 rounded-xl border border-white/[0.08] bg-black/40 px-4 pb-4 pt-6"
          role="img"
          aria-label="Bar chart of mock production"
        >
          {BAR_HEIGHTS.map((h, i) => (
            <div
              key={i}
              className="min-w-0 flex-1 rounded-sm bg-white/25"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-4">
        <AurosButton type="button" onClick={onWithdraw}>
          Withdraw
        </AurosButton>
        {withdrawNote ? (
          <p className="max-w-md text-xs text-white/50">{withdrawNote}</p>
        ) : null}
      </div>
    </div>
  );
}
