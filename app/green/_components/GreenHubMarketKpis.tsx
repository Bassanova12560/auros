"use client";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import type { GreenHubImpact } from "@/lib/green/hub-impact";
import { formatImpactNumber } from "@/lib/green/hub-impact";
import type { GreenMarketSnapshot } from "@/lib/green/market/green-market-db";
import { getGreenMessages } from "@/lib/green";

import { GreenForestWord, GreenSectionTitle } from "./green-ui";

type Props = {
  marketSnapshot: GreenMarketSnapshot;
  impact: GreenHubImpact;
};

export function GreenHubMarketKpis({ marketSnapshot, impact }: Props) {
  const { locale } = useLocale();
  const m = getGreenMessages(locale).hub;
  const loc = locale === "es" ? "es" : locale === "en" ? "en" : "fr";

  const actorCount = marketSnapshot.actors.length;
  const countryCount = new Set(
    marketSnapshot.actors.map((a) => a.country.trim()).filter(Boolean)
  ).size;
  const offerCount = marketSnapshot.offers.length;

  const marketTiles = [
    { label: m.marketKpis.actorsLabel, value: String(actorCount) },
    { label: m.marketKpis.countriesLabel, value: String(countryCount) },
    { label: m.marketKpis.offersLabel, value: String(offerCount) },
  ];

  const impactTiles = [
    {
      label: m.metrics.carbon,
      value: formatImpactNumber(impact.carbonSavedTco2, loc),
      unit: m.metrics.carbonUnit,
    },
    {
      label: m.metrics.mwh,
      value: formatImpactNumber(impact.mwhTraced, loc),
      unit: m.metrics.mwhUnit,
    },
  ];

  const impactNote = impact.fromRegistry
    ? m.metrics.note
    : `${m.metrics.note} ${m.metrics.noteDemo}`;

  return (
    <section aria-labelledby="green-hub-kpis">
      <GreenSectionTitle>{m.marketKpis.title}</GreenSectionTitle>
      <p id="green-hub-kpis" className="sr-only">
        {m.marketKpis.demoNote}
      </p>

      <div className="mt-6 border border-white/[0.08] bg-black">
        <div className="grid sm:grid-cols-3">
          {marketTiles.map((tile, i) => (
            <div
              key={tile.label}
              className={`px-5 py-6 md:px-6 ${i < 2 ? "border-b border-white/[0.06] sm:border-b-0 sm:border-r sm:border-white/[0.06]" : ""}`}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
                {tile.label}
              </p>
              <p className="mt-2 font-display text-3xl font-semibold tabular-nums tracking-[-0.03em] text-white">
                {tile.value}
              </p>
            </div>
          ))}
        </div>
        <p className="border-t border-white/[0.06] px-5 py-3 text-[11px] leading-relaxed text-white/35 md:px-6">
          {m.marketKpis.demoNote}
        </p>
      </div>

      <div className="mt-8 border border-white/[0.08] bg-black">
        <div className="border-b border-white/[0.06] px-5 py-5 md:px-8 md:py-6">
          <p className="font-display text-lg font-semibold tracking-[-0.02em] text-white md:text-xl">
            {m.metrics.title}
          </p>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/40">{m.metrics.subtitle}</p>
        </div>
        <div className="grid sm:grid-cols-2">
          {impactTiles.map((tile, i) => (
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
          {impactNote}
        </p>
      </div>
    </section>
  );
}
