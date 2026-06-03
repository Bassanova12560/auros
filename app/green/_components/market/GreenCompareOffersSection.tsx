"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import {
  GREEN_COMPARE_ROUTE,
  GREEN_ROUTE,
  getGreenMessages,
} from "@/lib/green";
import type { GreenMarketOfferDetail } from "@/lib/green/market/offer-detail";
import { formatGreenMarketOfferTitle } from "@/lib/green/market/offer-detail";
import { greenMarketOfferPath } from "@/lib/green/market/offer-routes";
import {
  buildGreenCompareUrl,
  mergeCompareOfferIds,
  parseCompareOfferIdsParam,
  readCompareOfferIds,
  removeCompareOfferId,
} from "@/lib/green/market/compare-selection";
import {
  formatGreenMarketLocation,
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

type Props = {
  initialOfferIds: string[];
  resolvedOffers: GreenMarketOfferDetail[];
  onSelectedOffersChange?: (offers: GreenMarketOfferDetail[]) => void;
};

export function GreenCompareOffersSection({
  initialOfferIds,
  resolvedOffers,
  onSelectedOffersChange,
}: Props) {
  const { locale } = useLocale();
  const c = getGreenMessages(locale).compare;
  const mm = getGreenMarketMessages(locale).market;
  const [selectedIds, setSelectedIds] = useState<string[]>(initialOfferIds);
  const [offerMap, setOfferMap] = useState<Record<string, GreenMarketOfferDetail>>(() => {
    const map: Record<string, GreenMarketOfferDetail> = {};
    for (const offer of resolvedOffers) {
      map[offer.id] = offer;
    }
    return map;
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlIds = parseCompareOfferIdsParam(params.get("offers"));
    const merged = urlIds.length > 0 ? mergeCompareOfferIds(urlIds) : readCompareOfferIds();
    setSelectedIds(merged);
  }, []);

  useEffect(() => {
    setOfferMap((prev) => {
      const next = { ...prev };
      for (const offer of resolvedOffers) {
        next[offer.id] = offer;
      }
      return next;
    });
  }, [resolvedOffers]);

  const selectedOffers = useMemo(
    () =>
      selectedIds
        .map((id) => offerMap[id])
        .filter((offer): offer is GreenMarketOfferDetail => Boolean(offer)),
    [selectedIds, offerMap]
  );

  useEffect(() => {
    onSelectedOffersChange?.(selectedOffers);
  }, [selectedOffers, onSelectedOffersChange]);

  const handleRemove = useCallback((id: string) => {
    const next = removeCompareOfferId(id);
    setSelectedIds(next);
  }, []);

  if (selectedIds.length === 0) {
    return (
      <GreenPanel className="mt-10">
        <div className="p-6 md:p-8">
          <GreenSectionTitle>{c.marketOffersSectionTitle}</GreenSectionTitle>
          <p className="mt-3 text-sm text-neutral-400">{c.marketOffersEmpty}</p>
          <Link
            href={`${GREEN_ROUTE}/market`}
            className="mt-4 inline-block font-mono text-[11px] uppercase tracking-wider text-emerald-500 hover:text-emerald-400"
          >
            {c.marketOffersBrowse} →
          </Link>
        </div>
      </GreenPanel>
    );
  }

  return (
    <GreenPanel className="mt-10 overflow-hidden">
      <div className="p-6 md:p-8">
        <GreenSectionTitle>{c.marketOffersSectionTitle}</GreenSectionTitle>
        <p className="mt-3 text-sm text-neutral-400">{c.marketOffersSectionIntro}</p>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-neutral-500">
          {c.marketOffersCount(selectedIds.length)}
        </p>
      </div>
      <div className="overflow-x-auto border-t border-emerald-500/20">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-emerald-500/30 font-mono text-[10px] uppercase tracking-wider text-emerald-500">
              <th className="px-6 py-4 pr-4">{mm.table.actor}</th>
              <th className="py-4 pr-4">{mm.table.side}</th>
              <th className="py-4 pr-4">{mm.table.volume}</th>
              <th className="py-4 pr-4">{mm.table.price}</th>
              <th className="py-4 pr-4">{mm.table.location}</th>
              <th className="px-6 py-4">{c.marketOffersActions}</th>
            </tr>
          </thead>
          <tbody>
            {selectedOffers.map((offer) => (
              <tr
                key={offer.id}
                className="border-b border-emerald-500/20 text-neutral-300"
              >
                <td className="px-6 py-4 pr-4">
                  <Link
                    href={greenMarketOfferPath(offer.id)}
                    className="font-medium text-emerald-400 hover:text-emerald-300"
                  >
                    {formatGreenMarketOfferTitle(offer, locale)}
                  </Link>
                  <div className="mt-2">
                    <GreenListingBadge tier={offer.listingTier} labels={mm.listingTier} />
                  </div>
                </td>
                <td className="py-4 pr-4 text-neutral-400">{mm.sides[offer.side]}</td>
                <td className="py-4 pr-4 font-mono text-xs">
                  {formatMarketNumber(offer.volumeKwh, locale)} kWh
                </td>
                <td className="py-4 pr-4 font-mono text-xs">
                  {offer.pricePerKwh.toFixed(3)} €/kWh
                </td>
                <td className="py-4 pr-4 text-xs text-neutral-500">
                  {formatGreenMarketLocation(offer.city, offer.country)}
                </td>
                <td className="px-6 py-4">
                  <button
                    type="button"
                    onClick={() => handleRemove(offer.id)}
                    className="font-mono text-[10px] uppercase tracking-wider text-neutral-500 hover:text-emerald-400"
                  >
                    {c.removeFromCompare}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-emerald-500/20 px-6 py-4">
        <Link
          href={buildGreenCompareUrl(selectedIds)}
          className="font-mono text-[11px] uppercase tracking-wider text-emerald-500 hover:text-emerald-400"
        >
          {c.copyCompareLink} →
        </Link>
      </div>
    </GreenPanel>
  );
}
