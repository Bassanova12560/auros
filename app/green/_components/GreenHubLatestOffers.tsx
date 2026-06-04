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
    <section aria-labelledby="green-latest-offers">
      <GreenSectionTitle>{h.title}</GreenSectionTitle>
      <ul className="mt-6 divide-y divide-white/[0.06]">
        {latest.map((offer) => (
          <li key={offer.id} className="py-5 first:pt-0 md:py-6">
            <Link href={greenMarketOfferPath(offer.id)} className="group block max-w-xl">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-display text-base font-medium text-white transition-colors duration-300 group-hover:text-green-royal-bright">
                  {offer.actorName}
                </p>
                <GreenListingBadge tier={offer.listingTier} labels={mm.listingTier} />
              </div>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-white/35">
                {mm.sides[offer.side]} · {mm.energyTypes[offer.energyType]}
              </p>
              <p className="mt-2 text-sm font-light text-white/50">
                {formatMarketNumber(offer.volumeKwh, locale)} kWh · {offer.pricePerKwh.toFixed(3)}{" "}
                €/kWh
              </p>
              <p className="mt-1 text-sm font-light text-white/35">
                {formatGreenMarketLocation(offer.city, offer.country)}
              </p>
            </Link>
          </li>
        ))}
      </ul>
      <Link
        id="green-latest-offers"
        href={GREEN_MARKET_ROUTE}
        className="mt-6 inline-flex min-h-[44px] items-center font-mono text-[11px] tracking-wide text-white/45 transition-colors duration-300 hover:text-green-royal-bright focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-royal"
      >
        {h.viewAll} →
      </Link>
    </section>
  );
}
