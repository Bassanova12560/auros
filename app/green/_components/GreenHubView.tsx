"use client";



import Link from "next/link";



import { useLocale } from "@/app/_components/i18n/LocaleProvider";

import {

  AUROS_WIZARD_ROUTE,

  GREEN_ABOUT_ROUTE,

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
import { GreenHubOnboarding } from "./GreenHubOnboarding";

import { GreenHubLatestOffers } from "./GreenHubLatestOffers";

import { GreenHubMarketKpis } from "./GreenHubMarketKpis";

import { GreenHubMoreSections } from "./GreenHubMoreSections";

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

    <div className="page-inner page-inner--6xl mx-auto px-4 pb-24 pt-14 md:px-6 md:pt-16">

      <GreenHubHeroSection />

      <GreenHubOnboarding />

      <GreenHubLatestOffers offers={marketSnapshot.offers} />



      <GreenHubParticipateSection />



      <GreenHubQuote />



      <GreenHubMoreSections>

        <GreenHubWhySection />



        <GreenHubRtmsSection />



        <GreenHubAssetsSection />



        <div>

          <GreenHubActorFinder actors={marketSnapshot.actors} />

          <p className="mt-6 flex flex-wrap gap-4">

            <Link

              href={GREEN_MARKET_ROUTE}

              className="font-mono text-[11px] tracking-wide text-white/45 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"

            >

              {m.hub.map.cta} →

            </Link>

            <Link

              href={GREEN_REGISTER_ROUTE}

              className="font-mono text-[11px] tracking-wide text-green-royal-bright transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-royal"

            >

              {m.hub.registerCta} →

            </Link>

            <Link

              href="/green/my"

              className="font-mono text-[11px] tracking-wide text-white/45 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"

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

            className="font-display text-xl font-semibold tracking-[-0.02em] text-white md:text-2xl"

          >

            {m.hub.secondary.title}

          </h2>

          <div className="mt-6 grid gap-px border border-white/[0.08] bg-white/[0.08] sm:grid-cols-2">

            {m.hub.secondary.links.map((link) => (

              <Link

                key={link.href}

                href={link.href}

                className="group bg-black px-5 py-5 transition-colors hover:bg-white/[0.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:px-6"

              >

                <p className="font-display text-base font-semibold text-white group-hover:text-accent">

                  {link.title}

                </p>

                <p className="mt-1.5 text-sm text-white/40">{link.description}</p>

              </Link>

            ))}

          </div>

        </section>



        <blockquote className="max-w-2xl border-l border-white/[0.1] pl-6 md:pl-8">

          <p className="text-base leading-[1.7] text-white/70 md:text-lg">{m.hub.manifesto}</p>

          <footer className="mt-5 font-display text-sm font-medium text-white/45">

            {m.hub.manifestoSign}

          </footer>

        </blockquote>



        <p>

          <Link

            href={GREEN_ABOUT_ROUTE}

            className="font-mono text-[11px] tracking-wide text-white/40 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"

          >

            {m.hub.aboutCta} →

          </Link>

          {" · "}

          <Link

            href={`${AUROS_WIZARD_ROUTE}?asset=renewable`}

            className="font-mono text-[11px] tracking-wide text-white/30 transition hover:text-white/55 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"

          >

            {m.hub.wizardCta} →

          </Link>

        </p>



        <GreenHubSeoSection />

      </GreenHubMoreSections>



      <GreenDisclaimer>{m.disclaimer}</GreenDisclaimer>

    </div>

  );

}

