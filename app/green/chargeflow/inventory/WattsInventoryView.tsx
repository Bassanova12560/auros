"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import {
  CHARGEFLOW_FLEETS_ROUTE,
  CHARGEFLOW_ROUTE,
} from "@/lib/chargeflow/constants";
import { WATTS_RESERVE_DISCLAIMER, WATTS_RESERVE_ROUTE } from "@/lib/watts";

type Offer = {
  offer_id: string;
  status: string;
  window: { start: string; end: string };
  capacity_kw: number | null;
  energy_kwh: number | null;
  zone: { country: string; zone_id?: string };
  carbon_intensity_gco2_kwh: number | null;
  firmness: string;
  producer_ref: string | null;
  label: string | null;
};

type MatchRow = {
  offer_id: string;
  match_score: number;
  match_reasons: { code: string; detail: string; delta: number }[];
  offer: Offer;
};

const fieldClass =
  "w-full border border-white/[0.1] bg-white/[0.03] px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-emerald-500/35 focus:bg-white/[0.05]";

function fmtWindow(w: { start: string; end: string }) {
  try {
    const a = new Date(w.start).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
    const b = new Date(w.end).toLocaleString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${a} → ${b}`;
  } catch {
    return `${w.start} → ${w.end}`;
  }
}

export function WattsInventoryView() {
  const [firmness, setFirmness] = useState<"firm" | "flex">("flex");
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
  const [capacityKw, setCapacityKw] = useState("50");
  const [energyKwh, setEnergyKwh] = useState("200");
  const [country, setCountry] = useState("FR");
  const [zoneId, setZoneId] = useState("");
  const [carbon, setCarbon] = useState("40");
  const [label, setLabel] = useState("");
  const [offers, setOffers] = useState<Offer[]>([]);
  const [matches, setMatches] = useState<MatchRow[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [matching, setMatching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/v1/watts/offers/demo");
      const json = (await res.json()) as {
        offers?: Offer[];
        error?: { message?: string };
      };
      if (!res.ok) {
        setError(json.error?.message ?? `Erreur ${res.status}`);
        return;
      }
      setOffers(json.offers ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function publish() {
    setPublishing(true);
    setError(null);
    setOkMsg(null);
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
    if (firmness === "flex") body.capacity_kw = Number(capacityKw);
    else body.energy_kwh = Number(energyKwh);
    if (carbon.trim()) body.carbon_intensity_gco2_kwh = Number(carbon);
    if (label.trim()) body.label = label.trim();
    body.producer_ref = "demo-producer";

    try {
      const res = await fetch("/api/v1/watts/offers/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = (await res.json()) as {
        offer_id?: string;
        error?: { message?: string };
      };
      if (!res.ok) {
        setError(json.error?.message ?? `Erreur ${res.status}`);
        return;
      }
      setOkMsg(`Offre publiée · ${json.offer_id}`);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setPublishing(false);
    }
  }

  async function runMatch() {
    setMatching(true);
    setError(null);
    setMatches(null);
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
    if (firmness === "flex") body.capacity_kw = Number(capacityKw);
    else body.energy_kwh = Number(energyKwh);
    if (carbon.trim()) body.carbon_intensity_max_gco2_kwh = Number(carbon);

    try {
      const res = await fetch("/api/v1/watts/offers/demo/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = (await res.json()) as {
        matches?: MatchRow[];
        error?: { message?: string };
      };
      if (!res.ok) {
        setError(json.error?.message ?? `Erreur ${res.status}`);
        return;
      }
      setMatches(json.matches ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setMatching(false);
    }
  }

  const busy = loading || publishing || matching;

  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-24 h-[28rem] bg-[radial-gradient(ellipse_at_50%_0%,rgba(16,185,129,0.12),transparent_60%)]"
      />

      <div className="relative mx-auto max-w-xl space-y-12">
        <header className="space-y-5 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-emerald-400/85">
            AUROS · Inventaire
          </p>
          <h1 className="font-display text-4xl font-medium tracking-tight text-white md:text-5xl">
            Capacité producteur
          </h1>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-white/55">
            Publiez une fenêtre de capacité, parcourez l’inventaire ouvert, et
            matchtez un profil acheteur — indicatif, sans engagement.
          </p>
        </header>

        <section className="space-y-6 border border-white/[0.08] bg-black/50 p-6 backdrop-blur-sm md:p-8">
          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
              Publier
            </p>
            <div className="flex gap-1.5">
              {(["flex", "firm"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFirmness(f)}
                  className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition ${
                    firmness === f
                      ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/35"
                      : "text-white/40 hover:text-white/70"
                  }`}
                >
                  {f === "flex" ? "Flex · kW" : "Firm · kWh"}
                </button>
              ))}
            </div>
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
                className={fieldClass}
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
                className={fieldClass}
              />
            </label>
          </div>

          {firmness === "flex" ? (
            <label className="block max-w-[12rem] space-y-1.5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                Capacité (kW)
              </span>
              <input
                type="number"
                min={0.1}
                value={capacityKw}
                onChange={(e) => setCapacityKw(e.target.value)}
                className={fieldClass}
              />
            </label>
          ) : (
            <label className="block max-w-[12rem] space-y-1.5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                Énergie (kWh)
              </span>
              <input
                type="number"
                min={0.1}
                value={energyKwh}
                onChange={(e) => setEnergyKwh(e.target.value)}
                className={fieldClass}
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
                className={fieldClass}
              />
            </label>
            <label className="block space-y-1.5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                Zone
              </span>
              <input
                value={zoneId}
                onChange={(e) => setZoneId(e.target.value)}
                placeholder="FR-IDF"
                className={fieldClass}
              />
            </label>
            <label className="block space-y-1.5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                gCO₂/kWh
              </span>
              <input
                type="number"
                min={0}
                value={carbon}
                onChange={(e) => setCarbon(e.target.value)}
                className={fieldClass}
              />
            </label>
          </div>

          <label className="block space-y-1.5">
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              Libellé (optionnel)
            </span>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Parc solaire · créneau soir"
              className={fieldClass}
            />
          </label>

          <div className="flex flex-wrap gap-3">
            <PrimaryButton
              type="button"
              onClick={() => void publish()}
              disabled={busy}
            >
              {publishing ? "Publication…" : "Publier l’offre"}
            </PrimaryButton>
            <PrimaryButton
              type="button"
              variant="ghost"
              onClick={() => void runMatch()}
              disabled={busy}
            >
              {matching ? "Matching…" : "Matcher ce profil"}
            </PrimaryButton>
          </div>

          {error ? (
            <p className="text-sm text-red-400/90" role="alert">
              {error}
            </p>
          ) : null}
          {okMsg ? (
            <p className="text-sm text-emerald-400/80">{okMsg}</p>
          ) : null}
        </section>

        {matches ? (
          <section className="space-y-4 border border-emerald-500/20 bg-emerald-500/[0.05] p-6 md:p-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
              Matches · {matches.length}
            </p>
            {matches.length === 0 ? (
              <p className="text-sm text-white/45">
                Aucune offre ouverte ne chevauche ce profil.
              </p>
            ) : (
              <ul className="space-y-4">
                {matches.map((m) => (
                  <li
                    key={m.offer_id}
                    className="border-t border-white/[0.06] pt-4 first:border-0 first:pt-0"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="text-sm text-white/80">
                        {m.offer.label || m.offer.producer_ref || "Offre"}
                      </p>
                      <p className="font-display text-2xl tabular-nums text-white">
                        {m.match_score}
                        <span className="text-sm text-white/35">/100</span>
                      </p>
                    </div>
                    <p className="mt-1 text-xs text-white/40">
                      {fmtWindow(m.offer.window)} · {m.offer.zone.country}
                      {m.offer.capacity_kw != null
                        ? ` · ${m.offer.capacity_kw} kW`
                        : ""}
                      {m.offer.energy_kwh != null
                        ? ` · ${m.offer.energy_kwh} kWh`
                        : ""}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ) : null}

        <section className="space-y-4 border border-white/[0.08] bg-black/40 p-6 md:p-8">
          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
              Inventaire ouvert · {offers.length}
            </p>
            <button
              type="button"
              onClick={() => void refresh()}
              disabled={busy}
              className="font-mono text-[10px] uppercase tracking-wider text-white/40 hover:text-white/70"
            >
              {loading ? "…" : "Rafraîchir"}
            </button>
          </div>
          {offers.length === 0 ? (
            <p className="text-sm text-white/45">
              Aucune offre pour l’instant — publiez une fenêtre ci-dessus.
            </p>
          ) : (
            <ul className="space-y-4">
              {offers.slice(0, 12).map((o) => (
                <li
                  key={o.offer_id}
                  className="border-t border-white/[0.06] pt-4 first:border-0 first:pt-0"
                >
                  <p className="text-sm text-white/75">
                    {o.label || o.producer_ref || "Offre capacité"}
                  </p>
                  <p className="mt-1 text-xs text-white/40">
                    {fmtWindow(o.window)} · {o.firmness} · {o.zone.country}
                    {o.zone.zone_id ? `/${o.zone.zone_id}` : ""}
                    {o.capacity_kw != null ? ` · ${o.capacity_kw} kW` : ""}
                    {o.energy_kwh != null ? ` · ${o.energy_kwh} kWh` : ""}
                    {o.carbon_intensity_gco2_kwh != null
                      ? ` · ${o.carbon_intensity_gco2_kwh} gCO₂`
                      : ""}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <footer className="space-y-4 text-center">
          <p className="mx-auto max-w-md text-[11px] leading-relaxed text-white/30">
            {WATTS_RESERVE_DISCLAIMER}
          </p>
          <p className="text-xs text-white/35">
            <Link
              href={WATTS_RESERVE_ROUTE}
              className="text-white/55 underline-offset-2 hover:underline"
            >
              Réserver
            </Link>
            {" · "}
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
          </p>
        </footer>
      </div>
    </div>
  );
}
