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

const secondaryLinkClass =
  "font-mono text-[11px] tracking-wide text-white/40 transition-colors duration-300 hover:text-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

export function GreenHubHeroSection({
  marketMode = "demo",
}: {
  marketMode?: "live" | "demo";
}) {
  const { locale } = useLocale();
  const h = getGreenMessages(locale).hub;

  const secondaryNavLabel =
    locale === "fr"
      ? "Accès secondaires"
      : locale === "es"
        ? "Accesos secundarios"
        : "Secondary access";

  const primaryHref =
    marketMode === "live" ? GREEN_REGISTER_ROUTE : GREEN_MARKET_ROUTE;
  const primaryLabel =
    marketMode === "live"
      ? h.hero.secondaryRegisterCta
      : h.hero.primaryCta;

  return (
    <header
      className="relative flex min-h-[calc(100dvh-4.5rem)] flex-col justify-center overflow-hidden pb-16 pt-6 md:pb-24 md:pt-10"
      aria-labelledby="green-hub-title"
    >
      <div className="green-hub-fade-in relative z-10 max-w-3xl">
        <h1
          id="green-hub-title"
          className="font-display text-[clamp(2.25rem,6.5vw,4.5rem)] font-semibold leading-[1.06] tracking-[-0.03em] text-white"
        >
          AUROS <GreenForestWord />
        </h1>
        <p className="mt-8 max-w-xl text-lg font-light leading-relaxed text-white/65 md:text-xl">
          {h.tagline}
        </p>
        <p className="mt-4 max-w-xl text-base font-light leading-relaxed text-white/45">
          {h.hero.valueProp}
        </p>
        {marketMode === "live" ? (
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-green-royal-bright">
            Marché live
          </p>
        ) : null}

        <div className="green-hub-fade-in-delay mt-12 md:mt-14">
          <PrimaryButton
            href={primaryHref}
            className={`w-full justify-center transition-transform duration-300 active:scale-[0.98] sm:w-auto ${greenBtnClass}`}
          >
            {primaryLabel}
          </PrimaryButton>
        </div>

        <nav
          className="green-hub-fade-in-delay-2 mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 md:mt-12"
          aria-label={secondaryNavLabel}
        >
          {marketMode === "live" ? (
            <>
              <Link href={GREEN_MARKET_ROUTE} className={secondaryLinkClass}>
                {h.hero.primaryCta} →
              </Link>
              <span className="hidden text-white/20 sm:inline" aria-hidden>
                ·
              </span>
              <Link href="/green/my" className={secondaryLinkClass}>
                {locale === "fr"
                  ? "Mes fiches"
                  : locale === "es"
                    ? "Mis fichas"
                    : "My listings"}{" "}
                →
              </Link>
            </>
          ) : (
            <>
              <Link href={GREEN_REGISTER_ROUTE} className={secondaryLinkClass}>
                {h.hero.secondaryRegisterCta} →
              </Link>
              <span className="hidden text-white/20 sm:inline" aria-hidden>
                ·
              </span>
              <Link
                href={`${GREEN_REGISTER_ROUTE}?type=producer`}
                className={secondaryLinkClass}
              >
                {h.hero.producerSurplusCta} →
              </Link>
              <span className="hidden text-white/20 sm:inline" aria-hidden>
                ·
              </span>
              <Link href={GREEN_REGISTRY_ROUTE} className={secondaryLinkClass}>
                {h.hero.tertiaryCta} →
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
