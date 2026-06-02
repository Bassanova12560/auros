"use client";

import { motion } from "framer-motion";

import { BezelCard } from "@/app/_components/ui/BezelCard";
import { SectionHeader } from "@/app/_components/ui/SectionHeader";
import { getEnterpriseMessages } from "@/lib/jurisdictions/enterprise-messages";
import { fadeUp, staggerContainer } from "@/lib/motion";

import { useJurisdictionPage } from "./useJurisdictionPage";

export function JurisdictionEnterpriseProof() {
  const { locale } = useJurisdictionPage();
  const e = getEnterpriseMessages(locale);
  const p = e.enterpriseProof;

  return (
    <section className="border-t border-white/[0.06] py-16 md:py-24">
      <SectionHeader eyebrow={p.eyebrow} title={p.title} align="left" />

      <motion.div
        className="mt-10 grid gap-4 md:grid-cols-3"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={staggerContainer(0.08, 0.06)}
      >
        {p.cases.map((item) => (
          <motion.div key={item.name} variants={fadeUp}>
            <BezelCard innerClassName="flex h-full flex-col p-6 md:p-7" animate>
              <p className="flex-1 text-sm leading-relaxed text-white/65">
                &ldquo;{item.quote}&rdquo;
              </p>
              <div className="mt-6 border-t border-white/[0.06] pt-5">
                <p className="font-medium text-white">{item.name}</p>
                <p className="mt-1 text-xs text-white/45">{item.role}</p>
                <p className="mt-3 inline-block rounded-full bg-emerald-400/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-emerald-300/80">
                  {item.metric}
                </p>
              </div>
            </BezelCard>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
