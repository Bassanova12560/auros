"use client";

import Link from "next/link";

import { AurosBrandLockup } from "@/app/_components/AurosBrandLockup";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { WATTS_HUB_ROUTE, WATTS_RESERVE_ROUTE } from "@/lib/watts";

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
    <div className="auros-page-article relative">
      <div className="mb-8 md:mb-10">
        <AurosBrandLockup product="Power" size="md" />
        <div className="auros-accent-rule mt-6" aria-hidden />
      </div>

      <header className="max-w-2xl space-y-5">
        <p className="page-eyebrow">Low-carbon · hors Green Verified</p>
        <h1 className="page-title text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.05]">
          Power
        </h1>
        <p className="page-intro">
          Nucléaire, hydro bas-carbone et mix — booking Watts + preuves CFU,
          sans badge Green Verified. Indicatif, explicite, counsel requis.
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <PrimaryButton href="/guides/low-carbon-power">
            Lire la définition
          </PrimaryButton>
          <PrimaryButton href={WATTS_HUB_ROUTE} variant="ghost">
            Hub Watts
          </PrimaryButton>
        </div>
      </header>

      <section className="mt-14 grid gap-8 text-left sm:grid-cols-3">
        {PATHS.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            className="group space-y-2 border-t border-white/[0.08] pt-4 transition hover:border-[color-mix(in_srgb,var(--auros-green-warm)_50%,white)]"
          >
            <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 group-hover:text-white/70">
              {p.title}
            </h2>
            <p className="text-sm leading-relaxed text-white/60">{p.detail}</p>
          </Link>
        ))}
      </section>

      <p className="mt-14 max-w-md text-[11px] leading-relaxed text-white/30">
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
  );
}
