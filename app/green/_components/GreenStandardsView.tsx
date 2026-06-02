"use client";

import Link from "next/link";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import {
  GREEN_COMPARE_ROUTE,
  GREEN_LABEL_ROUTE,
  GREEN_MARKET_ROUTE,
  GREEN_REGISTRY_ROUTE,
  GREEN_RTMS_PILLARS,
  GREEN_ROUTE,
  getGreenMessages,
} from "@/lib/green";

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

      <nav
        className="mt-10 grid gap-px border border-emerald-500/25 bg-emerald-500/10 sm:grid-cols-2 lg:grid-cols-4"
        aria-label={s.quickNavAria}
      >
        {[
          { href: GREEN_MARKET_ROUTE, title: s.quickNav.market },
          { href: GREEN_REGISTRY_ROUTE, title: s.quickNav.registry },
          { href: GREEN_COMPARE_ROUTE, title: s.quickNav.compare },
          { href: GREEN_LABEL_ROUTE, title: s.quickNav.label },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex min-h-[72px] items-center justify-between bg-black px-5 py-4 text-sm text-emerald-400 transition hover:bg-emerald-500/5"
          >
            <span>{item.title}</span>
            <span className="font-mono text-white/30">→</span>
          </Link>
        ))}
      </nav>

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
