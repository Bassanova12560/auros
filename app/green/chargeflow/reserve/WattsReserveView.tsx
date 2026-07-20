"use client";

import Link from "next/link";
import { useState } from "react";

import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import {
  CHARGEFLOW_FLEETS_ROUTE,
  CHARGEFLOW_ROUTE,
} from "@/lib/chargeflow/constants";
import { WATTS_RESERVE_DISCLAIMER } from "@/lib/watts";

type MatchReason = { code: string; detail: string; delta: number };

type ReserveResult = {
  reservation_id?: string;
  match_score?: number;
  match_reasons?: MatchReason[];
  suggested_unit_kind?: "e" | "f";
  status?: string;
  disclaimer?: string;
  next_step?: string;
  error?: { message?: string };
};

export function WattsReserveView() {
  const [firmness, setFirmness] = useState<"firm" | "flex">("firm");
  const [start, setStart] = useState(() => {
    const d = new Date();
    d.setMinutes(0, 0, 0);
    return d.toISOString().slice(0, 16);
  });
  const [end, setEnd] = useState(() => {
    const d = new Date();
    d.setHours(d.getHours() + 4, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  });
  const [energyKwh, setEnergyKwh] = useState("20");
  const [capacityKw, setCapacityKw] = useState("5");
  const [country, setCountry] = useState("FR");
  const [zoneId, setZoneId] = useState("");
  const [carbonMax, setCarbonMax] = useState("50");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReserveResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setLoading(true);
    setError(null);
    setResult(null);
    const body: Record<string, unknown> = {
      window: {
        start: new Date(start).toISOString(),
        end: new Date(end).toISOString(),
      },
      zone: {
        country: country.trim(),
        ...(zoneId.trim() ? { zone_id: zoneId.trim() } : {}),
      },
      firmness,
    };
    if (firmness === "firm") {
      body.energy_kwh = Number(energyKwh);
    } else {
      body.capacity_kw = Number(capacityKw);
    }
    if (carbonMax.trim()) {
      body.carbon_intensity_max_gco2_kwh = Number(carbonMax);
    }

    try {
      const res = await fetch("/api/v1/watts/reserve/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = (await res.json()) as ReserveResult;
      if (!res.ok) {
        setError(json.error?.message ?? `Erreur ${res.status}`);
        return;
      }
      setResult(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-emerald-400/80">
          Watts Reserve · étape 1
        </p>
        <h1 className="font-display text-3xl font-medium text-white md:text-4xl">
          Réserver un profil de watts
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-white/55">
          Décrivez une fenêtre, une zone et une cible énergie ou flex. AUROS
          calcule un score de matching indicatif — aucune CFU n’est mintée à
          cette étape.
        </p>
        <p className="max-w-2xl text-xs leading-relaxed text-white/35">
          {WATTS_RESERVE_DISCLAIMER}
        </p>
      </header>

      <div className="space-y-5 border border-white/[0.08] bg-black/40 p-5 md:p-6">
        <div className="flex flex-wrap gap-2">
          {(["firm", "flex"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFirmness(f)}
              className={`rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition ${
                firmness === f
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                  : "border-white/10 text-white/40 hover:text-white/70"
              }`}
            >
              {f === "firm" ? "Firm · kWh → CFU-E" : "Flex · kW → CFU-F"}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1.5">
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              Début
            </span>
            <input
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              Fin
            </span>
            <input
              type="datetime-local"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
            />
          </label>
        </div>

        {firmness === "firm" ? (
          <label className="block max-w-xs space-y-1.5">
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              Énergie cible (kWh)
            </span>
            <input
              type="number"
              min={0.1}
              step="any"
              value={energyKwh}
              onChange={(e) => setEnergyKwh(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
            />
          </label>
        ) : (
          <label className="block max-w-xs space-y-1.5">
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              Capacité (kW)
            </span>
            <input
              type="number"
              min={0.1}
              step="any"
              value={capacityKw}
              onChange={(e) => setCapacityKw(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
            />
          </label>
        )}

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block space-y-1.5">
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              Pays
            </span>
            <input
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              Zone (optionnel)
            </span>
            <input
              value={zoneId}
              onChange={(e) => setZoneId(e.target.value)}
              placeholder="ex. FR-IDF"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/25"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              Carbone max gCO₂/kWh
            </span>
            <input
              type="number"
              min={0}
              value={carbonMax}
              onChange={(e) => setCarbonMax(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
            />
          </label>
        </div>

        <PrimaryButton type="button" onClick={() => void submit()} disabled={loading}>
          {loading ? "Matching…" : "Calculer le matching"}
        </PrimaryButton>

        {error ? (
          <p className="text-sm text-red-400/90" role="alert">
            {error}
          </p>
        ) : null}

        {result?.reservation_id ? (
          <div className="space-y-3 border-t border-white/[0.06] pt-4 text-sm text-white/70">
            <p className="font-mono text-[11px] text-emerald-400/80">
              Score {result.match_score}/100 · CFU-
              {result.suggested_unit_kind?.toUpperCase()} suggéré ·{" "}
              {result.status}
            </p>
            <p className="font-mono text-[10px] text-white/35">
              id · {result.reservation_id}
            </p>
            <ul className="space-y-1 text-xs text-white/45">
              {(result.match_reasons ?? []).map((r) => (
                <li key={`${r.code}-${r.detail}`}>
                  {r.detail}
                  {r.delta ? ` (+${r.delta})` : ""}
                </li>
              ))}
            </ul>
            <p className="text-xs text-white/35">{result.next_step}</p>
          </div>
        ) : null}
      </div>

      <p className="text-xs text-white/35">
        <Link
          href={CHARGEFLOW_ROUTE}
          className="text-white/55 underline-offset-2 hover:underline"
        >
          ChargeFlow
        </Link>
        {" · "}
        <Link
          href={CHARGEFLOW_FLEETS_ROUTE}
          className="text-white/55 underline-offset-2 hover:underline"
        >
          Flottes
        </Link>
        {" · "}
        <Link
          href="/copilot?context=watts"
          className="text-white/55 underline-offset-2 hover:underline"
        >
          Copilot
        </Link>
      </p>
    </div>
  );
}
