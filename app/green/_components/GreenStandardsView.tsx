"use client";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { GREEN_RTMS_PILLARS, GREEN_ROUTE, getGreenMessages } from "@/lib/green";

import {
  GreenBackLink,
  GreenDisclaimer,
  GreenFieldLabel,
  GreenPageHeader,
  GreenPanel,
  GreenSectionTitle,
} from "./green-ui";

export function GreenStandardsView() {
  const { locale } = useLocale();
  const m = getGreenMessages(locale);
  const s = m.standards;

  return (
    <div className="page-inner page-inner--4xl mx-auto px-4 pb-20 pt-12 md:px-6 md:pt-14">
      <GreenPageHeader eyebrow={s.eyebrow} title={s.title} intro={s.intro} compact />

      <GreenPanel className="mt-12">
        <div className="p-6 md:p-8">
          <GreenSectionTitle>{s.methodologyTitle}</GreenSectionTitle>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-400">
            {s.methodologyIntro}
          </p>
          <ol className="mt-8 space-y-6">
            {s.methodologySteps.map((step) => (
              <li key={step.step} className="border-l border-emerald-500/40 pl-5">
                <p className="font-mono text-[11px] uppercase tracking-wider text-emerald-500">
                  {step.step}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-neutral-300">{step.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </GreenPanel>

      <section className="mt-12">
        <GreenSectionTitle>RTMS</GreenSectionTitle>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {GREEN_RTMS_PILLARS.map((pillar) => {
            const p = s.pillars[pillar];
            return (
              <GreenPanel key={pillar}>
                <div className="p-6 md:p-8">
                  <GreenFieldLabel>{p.name}</GreenFieldLabel>
                  <h2 className="mt-2 font-display text-xl font-semibold text-emerald-400">
                    {p.tagline}
                  </h2>
                  <ul className="mt-4 space-y-2 text-sm text-neutral-400">
                    {p.bullets.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="text-emerald-500">·</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </GreenPanel>
            );
          })}
        </div>
      </section>

      <GreenDisclaimer>{m.disclaimer}</GreenDisclaimer>
      <GreenBackLink href={GREEN_ROUTE}>{s.backLink}</GreenBackLink>
    </div>
  );
}
