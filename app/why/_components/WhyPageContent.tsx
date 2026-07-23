"use client";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { NextStepStrip } from "@/app/_components/NextStepStrip";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { getWhyMessages } from "@/lib/i18n/pages/why";

export function WhyPageContent() {
  const { locale } = useLocale();
  const m = getWhyMessages(locale);

  return (
    <ContentPageLayout
      product={m.product}
      eyebrow={m.eyebrow}
      title={m.title}
      intro={m.intro}
    >
      <div className="space-y-12 text-sm leading-relaxed text-white/65">
        <section className="space-y-4">
          <h2 className="font-display text-xl text-white">{m.whyUsTitle}</h2>
          <ul className="space-y-4">
            {m.benefits.map((b) => (
              <li key={b.who} className="border-t border-white/10 pt-4">
                <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                  {b.who}
                </p>
                <p className="mt-1 text-white/75">{b.why}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-3 border border-white/[0.08] bg-white/[0.02] px-5 py-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
            {m.scenarioEyebrow}
          </p>
          <h2 className="font-display text-lg text-white">{m.scenarioTitle}</h2>
          <p>{m.scenarioBody}</p>
          <PrimaryButton href="/lab">{m.ctaLab}</PrimaryButton>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl text-white">{m.howTitle}</h2>
          <ol className="list-decimal space-y-2 pl-5 text-white/60">
            {m.howSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>

        <NextStepStrip preset="company" />
      </div>
    </ContentPageLayout>
  );
}
