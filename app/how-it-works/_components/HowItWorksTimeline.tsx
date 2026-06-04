"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import { useTranslations } from "@/app/_components/i18n/LocaleProvider";
import { SectionHeader } from "@/app/_components/ui/SectionHeader";
import { fadeUp, staggerContainer } from "@/lib/motion";

function FaqAccordion({
  items,
}: {
  items: ReadonlyArray<{ question: string; answer: string }>;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-white/[0.06]">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.question}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              aria-controls={`how-faq-panel-${index}`}
              className="flex w-full items-start justify-between gap-4 py-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <span className="font-display text-base font-medium text-white md:text-lg">
                {item.question}
              </span>
              <span className="mt-1 shrink-0 font-mono text-sm text-white/35" aria-hidden>
                {isOpen ? "▲" : "▼"}
              </span>
            </button>
            <div
              id={`how-faq-panel-${index}`}
              className={`overflow-hidden transition-all duration-300 ${
                isOpen ? "max-h-96 pb-5 opacity-100" : "max-h-0 opacity-0"
              }`}
              aria-hidden={!isOpen}
            >
              <p className="text-sm leading-relaxed text-muted">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function HowItWorksTimeline() {
  const t = useTranslations();
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { step: "01", title: t.howItWorks.step1Title, desc: t.howItWorks.step1Desc, duration: t.howItWorks.step1Duration },
    { step: "02", title: t.howItWorks.step2Title, desc: t.howItWorks.step2Desc, duration: t.howItWorks.step2Duration },
    { step: "03", title: t.howItWorks.step3Title, desc: t.howItWorks.step3Desc, duration: t.howItWorks.step3Duration },
  ] as const;

  return (
    <section id="how-it-works" className="border-t border-white/[0.06] px-6 py-24 md:py-32">
      <div className="mx-auto max-w-3xl">
        <SectionHeader eyebrow={t.howItWorks.eyebrow} title={t.howItWorks.title} />

        <motion.ol
          className="relative mt-14"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer(0.08)}
          aria-label={t.howItWorks.title}
        >
          {steps.map((item, index) => {
            const isActive = activeStep === index;
            const isLast = index === steps.length - 1;
            return (
              <motion.li key={item.step} variants={fadeUp} className="relative flex gap-5 md:gap-8">
                {!isLast ? (
                  <span className="absolute left-[15px] top-10 bottom-0 w-px bg-white/[0.08] md:left-[19px]" aria-hidden />
                ) : null}
                <button
                  type="button"
                  onClick={() => setActiveStep(index)}
                  aria-expanded={isActive}
                  aria-controls={`how-step-panel-${index}`}
                  className={`relative z-10 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-mono text-[10px] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:h-10 md:w-10 ${
                    isActive ? "border-white/40 bg-white/[0.12] text-white" : "border-white/15 text-white/45 hover:border-white/30"
                  }`}
                >
                  {item.step}
                </button>
                <div className="min-w-0 flex-1 pb-10 md:pb-14">
                  <button
                    type="button"
                    onClick={() => setActiveStep(index)}
                    className="group w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                  >
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="font-display text-lg font-semibold text-white">{item.title}</h3>
                      <span className="font-mono text-[10px] text-white/35">{item.duration}</span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{item.desc}</p>
                  </button>
                  <div
                    id={`how-step-panel-${index}`}
                    className={`mt-5 overflow-hidden transition-all duration-300 ${isActive ? "max-h-80 opacity-100" : "max-h-0 opacity-0"}`}
                    aria-hidden={!isActive}
                  >
                    <div
                      className="flex aspect-[16/10] w-full items-center justify-center rounded-xl border border-dashed border-white/[0.12] bg-white/[0.02] font-mono text-[11px] text-white/30"
                      role="img"
                      aria-label={t.howItWorks.screenshotPlaceholder}
                    >
                      {t.howItWorks.screenshotPlaceholder}
                    </div>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </motion.ol>

        <div className="mt-16 border-t border-white/[0.06] pt-16">
          <h2 className="font-display text-xl font-semibold text-white">{t.howItWorks.faqTitle}</h2>
          <div className="mt-8">
            <FaqAccordion items={[...t.howItWorks.faq]} />
          </div>
        </div>
      </div>
    </section>
  );
}
