"use client";

import { Eyebrow } from "@/app/_components/ui/Eyebrow";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { JurisdictionComparatorPreview } from "./JurisdictionComparatorPreview";
import { useJurisdictionPage } from "./useJurisdictionPage";
import { JURISDICTIONS_ANCHORS } from "@/lib/jurisdictions";

/** SSR-safe jurisdictions hero — no framer-motion opacity:0 on first paint. */
export function JurisdictionHero() {
  const { messages } = useJurisdictionPage();
  const h = messages.hero;

  return (
    <header className="relative pb-8 md:pb-12">
      <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
        <div className="green-hub-fade-in max-w-xl flex-1">
          <Eyebrow>{h.eyebrow}</Eyebrow>

          <h1 className="mt-5 font-display text-[clamp(2rem,5.5vw,3.25rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-white">
            {h.title}
          </h1>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-muted md:text-lg">
            {h.subtitle}
          </p>

          <p className="mt-3 font-mono text-[11px] tracking-wide text-white/40">
            {h.primaryPath}
          </p>

          <div className="green-hub-fade-in-delay mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
            <PrimaryButton href={JURISDICTIONS_ANCHORS.guide}>
              {h.ctaPrimary}
            </PrimaryButton>
            <a
              href={JURISDICTIONS_ANCHORS.comparator}
              className="text-sm text-white/40 underline-offset-4 transition hover:text-white/70 hover:underline"
            >
              {h.ctaExplore}
            </a>
          </div>

          <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-6 border-t border-white/[0.06] pt-8">
            {h.metrics.map((metric) => (
              <div key={metric.label}>
                <dt className="font-display text-2xl font-semibold tabular-nums text-white">
                  {metric.value}
                </dt>
                <dd className="mt-1 max-w-[12ch] font-mono text-[10px] leading-snug text-white/35">
                  {metric.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <JurisdictionComparatorPreview />
      </div>
    </header>
  );
}
