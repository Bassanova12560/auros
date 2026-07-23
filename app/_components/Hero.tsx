"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { ProductPreview } from "./ProductPreview";
import { useLocale, useTranslations } from "./i18n/LocaleProvider";
import { Eyebrow } from "./ui/Eyebrow";
import { PrimaryButton } from "./ui/PrimaryButton";
import { EASE_OUT_EXPO } from "@/lib/motion";

/**
 * Unified homepage hero — one liquidity story; audience paths live in HomeSolutions.
 */
export function Hero() {
  const t = useTranslations();
  const { locale } = useLocale();

  return (
    <section className="relative flex min-h-[78dvh] flex-col justify-center px-4 pb-12 pt-[calc(5.5rem+env(safe-area-inset-top))] md:px-6 md:pb-16 md:pt-28">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 lg:flex-row lg:items-center lg:justify-between">
        <div className="green-hub-fade-in flex-1">
          <Eyebrow>{t.hero.eyebrow}</Eyebrow>

          <h1 className="mt-6 font-display text-[clamp(2.25rem,6.5vw,4.25rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-white">
            {t.hero.title}
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{t.hero.subtitle}</p>

          <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <PrimaryButton href="/lab">{t.hero.firstWinLabel}</PrimaryButton>
            <PrimaryButton href="mailto:resources@getauros.com?subject=Auros%20intro" variant="ghost">
              {t.hero.ctaPrimary}
            </PrimaryButton>
            <Link href="/start" className="auros-btn auros-btn--link">
              {t.hero.ctaEstimate} →
            </Link>
          </div>

          <p className="mt-8 max-w-lg text-xs leading-relaxed text-white/40">
            {locale === "fr"
              ? "Même moteur : marchés institutionnels pour actifs numériques, et couche de règlement pour l’énergie, l’eau et le compute tokenisés."
              : "Same engine: institutional markets for digital assets, and a settlement layer for tokenized energy, water, and compute."}
          </p>
        </div>

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
