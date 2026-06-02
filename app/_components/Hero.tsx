"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import { ProductPreview } from "./ProductPreview";
import { useLocale, useTranslations } from "./i18n/LocaleProvider";
import { getEaseMessages } from "@/lib/ease-i18n";
import { getWizardExpertMessages } from "@/lib/wizard-expert-i18n";
import { QuickScoreSheet } from "./QuickScoreSheet";
import { Eyebrow } from "./ui/Eyebrow";
import { PrimaryButton } from "./ui/PrimaryButton";
import { EASE_OUT_EXPO, fadeUp, staggerContainer } from "@/lib/motion";

export function Hero() {
  const t = useTranslations();
  const { locale } = useLocale();
  const ease = getEaseMessages(locale);
  const expert = getWizardExpertMessages(locale);
  const [quickScoreOpen, setQuickScoreOpen] = useState(false);

  const metrics = [
    { label: t.hero.metricAssets, value: "12+" },
    { label: t.hero.metricJurisdictions, value: "40+" },
    { label: t.hero.metricDossier, value: "~12 min" },
  ] as const;

  return (
    <section className="relative flex min-h-[88dvh] flex-col justify-center px-4 pb-16 pt-[calc(5.5rem+env(safe-area-inset-top))] md:px-6 md:pt-32">
      <QuickScoreSheet
        open={quickScoreOpen}
        onClose={() => setQuickScoreOpen(false)}
      />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 lg:flex-row lg:items-center lg:justify-between">
        <motion.div
          key="hero-content"
          className="flex-1"
          initial="hidden"
          animate="visible"
          variants={staggerContainer(0.12, 0.08)}
        >
          <motion.div variants={fadeUp}>
            <Eyebrow>{t.hero.eyebrow}</Eyebrow>
          </motion.div>

          <h1 className="mt-6 font-display text-[clamp(2.5rem,7vw,4.75rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-white">
            <motion.span variants={fadeUp} className="block">
              {t.hero.title}
            </motion.span>
          </h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-lg text-lg leading-relaxed text-muted"
          >
            {t.hero.subtitle}
          </motion.p>
          <motion.p
            variants={fadeUp}
            className="mt-3 max-w-lg font-mono text-[11px] leading-relaxed text-white/40"
          >
            {ease.landing.scorePath}
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <PrimaryButton href="/wizard">{t.hero.ctaPrimary}</PrimaryButton>
            <button
              type="button"
              onClick={() => setQuickScoreOpen(true)}
              className="text-sm text-muted underline-offset-4 transition hover:text-white hover:underline"
            >
              {t.hero.ctaEstimate}
            </button>
            <a
              href="/wizard?expert=1"
              className="w-full text-sm text-white/35 underline-offset-4 transition hover:text-white/55 hover:underline sm:w-auto"
            >
              {expert.expressTitle} →
            </a>
          </motion.div>

          <div className="mt-14 flex flex-wrap gap-8 border-t border-white/[0.06] pt-8">
            {metrics.map((m) => (
              <div key={`${m.label}-${m.value}`}>
                <p className="font-display text-xl font-semibold text-white">
                  {m.value}
                </p>
                <p className="mt-1 font-mono text-[10px] text-white/35">
                  {m.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        <ProductPreview />
      </div>

      <motion.div
        className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8, ease: EASE_OUT_EXPO }}
        aria-hidden
      >
        <motion.span
          className="block h-6 w-px bg-white/30"
          animate={{ scaleY: [0.5, 1, 0.5], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 2.2, repeat: Infinity }}
        />
      </motion.div>
    </section>
  );
}
