"use client";

import Link from "next/link";

import { BezelCard } from "@/app/_components/ui/BezelCard";
import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { ACADEMY_ROUTE } from "@/lib/academy";
import { formatCertDate, getAcademyMessages } from "@/lib/academy/i18n";
import type { AcademyRegistryStats } from "@/lib/academy/cert-registry";

type Props = {
  stats: AcademyRegistryStats;
};

export function AcademyRegistryView({ stats }: Props) {
  const { locale } = useLocale();
  const m = getAcademyMessages(locale);
  const r = m.registry;

  return (
    <div className="page-inner page-inner--2xl mx-auto px-4 pb-16 pt-10 md:px-6">
      <header className="max-w-2xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/40">
          {r.eyebrow}
        </p>
        <h1 className="mt-4 font-display text-3xl font-semibold text-white md:text-4xl">
          {r.title}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-white/55">{r.intro}</p>
        {!stats.available && (
          <p className="mt-3 text-xs text-white/40">{r.statsUnavailable}</p>
        )}
      </header>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        <BezelCard innerClassName="p-6">
          <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
            {r.totalIssued}
          </p>
          <p className="mt-3 font-display text-4xl font-semibold text-white">
            {stats.totalIssued.toLocaleString(locale === "en" ? "en-GB" : locale === "es" ? "es-ES" : "fr-FR")}
          </p>
        </BezelCard>
        <BezelCard innerClassName="p-6">
          <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
            {r.activeCount}
          </p>
          <p className="mt-3 font-display text-4xl font-semibold text-white">
            {stats.activeCount.toLocaleString(locale === "en" ? "en-GB" : locale === "es" ? "es-ES" : "fr-FR")}
          </p>
        </BezelCard>
      </div>

      <BezelCard className="mt-10" innerClassName="p-6 md:p-8">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
          {r.institutionsTitle}
        </h2>
        <p className="mt-3 text-xs text-white/40">{r.institutionsNote}</p>
        {stats.institutions.length === 0 ? (
          <p className="mt-6 text-sm text-white/45">{r.institutionsEmpty}</p>
        ) : (
          <ul className="mt-6 divide-y divide-white/[0.06]">
            {stats.institutions.map((inst) => (
              <li
                key={`${inst.name}-${inst.purchasedAt}`}
                className="flex flex-wrap items-baseline justify-between gap-2 py-3 first:pt-0 last:pb-0"
              >
                <span className="text-sm text-white/75">{inst.name}</span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-white/35">
                  {formatCertDate(locale, inst.purchasedAt, "long")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </BezelCard>

      <p className="mt-8 max-w-2xl text-xs leading-relaxed text-white/35">{r.privacyNote}</p>
      <p className="mt-6 max-w-2xl text-xs leading-relaxed text-white/35">{m.disclaimer}</p>
      <Link
        href={ACADEMY_ROUTE}
        className="mt-8 inline-block text-sm text-white/50 hover:text-white"
      >
        {r.backLink}
      </Link>
    </div>
  );
}
