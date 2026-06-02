"use client";

import { motion } from "framer-motion";

import { BezelCard } from "@/app/_components/ui/BezelCard";
import { SectionHeader } from "@/app/_components/ui/SectionHeader";
import { useJurisdictionPage } from "./useJurisdictionPage";
import { fadeUp, staggerContainer } from "@/lib/motion";

export function JurisdictionConversionPath() {
  const { messages } = useJurisdictionPage();
  const p = messages.path;

  return (
    <section className="py-16 md:py-20">
      <SectionHeader eyebrow={p.eyebrow} title={p.title} align="left" />

      <motion.ol
        className="mt-10 grid gap-8 md:grid-cols-4 md:gap-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={staggerContainer(0.1, 0.05)}
      >
        {p.steps.map((step, index) => (
          <motion.li key={step.title} variants={fadeUp} className="jurisdiction-path-step">
            <span className="jurisdiction-path-index">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="font-display text-lg font-medium text-white">{step.title}</h3>
            <p className="text-sm leading-relaxed text-white/50">{step.description}</p>
          </motion.li>
        ))}
      </motion.ol>

      <BezelCard className="mt-10" innerClassName="px-5 py-4 md:px-6 md:py-5" animate>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
          {messages.hero.primaryPath}
        </p>
      </BezelCard>
    </section>
  );
}
