"use client";

import { motion } from "framer-motion";

import { useTranslations } from "./i18n/LocaleProvider";
import { BezelCard } from "./ui/BezelCard";
import { PrimaryButton } from "./ui/PrimaryButton";
import { fadeUp, staggerContainer } from "@/lib/motion";

export function FinalCta() {
  const t = useTranslations();

  return (
    <section className="px-6 pb-28 pt-8 md:pb-36">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer(0.12)}
        >
          <BezelCard innerClassName="px-8 py-16 text-center md:px-16 md:py-20">
            <motion.h2
              variants={fadeUp}
              className="font-display text-3xl font-semibold tracking-tight text-white md:text-4xl"
            >
              {t.finalCta.title}
            </motion.h2>
            <motion.p variants={fadeUp} className="mx-auto mt-4 max-w-md text-muted">
              {t.finalCta.subtitle}
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex flex-col items-center gap-4">
              <PrimaryButton href="/wizard">{t.finalCta.wizard}</PrimaryButton>
              <a
                href="/estimate"
                className="font-mono text-[11px] tracking-wide text-white/40 transition hover:text-white/70"
              >
                {t.finalCta.score} →
              </a>
            </motion.div>
          </BezelCard>
        </motion.div>
      </div>
    </section>
  );
}
