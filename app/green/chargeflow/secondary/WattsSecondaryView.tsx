"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import {
  CHARGEFLOW_FLEETS_ROUTE,
  CHARGEFLOW_ROUTE,
} from "@/lib/chargeflow/constants";
import {
  WATTS_INVENTORY_ROUTE,
  WATTS_RESERVE_DISCLAIMER,
  WATTS_RESERVE_ROUTE,
} from "@/lib/watts";

import {
  useWattsApiMode,
  WattsApiModeBar,
} from "../_components/WattsApiModeBar";
import { WattsFlowNav } from "../_components/WattsFlowNav";

type Listing = {
  listing_id: string;
  status: string;
  indicative_price_eur: number;
  compare_ref_id: string | null;
  compare_url: string | null;
  label: string | null;
  note: string | null;
  energy_kwh: number | null;
  capacity_kw: number | null;
  zone: { country: string; zone_id?: string };
  firmness: string;
  interest_count: number;
  cfu_verify_url: string | null;
  reservation_id?: string | null;
  rwa_hint?: string;
};

const fieldClass =
  "w-full border border-white/[0.1] bg-white/[0.03] px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-emerald-500/35 focus:bg-white/[0.05]";

export function WattsSecondaryView({
  initialReservationId = null,
}: {
  initialReservationId?: string | null;
}) {
  const {
    mode,
    setMode,
    apiKey,
    setApiKey,
    authHeaders,
    endpoint,
    isPremiumReady,
  } = useWattsApiMode();
  const [price, setPrice] = useState("1200");
  const [energyKwh, setEnergyKwh] = useState("100");
  const [country, setCountry] = useState("FR");
  const [label, setLabel] = useState("");
  const [compareRef, setCompareRef] = useState("");
  const [note, setNote] = useState("");
  const [reservationId, setReservationId] = useState(
    initialReservationId?.trim() || ""
  );
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(endpoint("/api/v1/watts/secondary/demo"), {
        headers: authHeaders(),
      });
      const json = (await res.json()) as {
        listings?: Listing[];
        error?: { message?: string };
      };
      if (!res.ok) {
        setError(json.error?.message ?? `Erreur ${res.status}`);
        return;
      }
      setListings(json.listings ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
    }
  }, [endpoint, authHeaders]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function publish() {
    if (mode === "premium" && !isPremiumReady) {
      setError("Mode Premium : collez une clé Protocol Premium.");
      return;
    }
    setPublishing(true);
    setError(null);
    setOkMsg(null);
    const body: Record<string, unknown> = {
      indicative_price_eur: Number(price),
      label: label.trim() || "Position watts",
    };
    if (reservationId.trim()) {
      body.reservation_id = reservationId.trim();
    } else {
      body.energy_kwh = Number(energyKwh);
      body.zone = { country: country.trim() };
      body.firmness = "firm";
    }
    if (compareRef.trim()) body.compare_ref_id = compareRef.trim();
    if (note.trim()) body.note = note.trim();

    try {
      const res = await fetch(endpoint("/api/v1/watts/secondary/demo"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify(body),
      });
      const json = (await res.json()) as {
        listing_id?: string;
        error?: { message?: string };
      };
      if (!res.ok) {
        setError(json.error?.message ?? `Erreur ${res.status}`);
        return;
      }
      setOkMsg(`Listing publié · ${json.listing_id}`);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setPublishing(false);
    }
  }

  async function expressInterest(id: string) {
    setError(null);
    try {
      const res = await fetch(
        `/api/v1/watts/secondary/${encodeURIComponent(id)}/interest`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ note: "Demo interest" }),
        }
      );
      const json = (await res.json()) as {
        interest_count?: number;
        error?: { message?: string };
      };
      if (!res.ok) {
        setError(json.error?.message ?? `Erreur ${res.status}`);
        return;
      }
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    }
  }

  const busy = loading || publishing;
  const fromReservation = Boolean(reservationId.trim());

  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-24 h-[28rem] bg-[radial-gradient(ellipse_at_50%_0%,rgba(16,185,129,0.1),transparent_60%)]"
      />

      <div className="relative mx-auto max-w-xl space-y-12">
        <header className="space-y-5 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-emerald-400/85">
            AUROS · Secondaire
          </p>
          <h1 className="font-display text-4xl font-medium tracking-tight text-white md:text-5xl">
            Positions & RWA prep
          </h1>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-white/55">
            Listez une position watts à prix indicatif, liez un produit Protocol
            pour le comparateur — pas un marché réglementé, pas d’ordre exécuté.
          </p>
          <WattsFlowNav />
        </header>

        <WattsApiModeBar
          mode={mode}
          apiKey={apiKey}
          onModeChange={setMode}
          onKeyChange={setApiKey}
        />

        <section className="space-y-6 border border-white/[0.08] bg-black/50 p-6 backdrop-blur-sm md:p-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
            Publier un listing
          </p>

          {fromReservation ? (
            <p className="text-xs leading-relaxed text-emerald-400/70">
              Réservation liée — le snapshot CFU / zone sera repris à la
              publication.
            </p>
          ) : null}

          <label className="block space-y-1.5">
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              reservation_id (optionnel)
            </span>
            <input
              value={reservationId}
              onChange={(e) => setReservationId(e.target.value)}
              placeholder="uuid settled / confirmed"
              className={fieldClass}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-1.5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                Prix indicatif (€)
              </span>
              <input
                type="number"
                min={1}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={fieldClass}
              />
            </label>
            {!fromReservation ? (
              <label className="block space-y-1.5">
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
            ) : (
              <label className="block space-y-1.5">
                <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                  Pays (ignoré si réservation)
                </span>
                <input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className={fieldClass}
                  disabled
                />
              </label>
            )}
          </div>

          {!fromReservation ? (
            <div className="grid gap-4 sm:grid-cols-2">
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
                  compare_ref_id (RWA)
                </span>
                <input
                  value={compareRef}
                  onChange={(e) => setCompareRef(e.target.value)}
                  placeholder="id produit Protocol"
                  className={fieldClass}
                />
              </label>
            </div>
          ) : (
            <label className="block space-y-1.5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                compare_ref_id (RWA)
              </span>
              <input
                value={compareRef}
                onChange={(e) => setCompareRef(e.target.value)}
                placeholder="id produit Protocol"
                className={fieldClass}
              />
            </label>
          )}

          <label className="block space-y-1.5">
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              Libellé
            </span>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Bundle flex IDF · Q3"
              className={fieldClass}
            />
          </label>

          <label className="block space-y-1.5">
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              Note
            </span>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Contexte RWA prep (indicatif)"
              className={fieldClass}
            />
          </label>

          <PrimaryButton
            type="button"
            onClick={() => void publish()}
            disabled={busy}
          >
            {publishing ? "Publication…" : "Publier le listing"}
          </PrimaryButton>

          {error ? (
            <p className="text-sm text-red-400/90" role="alert">
              {error}
            </p>
          ) : null}
          {okMsg ? (
            <p className="text-sm text-emerald-400/80">{okMsg}</p>
          ) : null}
        </section>

        <section className="space-y-4 border border-white/[0.08] bg-black/40 p-6 md:p-8">
          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
              Livre ouvert · {listings.length}
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

          {listings.length === 0 ? (
            <p className="text-sm text-white/45">
              Aucun listing — publiez une position ci-dessus.
            </p>
          ) : (
            <ul className="space-y-5">
              {listings.slice(0, 12).map((l) => (
                <li
                  key={l.listing_id}
                  className="border-t border-white/[0.06] pt-4 first:border-0 first:pt-0"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="text-sm text-white/80">
                      {l.label || "Position watts"}
                    </p>
                    <p className="font-display text-2xl tabular-nums text-white">
                      {l.indicative_price_eur.toLocaleString("fr-FR")}
                      <span className="text-sm text-white/35"> €</span>
                    </p>
                  </div>
                  <p className="mt-1 text-xs text-white/40">
                    {l.zone.country}
                    {l.energy_kwh != null ? ` · ${l.energy_kwh} kWh` : ""}
                    {l.capacity_kw != null ? ` · ${l.capacity_kw} kW` : ""}
                    {` · ${l.firmness}`}
                    {` · intérêts ${l.interest_count}`}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <PrimaryButton
                      type="button"
                      variant="ghost"
                      onClick={() => void expressInterest(l.listing_id)}
                    >
                      Marquer un intérêt
                    </PrimaryButton>
                    {l.compare_url ? (
                      <PrimaryButton href={l.compare_url} variant="ghost">
                        Ouvrir /compare
                      </PrimaryButton>
                    ) : (
                      <PrimaryButton href="/compare" variant="ghost">
                        Comparateur RWA
                      </PrimaryButton>
                    )}
                    {l.cfu_verify_url ? (
                      <PrimaryButton href={l.cfu_verify_url} variant="ghost">
                        Vérifier CFU
                      </PrimaryButton>
                    ) : null}
                  </div>
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
              href={WATTS_INVENTORY_ROUTE}
              className="text-white/55 underline-offset-2 hover:underline"
            >
              Inventaire
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
