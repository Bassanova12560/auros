"use client";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import type { GreenHubImpact } from "@/lib/green/hub-impact";
import { formatImpactNumber } from "@/lib/green/hub-impact";
import { getGreenMessages } from "@/lib/green";

import { GreenForestWord } from "./green-ui";

type Props = {
  impact: GreenHubImpact;
};

export function GreenHubImpactMetrics({ impact }: Props) {
  const { locale } = useLocale();
  const m = getGreenMessages(locale).hub.metrics;
  const loc = locale === "es" ? "es" : locale === "en" ? "en" : "fr";

  const tiles = [
    {
      label: m.carbon,
      value: formatImpactNumber(impact.carbonSavedTco2, loc),
      unit: m.carbonUnit,
    },
    {
      label: m.mwh,
      value: formatImpactNumber(impact.mwhTraced, loc),
      unit: m.mwhUnit,
    },
  ];

  const footnote = impact.fromRegistry
    ? m.note
    : `${m.note} ${m.noteDemo}`;

  return (
    <section className="border border-white/[0.08] bg-black">
      <div className="border-b border-white/[0.06] px-5 py-5 md:px-8 md:py-6">
        <p className="font-display text-lg font-semibold tracking-[-0.02em] text-white md:text-xl">
          {m.title}
        </p>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/40">{m.subtitle}</p>
      </div>

      <div className="grid sm:grid-cols-2">
        {tiles.map((tile, i) => (
          <div
            key={tile.label}
            className={`px-5 py-8 md:px-8 md:py-10 ${i === 0 ? "border-b border-white/[0.06] sm:border-b-0 sm:border-r sm:border-white/[0.06]" : ""}`}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
              {tile.label}
            </p>
            <p className="mt-3 font-display text-[clamp(2rem,5vw,2.75rem)] font-semibold tabular-nums leading-none tracking-[-0.03em]">
              <GreenForestWord size="metric">{tile.value}</GreenForestWord>
            </p>
            <p className="mt-2 font-mono text-[10px] text-white/35">{tile.unit}</p>
          </div>
        ))}
      </div>

      <p className="border-t border-white/[0.06] px-5 py-4 text-[11px] leading-relaxed text-white/35 md:px-8">
        {footnote}
      </p>
    </section>
  );
}
