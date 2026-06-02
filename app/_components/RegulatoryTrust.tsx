"use client";

import { motion } from "framer-motion";

import { useTranslations } from "./i18n/LocaleProvider";
import { fadeUp, staggerContainer } from "@/lib/motion";
export function RegulatoryTrust() {
  const t = useTranslations();

  const items = [
    { title: t.regulatory.kyc, desc: t.regulatory.kycDesc },
    {
      title: t.regulatory.jurisdictions,
      desc: t.regulatory.jurisdictionsDesc,
    },
    { title: t.regulatory.indicative, desc: t.regulatory.indicativeDesc },
    { title: t.regulatory.partners, desc: t.regulatory.partnersDesc },
  ];

  return (
    <section className="border-t border-white/[0.06] px-6 py-16 md:py-20">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer(0.08)}
        >
          <motion.p
            variants={fadeUp}
            className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/40"
          >
            {t.regulatory.eyebrow}
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="mt-3 font-display text-2xl font-semibold tracking-tight text-white md:text-3xl"
          >
            {t.regulatory.title}
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-3 max-w-2xl text-muted">
            {t.regulatory.subtitle}
          </motion.p>

          <motion.div
            variants={staggerContainer(0.06, 0.12)}
            className="mt-10 grid gap-4 sm:grid-cols-2"
          >
            {items.map((item) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5"
              >
                <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="mt-8 border-t border-white/[0.06] pt-6 font-mono text-[10px] leading-relaxed tracking-wide text-white/35"
          >
            {t.regulatory.disclaimer}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
