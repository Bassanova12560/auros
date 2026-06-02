"use client";

import { BezelCard } from "@/app/_components/ui/BezelCard";
import { SectionHeader } from "@/app/_components/ui/SectionHeader";
import { getEnterpriseMessages } from "@/lib/jurisdictions/enterprise-messages";

import { useJurisdictionPage } from "./useJurisdictionPage";

export function JurisdictionLegalMethodology() {
  const { locale } = useJurisdictionPage();
  const m = getEnterpriseMessages(locale).legalMethodology;

  return (
    <section className="border-t border-white/[0.06] py-16 md:py-24">
      <SectionHeader
        eyebrow={m.eyebrow}
        title={m.title}
        subtitle={m.subtitle}
        align="left"
      />

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {m.pillars.map((pillar) => (
          <BezelCard
            key={pillar.title}
            innerClassName="flex h-full flex-col p-6 md:p-7"
            animate
          >
            <h3 className="font-display text-lg font-medium text-white">
              {pillar.title}
            </h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-white/55">
              {pillar.body}
            </p>
          </BezelCard>
        ))}
      </div>

      <BezelCard className="mt-4" innerClassName="px-5 py-4 md:px-6 md:py-5" animate>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
          {m.sourcesLabel}
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {m.sources.map((source) => (
            <li
              key={source}
              className="rounded-full border border-white/[0.1] bg-white/[0.03] px-3 py-1 font-mono text-[10px] text-white/50"
            >
              {source}
            </li>
          ))}
        </ul>
      </BezelCard>
    </section>
  );
}
