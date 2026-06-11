"use client";

import { useTranslations } from "./i18n/LocaleProvider";

/** SSR-friendly trust process — no fake regulators, no framer-motion. */
export function TrustHowWeWork() {
  const te = useTranslations().trustPage;

  return (
    <section className="border-t border-white/[0.06] px-6 py-16 md:py-20">
      <div className="mx-auto max-w-3xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/40">
          {te.howWeWorkEyebrow}
        </p>
        <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-white md:text-3xl">
          {te.howWeWorkTitle}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          {te.howWeWorkIntro}
        </p>

        <ol className="mt-10 space-y-6">
          {te.howWeWorkSteps.map((step) => (
            <li
              key={step.number}
              className="flex gap-5 rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 md:gap-6 md:p-6"
            >
              <span className="font-mono text-sm font-semibold tabular-nums text-white/50">
                {step.number}
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
