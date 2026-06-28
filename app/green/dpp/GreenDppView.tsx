"use client";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { getGreenDppCopy } from "@/lib/green/dpp-i18n";

import { DppBridgeLookup } from "./_components/DppBridgeLookup";

const DEMO_IDS = ["moss", "toucan", "klim"] as const;

export function GreenDppView() {
  const { locale } = useLocale();
  const t = getGreenDppCopy(locale);

  return (
    <div className="space-y-12">
      <header className="space-y-4 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-emerald-400/80">
          {t.eyebrow}
        </p>
        <h1 className="font-display text-3xl font-medium text-white md:text-4xl">{t.title}</h1>
        <p className="mx-auto max-w-2xl text-sm leading-relaxed text-white/55">{t.subtitle}</p>
      </header>

      <DppBridgeLookup demoIds={[...DEMO_IDS]} />

      <section className="grid gap-4 sm:grid-cols-3">
        {t.features.map((feature) => (
          <div key={feature.title} className="card-flat px-4 py-5">
            <p className="text-sm font-medium text-white">{feature.title}</p>
            <p className="mt-2 text-xs leading-relaxed text-white/45">{feature.body}</p>
          </div>
        ))}
      </section>

      <p className="text-center text-xs text-white/35">{t.disclaimer}</p>
    </div>
  );
}
