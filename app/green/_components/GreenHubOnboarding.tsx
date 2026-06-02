"use client";

import Link from "next/link";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import {
  AUROS_WIZARD_ROUTE,
  GREEN_MARKET_ROUTE,
  GREEN_REGISTER_ROUTE,
  GREEN_STANDARDS_ROUTE,
  getGreenMessages,
} from "@/lib/green";

const STEP_HREFS = [
  GREEN_STANDARDS_ROUTE,
  GREEN_MARKET_ROUTE,
  GREEN_REGISTER_ROUTE,
] as const;

export function GreenHubOnboarding() {
  const { locale } = useLocale();
  const o = getGreenMessages(locale).hub.onboarding;

  return (
    <details className="group mt-10 border border-white/[0.08] bg-black md:mt-12">
      <summary className="cursor-pointer list-none px-5 py-4 font-mono text-[11px] uppercase tracking-wider text-white/55 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:px-6 [&::-webkit-details-marker]:hidden">
        <span className="inline-flex items-center gap-2">
          <span
            className="inline-block text-green-royal-bright transition group-open:rotate-90"
            aria-hidden
          >
            ›
          </span>
          {o.toggle}
        </span>
      </summary>
      <div className="border-t border-white/[0.06] px-5 pb-6 pt-4 md:px-6">
        <p className="max-w-2xl text-sm leading-relaxed text-white/50">{o.intro}</p>
        <ol className="mt-5 grid gap-px border border-white/[0.08] bg-white/[0.08] sm:grid-cols-3">
          {o.steps.map((step, index) => (
            <li key={step.title} className="bg-black px-4 py-4 md:px-5 md:py-5">
              <p className="font-mono text-[10px] uppercase tracking-wider text-green-royal-bright">
                {o.stepLabel(index + 1, o.steps.length)}
              </p>
              <p className="mt-2 font-display text-sm font-semibold text-white">
                {step.title}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-white/45">{step.body}</p>
              <Link
                href={
                  index === 0
                    ? STEP_HREFS[0]
                    : index === 1
                      ? STEP_HREFS[1]
                      : STEP_HREFS[2]
                }
                className="mt-3 inline-flex min-h-[40px] items-center font-mono text-[10px] uppercase tracking-wider text-white/55 transition hover:text-green-royal-bright focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {step.cta} →
              </Link>
            </li>
          ))}
        </ol>
        <p className="mt-4">
          <Link
            href={`${AUROS_WIZARD_ROUTE}?asset=renewable`}
            className="font-mono text-[10px] tracking-wide text-white/35 transition hover:text-white/55"
          >
            {o.wizardHint} →
          </Link>
        </p>
      </div>
    </details>
  );
}
