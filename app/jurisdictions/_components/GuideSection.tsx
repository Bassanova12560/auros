"use client";

import { BezelCard } from "@/app/_components/ui/BezelCard";
import { SectionHeader } from "@/app/_components/ui/SectionHeader";
import { JurisdictionGuideForm } from "./JurisdictionGuideForm";
import { useJurisdictionPage } from "./useJurisdictionPage";

export function GuideSection() {
  const { messages } = useJurisdictionPage();
  const g = messages.guide;

  return (
    <section
      id="guide"
      className="scroll-mt-28 border-t border-white/[0.06] py-16 md:py-24"
    >
      <SectionHeader
        eyebrow={g.eyebrow}
        title={g.title}
        subtitle={g.subtitle}
        align="left"
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start lg:gap-12">
        <div>
          <ul className="space-y-3">
            {g.bullets.map((bullet) => (
              <li
                key={bullet}
                className="flex items-start gap-3 text-sm leading-relaxed text-white/55"
              >
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-white/35" />
                {bullet}
              </li>
            ))}
          </ul>
          <BezelCard
            className="mt-8"
            innerClassName="px-4 py-3.5 md:px-5 md:py-4"
            animate
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
              {g.timeEstimate}
            </p>
            <p className="mt-2 text-sm text-white/50">{g.footnote}</p>
          </BezelCard>
        </div>

        <JurisdictionGuideForm />
      </div>
    </section>
  );
}
