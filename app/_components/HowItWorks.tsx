"use client";

import { motion } from "framer-motion";

import { useTranslations } from "./i18n/LocaleProvider";
import { BezelCard } from "./ui/BezelCard";
import { SectionHeader } from "./ui/SectionHeader";
import { fadeUp, staggerContainer } from "@/lib/motion";

export function HowItWorks() {
  const t = useTranslations();
  const steps = [
    { step: "01", title: t.howItWorks.step1Title, desc: t.howItWorks.step1Desc, featured: true },
    { step: "02", title: t.howItWorks.step2Title, desc: t.howItWorks.step2Desc, featured: false },
    { step: "03", title: t.howItWorks.step3Title, desc: t.howItWorks.step3Desc, featured: false },
  ] as const;

  return (
    <section id="how-it-works" className="border-t border-white/[0.06] px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow={t.howItWorks.eyebrow}
          title={t.howItWorks.title}
        />

        <motion.div
          className="mt-14 grid gap-4 md:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer(0.1)}
        >
          {steps.map((item) => (
            <motion.div key={item.step} variants={fadeUp}>
              {item.featured ? (
                <BezelCard innerClassName="p-8">
                  <StepContent item={item} />
                </BezelCard>
              ) : (
                <div className="card-flat h-full">
                  <StepContent item={item} />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function StepContent({ item }: { item: { step: string; title: string; desc: string } }) {
  return (
    <>
      <span className="font-mono text-[10px] text-white/35">{item.step}</span>
      <h3 className="mt-4 font-display text-lg font-semibold text-white">
        {item.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{item.desc}</p>
    </>
  );
}
