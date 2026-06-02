"use client";

import Link from "next/link";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import {
  GREEN_RTMS_ASSISTANT_ROUTE,
  GREEN_RTMS_PILLARS,
  GREEN_STANDARDS_ROUTE,
  getGreenMessages,
} from "@/lib/green";

import { GreenSectionTitle } from "./green-ui";

const PILLAR_LETTERS: Record<(typeof GREEN_RTMS_PILLARS)[number], string> = {
  real: "R",
  transparent: "T",
  measurable: "M",
  sound: "S",
};

export function GreenHubRtmsSection() {
  const { locale } = useLocale();
  const m = getGreenMessages(locale);
  const s = m.hub.rtmsSection;
  const pillars = m.standards.pillars;

  return (
    <section aria-labelledby="green-rtms">
      <GreenSectionTitle>{s.title}</GreenSectionTitle>
      <p id="green-rtms" className="mt-3 max-w-2xl text-base leading-relaxed text-white/55">
        {s.intro}
      </p>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-white/35">
        {s.statusNote}
      </p>

      <div className="mt-8 grid grid-cols-2 gap-px border border-white/[0.08] bg-white/[0.08] md:grid-cols-4">
        {GREEN_RTMS_PILLARS.map((key) => {
          const pillar = pillars[key];
          return (
            <div key={key} className="bg-black px-4 py-5 md:px-5 md:py-6">
              <span className="font-display text-2xl font-semibold text-green-royal-bright md:text-3xl">
                {PILLAR_LETTERS[key]}
              </span>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-white/50">
                {pillar.name}
              </p>
              <p className="mt-2 text-xs leading-snug text-white/40">{pillar.tagline}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-6">
        <Link
          href={GREEN_STANDARDS_ROUTE}
          className="inline-flex min-h-[44px] items-center font-mono text-[11px] uppercase tracking-wider text-green-royal-bright transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-royal"
        >
          {s.cta} →
        </Link>
        <Link
          href={GREEN_RTMS_ASSISTANT_ROUTE}
          className="inline-flex min-h-[44px] items-center font-mono text-[11px] uppercase tracking-wider text-white/50 transition hover:text-green-royal-bright"
        >
          {s.assistantCta} →
        </Link>
      </div>
    </section>
  );
}
