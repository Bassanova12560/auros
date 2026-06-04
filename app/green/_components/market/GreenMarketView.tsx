"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { matchesGreenMarketSearch } from "@/lib/green/market/search";
import { GREEN_MARKET_COUNTRIES } from "@/lib/green/market/countries";
import { GREEN_MARKET_PILOT_LISTINGS } from "@/lib/green/market/pilot-listings";
import {
  buildGreenMarketShareUrl,
  decodeGreenMarketFilters,
  encodeGreenMarketFilters,
} from "@/lib/green/market/market-share";
import {
  readGreenMarketSavedSearches,
  removeGreenMarketSavedSearch,
  saveGreenMarketSearch,
  type GreenMarketSavedSearch,
} from "@/lib/green/market/saved-searches";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import {
  GREEN_CHARGERS_ROUTE,
  GREEN_CONSUMERS_ROUTE,
  GREEN_PRODUCERS_ROUTE,
  GREEN_REGISTER_ROUTE,
  GREEN_ROUTE,
  GREEN_RTMS_ASSISTANT_ROUTE,
  GREEN_STORERS_ROUTE,
} from "@/lib/green";
import type { GreenMarketSnapshot } from "@/lib/green/market/green-market-db";
import { greenMarketCentroid, withinRadiusKm } from "@/lib/green/market/geo";
import { readStoredGreenMarketOffers } from "@/lib/green/market/offers-storage";
import type {
  GreenMarketActorType,
  GreenMarketEnergyType,
  GreenMarketOffer,
  GreenMarketOfferSide,
  GreenMarketRadiusKm,
} from "@/lib/green/market/types";
import {
  formatGreenMarketLocation,
  formatMarketDate,
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
import { GreenOfferForm } from "./GreenOfferForm";
import { GreenMarketMapLegend } from "./GreenMarketMapLegend";
import { greenMarketOfferPath } from "@/lib/green/market/offer-routes";

const OFFERS_PAGE_SIZE = 10;

function GreenMarketMapSkeleton() {
  return (
    <div
      className="h-[min(420px,55vh)] w-full animate-pulse rounded-lg bg-white/[0.06]"
      aria-hidden
    />
  );
}

const GreenMarketMap = dynamic(
  () => import("./GreenMarketMap").then((m) => m.GreenMarketMap),
  { ssr: false, loading: () => <GreenMarketMapSkeleton /> }
);

type Props = {
  snapshot: GreenMarketSnapshot;
};

export function GreenMarketView({ snapshot }: Props) {
  const { locale } = useLocale();
  const mm = getGreenMarketMessages(locale).market;
  const disclaimer = getGreenMessages(locale).disclaimer;
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [actorFilter, setActorFilter] = useState<GreenMarketActorType | "all">("all");
  const [radiusKm, setRadiusKm] = useState<GreenMarketRadiusKm | 0>(0);
  const [energyFilter, setEnergyFilter] = useState<GreenMarketEnergyType | "all">("all");
  const [sideFilter, setSideFilter] = useState<GreenMarketOfferSide | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [offersPage, setOffersPage] = useState(1);
  const [localOffers, setLocalOffers] = useState<GreenMarketOffer[]>([]);
  const [urlReady, setUrlReady] = useState(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);
  const [savedSearches, setSavedSearches] = useState<GreenMarketSavedSearch[]>([]);
  const [savedSearchName, setSavedSearchName] = useState("");

  const currentFilters = useMemo(
    () => ({
      actor: actorFilter,
      radius: radiusKm,
      energy: energyFilter,
      side: sideFilter,
      q: searchQuery,
    }),
    [actorFilter, radiusKm, energyFilter, sideFilter, searchQuery]
  );

  useEffect(() => {
    setSavedSearches(readGreenMarketSavedSearches());
  }, []);

  useEffect(() => {
    const decoded = decodeGreenMarketFilters(searchParams);
    setActorFilter(decoded.actor ?? "all");
    setRadiusKm(decoded.radius ?? 0);
    setEnergyFilter(decoded.energy ?? "all");
    setSideFilter(decoded.side ?? "all");
    setSearchQuery(decoded.q ?? "");
    setUrlReady(true);
  }, [searchParams]);

  useEffect(() => {
    if (!urlReady) return;
    const params = encodeGreenMarketFilters(currentFilters);
    const next = params.toString();
    if (next === searchParams.toString()) return;
    router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
  }, [currentFilters, urlReady, pathname, router, searchParams]);

  const handleShareLink = useCallback(async () => {
    const url = buildGreenMarketShareUrl(
      currentFilters,
      typeof window !== "undefined" ? window.location.origin : ""
    );
    try {
      await navigator.clipboard.writeText(url);
      setShareFeedback(mm.shareCopied);
      window.setTimeout(() => setShareFeedback(null), 2500);
    } catch {
      setShareFeedback(url);
    }
  }, [currentFilters, mm.shareCopied]);

  const handleSaveSearch = useCallback(() => {
    const next = saveGreenMarketSearch(savedSearchName, currentFilters);
    setSavedSearches(next);
    setSavedSearchName("");
  }, [savedSearchName, currentFilters]);

  const applySavedSearch = useCallback((entry: GreenMarketSavedSearch) => {
    setActorFilter(entry.filters.actor ?? "all");
    setRadiusKm(entry.filters.radius ?? 0);
    setEnergyFilter(entry.filters.energy ?? "all");
    setSideFilter(entry.filters.side ?? "all");
    setSearchQuery(entry.filters.q ?? "");
  }, []);

  useEffect(() => {
    if (!snapshot.available) {
      setLocalOffers(readStoredGreenMarketOffers());
    }
  }, [snapshot.available]);

  const realOffers = useMemo(() => {
    const byId = new Map<string, GreenMarketOffer>();
    for (const o of snapshot.offers) byId.set(o.id, o);
    for (const o of localOffers) byId.set(o.id, o);
    return [...byId.values()].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [snapshot.offers, localOffers]);

  const showPilotListings = realOffers.length === 0;

  const allOffers = realOffers;

  const mapCenter = useMemo(
    () => greenMarketCentroid(snapshot.actors),
    [snapshot.actors]
  );

  useEffect(() => {
    setOffersPage(1);
  }, [actorFilter, radiusKm, energyFilter, sideFilter, searchQuery, countryFilter]);

  const filteredActors = useMemo(() => {
    return snapshot.actors.filter((a) => {
      if (countryFilter && a.country.trim() !== countryFilter) return false;
      if (actorFilter !== "all" && a.type !== actorFilter) return false;
      if (
        !matchesGreenMarketSearch(searchQuery, {
          name: a.name,
          city: a.city,
          country: a.country,
          region: a.region,
        })
      ) {
        return false;
      }
      if (
        radiusKm &&
        !withinRadiusKm(a.lat, a.lon, mapCenter.lat, mapCenter.lon, radiusKm)
      ) {
        return false;
      }
      return true;
    });
  }, [
    snapshot.actors,
    countryFilter,
    actorFilter,
    radiusKm,
    mapCenter.lat,
    mapCenter.lon,
    searchQuery,
  ]);

  const mapCountryCount = useMemo(
    () =>
      new Set(filteredActors.map((a) => a.country.trim()).filter(Boolean)).size,
    [filteredActors]
  );

  const actorFilterKeys = ["all", "producer", "storer", "charger", "consumer"] as const;

  const filteredOffers = useMemo(() => {
    return allOffers.filter((o) => {
      if (countryFilter && o.country.trim() !== countryFilter) return false;
      if (energyFilter !== "all" && o.energyType !== energyFilter) return false;
      if (sideFilter !== "all" && o.side !== sideFilter) return false;
      if (
        !matchesGreenMarketSearch(searchQuery, {
          name: o.actorName,
          city: o.city,
          country: o.country,
        })
      ) {
        return false;
      }
      if (
        radiusKm &&
        !withinRadiusKm(o.lat, o.lon, mapCenter.lat, mapCenter.lon, radiusKm)
      ) {
        return false;
      }
      return true;
    });
  }, [
    allOffers,
    countryFilter,
    energyFilter,
    sideFilter,
    radiusKm,
    mapCenter.lat,
    mapCenter.lon,
    searchQuery,
  ]);

  const offersTotalPages = showPilotListings
    ? 1
    : Math.max(1, Math.ceil(filteredOffers.length / OFFERS_PAGE_SIZE));
  const safeOffersPage = Math.min(offersPage, offersTotalPages);
  const paginatedOffers = useMemo(
    () =>
      showPilotListings
        ? []
        : filteredOffers.slice(
            (safeOffersPage - 1) * OFFERS_PAGE_SIZE,
            safeOffersPage * OFFERS_PAGE_SIZE
          ),
    [filteredOffers, safeOffersPage, showPilotListings]
  );

  const marketCountries = useMemo(() => {
    const fromActors = snapshot.actors.map((a) => a.country.trim()).filter(Boolean);
    const merged = new Set([...GREEN_MARKET_COUNTRIES, ...fromActors]);
    return [...merged].sort((a, b) => a.localeCompare(b, "fr"));
  }, [snapshot.actors]);

  const selectClass =
    "rounded-lg border border-white/[0.12] bg-black px-3 py-2 text-sm text-white outline-none focus:border-white/30";

  const actorLinks = [
    { href: GREEN_PRODUCERS_ROUTE, label: mm.actorTypes.producer },
    { href: GREEN_STORERS_ROUTE, label: mm.actorTypes.storer },
    { href: GREEN_CHARGERS_ROUTE, label: mm.actorTypes.charger },
    { href: GREEN_CONSUMERS_ROUTE, label: mm.actorTypes.consumer },
  ];

  return (
    <div className="page-inner page-inner--6xl mx-auto px-4 pb-24 pt-12 md:px-6 md:pt-16">
      <GreenPageHeader eyebrow={mm.eyebrow} title={mm.title} intro={mm.intro} compact />

      {snapshot.mode === "demo" ? (
        <p className="mt-4 max-w-2xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm leading-relaxed text-amber-200/80">
          {mm.demoBanner}
        </p>
      ) : (
        <p className="mt-4 font-mono text-[10px] tracking-wide text-green-royal-bright">
          {mm.liveBadge}
        </p>
      )}

      <p className="mt-4">
        <Link
          href={GREEN_RTMS_ASSISTANT_ROUTE}
          className="inline-flex min-h-[44px] items-center font-mono text-[11px] uppercase tracking-wider text-emerald-500/80 transition hover:text-emerald-400"
        >
          {mm.rtmsAssistantCta} →
        </Link>
      </p>

      <section className="mt-10">
        <GreenSectionTitle>{mm.mapTitle}</GreenSectionTitle>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-white/40">
          {mm.mapActorsCountries(filteredActors.length, mapCountryCount)}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2" role="group" aria-label={mm.filters.actorType}>
          {actorFilterKeys.map((key) => {
            const active = actorFilter === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActorFilter(key)}
                className={
                  active
                    ? "border border-green-royal bg-green-royal/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-green-royal-bright"
                    : "border border-white/[0.12] px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-white/50 transition hover:border-white/25 hover:text-white"
                }
              >
                {mm.actorTypes[key]}
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex flex-wrap gap-3">
          <label className="flex min-w-[200px] flex-1 flex-col gap-1 sm:max-w-md">
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              {mm.filters.search}
            </span>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={mm.filters.searchPlaceholder}
              className={selectClass}
              aria-label={mm.filters.search}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              {mm.filters.country}
            </span>
            <select
              className={selectClass}
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              aria-label={mm.filters.country}
            >
              <option value="">{mm.filters.allCountries}</option>
              {marketCountries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              {mm.filters.radius}
            </span>
            <select
              className={selectClass}
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value) as GreenMarketRadiusKm | 0)}
            >
              <option value={0}>{mm.filters.allActors}</option>
              {([5, 10, 20] as const).map((km) => (
                <option key={km} value={km}>
                  {mm.filters.radiusKm(km)}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <button
            type="button"
            onClick={() => void handleShareLink()}
            className="rounded-lg border border-white/[0.12] px-4 py-2 font-mono text-[11px] tracking-wide text-white/60 transition hover:border-white/25 hover:text-white"
          >
            {shareFeedback ?? mm.shareLink}
          </button>
          <label className="flex min-w-[160px] flex-1 flex-col gap-1 sm:max-w-xs">
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              {mm.savedSearchName}
            </span>
            <input
              value={savedSearchName}
              onChange={(e) => setSavedSearchName(e.target.value)}
              className={selectClass}
            />
          </label>
          <button
            type="button"
            onClick={handleSaveSearch}
            disabled={!savedSearchName.trim()}
            className="rounded-lg border border-green-royal/40 bg-green-royal/10 px-4 py-2 font-mono text-[11px] tracking-wide text-green-royal-bright transition hover:border-green-royal disabled:opacity-40"
          >
            {mm.savedSearchSave}
          </button>
        </div>
        {savedSearches.length > 0 ? (
          <div className="mt-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-white/35">
              {mm.savedSearchesTitle}
            </p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {savedSearches.map((entry) => (
                <li
                  key={entry.id}
                  className="flex items-center gap-2 rounded border border-white/[0.1] px-2 py-1"
                >
                  <button
                    type="button"
                    onClick={() => applySavedSearch(entry)}
                    className="font-mono text-[10px] text-emerald-400/90 hover:text-emerald-300"
                  >
                    {entry.name} · {mm.savedSearchApply}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setSavedSearches(removeGreenMarketSavedSearch(entry.id))
                    }
                    className="font-mono text-[10px] text-white/35 hover:text-white/60"
                    aria-label={mm.savedSearchRemove}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="mt-3 font-mono text-[10px] text-white/30">{mm.savedSearchEmpty}</p>
        )}
        {filteredActors.length === 0 ? (
          <div
            className="mt-4 border border-white/[0.08] bg-white/[0.02] px-4 py-6"
            role="status"
          >
            <p className="text-sm text-white/50">{mm.mapActorsEmpty}</p>
            <p className="mt-2 text-sm text-white/40">{mm.mapEmptyHint}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  setActorFilter("all");
                  setRadiusKm(0);
                  setSearchQuery("");
                  setCountryFilter("");
                }}
                className="rounded-lg border border-white/[0.12] px-4 py-2 font-mono text-[11px] tracking-wide text-white/60 transition hover:border-white/25 hover:text-white"
              >
                {mm.mapEmptyWiden}
              </button>
              <Link
                href={GREEN_REGISTER_ROUTE}
                className="rounded-lg border border-green-royal/40 bg-green-royal/10 px-4 py-2 font-mono text-[11px] tracking-wide text-green-royal-bright transition hover:border-green-royal hover:text-white"
              >
                {mm.mapEmptyRegister} →
              </Link>
            </div>
          </div>
        ) : null}
        <div className="mt-4">
          <GreenMarketMap
            actors={filteredActors}
            center={mapCenter}
            radiusKm={radiusKm || undefined}
            fitGlobal
            actorTypeLabels={{
              producer: mm.actorTypes.producer,
              storer: mm.actorTypes.storer,
              charger: mm.actorTypes.charger,
              consumer: mm.actorTypes.consumer,
            }}
            popupViewSheetLabel={mm.popupViewSheet}
            mapAriaLabel={mm.mapTitle}
          />
          <GreenMarketMapLegend
            labels={{
              producer: mm.actorTypes.producer,
              storer: mm.actorTypes.storer,
              charger: mm.actorTypes.charger,
              consumer: mm.actorTypes.consumer,
            }}
          />
        </div>
      </section>

      <section className="mt-12">
        <GreenSectionTitle>{mm.actorPagesTitle}</GreenSectionTitle>
        <div className="mt-4 flex flex-wrap gap-3">
          {actorLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg border border-white/[0.12] px-4 py-2 font-mono text-[11px] tracking-wide text-white/60 transition hover:border-white/25 hover:text-white"
            >
              {link.label} →
            </Link>
          ))}
        </div>
      </section>

      <section id="offers" className="mt-14 scroll-mt-24">
        <GreenSectionTitle>{mm.listingsTitle}</GreenSectionTitle>
        <div className="mt-4 flex flex-wrap gap-3">
          <label className="flex flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              {mm.filters.energyType}
            </span>
            <select
              className={selectClass}
              value={energyFilter}
              onChange={(e) => setEnergyFilter(e.target.value as GreenMarketEnergyType | "all")}
            >
              {(Object.keys(mm.energyTypes) as Array<GreenMarketEnergyType | "all">).map((k) => (
                <option key={k} value={k}>
                  {mm.energyTypes[k]}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              {mm.filters.side}
            </span>
            <select
              className={selectClass}
              value={sideFilter}
              onChange={(e) => setSideFilter(e.target.value as GreenMarketOfferSide | "all")}
            >
              {(Object.keys(mm.sides) as Array<GreenMarketOfferSide | "all">).map((k) => (
                <option key={k} value={k}>
                  {mm.sides[k]}
                </option>
              ))}
            </select>
          </label>
        </div>

        <GreenPanel className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.08] font-mono text-[10px] uppercase tracking-wider text-white/40">
                <th className="px-4 py-3">{mm.table.actor}</th>
                <th className="px-4 py-3">{mm.table.side}</th>
                <th className="px-4 py-3">{mm.table.volume}</th>
                <th className="px-4 py-3">{mm.table.price}</th>
                <th className="px-4 py-3">{mm.table.location}</th>
                <th className="px-4 py-3">{mm.table.date}</th>
                <th className="px-4 py-3">{mm.table.status}</th>
              </tr>
            </thead>
            <tbody>
              {showPilotListings ? (
                GREEN_MARKET_PILOT_LISTINGS.map((listing) => (
                  <tr key={listing.id} className="border-b border-white/[0.06] text-white/70">
                    <td className="px-4 py-3 font-medium text-white/80">
                      <span className="inline-flex flex-wrap items-center gap-2">
                        {listing.actorName}
                        <span className="inline-block border border-amber-500/30 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide text-amber-200/70">
                          {mm.pilotBadge}
                        </span>
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {listing.side === "sell" ? mm.sides.sell : mm.sides.buy}
                    </td>
                    <td className="px-4 py-3 tabular-nums">{listing.volumeLabel}</td>
                    <td className="px-4 py-3 tabular-nums">{listing.priceLabel}</td>
                    <td className="px-4 py-3">{listing.location}</td>
                    <td className="px-4 py-3 text-white/40">—</td>
                    <td className="px-4 py-3 text-white/40">{mm.pilotBadge}</td>
                  </tr>
                ))
              ) : filteredOffers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-muted">
                    {mm.listingsEmpty}
                  </td>
                </tr>
              ) : (
                paginatedOffers.map((offer) => (
                  <tr key={offer.id} className="border-b border-white/[0.06] text-white/80">
                    <td className="px-4 py-3 font-medium text-white">
                      <Link
                        href={greenMarketOfferPath(offer.id)}
                        className="inline-flex flex-wrap items-center gap-2 transition hover:text-green-royal-bright"
                      >
                        {offer.actorName}
                        <GreenListingBadge tier={offer.listingTier} labels={mm.listingTier} />
                      </Link>
                    </td>
                    <td className="px-4 py-3">{mm.sides[offer.side]}</td>
                    <td className="px-4 py-3 tabular-nums">
                      {formatMarketNumber(offer.volumeKwh, locale)} kWh
                    </td>
                    <td className="px-4 py-3 tabular-nums">
                      {offer.pricePerKwh.toFixed(3)} €/kWh
                    </td>
                    <td className="px-4 py-3">
                      {formatGreenMarketLocation(offer.city, offer.country)}
                    </td>
                    <td className="px-4 py-3">{formatMarketDate(offer.createdAt, locale)}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex flex-col gap-1">
                        <span>{mm.status[offer.status]}</span>
                        <Link
                          href={greenMarketOfferPath(offer.id)}
                          className="font-mono text-[10px] uppercase tracking-wider text-emerald-500/70 hover:text-emerald-400"
                        >
                          {mm.viewOffer} →
                        </Link>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </GreenPanel>
        {showPilotListings ? (
          <p className="mt-3 text-sm text-white/45">{mm.pilotDataNote}</p>
        ) : null}
        {!showPilotListings && filteredOffers.length > OFFERS_PAGE_SIZE ? (
          <nav
            className="mt-4 flex flex-wrap items-center justify-between gap-3"
            aria-label={mm.pagination.page(safeOffersPage, offersTotalPages)}
          >
            <button
              type="button"
              disabled={safeOffersPage <= 1}
              onClick={() => setOffersPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-white/[0.12] px-4 py-2 font-mono text-[11px] tracking-wide text-white/60 transition hover:border-white/25 hover:text-white disabled:opacity-40"
            >
              {mm.pagination.prev}
            </button>
            <p className="font-mono text-[10px] uppercase tracking-wider text-white/45">
              {mm.pagination.page(safeOffersPage, offersTotalPages)}
            </p>
            <button
              type="button"
              disabled={safeOffersPage >= offersTotalPages}
              onClick={() => setOffersPage((p) => Math.min(offersTotalPages, p + 1))}
              className="rounded-lg border border-white/[0.12] px-4 py-2 font-mono text-[11px] tracking-wide text-white/60 transition hover:border-white/25 hover:text-white disabled:opacity-40"
            >
              {mm.pagination.next}
            </button>
          </nav>
        ) : null}
      </section>

      <div className="mt-10">
        <GreenOfferForm
          dbAvailable={snapshot.mode === "live"}
          onPublished={(offer) => setLocalOffers((prev) => [offer, ...prev])}
        />
      </div>

      <GreenDisclaimer>{disclaimer}</GreenDisclaimer>
      <GreenBackLink href={GREEN_ROUTE}>{mm.backLink}</GreenBackLink>
    </div>
  );
}
