"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import {
  WATTS_HUB_ROUTE,
  WATTS_INVENTORY_ROUTE,
  WATTS_RESERVE_DISCLAIMER,
  WATTS_RESERVE_ROUTE,
  WATTS_SECONDARY_ROUTE,
} from "@/lib/watts";

const PATHS = [
  {
    href: WATTS_RESERVE_ROUTE,
    title: "Réserver",
    detail: "Profil · matching · confirm CFU · settle",
  },
  {
    href: WATTS_INVENTORY_ROUTE,
    title: "Inventaire",
    detail: "Fenêtres de capacité producteur",
  },
  {
    href: WATTS_SECONDARY_ROUTE,
    title: "Secondaire",
    detail: "Listings indicatifs · prep RWA /compare",
  },
] as const;

type OfferSnap = {
  offer_id: string;
  label: string | null;
  firmness: string;
  zone: { country: string };
  capacity_kw: number | null;
  energy_kwh: number | null;
};

type ListingSnap = {
  listing_id: string;
  label: string | null;
  indicative_price_eur: number;
  zone: { country: string };
  interest_count: number;
};

function fmtOffer(o: OfferSnap) {
  const vol =
    o.capacity_kw != null
      ? `${o.capacity_kw} kW`
      : o.energy_kwh != null
        ? `${o.energy_kwh} kWh`
        : "—";
  return `${o.label || "Offre"} · ${o.zone.country} · ${vol}`;
}

export function WattsHubView() {
  const [offers, setOffers] = useState<OfferSnap[]>([]);
  const [listings, setListings] = useState<ListingSnap[]>([]);
  const [loadingLive, setLoadingLive] = useState(true);

  const refreshLive = useCallback(async () => {
    setLoadingLive(true);
    try {
      const [offersRes, listingsRes] = await Promise.all([
        fetch("/api/v1/watts/offers/demo"),
        fetch("/api/v1/watts/secondary/demo"),
      ]);
      if (offersRes.ok) {
        const j = (await offersRes.json()) as { offers?: OfferSnap[] };
        setOffers(j.offers ?? []);
      }
      if (listingsRes.ok) {
        const j = (await listingsRes.json()) as { listings?: ListingSnap[] };
        setListings(j.listings ?? []);
      }
    } catch {
      /* silent — hub still works offline */
    } finally {
      setLoadingLive(false);
    }
  }, []);

  useEffect(() => {
    void refreshLive();
  }, [refreshLive]);

  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-32 h-[36rem] bg-[radial-gradient(ellipse_at_50%_0%,rgba(16,185,129,0.18),transparent_55%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-48 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-20 h-64 w-64 rounded-full bg-emerald-500/[0.07] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 bottom-24 h-48 w-48 rounded-full bg-emerald-400/[0.04] blur-3xl"
      />

      <div className="relative mx-auto max-w-2xl space-y-16 pb-8 pt-4 text-center">
        <header className="space-y-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-emerald-400/90">
            AUROS
          </p>
          <h1 className="font-display text-5xl font-medium tracking-tight text-white md:text-6xl">
            Watts
          </h1>
          <p className="mx-auto max-w-md text-base leading-relaxed text-white/55">
            Réserver, prouver et préparer la finance des watts critiques —
            flottes, CPO, flex. Indicatif, explicite, sans auto-mint.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <PrimaryButton href={WATTS_RESERVE_ROUTE}>
              Réserver un profil
            </PrimaryButton>
            <PrimaryButton href={WATTS_INVENTORY_ROUTE} variant="ghost">
              Voir l’inventaire
            </PrimaryButton>
          </div>
        </header>

        <section className="grid gap-8 text-left sm:grid-cols-3">
          {PATHS.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="group space-y-2 border-t border-white/[0.08] pt-4 transition duration-300 hover:border-emerald-500/35"
            >
              <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 transition group-hover:text-emerald-400/85">
                {p.title}
              </h2>
              <p className="text-sm leading-relaxed text-white/60 transition group-hover:text-white/80">
                {p.detail}
              </p>
            </Link>
          ))}
        </section>

        <section className="space-y-8 border border-white/[0.07] bg-black/35 px-5 py-6 text-left md:px-7">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                Marché indicatif
              </p>
              <p className="mt-2 font-display text-2xl tabular-nums text-white">
                {loadingLive ? "…" : offers.length}
                <span className="text-sm text-white/35"> offres</span>
                <span className="mx-2 text-white/20">·</span>
                {loadingLive ? "…" : listings.length}
                <span className="text-sm text-white/35"> listings</span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => void refreshLive()}
              className="font-mono text-[10px] uppercase tracking-wider text-white/35 transition hover:text-white/60"
            >
              Rafraîchir
            </button>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div className="space-y-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
                Capacité ouverte
              </p>
              {offers.length === 0 ? (
                <p className="text-xs leading-relaxed text-white/40">
                  Aucune offre encore —{" "}
                  <Link
                    href={WATTS_INVENTORY_ROUTE}
                    className="text-white/55 underline-offset-2 hover:underline"
                  >
                    publier une fenêtre
                  </Link>
                  .
                </p>
              ) : (
                <ul className="space-y-2">
                  {offers.slice(0, 3).map((o) => (
                    <li
                      key={o.offer_id}
                      className="text-xs leading-relaxed text-white/55"
                    >
                      {fmtOffer(o)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="space-y-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
                Livre secondaire
              </p>
              {listings.length === 0 ? (
                <p className="text-xs leading-relaxed text-white/40">
                  Aucun listing —{" "}
                  <Link
                    href={WATTS_SECONDARY_ROUTE}
                    className="text-white/55 underline-offset-2 hover:underline"
                  >
                    ouvrir le secondaire
                  </Link>
                  .
                </p>
              ) : (
                <ul className="space-y-2">
                  {listings.slice(0, 3).map((l) => (
                    <li
                      key={l.listing_id}
                      className="text-xs leading-relaxed text-white/55"
                    >
                      {l.label || "Position"} · {l.zone.country} ·{" "}
                      {l.indicative_price_eur.toLocaleString("fr-FR")} € ·{" "}
                      {l.interest_count} intérêt
                      {l.interest_count === 1 ? "" : "s"}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-md space-y-3 text-left">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
            Boucle
          </p>
          <p className="text-sm leading-relaxed text-white/50">
            Matching → confirm (mint CFU) → settle (retire) → inventaire →
            secondaire lié au comparateur RWA. Quatre moments, une preuve
            off-chain.
          </p>
          <p className="text-xs text-white/35">
            <Link
              href="/developers/docs/endpoint-watts-reserve"
              className="underline-offset-2 hover:underline"
            >
              Docs API
            </Link>
            {" · "}
            <Link
              href="/copilot?context=watts"
              className="underline-offset-2 hover:underline"
            >
              Copilot
            </Link>
          </p>
        </section>

        <footer className="space-y-3">
          <p className="mx-auto max-w-md text-[11px] leading-relaxed text-white/30">
            {WATTS_RESERVE_DISCLAIMER}
          </p>
          <p className="font-mono text-[10px] text-white/25">{WATTS_HUB_ROUTE}</p>
        </footer>
      </div>
    </div>
  );
}
