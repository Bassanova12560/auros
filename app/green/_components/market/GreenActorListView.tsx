"use client";

import Link from "next/link";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { GREEN_MARKET_ROUTE } from "@/lib/green";
import {
  greenMarketActorMailtoHref,
  greenMarketActorPath,
} from "@/lib/green/market/actor-routes";
import type { GreenMarketActor, GreenMarketActorType } from "@/lib/green/market/types";
import {
  formatGreenMarketLocation,
  formatMarketNumber,
  getGreenMarketMessages,
} from "@/lib/green/market-i18n";
import { getGreenMessages } from "@/lib/green/i18n";

import {
  GreenBackLink,
  GreenDisclaimer,
  GreenListingBadge,
  GreenPageHeader,
  GreenPanel,
  GreenSectionTitle,
} from "../green-ui";
type Props = {
  type: GreenMarketActorType;
  actors: GreenMarketActor[];
};

export function GreenActorListView({ type, actors }: Props) {
  const { locale } = useLocale();
  const am = getGreenMarketMessages(locale).actors[type];
  const mm = getGreenMarketMessages(locale).market;
  const listingLabels = mm.listingTier;
  const disclaimer = getGreenMessages(locale).disclaimer;

  return (
    <div className="page-inner page-inner--4xl mx-auto px-4 pb-24 pt-12 md:px-6 md:pt-16">
      <GreenPageHeader eyebrow={am.eyebrow} title={am.title} intro={am.intro} compact />

      <div className="mt-10 space-y-px border border-white/[0.08] bg-white/[0.08]">
        {actors.length === 0 ? (
          <GreenPanel className="border-0 p-8 text-center">
            <p className="text-sm text-muted">{mm.actorsListEmpty}</p>
          </GreenPanel>
        ) : null}
        {actors.map((actor) => {
          const mailto = greenMarketActorMailtoHref(actor);
          return (
          <GreenPanel key={actor.id} className="border-0">
            <div className="p-6 md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-xl font-semibold tracking-[-0.01em] text-white">
                    <Link
                      href={greenMarketActorPath(actor.id)}
                      className="transition hover:text-green-royal-bright"
                    >
                      {actor.name}
                    </Link>
                  </h2>
                  <div className="mt-2">
                    <GreenListingBadge tier={actor.listingTier} labels={listingLabels} />
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    {formatGreenMarketLocation(actor.city, actor.country)}
                    {actor.region ? ` · ${actor.region}` : ""}
                  </p>
                  {actor.isCertified ? (
                    <span className="mt-3 inline-block border border-green-royal px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide text-green-royal">
                      {mm.verifiedBadge}
                    </span>
                  ) : null}
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <Link
                    href={greenMarketActorPath(actor.id)}
                    className="rounded-lg border border-green-royal/40 bg-green-royal/10 px-4 py-2 font-mono text-[11px] tracking-wide text-green-royal-bright transition hover:border-green-royal hover:text-white"
                  >
                    {mm.viewActorProfile} →
                  </Link>
                  {mailto ? (
                    <a
                      href={mailto}
                      className="rounded-lg border border-white/[0.12] px-4 py-2 font-mono text-[11px] tracking-wide text-white/70 transition hover:border-white/30 hover:text-white"
                    >
                      {am.contact} →
                    </a>
                  ) : null}
                </div>
              </div>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">{actor.description}</p>
              <dl className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                <div>
                  <GreenSectionTitle>{am.capacity}</GreenSectionTitle>
                  <p className="mt-1 text-sm text-white">
                    {formatMarketNumber(actor.capacityKwh, locale)} kWh
                  </p>
                </div>
                <div>
                  <GreenSectionTitle>{am.price}</GreenSectionTitle>
                  <p className="mt-1 text-sm text-white">
                    {actor.pricePerKwh != null
                      ? `${actor.pricePerKwh.toFixed(3)} €/kWh`
                      : "—"}
                  </p>
                </div>
                <div>
                  <GreenSectionTitle>{am.energy}</GreenSectionTitle>
                  <p className="mt-1 text-sm text-white">{mm.energyTypes[actor.energyType]}</p>
                </div>
                <div>
                  <GreenSectionTitle>{am.status}</GreenSectionTitle>
                  <p className="mt-1 text-sm text-white">{mm.status[actor.status]}</p>
                </div>
              </dl>
            </div>
          </GreenPanel>
          );
        })}
      </div>

      <GreenDisclaimer>{disclaimer}</GreenDisclaimer>
      <GreenBackLink href={GREEN_MARKET_ROUTE}>{am.backLink}</GreenBackLink>
    </div>
  );
}
