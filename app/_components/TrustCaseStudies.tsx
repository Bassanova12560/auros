"use client";

import { useTranslations } from "./i18n/LocaleProvider";

/** Anonymous usage snapshots — illustrative, not endorsements. */
export function TrustCaseStudies() {
  const te = useTranslations().trustPage;

  return (
    <section className="border-t border-white/[0.06] px-6 py-16 md:py-20">
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/40">
          {te.caseStudiesEyebrow}
        </p>
        <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-white md:text-3xl">
          {te.caseStudiesTitle}
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-muted">{te.caseStudiesNote}</p>

        <div className="mt-10 grid gap-4 md:grid-cols-2 md:gap-5">
          {te.caseStudies.map((study) => (
            <figure
              key={study.sector}
              className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 md:p-6"
            >
              <figcaption className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
                {study.sector}
              </figcaption>
              <blockquote className="mt-4 text-base leading-relaxed text-white/85">
                &ldquo;{study.quote}&rdquo;
              </blockquote>
              <p className="mt-4 text-xs leading-relaxed text-muted">{study.context}</p>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
