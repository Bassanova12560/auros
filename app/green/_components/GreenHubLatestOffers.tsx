"use client";

import Link from "next/link";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { GREEN_MARKET_ROUTE, getGreenMessages } from "@/lib/green";
import { greenMarketOfferPath } from "@/lib/green/market/offer-routes";
import type { GreenMarketOffer } from "@/lib/green/market/types";
import {
  formatGreenMarketLocation,
  formatMarketNumber,
  getGreenMarketMessages,
} from "@/lib/green/market-i18n";

import { GreenListingBadge, GreenSectionTitle } from "./green-ui";

type Props = {
  offers: GreenMarketOffer[];
};

export function GreenHubLatestOffers({ offers }: Props) {
  const { locale } = useLocale();
  const h = getGreenMessages(locale).hub.latestOffers;
  const mm = getGreenMarketMessages(locale).market;

  const latest = offers.slice(0, 3);
  if (latest.length === 0) return null;

  return (
    <section className="mt-14 md:mt-16" aria-labelledby="green-latest-offers">
      <GreenSectionTitle>{h.title}</GreenSectionTitle>
      <ul className="mt-6 grid gap-px border border-white/[0.08] bg-white/[0.08] md:grid-cols-3">
        {latest.map((offer) => (
          <li key={offer.id} className="flex flex-col bg-black px-5 py-5 md:px-6 md:py-6">
            <Link href={greenMarketOfferPath(offer.id)} className="group flex flex-1 flex-col">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-display text-base font-semibold text-white transition group-hover:text-green-royal-bright">
                  {offer.actorName}
                </p>
                <GreenListingBadge tier={offer.listingTier} labels={mm.listingTier} />
              </div>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-white/40">
                {mm.sides[offer.side]} · {mm.energyTypes[offer.energyType]}
              </p>
              <p className="mt-2 text-sm text-white/55">
                {formatMarketNumber(offer.volumeKwh, locale)} kWh · {offer.pricePerKwh.toFixed(3)} €/kWh
              </p>
              <p className="mt-1 text-sm text-white/40">
                {formatGreenMarketLocation(offer.city, offer.country)}
              </p>
            </Link>
          </li>
        ))}
      </ul>
      <Link
        id="green-latest-offers"
        href={GREEN_MARKET_ROUTE}
        className="mt-5 inline-flex min-h-[44px] items-center font-mono text-[11px] uppercase tracking-wider text-green-royal-bright transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-royal"
      >
        {h.viewAll} →
      </Link>
    </section>
  );
}
