"use client";

import { motion } from "framer-motion";

import { Eyebrow } from "@/app/_components/ui/Eyebrow";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { JurisdictionComparatorPreview } from "./JurisdictionComparatorPreview";
import { useJurisdictionPage } from "./useJurisdictionPage";
import { JURISDICTIONS_ANCHORS } from "@/lib/jurisdictions";
import { EASE_OUT_EXPO, fadeUp, staggerContainer } from "@/lib/motion";

export function JurisdictionHero() {
  const { messages } = useJurisdictionPage();
  const h = messages.hero;

  return (
    <header className="relative pb-8 md:pb-12">
      <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
        <motion.div
          className="max-w-xl flex-1"
          initial="hidden"
          animate="visible"
          variants={staggerContainer(0.1, 0.06)}
        >
          <motion.div variants={fadeUp}>
            <Eyebrow>{h.eyebrow}</Eyebrow>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mt-5 font-display text-[clamp(2rem,5.5vw,3.25rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-white"
          >
            {h.title}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-lg text-base leading-relaxed text-muted md:text-lg"
          >
            {h.subtitle}
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="mt-3 font-mono text-[11px] tracking-wide text-white/40"
          >
            {h.primaryPath}
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center"
          >
            <PrimaryButton href={JURISDICTIONS_ANCHORS.guide}>
              {h.ctaPrimary}
            </PrimaryButton>
            <a
              href={JURISDICTIONS_ANCHORS.comparator}
              className="text-sm text-white/40 underline-offset-4 transition hover:text-white/70 hover:underline"
            >
              {h.ctaExplore}
            </a>
          </motion.div>

          <motion.dl
            variants={fadeUp}
            className="mt-12 flex flex-wrap gap-x-10 gap-y-6 border-t border-white/[0.06] pt-8"
          >
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
          </motion.dl>
        </motion.div>

        <JurisdictionComparatorPreview />
      </div>

      <motion.div
        className="pointer-events-none absolute -bottom-2 left-1/2 hidden -translate-x-1/2 md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.8, ease: EASE_OUT_EXPO }}
        aria-hidden
      >
        <motion.span
          className="block h-8 w-px bg-white/25"
          animate={{ scaleY: [0.4, 1, 0.4], opacity: [0.15, 0.5, 0.15] }}
          transition={{ duration: 2.4, repeat: Infinity }}
        />
      </motion.div>
    </header>
  );
}
