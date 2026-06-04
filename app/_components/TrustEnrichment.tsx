"use client";

import { useState } from "react";

import { useTranslations } from "@/app/_components/i18n/LocaleProvider";

function TrustFaqAccordion({
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
              aria-controls={`trust-faq-panel-${index}`}
              className="flex w-full items-start justify-between gap-4 py-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <span className="font-display text-base font-medium text-white md:text-lg">
                {item.question}
              </span>
              <span className="mt-1 shrink-0 font-mono text-sm text-white/35" aria-hidden>
                {isOpen ? "\u25B2" : "\u25BC"}
              </span>
            </button>
            <div
              id={`trust-faq-panel-${index}`}
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

export function TrustEnrichment() {
  const t = useTranslations();
  const te = t.trustPage;

  return (
    <section className="border-t border-white/[0.06] px-6 py-16 md:py-20">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-wrap gap-3">
          {te.badges.map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-white/[0.12] px-3 py-1.5 text-sm font-medium text-white/80"
            >
              {"\u2713"} {badge}
            </span>
          ))}
        </div>

        <div className="mt-12">
          <h2 className="font-display text-xl font-semibold text-white">{te.infrastructureTitle}</h2>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted">
            {te.infrastructureItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="mt-12 border-t border-white/[0.06] pt-12">
          <h2 className="font-display text-xl font-semibold text-white">{te.faqTitle}</h2>
          <div className="mt-8">
            <TrustFaqAccordion items={[...te.faq]} />
          </div>
        </div>
      </div>
    </section>
  );
}