"use client";

import { useMemo } from "react";

import { useTranslations } from "./i18n/LocaleProvider";

type StatItem = {
  value: string;
  label: string;
};

/** SSR-safe stats strip — no framer-motion opacity:0 on first paint. */
export function Stats() {
  const t = useTranslations();
  const stats = useMemo<StatItem[]>(
    () => [
      { value: "100", label: t.stats.scoreMax },
      { value: "40+", label: t.stats.jurisdictions },
      { value: "5", label: t.stats.sections },
      { value: "~12 min", label: t.stats.avgTime },
    ],
    [t]
  );

  return (
    <section className="px-6 py-16">
      <div className="mx-auto grid max-w-6xl gap-10 border-t border-white/[0.06] pt-16 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center lg:text-left">
            <p className="font-display text-4xl font-semibold text-white md:text-5xl">
              {stat.value}
            </p>
            <p className="mt-2 font-mono text-[10px] text-white/35">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
