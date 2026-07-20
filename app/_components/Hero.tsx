"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { ProductPreview } from "./ProductPreview";
import { useLocale, useTranslations } from "./i18n/LocaleProvider";
import { getEaseMessages } from "@/lib/ease-i18n";
import { Eyebrow } from "./ui/Eyebrow";
import { PrimaryButton } from "./ui/PrimaryButton";
import { EASE_OUT_EXPO } from "@/lib/motion";

/** SSR-safe hero — two doors only (dossier | proofs). Depth elsewhere. */
export function Hero() {
  const t = useTranslations();
  const { locale } = useLocale();
  const ease = getEaseMessages(locale);

  const metrics = [
    { label: t.hero.metricAssets, value: "12+" },
    { label: t.hero.metricJurisdictions, value: "40+" },
    { label: t.hero.metricDossier, value: "~12 min" },
  ] as const;

  return (
    <section className="relative flex min-h-[88dvh] flex-col justify-center px-4 pb-16 pt-[calc(5.5rem+env(safe-area-inset-top))] md:px-6 md:pt-32">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 lg:flex-row lg:items-center lg:justify-between">
        <div className="green-hub-fade-in flex-1">
          <Eyebrow>{t.hero.eyebrow}</Eyebrow>

          <h1 className="mt-6 font-display text-[clamp(2.5rem,7vw,4.75rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-white">
            {t.hero.title}
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
            {t.hero.subtitle}
          </p>
          <p className="mt-3 max-w-lg font-mono text-[11px] leading-relaxed text-white/40">
            {ease.landing.scorePath}
          </p>

          <div className="mt-10 grid max-w-xl gap-3 sm:grid-cols-2">
            <Link
              href="/wizard"
              className="group rounded-xl border border-white/15 bg-white/[0.04] px-5 py-4 transition hover:border-white/35 hover:bg-white/[0.07]"
            >
              <p className="font-display text-base text-white group-hover:text-white">
                {t.hero.doorDossierLabel}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-white/45">
                {t.hero.doorDossierHint}
              </p>
            </Link>
            <Link
              href="/developers/shield"
              className="group rounded-xl border border-white/10 px-5 py-4 transition hover:border-white/30 hover:bg-white/[0.04]"
            >
              <p className="font-display text-base text-white/90">
                {t.hero.doorProofLabel}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-white/45">
                {t.hero.doorProofHint}
              </p>
            </Link>
          </div>

          <div className="green-hub-fade-in-delay mt-6 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <PrimaryButton href="/start">{t.hero.firstWinLabel}</PrimaryButton>
            <Link href="/estimate" className="auros-btn auros-btn--link">
              {t.hero.ctaEstimate} →
            </Link>
          </div>

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

          <p className="mt-8 text-xs text-white/35">
            {locale === "fr"
              ? "Énergie / Green Verified → "
              : locale === "es"
                ? "Energía / Green Verified → "
                : "Energy / Green Verified → "}
            <Link href="/green" className="underline-offset-2 hover:underline">
              /green
            </Link>
            {" · "}
            {locale === "fr"
              ? "bas-carbone / nucléaire → "
              : locale === "es"
                ? "bajo carbono / nuclear → "
                : "low-carbon / nuclear → "}
            <Link href="/power" className="underline-offset-2 hover:underline">
              /power
            </Link>
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
