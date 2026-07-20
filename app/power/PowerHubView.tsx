"use client";

import Link from "next/link";

import { AurosBrandLockup } from "@/app/_components/AurosBrandLockup";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { WATTS_RESERVE_ROUTE } from "@/lib/watts";

const RESERVE_NUCLEAR = `${WATTS_RESERVE_ROUTE}?source=nuclear&from=power`;
const ACTIONS = [
  {
    step: "01",
    href: RESERVE_NUCLEAR,
    title: "Réserver des Watts",
    detail:
      "Profil firm/flex avec generation_source=nuclear — booking indicatif, hors Green Verified.",
    primary: true,
  },
  {
    step: "02",
    href: "/green/chargeflow/console",
    title: "Mint / vérifier CFU",
    detail:
      "Console ChargeFlow : sessions → unités hashées, verify URL publique. Pas de badge Verified.",
    primary: false,
  },
  {
    step: "03",
    href: "/developers/shield/banks",
    title: "Preuve institutionnelle",
    detail:
      "Evidence Pack Shield (Premium) pour dossier crédit / ESG — generation_source lisible.",
    primary: false,
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
          Nucléaire, hydro bas-carbone et mix — réserver, prouver, joindre au
          dossier. Indicatif, explicite, counsel requis. Ce hub n&apos;ouvre
          pas le label RTMS renouvelable.
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <PrimaryButton href={RESERVE_NUCLEAR}>
            Réserver (nucléaire)
          </PrimaryButton>
          <PrimaryButton href="/guides/low-carbon-power" variant="ghost">
            Définition
          </PrimaryButton>
        </div>
      </header>

      <section className="mt-14 space-y-0" aria-label="Parcours Power">
        {ACTIONS.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="group flex flex-col gap-2 border-t border-white/[0.08] py-6 transition hover:border-[color-mix(in_srgb,var(--auros-green-warm)_45%,white)] sm:flex-row sm:items-baseline sm:gap-8"
          >
            <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.22em] text-white/35">
              {a.step}
            </span>
            <div className="min-w-0 flex-1 space-y-1.5">
              <h2
                className={`font-display text-lg text-white ${
                  a.primary ? "font-semibold" : "font-medium"
                }`}
              >
                {a.title}
              </h2>
              <p className="max-w-xl text-sm leading-relaxed text-white/55 group-hover:text-white/70">
                {a.detail}
              </p>
            </div>
            <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-white/30 group-hover:text-white/55">
              Ouvrir →
            </span>
          </Link>
        ))}
      </section>

      <p className="mt-12 max-w-md text-[11px] leading-relaxed text-white/30">
        Power ≠ AUROS Green Verified. Voir aussi{" "}
        <Link
          href="/comment-tokeniser/nucleaire"
          className="underline-offset-2 hover:underline"
        >
          comment tokeniser le nucléaire
        </Link>
        {" · "}
        <Link
          href="/developers/institutions"
          className="underline-offset-2 hover:underline"
        >
          pack institutions
        </Link>
        .
      </p>
    </div>
  );
}
