"use client";

import Link from "next/link";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { GREEN_RTMS_ASSISTANT_ROUTE, GREEN_RTMS_PILLARS, GREEN_STANDARDS_ROUTE, getGreenMessages } from "@/lib/green";

const PILLAR_LETTERS: Record<(typeof GREEN_RTMS_PILLARS)[number], string> = {
  real: "R",
  transparent: "T",
  measurable: "M",
  sound: "S",
};

export function GreenHubRtmsWidget() {
  const { locale } = useLocale();
  const m = getGreenMessages(locale);
  const w = m.hub.widgets.rtms;
  const pillars = m.standards.pillars;

  return (
    <div className="flex h-full flex-col p-6 md:p-7">
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-emerald-500">
        {w.label}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-neutral-400">{w.subtitle}</p>

      <div className="mt-8 grid flex-1 grid-cols-2 gap-px overflow-hidden rounded-lg border border-emerald-500/40 bg-emerald-500/40">
        {GREEN_RTMS_PILLARS.map((key) => {
          const pillar = pillars[key];
          return (
            <div
              key={key}
              className="flex flex-col justify-center bg-black px-4 py-5 md:px-5 md:py-6"
            >
              <span className="font-display text-3xl font-semibold text-emerald-400">
                {PILLAR_LETTERS[key]}
              </span>
              <span className="mt-1 font-mono text-[10px] uppercase tracking-wider text-emerald-500">
                {pillar.name}
              </span>
              <span className="mt-2 text-xs leading-snug text-neutral-500">
                {pillar.tagline}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap gap-4">
        <Link
          href={GREEN_STANDARDS_ROUTE}
          className="inline-flex items-center font-mono text-[11px] uppercase tracking-wider text-emerald-500 hover:text-emerald-400"
        >
          {w.cta} →
        </Link>
        <Link
          href={GREEN_RTMS_ASSISTANT_ROUTE}
          className="inline-flex items-center font-mono text-[11px] uppercase tracking-wider text-emerald-500/70 hover:text-emerald-400"
        >
          {w.assistantCta} →
        </Link>
      </div>
    </div>
  );
}
