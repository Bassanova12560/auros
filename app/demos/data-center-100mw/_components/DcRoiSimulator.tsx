"use client";

import { useMemo, useState } from "react";

import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import {
  simulateSustainableRoi,
  type RoiStressChoice,
} from "@/lib/resilience/roi-simulator";

export function DcRoiSimulator() {
  const [mw, setMw] = useState(100);
  const [stress, setStress] = useState<RoiStressChoice>("medium");
  const [waterPrice, setWaterPrice] = useState(2.4);
  const [closedLoop, setClosedLoop] = useState(true);

  const result = useMemo(
    () =>
      simulateSustainableRoi({
        mw_it: mw,
        stress,
        water_eur_per_m3: waterPrice,
        target_closed_loop: closedLoop,
      }),
    [mw, stress, waterPrice, closedLoop]
  );

  return (
    <section
      aria-label="Simulateur ROI durable"
      className="mt-12 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.03] px-5 py-6 md:px-8"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-300/60">
        Calculateur ROI durable · indicatif
      </p>
      <p className="mt-2 max-w-xl text-sm text-white/55">
        Fourchettes eau et OPEX — hypothèses visibles, pas de « jusqu’à X % » sans contexte.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="block space-y-1.5">
          <span className="font-mono text-[10px] uppercase text-white/40">MW IT</span>
          <input
            type="range"
            min={10}
            max={200}
            value={mw}
            onChange={(e) => setMw(Number(e.target.value))}
            className="w-full"
          />
          <span className="font-mono text-sm text-white/70">{mw} MW</span>
        </label>
        <label className="block space-y-1.5">
          <span className="font-mono text-[10px] uppercase text-white/40">Stress hydrique</span>
          <select
            value={stress}
            onChange={(e) => setStress(e.target.value as RoiStressChoice)}
            className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white"
          >
            <option value="low">Faible</option>
            <option value="medium">Medium</option>
            <option value="high">Élevé</option>
            <option value="extreme">Extrême</option>
          </select>
        </label>
        <label className="block space-y-1.5">
          <span className="font-mono text-[10px] uppercase text-white/40">€/m³ eau (bande)</span>
          <input
            type="number"
            step={0.1}
            min={0.5}
            max={8}
            value={waterPrice}
            onChange={(e) => setWaterPrice(Number(e.target.value) || 2)}
            className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white"
          />
        </label>
        <label className="flex items-center gap-3 pt-6">
          <input
            type="checkbox"
            checked={closedLoop}
            onChange={(e) => setClosedLoop(e.target.checked)}
            className="h-4 w-4"
          />
          <span className="text-sm text-white/65">Cible boucle fermée (~0,5 L/kWh)</span>
        </label>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-white/10 bg-black/40 p-4">
          <p className="font-mono text-[10px] uppercase text-white/35">Eau évitée</p>
          <p className="mt-2 font-display text-2xl text-emerald-300/90">
            {result.pct_water_reduction} %
          </p>
          <p className="mt-1 text-xs text-white/45">
            ~{result.savings_m3_year.toLocaleString("fr-FR")} m³/an
          </p>
        </div>
        <div className="rounded-lg border border-white/10 bg-black/40 p-4">
          <p className="font-mono text-[10px] uppercase text-white/35">Économie eau</p>
          <p className="mt-2 font-display text-2xl text-white">
            {result.savings_eur_low_year}–{result.savings_eur_high_year} M€/an
          </p>
        </div>
        <div className="rounded-lg border border-white/10 bg-black/40 p-4">
          <p className="font-mono text-[10px] uppercase text-white/35">Δ OPEX indicatif</p>
          <p className="mt-2 font-display text-2xl text-white">
            {result.opex_delta_eur_m_low} à {result.opex_delta_eur_m_high} M€/an
          </p>
        </div>
      </div>

      <ul className="mt-4 list-disc space-y-1 pl-5 text-xs text-white/40">
        {result.assumptions.map((a) => (
          <li key={a}>{a}</li>
        ))}
      </ul>

      <div className="mt-6">
        <PrimaryButton href="/eau/continuity/playbook" variant="ghost">
          Chiffrer les scénarios (playbook) →
        </PrimaryButton>
      </div>
    </section>
  );
}
