"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useCallback, useState } from "react";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { getGreenMessages } from "@/lib/green/i18n";
import { GREEN_MARKET_ROUTE } from "@/lib/green/constants";
import { formatGreenMarketActorTitle } from "@/lib/green/market/actor-detail";
import type { GreenMarketActorDetail } from "@/lib/green/market/actor-detail";
import {
  buildGreenMarketActorShareUrl,
  greenMarketActorMailtoHref,
} from "@/lib/green/market/actor-routes";
import { buildGreenMarketActorFocusUrl } from "@/lib/green/market/offer-routes";
import { greenMarketOfferPath } from "@/lib/green/market/offer-routes";
import {
  formatGreenMarketLocation,
  formatMarketDate,
  formatMarketNumber,
  getGreenMarketMessages,
} from "@/lib/green/market-i18n";

import {
  GreenBackLink,
  GreenDisclaimer,
  GreenListingBadge,
  GreenPageHeader,
  GreenPanel,
  GreenSectionTitle,
} from "../green-ui";

const GreenMarketMap = dynamic(
  () => import("./GreenMarketMap").then((m) => m.GreenMarketMap),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[200px] h-[min(240px,40vh)] animate-pulse bg-white/[0.04] sm:h-[min(280px,45vh)]" />
    ),
  }
);

type Props = {
  actor: GreenMarketActorDetail;
};

export function GreenActorDetailView({ actor }: Props) {
  const { locale } = useLocale();
  const gm = getGreenMarketMessages(locale);
  const mm = gm.market;
  const am = gm.actors[actor.type];
  const ad = gm.actorDetail;
  const od = gm.offerDetail;
  const disclaimer = getGreenMessages(locale).disclaimer;
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  const title = formatGreenMarketActorTitle(actor, locale);
  const mailto = greenMarketActorMailtoHref(actor);
  const mapFocusHref = buildGreenMarketActorFocusUrl(actor.name);

  const handleShare = useCallback(async () => {
    const url = buildGreenMarketActorShareUrl(
      actor.id,
      typeof window !== "undefined" ? window.location.origin : ""
    );
    try {
      await navigator.clipboard.writeText(url);
      setShareFeedback(ad.shareCopied);
      window.setTimeout(() => setShareFeedback(null), 2500);
    } catch {
      setShareFeedback(url);
    }
  }, [actor.id, ad.shareCopied]);

  return (
    <div className="page-inner page-inner--4xl mx-auto px-4 pb-24 pt-10 sm:pt-12 md:px-6 md:pt-16">
      <GreenPageHeader
        eyebrow={ad.eyebrow}
        title={title}
        intro={formatGreenMarketLocation(actor.city, actor.country)}
        compact
      />

      <div className="mt-5 flex flex-wrap items-center gap-2 sm:mt-6 sm:gap-3">
        <GreenListingBadge tier={actor.listingTier} labels={mm.listingTier} />
        <span className="font-mono text-[10px] uppercase tracking-wider text-white/45">
          {mm.actorTypes[actor.type]}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-white/35">
          {mm.status[actor.status]}
        </span>
        {actor.isCertified ? (
          <span className="border border-green-royal px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide text-green-royal">
            {mm.verifiedBadge}
          </span>
        ) : null}
      </div>

      <GreenPanel className="mt-6 grid gap-5 p-5 sm:mt-8 sm:grid-cols-2 sm:gap-6 sm:p-8">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
            {am.capacity}
          </p>
          <p className="mt-1 font-display text-xl font-semibold tabular-nums text-white sm:text-2xl">
            {formatMarketNumber(actor.capacityKwh, locale)} kWh
          </p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
            {am.price}
          </p>
          <p className="mt-1 font-display text-xl font-semibold tabular-nums text-white sm:text-2xl">
            {actor.pricePerKwh != null ? `${actor.pricePerKwh.toFixed(3)} €/kWh` : "—"}
          </p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
            {am.energy}
          </p>
          <p className="mt-1 text-base text-white/80">{mm.energyTypes[actor.energyType]}</p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
            {mm.table.location}
          </p>
          <p className="mt-1 text-base text-white/80">
            {formatGreenMarketLocation(actor.city, actor.country)}
            {actor.region ? ` · ${actor.region}` : ""}
          </p>
        </div>
      </GreenPanel>

      {mailto ? (
        <div className="mt-8">
          <GreenSectionTitle>{ad.contactTitle}</GreenSectionTitle>
          <a
            href={mailto}
            className="mt-4 inline-flex rounded-lg border border-green-royal/40 bg-green-royal/10 px-5 py-3 font-mono text-[11px] tracking-wide text-green-royal-bright transition hover:border-green-royal hover:text-white"
          >
            {mm.contact} →
          </a>
        </div>
      ) : null}

      <section className="mt-10">
        <GreenSectionTitle>{ad.descriptionTitle}</GreenSectionTitle>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/65">{actor.description}</p>
      </section>

      <section className="mt-10">
        <GreenSectionTitle>{ad.offersTitle}</GreenSectionTitle>
        {actor.offers.length === 0 ? (
          <p className="mt-4 text-sm text-white/45">{ad.offersEmpty}</p>
        ) : (
          <ul className="mt-4 space-y-px border border-white/[0.08] bg-white/[0.08]">
            {actor.offers.map((offer) => (
              <li key={offer.id}>
                <Link
                  href={greenMarketOfferPath(offer.id)}
                  className="flex flex-col gap-2 border-b border-white/[0.06] bg-[#0a0f0d] p-4 transition hover:bg-white/[0.03] sm:flex-row sm:items-center sm:justify-between sm:p-5"
                >
                  <div>
                    <p className="font-medium text-white">
                      {mm.sides[offer.side]} · {mm.energyTypes[offer.energyType]}
                    </p>
                    <p className="mt-1 text-sm text-white/50">
                      {formatGreenMarketLocation(offer.city, offer.country)} ·{" "}
                      {formatMarketDate(offer.createdAt, locale)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm tabular-nums text-white/70">
                    <span>{formatMarketNumber(offer.volumeKwh, locale)} kWh</span>
                    <span>{offer.pricePerKwh.toFixed(3)} €/kWh</span>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-500/80">
                      {ad.viewOffer} →
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-12">
        <GreenSectionTitle>{ad.mapTitle}</GreenSectionTitle>
        <div className="mt-4">
          <GreenMarketMap
            actors={[actor]}
            center={{ lat: actor.lat, lon: actor.lon }}
            actorTypeLabels={{
              producer: mm.actorTypes.producer,
              storer: mm.actorTypes.storer,
              charger: mm.actorTypes.charger,
              consumer: mm.actorTypes.consumer,
            }}
            popupViewSheetLabel={mm.popupViewSheet}
            mapAriaLabel={ad.mapTitle}
          />
        </div>
        <p className="mt-3">
          <Link
            href={mapFocusHref}
            className="font-mono text-[11px] uppercase tracking-wider text-emerald-500/80 transition hover:text-emerald-400"
          >
            {od.viewActorOnMap} →
          </Link>
        </p>
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => void handleShare()}
          className="rounded-lg border border-white/[0.12] px-4 py-2 font-mono text-[11px] tracking-wide text-white/60 transition hover:border-white/25 hover:text-white"
        >
          {shareFeedback ?? ad.shareProfile}
        </button>
      </div>

      <GreenDisclaimer>{disclaimer}</GreenDisclaimer>
      <GreenBackLink href={GREEN_MARKET_ROUTE}>{ad.backToMarket}</GreenBackLink>
    </div>
  );
}
