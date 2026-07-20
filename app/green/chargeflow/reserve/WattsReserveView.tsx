"use client";

import Link from "next/link";
import { useState } from "react";

import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import {
  CHARGEFLOW_FLEETS_ROUTE,
  CHARGEFLOW_ROUTE,
} from "@/lib/chargeflow/constants";
import {
  WATTS_INVENTORY_ROUTE,
  WATTS_RESERVE_DISCLAIMER,
  WATTS_SECONDARY_ROUTE,
} from "@/lib/watts";

import { WattsFlowNav } from "../_components/WattsFlowNav";

type MatchReason = { code: string; detail: string; delta: number };

type ReserveResult = {
  reservation_id?: string;
  match_score?: number;
  match_reasons?: MatchReason[];
  suggested_unit_kind?: "e" | "f";
  status?: string;
  disclaimer?: string;
  next_step?: string;
  cfu_unit_id?: string | null;
  cfu_verify_url?: string | null;
  confirmed_at?: string | null;
  settled_at?: string | null;
  delivery_ref?: string | null;
  unit?: {
    id?: string;
    verify_url?: string;
    unit_kind?: string;
    status?: string;
  };
  error?: { message?: string };
};

const fieldClass =
  "w-full border border-white/[0.1] bg-white/[0.03] px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-emerald-500/35 focus:bg-white/[0.05]";

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
  const [confirming, setConfirming] = useState(false);
  const [settling, setSettling] = useState(false);
  const [deliveryRef, setDeliveryRef] = useState("");
  const [result, setResult] = useState<ReserveResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [matchingOffers, setMatchingOffers] = useState(false);
  const [offerMatches, setOfferMatches] = useState<
    {
      offer_id: string;
      match_score: number;
      offer: {
        label: string | null;
        zone: { country: string };
        capacity_kw: number | null;
        energy_kwh: number | null;
        firmness: string;
      };
    }[]
  >([]);

  function profileBody() {
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
    return body;
  }

  async function submit() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/v1/watts/reserve/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileBody()),
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

  async function matchInventory() {
    setMatchingOffers(true);
    setError(null);
    try {
      const res = await fetch("/api/v1/watts/offers/demo/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileBody()),
      });
      const json = (await res.json()) as {
        matches?: typeof offerMatches;
        error?: { message?: string };
      };
      if (!res.ok) {
        setError(json.error?.message ?? `Erreur ${res.status}`);
        return;
      }
      setOfferMatches((json.matches ?? []).slice(0, 5));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setMatchingOffers(false);
    }
  }

  async function confirm() {
    if (!result?.reservation_id) return;
    setConfirming(true);
    setError(null);
    try {
      const res = await fetch("/api/v1/watts/reserve/demo/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reservation_id: result.reservation_id }),
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
      setConfirming(false);
    }
  }

  async function settle() {
    if (!result?.reservation_id) return;
    setSettling(true);
    setError(null);
    try {
      const body: Record<string, unknown> = {
        reservation_id: result.reservation_id,
        reason: "Demo delivery settle",
      };
      if (deliveryRef.trim()) body.delivery_ref = deliveryRef.trim();
      if (firmness === "firm") {
        body.energy_kwh_delivered = Number(energyKwh);
      } else {
        body.capacity_kw_delivered = Number(capacityKw);
      }
      const res = await fetch("/api/v1/watts/reserve/demo/settle", {
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
      setSettling(false);
    }
  }

  const confirmed = result?.status === "confirmed";
  const pending = result?.status === "pending_confirm";
  const settled = result?.status === "settled";
  const busy = loading || confirming || settling || matchingOffers;

  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-24 h-[28rem] bg-[radial-gradient(ellipse_at_50%_0%,rgba(16,185,129,0.14),transparent_60%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-40 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />

      <div className="relative mx-auto max-w-xl space-y-12">
        <header className="space-y-5 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-emerald-400/85">
            AUROS · Watts Reserve
          </p>
          <h1 className="font-display text-4xl font-medium tracking-tight text-white md:text-5xl">
            Réserver des watts
          </h1>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-white/55">
            Matching indicatif, confirm pour mint CFU, settle pour retire à la
            livraison — trois actions explicites.
          </p>
          <WattsFlowNav />
        </header>

        <section className="space-y-6 border border-white/[0.08] bg-black/50 p-6 backdrop-blur-sm md:p-8">
          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
              Profil
            </p>
            <div className="flex gap-1.5">
              {(["firm", "flex"] as const).map((f) => (
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
                  {f === "firm" ? "Firm · kWh" : "Flex · kW"}
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

          {firmness === "firm" ? (
            <label className="block max-w-[12rem] space-y-1.5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                Énergie (kWh)
              </span>
              <input
                type="number"
                min={0.1}
                step="any"
                value={energyKwh}
                onChange={(e) => setEnergyKwh(e.target.value)}
                className={fieldClass}
              />
            </label>
          ) : (
            <label className="block max-w-[12rem] space-y-1.5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                Capacité (kW)
              </span>
              <input
                type="number"
                min={0.1}
                step="any"
                value={capacityKw}
                onChange={(e) => setCapacityKw(e.target.value)}
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
                Carbone max
              </span>
              <input
                type="number"
                min={0}
                value={carbonMax}
                onChange={(e) => setCarbonMax(e.target.value)}
                className={fieldClass}
              />
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <PrimaryButton
              type="button"
              onClick={() => void submit()}
              disabled={busy}
            >
              {loading ? "Matching…" : "Calculer le matching"}
            </PrimaryButton>
            <PrimaryButton
              type="button"
              variant="ghost"
              onClick={() => void matchInventory()}
              disabled={busy}
            >
              {matchingOffers ? "Inventaire…" : "Voir capacité ouverte"}
            </PrimaryButton>
          </div>

          {offerMatches.length > 0 ? (
            <div className="space-y-3 border-t border-white/[0.08] pt-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                Inventaire · top match
              </p>
              <ul className="space-y-2">
                {offerMatches.map((m) => {
                  const vol =
                    m.offer.capacity_kw != null
                      ? `${m.offer.capacity_kw} kW`
                      : m.offer.energy_kwh != null
                        ? `${m.offer.energy_kwh} kWh`
                        : "—";
                  return (
                    <li
                      key={m.offer_id}
                      className="flex flex-wrap items-baseline justify-between gap-2 text-sm text-white/60"
                    >
                      <span>
                        {m.offer.label || "Offre"} · {m.offer.zone.country} ·{" "}
                        {vol} · {m.offer.firmness}
                      </span>
                      <span className="font-mono tabular-nums text-emerald-400/90">
                        {m.match_score}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <p className="text-xs text-white/35">
                Indicatif — aucune réservation auto.{" "}
                <Link
                  href={WATTS_INVENTORY_ROUTE}
                  className="underline-offset-2 hover:underline"
                >
                  Inventaire complet
                </Link>
              </p>
            </div>
          ) : null}

          {error ? (
            <p className="text-sm text-red-400/90" role="alert">
              {error}
            </p>
          ) : null}
        </section>

        {result?.reservation_id ? (
          <section
            className={`space-y-5 border p-6 md:p-8 ${
              settled
                ? "border-white/15 bg-white/[0.04]"
                : confirmed
                  ? "border-emerald-500/25 bg-emerald-500/[0.06]"
                  : "border-white/[0.08] bg-black/40"
            }`}
          >
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                  {settled
                    ? "Settled"
                    : confirmed
                      ? "Confirmé"
                      : "Matching"}
                </p>
                <p className="mt-1 font-display text-4xl tabular-nums text-white">
                  {result.match_score}
                  <span className="text-lg text-white/35">/100</span>
                </p>
              </div>
              <p className="font-mono text-[11px] text-emerald-400/85">
                CFU-{result.suggested_unit_kind?.toUpperCase()} · {result.status}
              </p>
            </div>

            <ul className="space-y-1.5 text-xs leading-relaxed text-white/45">
              {(result.match_reasons ?? [])
                .filter((r) => r.code !== "base")
                .slice(0, 5)
                .map((r) => (
                  <li key={`${r.code}-${r.detail}`}>
                    {r.detail}
                    {r.delta ? (
                      <span className="text-white/25"> · +{r.delta}</span>
                    ) : null}
                  </li>
                ))}
            </ul>

            <p className="font-mono text-[10px] text-white/30">
              {result.reservation_id}
            </p>

            {pending ? (
              <div className="space-y-3 border-t border-white/[0.06] pt-5">
                <p className="text-xs leading-relaxed text-white/45">
                  Le matching est prêt. Confirmez pour mint une CFU liée à cette
                  réservation — action explicite, pas d’auto-mint.
                </p>
                <PrimaryButton
                  type="button"
                  onClick={() => void confirm()}
                  disabled={busy}
                >
                  {confirming
                    ? "Mint CFU…"
                    : `Confirmer · mint CFU-${result.suggested_unit_kind?.toUpperCase()}`}
                </PrimaryButton>
              </div>
            ) : null}

            {confirmed ? (
              <div className="space-y-4 border-t border-emerald-500/15 pt-5">
                <p className="text-sm text-white/70">
                  CFU{" "}
                  <span className="font-mono text-emerald-300/90">
                    {result.cfu_unit_id ?? result.unit?.id}
                  </span>{" "}
                  mintée.
                </p>
                {(result.cfu_verify_url ?? result.unit?.verify_url) ? (
                  <PrimaryButton
                    href={result.cfu_verify_url ?? result.unit?.verify_url}
                    variant="ghost"
                  >
                    Vérifier la CFU
                  </PrimaryButton>
                ) : null}
                <div className="space-y-3 pt-2">
                  <p className="text-xs leading-relaxed text-white/45">
                    À la livraison, settle retire la CFU — preuve clôturée,
                    pas d’auto-retire.
                  </p>
                  <label className="block max-w-xs space-y-1.5">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                      Réf. livraison (optionnel)
                    </span>
                    <input
                      value={deliveryRef}
                      onChange={(e) => setDeliveryRef(e.target.value)}
                      placeholder="session / meter id"
                      className={fieldClass}
                    />
                  </label>
                  <PrimaryButton
                    type="button"
                    onClick={() => void settle()}
                    disabled={busy}
                  >
                    {settling ? "Settlement…" : "Livré · settle & retire CFU"}
                  </PrimaryButton>
                </div>
              </div>
            ) : null}

            {settled ? (
              <div className="space-y-3 border-t border-white/10 pt-5">
                <p className="text-sm text-white/70">
                  Réservation settled — CFU{" "}
                  <span className="font-mono text-white/50">
                    {result.cfu_unit_id ?? result.unit?.id}
                  </span>{" "}
                  retired
                  {result.unit?.status ? ` (${result.unit.status})` : ""}.
                </p>
                {result.delivery_ref ? (
                  <p className="font-mono text-[10px] text-white/35">
                    delivery · {result.delivery_ref}
                  </p>
                ) : null}
                <div className="flex flex-wrap gap-2">
                  {(result.cfu_verify_url ?? result.unit?.verify_url) ? (
                    <PrimaryButton
                      href={result.cfu_verify_url ?? result.unit?.verify_url}
                      variant="ghost"
                    >
                      Voir la CFU retired
                    </PrimaryButton>
                  ) : null}
                  {result.reservation_id ? (
                    <PrimaryButton
                      href={`${WATTS_SECONDARY_ROUTE}?reservation_id=${encodeURIComponent(result.reservation_id)}`}
                    >
                      Lister au secondaire
                    </PrimaryButton>
                  ) : null}
                </div>
              </div>
            ) : null}
          </section>
        ) : null}

        <footer className="space-y-4 text-center">
          <p className="mx-auto max-w-md text-[11px] leading-relaxed text-white/30">
            {WATTS_RESERVE_DISCLAIMER}
          </p>
          <p className="text-xs text-white/35">
            <Link
              href={WATTS_INVENTORY_ROUTE}
              className="text-white/55 underline-offset-2 hover:underline"
            >
              Inventaire
            </Link>
            {" · "}
            <Link
              href={WATTS_SECONDARY_ROUTE}
              className="text-white/55 underline-offset-2 hover:underline"
            >
              Secondaire
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
            {" · "}
            <Link
              href="/copilot?context=watts"
              className="text-white/55 underline-offset-2 hover:underline"
            >
              Copilot
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
