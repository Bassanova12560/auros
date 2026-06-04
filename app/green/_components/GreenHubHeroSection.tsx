"use client";

import Link from "next/link";

import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import {
  GREEN_MARKET_ROUTE,
  GREEN_REGISTER_ROUTE,
  GREEN_REGISTRY_ROUTE,
  getGreenMessages,
} from "@/lib/green";

import { GreenForestWord, greenBtnClass } from "./green-ui";

export function GreenHubHeroSection() {
  const { locale } = useLocale();
  const h = getGreenMessages(locale).hub;

  return (
    <header className="max-w-3xl" aria-labelledby="green-hub-title">
      <h1
        id="green-hub-title"
        className="font-display text-[clamp(2.5rem,7vw,4.75rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-white"
      >
        AUROS <GreenForestWord />
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70 md:text-xl">
        {h.tagline}
      </p>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/55">
        {h.hero.valueProp}
      </p>
      <div className="mt-8 flex w-full min-w-0 max-w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="w-full min-w-0 max-w-full sm:w-auto">
          <PrimaryButton
            href={GREEN_MARKET_ROUTE}
            className={`w-full max-w-full justify-center sm:w-auto ${greenBtnClass}`}
          >
            {h.hero.primaryCta}
          </PrimaryButton>
        </div>
        <Link
          href={`${GREEN_REGISTER_ROUTE}?type=producer`}
          className="inline-flex min-h-[44px] w-full max-w-full items-center justify-center border border-white/20 px-4 font-mono text-[10px] uppercase tracking-wider text-white/70 transition hover:border-white/40 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto sm:max-w-none sm:px-5 sm:text-[11px]"
        >
          {h.hero.producerSurplusCta}
        </Link>
        <Link
          href={GREEN_REGISTER_ROUTE}
          className="inline-flex min-h-[44px] w-full max-w-full items-center justify-center font-mono text-[11px] tracking-wide text-white/55 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto sm:max-w-none sm:justify-start"
        >
          {h.hero.secondaryRegisterCta} →
        </Link>
        <Link
          href={GREEN_REGISTRY_ROUTE}
          className="inline-flex min-h-[44px] w-full max-w-full items-center font-mono text-[11px] tracking-wide text-green-royal-bright transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-royal sm:w-auto sm:max-w-none"
        >
          {h.hero.tertiaryCta} →
        </Link>
      </div>
    </header>
  );
}
