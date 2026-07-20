"use client";

import Link from "next/link";

import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import {
  WATTS_HUB_ROUTE,
  WATTS_RESERVE_ROUTE,
} from "@/lib/watts";

const PATHS = [
  {
    href: `${WATTS_RESERVE_ROUTE}`,
    title: "Réserver (Watts)",
    detail: "Profil firm/flex + generation_source=nuclear si besoin",
  },
  {
    href: "/green/chargeflow",
    title: "Prouver (CFU)",
    detail: "Unités ChargeFlow vérifiables — export audit Premium",
  },
  {
    href: "/developers/institutions",
    title: "Intégrer (API)",
    detail: "OpenAPI, Monitor, export CFU — usage institutionnel",
  },
] as const;

export function PowerHubView() {
  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-32 h-[36rem] bg-[radial-gradient(ellipse_at_50%_0%,rgba(148,163,184,0.16),transparent_55%)]"
      />
      <div className="relative mx-auto max-w-2xl space-y-14 pb-8 pt-4 text-center">
        <header className="space-y-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-slate-300/90">
            AUROS · Low-carbon Power
          </p>
          <h1 className="font-display text-5xl font-medium tracking-tight text-white md:text-6xl">
            Power
          </h1>
          <p className="mx-auto max-w-md text-base leading-relaxed text-white/55">
            Nucléaire, hydro bas-carbone et mix — booking Watts + preuves CFU,
            sans badge Green Verified. Indicatif, explicite, counsel requis.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <PrimaryButton href="/guides/low-carbon-power">
              Lire la définition
            </PrimaryButton>
            <PrimaryButton href={WATTS_HUB_ROUTE} variant="ghost">
              Hub Watts
            </PrimaryButton>
          </div>
        </header>

        <section className="grid gap-8 text-left sm:grid-cols-3">
          {PATHS.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="group space-y-2 border-t border-white/[0.08] pt-4 transition hover:border-slate-400/40"
            >
              <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 group-hover:text-slate-300">
                {p.title}
              </h2>
              <p className="text-sm leading-relaxed text-white/60">{p.detail}</p>
            </Link>
          ))}
        </section>

        <p className="mx-auto max-w-md text-[11px] leading-relaxed text-white/30">
          Ce hub n&apos;est pas AUROS Green Verified. Le nucléaire n&apos;ouvre pas
          de candidature label RTMS renouvelable. Voir aussi{" "}
          <Link
            href="/comment-tokeniser/nucleaire"
            className="underline-offset-2 hover:underline"
          >
            comment tokeniser le nucléaire
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
