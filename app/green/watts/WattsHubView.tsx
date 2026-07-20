"use client";

import Link from "next/link";

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

export function WattsHubView() {
  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-32 h-[36rem] bg-[radial-gradient(ellipse_at_50%_0%,rgba(16,185,129,0.18),transparent_55%)] transition-opacity duration-700"
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
            <PrimaryButton
              href="/developers/docs/endpoint-watts-reserve"
              variant="ghost"
            >
              Docs API
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

        <section className="mx-auto max-w-md space-y-3 text-left">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
            Boucle
          </p>
          <p className="text-sm leading-relaxed text-white/50">
            Matching → confirm (mint CFU) → settle (retire) → inventaire →
            secondaire lié au comparateur RWA. Quatre moments, une preuve
            off-chain.
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
