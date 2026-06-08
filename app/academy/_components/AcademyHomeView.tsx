"use client";

import Link from "next/link";

import { BezelCard } from "@/app/_components/ui/BezelCard";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import {
  ACADEMY_ENTREPRISE_ROUTE,
  ACADEMY_FUNDAMENTALS_ROUTE,
  ACADEMY_PRATICIEN_ROUTE,
  ACADEMY_REGISTRY_ROUTE,
} from "@/lib/academy";
import { getAcademyMessages } from "@/lib/academy/i18n";

import { AcademyWaitlistForm } from "./AcademyWaitlistForm";

const TIER_META = [
  { id: "fundamentals" as const, path: ACADEMY_FUNDAMENTALS_ROUTE, status: "available" as const },
  { id: "praticien" as const, path: ACADEMY_PRATICIEN_ROUTE, status: "soon" as const },
  { id: "entreprise" as const, path: ACADEMY_ENTREPRISE_ROUTE, status: "partial" as const },
];

type AcademyHomeViewProps = {
  tallyUrl?: string | null;
};

export function AcademyHomeView({ tallyUrl }: AcademyHomeViewProps) {
  const { locale } = useLocale();
  const m = getAcademyMessages(locale);

  return (
    <div className="page-inner page-inner--6xl mx-auto px-4 pb-16 pt-10 md:px-6">
      <header className="max-w-3xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/40">
          {m.home.eyebrow}
        </p>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-white md:text-5xl">
          {m.home.title}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-white/55">{m.home.intro}</p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {m.home.teaserHighlights.map((item) => (
            <li
              key={item}
              className="rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-white/45"
            >
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <PrimaryButton href={ACADEMY_FUNDAMENTALS_ROUTE}>{m.home.startFree}</PrimaryButton>
        </div>
      </header>

      <div className="mt-14 grid gap-5 lg:grid-cols-3">
        {TIER_META.map(({ id, path, status }) => {
          const tier = m.tiers[id];
          return (
            <BezelCard key={id} innerClassName="flex h-full flex-col p-6 md:p-8" animate>
              <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                {tier.price}
              </p>
              <h2 className="mt-3 font-display text-xl font-semibold text-white">{tier.name}</h2>
              <p className="mt-2 text-sm font-medium text-white/70">{tier.headline}</p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-white/45">
                {tier.description}
              </p>
              <div className="mt-8">
                {status === "soon" ? (
                  <AcademyWaitlistForm
                    track="praticien"
                    tallyUrl={tallyUrl}
                    compact
                    ctaLabel={tier.cta}
                  />
                ) : (
                  <Link
                    href={path}
                    className="font-mono text-[11px] tracking-wide text-white/40 transition hover:text-white/70"
                  >
                    {tier.cta} →
                  </Link>
                )}
              </div>
            </BezelCard>
          );
        })}
      </div>

      <BezelCard className="mt-10" innerClassName="p-6 md:p-8">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
          {m.home.scopeTitle}
        </h2>
        <div className="mt-6 grid gap-8 md:grid-cols-2">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-white/35">
              ✓
            </p>
            <ul className="mt-3 space-y-2 text-sm text-white/55">
              {m.home.scopeMeasures.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-white/35">
              —
            </p>
            <ul className="mt-3 space-y-2 text-sm text-white/45">
              {m.home.scopeDoesNot.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </BezelCard>

      <BezelCard className="mt-10" innerClassName="p-6 md:p-8">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
          {m.home.verifyTitle}
        </h2>
        <p className="mt-3 text-sm text-white/55">{m.home.verifyBody}</p>
        <p className="mt-4">
          <Link href={ACADEMY_REGISTRY_ROUTE} className="text-sm text-white/55 hover:text-white/80">
            {m.home.registryLink}
          </Link>
        </p>
      </BezelCard>

      <p className="mt-10 max-w-2xl text-xs leading-relaxed text-white/35">{m.disclaimer}</p>
    </div>
  );
}
