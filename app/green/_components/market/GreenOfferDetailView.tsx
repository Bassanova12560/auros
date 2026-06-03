"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useCallback, useMemo, useState } from "react";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { getGreenMessages } from "@/lib/green/i18n";
import { GREEN_MARKET_ROUTE } from "@/lib/green/constants";
import { greenMarketActorPath } from "@/lib/green/market/actor-routes";
import type { GreenMarketOfferDetail } from "@/lib/green/market/offer-detail";
import { formatGreenMarketOfferTitle } from "@/lib/green/market/offer-detail";
import {
  buildGreenMarketActorFocusUrl,
  buildGreenMarketOfferShareUrl,
} from "@/lib/green/market/offer-routes";
import type { GreenMarketActor } from "@/lib/green/market/types";
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
import { GreenOfferInterestForm } from "./GreenOfferInterestForm";

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
  offer: GreenMarketOfferDetail;
};

function mapActorFromOffer(offer: GreenMarketOfferDetail): GreenMarketActor {
  if (offer.actor) return offer.actor;
  return {
    id: offer.actorId,
    type: "producer",
    name: offer.actorName,
    lat: offer.lat,
    lon: offer.lon,
    capacityKwh: offer.volumeKwh,
    pricePerKwh: offer.pricePerKwh,
    energyType: offer.energyType,
    isCertified: offer.listingTier === "verified",
    status: offer.status,
    city: offer.city,
    country: offer.country,
    region: "",
    description: offer.description,
    contactEmail: "",
    listingTier: offer.listingTier,
  };
}

export function GreenOfferDetailView({ offer }: Props) {
  const { locale } = useLocale();
  const mm = getGreenMarketMessages(locale).market;
  const od = getGreenMarketMessages(locale).offerDetail;
  const disclaimer = getGreenMessages(locale).disclaimer;
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  const title = formatGreenMarketOfferTitle(offer, locale);
  const mapActor = useMemo(() => mapActorFromOffer(offer), [offer]);
  const actorMapHref = buildGreenMarketActorFocusUrl(offer.actorName);
  const actorProfileHref = offer.actor
    ? greenMarketActorPath(offer.actor.id)
    : actorMapHref;

  const handleShare = useCallback(async () => {
    const url = buildGreenMarketOfferShareUrl(
      offer.id,
      typeof window !== "undefined" ? window.location.origin : ""
    );
    try {
      await navigator.clipboard.writeText(url);
      setShareFeedback(od.shareCopied);
      window.setTimeout(() => setShareFeedback(null), 2500);
    } catch {
      setShareFeedback(url);
    }
  }, [offer.id, od.shareCopied]);

  return (
    <div className="page-inner page-inner--4xl mx-auto px-4 pb-24 pt-10 sm:pt-12 md:px-6 md:pt-16">
      <GreenPageHeader
        eyebrow={od.eyebrow}
        title={title}
        intro={formatGreenMarketLocation(offer.city, offer.country)}
        compact
      />

      <div className="mt-5 flex flex-wrap items-center gap-2 sm:mt-6 sm:gap-3">
        <GreenListingBadge tier={offer.listingTier} labels={mm.listingTier} />
        <span className="font-mono text-[10px] uppercase tracking-wider text-white/45">
          {mm.sides[offer.side]} · {mm.energyTypes[offer.energyType]}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-white/35">
          {mm.status[offer.status]}
        </span>
      </div>

      <GreenPanel className="mt-6 grid gap-5 p-5 sm:mt-8 sm:grid-cols-2 sm:gap-6 sm:p-8">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
            {mm.table.volume}
          </p>
          <p className="mt-1 font-display text-xl font-semibold tabular-nums text-white sm:text-2xl">
            {formatMarketNumber(offer.volumeKwh, locale)} kWh
          </p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
            {mm.table.price}
          </p>
          <p className="mt-1 font-display text-xl font-semibold tabular-nums text-white sm:text-2xl">
            {offer.pricePerKwh.toFixed(3)} €/kWh
          </p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
            {mm.table.location}
          </p>
          <p className="mt-1 text-base text-white/80">
            {formatGreenMarketLocation(offer.city, offer.country)}
          </p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
            {od.datesTitle}
          </p>
          <p className="mt-1 text-sm text-white/70">
            {od.publishedAt} {formatMarketDate(offer.createdAt, locale)}
          </p>
          {offer.startDate ? (
            <p className="mt-1 text-sm text-white/55">
              {od.validFrom} {formatMarketDate(offer.startDate, locale)}
            </p>
          ) : null}
          {offer.endDate ? (
            <p className="mt-1 text-sm text-white/55">
              {od.validUntil} {formatMarketDate(offer.endDate, locale)}
            </p>
          ) : offer.startDate ? (
            <p className="mt-1 text-sm text-white/40">{od.noEndDate}</p>
          ) : null}
        </div>
      </GreenPanel>

      <section className="mt-10">
        <GreenSectionTitle>{od.actorTitle}</GreenSectionTitle>
        <p className="mt-3 text-lg font-medium text-white">{offer.actorName}</p>
        <div className="mt-4 flex flex-wrap gap-2 sm:gap-3">
          <Link
            href={actorProfileHref}
            className="rounded-lg border border-green-royal/40 bg-green-royal/10 px-4 py-2 font-mono text-[11px] tracking-wide text-green-royal-bright transition hover:border-green-royal hover:text-white"
          >
            {od.viewActorProfile} →
          </Link>
          <Link
            href={actorMapHref}
            className="rounded-lg border border-white/[0.12] px-4 py-2 font-mono text-[11px] tracking-wide text-white/60 transition hover:border-white/25 hover:text-white"
          >
            {od.viewActorOnMap} →
          </Link>
        </div>
      </section>

      <section className="mt-10">
        <GreenSectionTitle>{od.descriptionTitle}</GreenSectionTitle>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/65">{offer.description}</p>
        <p className="mt-4 max-w-2xl text-xs leading-relaxed text-white/40">{od.indicativeNote}</p>
      </section>

      <GreenOfferInterestForm
        offerId={offer.id}
        offerTitle={title}
        actorName={offer.actorName}
        actorEmail={offer.actor?.contactEmail}
      />

      <section className="mt-12">
        <GreenSectionTitle>{od.mapTitle}</GreenSectionTitle>
        <div className="mt-4">
          <GreenMarketMap
            actors={[mapActor]}
            center={{ lat: offer.lat, lon: offer.lon }}
            actorTypeLabels={{
              producer: mm.actorTypes.producer,
              storer: mm.actorTypes.storer,
              charger: mm.actorTypes.charger,
              consumer: mm.actorTypes.consumer,
            }}
            popupViewSheetLabel={mm.popupViewSheet}
            mapAriaLabel={od.mapTitle}
          />
        </div>
        <p className="mt-3">
          <Link
            href={actorMapHref}
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
          {shareFeedback ?? od.shareOffer}
        </button>
      </div>

      <GreenDisclaimer>{disclaimer}</GreenDisclaimer>
      <GreenBackLink href={GREEN_MARKET_ROUTE}>{od.backToMarket}</GreenBackLink>
    </div>
  );
}
