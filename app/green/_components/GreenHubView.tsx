"use client";

import Link from "next/link";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import {
  AUROS_WIZARD_ROUTE,
  GREEN_ABOUT_ROUTE,
  GREEN_CSRD_CHECK_ROUTE,
  GREEN_MARKET_ROUTE,
  GREEN_REGISTER_ROUTE,
  getGreenMessages,
} from "@/lib/green";
import type { GreenHubImpact } from "@/lib/green/hub-impact";
import type { GreenRegistrySnapshot } from "@/lib/green/green-registry";
import type { GreenMarketSnapshot } from "@/lib/green/market/green-market-db";

import { GreenDisclaimer } from "./green-ui";
import { GreenHubActorFinder } from "./GreenHubActorFinder";
import { GreenHubAssetsSection } from "./GreenHubAssetsSection";
import { GreenHubEngagementSection } from "./GreenHubEngagementSection";
import { GreenHubHeroSection } from "./GreenHubHeroSection";
import { GreenHubLatestOffers } from "./GreenHubLatestOffers";
import { GreenHubMarketKpis } from "./GreenHubMarketKpis";
import { GreenHubMoreSections } from "./GreenHubMoreSections";
import { GreenHubOnboarding } from "./GreenHubOnboarding";
import { GreenHubParticipateSection } from "./GreenHubParticipateSection";
import { GreenHubQuote } from "./GreenHubQuote";
import { GreenHubRtmsSection } from "./GreenHubRtmsSection";
import { GreenHubSeoSection } from "./GreenHubSeoSection";
import { GreenHubWhySection } from "./GreenHubWhySection";

type Props = {
  marketSnapshot: GreenMarketSnapshot;
  impact: GreenHubImpact;
  registrySnapshot: GreenRegistrySnapshot;
};

export function GreenHubView({ marketSnapshot, impact, registrySnapshot }: Props) {
  const { locale } = useLocale();
  const m = getGreenMessages(locale);

  return (
    <div className="page-inner page-inner--6xl mx-auto px-4 pb-20 pt-2 md:px-6 md:pt-4">
      <GreenHubHeroSection marketMode={marketSnapshot.mode} />

      <GreenHubMoreSections>
        <GreenHubOnboarding />

        <GreenHubLatestOffers offers={marketSnapshot.offers} />

        <GreenHubParticipateSection />

        <GreenHubQuote />

        <GreenHubWhySection />

        <GreenHubRtmsSection />

        <GreenHubAssetsSection />

        <div>
          <GreenHubActorFinder actors={marketSnapshot.actors} />
          <p className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
            <Link
              href={GREEN_MARKET_ROUTE}
              className="font-mono text-[11px] tracking-wide text-white/40 transition-colors duration-300 hover:text-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {m.hub.map.cta} →
            </Link>
            <Link
              href={GREEN_REGISTER_ROUTE}
              className="font-mono text-[11px] tracking-wide text-white/40 transition-colors duration-300 hover:text-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {m.hub.registerCta} →
            </Link>
            <Link
              href="/green/my"
              className="font-mono text-[11px] tracking-wide text-white/40 transition-colors duration-300 hover:text-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {locale === "fr"
                ? "Mes fiches"
                : locale === "es"
                  ? "Mis fichas"
                  : "My listings"}{" "}
              →
            </Link>
          </p>
        </div>

        <GreenHubMarketKpis marketSnapshot={marketSnapshot} impact={impact} />

        <GreenHubEngagementSection registry={registrySnapshot} />

        <section aria-labelledby="green-secondary">
          <h2
            id="green-secondary"
            className="font-mono text-[11px] tracking-wide text-white/45"
          >
            {m.hub.secondary.title}
          </h2>
          <ul className="mt-6 space-y-6">
            {m.hub.secondary.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="group block max-w-xl transition-opacity duration-300 hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <p className="font-display text-base font-medium text-white group-hover:text-green-royal-bright">
                    {link.title}
                  </p>
                  <p className="mt-1.5 text-sm font-light leading-relaxed text-white/40">
                    {link.description}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <blockquote className="max-w-2xl">
          <p className="text-base font-light leading-[1.75] text-white/60 md:text-lg">
            {m.hub.manifesto}
          </p>
          <footer className="mt-5 font-display text-sm font-light text-white/40">
            {m.hub.manifestoSign}
          </footer>
        </blockquote>

        <p className="flex flex-wrap gap-x-4 gap-y-2">
          <Link
            href={GREEN_ABOUT_ROUTE}
            className="font-mono text-[11px] tracking-wide text-white/35 transition-colors duration-300 hover:text-white/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {m.hub.aboutCta} →
          </Link>
          <Link
            href={`${AUROS_WIZARD_ROUTE}?type=green&asset=renewable`}
            className="font-mono text-[11px] tracking-wide text-white/30 transition-colors duration-300 hover:text-white/55 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {m.hub.wizardCta} →
          </Link>
            <Link
              href="/data/uhi-index"
              className="font-mono text-[11px] tracking-wide text-violet-400/80 transition-colors duration-300 hover:text-violet-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              AUROS UHI Index →
            </Link>
            <Link
              href="/data/green-index"
              className="font-mono text-[11px] tracking-wide text-emerald-400/80 transition-colors duration-300 hover:text-emerald-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              AUROS Green Index →
            </Link>
            <Link
              href={GREEN_CSRD_CHECK_ROUTE}
            className="font-mono text-[11px] tracking-wide text-white/30 transition-colors duration-300 hover:text-white/55 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {locale === "fr"
              ? "Test CSRD gratuit"
              : locale === "es"
                ? "Test CSRD gratuito"
                : "Free CSRD check"}{" "}
            →
          </Link>
        </p>

        <GreenHubSeoSection />
      </GreenHubMoreSections>

      <GreenDisclaimer>{m.disclaimer}</GreenDisclaimer>
    </div>
  );
}
