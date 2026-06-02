"use client";

import { useState } from "react";

import { getEnterpriseMessages } from "@/lib/jurisdictions/enterprise-messages";

import { useJurisdictionPage } from "./useJurisdictionPage";

export function JurisdictionFaq({ id = "faq" }: { id?: string }) {
  const { locale } = useJurisdictionPage();
  const e = getEnterpriseMessages(locale);
  const f = e.faq;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id={id}
      className="scroll-mt-28 border-t border-white/[0.06] py-16 md:py-24"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/40">
        {f.eyebrow}
      </p>
      <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tight text-white md:text-4xl">
        {f.title}
      </h2>

      <ul className="mt-10 max-w-3xl divide-y divide-white/[0.08]">
        {f.items.map((item, index) => {
          const open = openIndex === index;
          return (
            <li key={item.q}>
              <button
                type="button"
                className="flex w-full items-start justify-between gap-4 py-5 text-left"
                onClick={() => setOpenIndex(open ? null : index)}
                aria-expanded={open}
              >
                <span className="text-base font-medium text-white/90">
                  {item.q}
                </span>
                <span
                  className="mt-0.5 shrink-0 font-mono text-lg leading-none text-white/40"
                  aria-hidden
                >
                  {open ? "−" : "+"}
                </span>
              </button>
              {open ? (
                <p className="pb-5 pr-10 text-sm leading-relaxed text-white/55">
                  {item.a}
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
