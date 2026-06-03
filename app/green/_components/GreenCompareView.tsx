"use client";



import Link from "next/link";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useCallback, useEffect, useMemo, useState } from "react";



import { useLocale } from "@/app/_components/i18n/LocaleProvider";

import {

  GREEN_COMPARE_ROWS,

  GREEN_ROUTE,

  AUROS_COMPARE_ROUTE,

  GREEN_REGISTRY_ROUTE,

  getGreenMessages,

  greenVerifyPath,

} from "@/lib/green";

import {

  buildGreenCompareSnapshotUrl,

} from "@/lib/green/compare-snapshot";

import {

  downloadGreenCompareCsv,

  greenCompareFullToCsv,

} from "@/lib/green/compare-csv";

import type { GreenRegistryProjectRow } from "@/lib/green/green-registry";

import type { GreenMarketOfferDetail } from "@/lib/green/market/offer-detail";

import {

  GREEN_COMPARE_COUNTRIES_URL_PARAM,

  GREEN_COMPARE_RWA_URL_PARAM,

  buildGreenCompareShareUrl,

  compareRwaRowIdsForShare,

  encodeCompareCountriesParam,

  encodeCompareRwaRowIdsParam,

  normalizeCompareCountries,

  normalizeCompareRwaRowIds,

  parseCompareCountriesParam,

  parseCompareRwaRowIdsParam,

  projectMatchesCompareCountries,

} from "@/lib/green/market/compare-selection";

import { getGreenMarketMessages } from "@/lib/green/market-i18n";



import { GreenCompareOffersSection } from "./market/GreenCompareOffersSection";

import {

  GreenBackLink,

  GreenDisclaimer,

  GreenPageHeader,

  GreenPanel,

  GreenSectionTitle,

  GreenTierBadge,

} from "./green-ui";



type Props = {

  registryProjects: GreenRegistryProjectRow[];

  initialOfferIds?: string[];

  initialCountries?: string[];

  initialRwaRowIds?: string[];

  resolvedOffers?: GreenMarketOfferDetail[];

  snapshotId?: string;

  snapshotExpiresAt?: string;

};



type PdfState = "idle" | "generating" | "error";



function formatSnapshotExpiry(iso: string, locale: string): string {

  try {

    return new Date(iso).toLocaleDateString(

      locale === "en" ? "en-GB" : locale === "es" ? "es-ES" : "fr-FR",

      { year: "numeric", month: "short", day: "numeric" }

    );

  } catch {

    return iso.slice(0, 10);

  }

}



function labelBadgeClass(status: string): string {

  switch (status) {

    case "certified":

      return "border-emerald-400 text-emerald-400";

    case "in_review":

      return "border-neutral-500 text-neutral-400";

    case "reference":

      return "border-neutral-600 text-neutral-500";

    default:

      return "border-neutral-700 text-neutral-500";

  }

}



export function GreenCompareView({

  registryProjects,

  initialOfferIds = [],

  initialCountries = [],

  initialRwaRowIds = [],

  resolvedOffers = [],

  snapshotId,

  snapshotExpiresAt,

}: Props) {

  const { locale } = useLocale();

  const m = getGreenMessages(locale);

  const c = m.compare;

  const r = m.registry;

  const allRwaIds = useMemo(() => GREEN_COMPARE_ROWS.map((row) => row.id), []);

  const [selectedRwaIds, setSelectedRwaIds] = useState<string[]>(() => {

    const fromInitial = normalizeCompareRwaRowIds(initialRwaRowIds);

    if (fromInitial.length > 0) return fromInitial;

    return allRwaIds;

  });

  const visibleRows = useMemo(

    () => GREEN_COMPARE_ROWS.filter((row) => selectedRwaIds.includes(row.id)),

    [selectedRwaIds]

  );

  const [pdfState, setPdfState] = useState<PdfState>("idle");

  const [selectedOffers, setSelectedOffers] = useState<GreenMarketOfferDetail[]>([]);

  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  const [snapshotState, setSnapshotState] = useState<"idle" | "saving" | "error">("idle");

  const [snapshotRenewState, setSnapshotRenewState] = useState<"idle" | "renewing" | "error">("idle");

  const [snapshotExpiryLabel, setSnapshotExpiryLabel] = useState<string | null>(
    snapshotExpiresAt ?? null
  );

  const searchParams = useSearchParams();

  const pathname = usePathname();

  const router = useRouter();

  const [selectedCountries, setSelectedCountries] = useState<string[]>(() =>

    normalizeCompareCountries(initialCountries)

  );

  const [urlReady, setUrlReady] = useState(false);

  const mm = getGreenMarketMessages(locale).market;



  useEffect(() => {

    const fromUrlCountries = parseCompareCountriesParam(

      searchParams.get(GREEN_COMPARE_COUNTRIES_URL_PARAM)

    );

    if (fromUrlCountries.length > 0) {

      setSelectedCountries(fromUrlCountries);

    } else if (initialCountries.length > 0) {

      setSelectedCountries(normalizeCompareCountries(initialCountries));

    } else {

      setSelectedCountries([]);

    }

    const fromUrlRwa = parseCompareRwaRowIdsParam(searchParams.get(GREEN_COMPARE_RWA_URL_PARAM));

    if (fromUrlRwa.length > 0) {

      setSelectedRwaIds(fromUrlRwa);

    } else if (initialRwaRowIds.length > 0) {

      setSelectedRwaIds(normalizeCompareRwaRowIds(initialRwaRowIds));

    }

    setUrlReady(true);

  }, [searchParams, initialRwaRowIds, initialCountries]);



  useEffect(() => {

    if (!urlReady) return;

    const params = new URLSearchParams(searchParams.toString());

    const encoded = encodeCompareCountriesParam(selectedCountries);

    if (encoded) {

      params.set(GREEN_COMPARE_COUNTRIES_URL_PARAM, encoded);

    } else {

      params.delete(GREEN_COMPARE_COUNTRIES_URL_PARAM);

    }

    const next = params.toString();

    if (next !== searchParams.toString()) {

      router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });

    }

  }, [selectedCountries, urlReady, pathname, router, searchParams]);



  useEffect(() => {

    if (!urlReady) return;

    const params = new URLSearchParams(searchParams.toString());

    const encodedRwa = encodeCompareRwaRowIdsParam(compareRwaRowIdsForShare(selectedRwaIds));

    if (encodedRwa) {

      params.set(GREEN_COMPARE_RWA_URL_PARAM, encodedRwa);

    } else {

      params.delete(GREEN_COMPARE_RWA_URL_PARAM);

    }

    const next = params.toString();

    if (next !== searchParams.toString()) {

      router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });

    }

  }, [selectedRwaIds, urlReady, pathname, router, searchParams]);



  const toggleRwaRow = useCallback((id: string) => {

    setSelectedRwaIds((prev) => {

      if (prev.includes(id)) return prev.filter((entry) => entry !== id);

      return normalizeCompareRwaRowIds([...prev, id]);

    });

  }, []);



  const selectAllRwaRows = useCallback(() => {

    setSelectedRwaIds(allRwaIds);

  }, [allRwaIds]);



  const clearRwaRows = useCallback(() => {

    setSelectedRwaIds([]);

  }, []);



  const availableCountries = useMemo(() => {

    const fromRegistry = registryProjects.map((p) => p.country);

    const fromOffers = [

      ...resolvedOffers.map((o) => o.country),

      ...selectedOffers.map((o) => o.country),

    ];

    return normalizeCompareCountries([...fromRegistry, ...fromOffers, ...selectedCountries]);

  }, [registryProjects, resolvedOffers, selectedOffers, selectedCountries]);



  const filteredRegistryProjects = useMemo(

    () =>

      registryProjects.filter((proj) =>

        projectMatchesCompareCountries(proj.country, selectedCountries)

      ),

    [registryProjects, selectedCountries]

  );



  const toggleCountry = useCallback((country: string) => {

    setSelectedCountries((prev) => {

      const key = country.trim().toLowerCase();

      if (!key) return prev;

      const active = prev.some((c) => c.trim().toLowerCase() === key);

      if (active) return prev.filter((c) => c.trim().toLowerCase() !== key);

      return normalizeCompareCountries([...prev, country]);

    });

  }, []);



  const clearCountries = useCallback(() => {

    setSelectedCountries([]);

  }, []);



  const shareCountries = useMemo(() => {

    if (selectedCountries.length > 0) return selectedCountries;

    return normalizeCompareCountries(selectedOffers.map((offer) => offer.country));

  }, [selectedCountries, selectedOffers]);



  const canExport = visibleRows.length > 0 || selectedOffers.length > 0;

  const rwaForShare = useMemo(

    () => compareRwaRowIdsForShare(selectedRwaIds),

    [selectedRwaIds]

  );

  const hasShareableState =

    selectedOffers.length > 0 || shareCountries.length > 0 || rwaForShare.length > 0;



  const handleExportCsv = useCallback(() => {

    if (!canExport) return;

    const csv = greenCompareFullToCsv(visibleRows, selectedOffers, c, mm, locale);

    downloadGreenCompareCsv(csv);

  }, [canExport, visibleRows, selectedOffers, c, mm, locale]);



  const handleExportPdf = useCallback(async () => {

    if (!canExport) return;

    setPdfState("generating");

    try {

      const { generateGreenComparePDF, suggestedGreenCompareFilename } =

        await import("@/lib/green/compare-pdf");

      const blob = await generateGreenComparePDF(visibleRows, c, locale, selectedOffers, mm);

      const url = URL.createObjectURL(blob);

      const anchor = document.createElement("a");

      anchor.href = url;

      anchor.download = suggestedGreenCompareFilename(locale);

      document.body.appendChild(anchor);

      anchor.click();

      anchor.remove();

      setTimeout(() => URL.revokeObjectURL(url), 0);

      setPdfState("idle");

    } catch (err) {

      console.error("[green/compare] PDF export failed", err);

      setPdfState("error");

    }

  }, [canExport, visibleRows, c, locale, selectedOffers, mm]);



  const handleShareLink = useCallback(async () => {

    const url = buildGreenCompareShareUrl({

      offerIds: selectedOffers.map((offer) => offer.id),

      countries: shareCountries,

      rwaRowIds: selectedRwaIds,

      origin: typeof window !== "undefined" ? window.location.origin : "",

    });

    try {

      await navigator.clipboard.writeText(url);

      setShareFeedback(c.shareCopied);

      window.setTimeout(() => setShareFeedback(null), 2500);

    } catch {

      setShareFeedback(url);

    }

  }, [selectedOffers, shareCountries, selectedRwaIds, c.shareCopied]);



  const handleSaveSnapshot = useCallback(async () => {

    if (!hasShareableState) return;

    setSnapshotState("saving");

    try {

      const res = await fetch("/api/green/compare-snapshot", {

        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({

          countries: shareCountries,

          offerIds: selectedOffers.map((offer) => offer.id),

          rwaRowIds: rwaForShare,

        }),

      });

      const json = (await res.json()) as { ok?: boolean; id?: string; error?: string };

      if (!res.ok || !json.ok || !json.id) {

        setSnapshotState("error");

        setShareFeedback(c.snapshotError);

        return;

      }

      const url = buildGreenCompareSnapshotUrl(

        json.id,

        typeof window !== "undefined" ? window.location.origin : ""

      );

      await navigator.clipboard.writeText(url);

      setSnapshotState("idle");

      setShareFeedback(c.snapshotCopied);

      window.setTimeout(() => setShareFeedback(null), 2500);

    } catch {

      setSnapshotState("error");

      setShareFeedback(c.snapshotError);

    }

  }, [hasShareableState, selectedOffers, shareCountries, rwaForShare, c.snapshotCopied, c.snapshotError]);



  const handleRenewSnapshot = useCallback(async () => {

    if (!snapshotId) return;

    setSnapshotRenewState("renewing");

    try {

      const res = await fetch("/api/green/compare-snapshot/renew", {

        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({ id: snapshotId }),

      });

      const json = (await res.json()) as { ok?: boolean; expiresAt?: string };

      if (!res.ok || !json.ok || !json.expiresAt) {

        setSnapshotRenewState("error");

        return;

      }

      setSnapshotExpiryLabel(json.expiresAt);

      setSnapshotRenewState("idle");

      setShareFeedback(c.snapshotRenewed);

      window.setTimeout(() => setShareFeedback(null), 2500);

    } catch {

      setSnapshotRenewState("error");

    }

  }, [snapshotId, c.snapshotRenewed]);



  const pdfLabel =

    pdfState === "generating"

      ? c.exportPdfGenerating

      : pdfState === "error"

        ? c.exportPdfRetry

        : c.exportPdf;



  return (

    <div className="page-inner page-inner--6xl mx-auto px-4 pb-20 pt-12 md:px-6 md:pt-14">

      <GreenPageHeader eyebrow={c.eyebrow} title={c.title} intro={c.intro} compact />

      {snapshotId ? (

        <div className="mt-4 flex flex-wrap items-center gap-3">

          <p className="font-mono text-[10px] uppercase tracking-wider text-emerald-500/80">

            {c.snapshotLoaded(snapshotId)}

          </p>

          {snapshotExpiryLabel ? (

            <p className="font-mono text-[10px] uppercase tracking-wider text-neutral-500">

              {c.snapshotExpiresAt(formatSnapshotExpiry(snapshotExpiryLabel, locale))}

            </p>

          ) : null}

          <button

            type="button"

            onClick={() => void handleRenewSnapshot()}

            disabled={snapshotRenewState === "renewing"}

            className="rounded-full border border-emerald-500/30 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-emerald-500 transition hover:border-emerald-400 hover:text-emerald-400 disabled:cursor-wait disabled:opacity-60"

          >

            {snapshotRenewState === "renewing"

              ? c.snapshotRenewing

              : snapshotRenewState === "error"

                ? c.snapshotRenewError

                : c.snapshotRenewCta}

          </button>

        </div>

      ) : null}

      <p className="mt-4 max-w-3xl border-l border-emerald-500/40 pl-5 text-xs leading-relaxed text-neutral-500">

        {c.disclaimer}

      </p>



      <GreenCompareOffersSection

        initialOfferIds={initialOfferIds}

        resolvedOffers={resolvedOffers}

        onSelectedOffersChange={setSelectedOffers}

        shareCountries={shareCountries}

        shareRwaRowIds={selectedRwaIds}

      />



      {availableCountries.length > 0 ? (

        <GreenPanel className="mt-10">

          <div className="p-6 md:p-8">

            <p className="font-mono text-[10px] uppercase tracking-wider text-emerald-500">

              {c.countryFilterLabel}

            </p>

            <div className="mt-3 flex flex-wrap gap-2">

              <button

                type="button"

                onClick={clearCountries}

                className={`rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition ${

                  selectedCountries.length === 0

                    ? "border-emerald-400 bg-emerald-500/10 text-emerald-400"

                    : "border-emerald-500/30 text-emerald-500/70 hover:border-emerald-400/60 hover:text-emerald-400"

                }`}

              >

                {c.countryFilterClear}

              </button>

              {availableCountries.map((country) => {

                const active = selectedCountries.some(

                  (c) => c.trim().toLowerCase() === country.trim().toLowerCase()

                );

                return (

                  <button

                    key={country}

                    type="button"

                    onClick={() => toggleCountry(country)}

                    className={`rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition ${

                      active

                        ? "border-emerald-400 bg-emerald-500/10 text-emerald-400"

                        : "border-emerald-500/30 text-emerald-500/70 hover:border-emerald-400/60 hover:text-emerald-400"

                    }`}

                  >

                    {country}

                  </button>

                );

              })}

            </div>

          </div>

        </GreenPanel>

      ) : null}



      {registryProjects.length > 0 ? (

        <GreenPanel className="mt-10">

          <div className="p-6 md:p-8">

            <GreenSectionTitle>{c.registrySectionTitle}</GreenSectionTitle>

            <p className="mt-3 text-sm text-neutral-400">{c.registrySectionIntro}</p>

            {filteredRegistryProjects.length === 0 ? (

              <p className="mt-4 text-sm text-neutral-500">{c.countryFilterEmpty}</p>

            ) : (

              <ul className="mt-6 divide-y divide-emerald-500/20">

                {filteredRegistryProjects.map((proj) => (

                  <li

                    key={proj.id}

                    className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0"

                  >

                    <div>

                      <p className="font-medium text-emerald-400">{proj.name}</p>

                      <p className="mt-1 text-xs text-neutral-500">

                        {c.projectTypes[proj.projectType]} · {proj.country}

                      </p>

                    </div>

                    <div className="flex items-center gap-3">

                      <GreenTierBadge

                        tier={proj.labelTier}

                        verifiedLabel={r.tierVerified}

                        pilotLabel={r.tierPilot}

                      />

                      <Link

                        href={greenVerifyPath(proj.verifyToken)}

                        className="font-mono text-[10px] uppercase tracking-wider text-emerald-500 hover:text-emerald-400"

                      >

                        {r.verifyLink} →

                      </Link>

                    </div>

                  </li>

                ))}

              </ul>

            )}

          </div>

        </GreenPanel>

      ) : null}



      <GreenPanel className="mt-10 overflow-hidden">

        <div className="border-b border-emerald-500/20 px-6 py-4 md:px-8">

          <div className="flex flex-wrap items-center gap-3">

            <p className="font-mono text-[10px] uppercase tracking-wider text-emerald-500">

              {c.rwaRowInclude}

            </p>

            <button

              type="button"

              onClick={selectAllRwaRows}

              className={`rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition ${

                selectedRwaIds.length === allRwaIds.length

                  ? "border-emerald-400 bg-emerald-500/10 text-emerald-400"

                  : "border-emerald-500/30 text-emerald-500/70 hover:border-emerald-400/60 hover:text-emerald-400"

              }`}

            >

              {c.rwaRowSelectAll}

            </button>

            <button

              type="button"

              onClick={clearRwaRows}

              className={`rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition ${

                selectedRwaIds.length === 0

                  ? "border-emerald-400 bg-emerald-500/10 text-emerald-400"

                  : "border-emerald-500/30 text-emerald-500/70 hover:border-emerald-400/60 hover:text-emerald-400"

              }`}

            >

              {c.rwaRowSelectClear}

            </button>

          </div>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[720px] border-collapse text-left text-sm">

            <thead>

              <tr className="border-b border-emerald-500 font-mono text-[10px] uppercase tracking-wider text-emerald-500">

                <th className="w-10 px-4 py-4">

                  <span className="sr-only">{c.rwaRowInclude}</span>

                </th>

                <th className="py-4 pr-4">{c.table.project}</th>

                <th className="py-4 pr-4">{c.table.type}</th>

                <th className="py-4 pr-4">{c.table.token}</th>

                <th className="py-4 pr-4">{c.table.yield}</th>

                <th className="py-4 pr-4">{c.table.impact}</th>

                <th className="py-4 pr-4">{c.table.label}</th>

                <th className="px-6 py-4">{c.table.source}</th>

              </tr>

            </thead>

            <tbody>

              {visibleRows.length === 0 ? (

                <tr>

                  <td colSpan={8} className="px-6 py-8 text-neutral-500">

                    {c.emptyNote}

                  </td>

                </tr>

              ) : (

                visibleRows.map((row) => (

                  <tr

                    key={row.id}

                    className="border-b border-emerald-500/20 text-neutral-300"

                  >

                    <td className="px-4 py-4">

                      <input

                        type="checkbox"

                        checked={selectedRwaIds.includes(row.id)}

                        onChange={() => toggleRwaRow(row.id)}

                        aria-label={`${c.rwaRowInclude} ${row.name}`}

                        className="size-4 rounded border-emerald-500/40 bg-black accent-emerald-500"

                      />

                    </td>

                    <td className="py-4 pr-4 font-medium text-emerald-400">{row.name}</td>

                    <td className="py-4 pr-4 text-neutral-400">{c.projectTypes[row.type]}</td>

                    <td className="py-4 pr-4 font-mono text-xs text-neutral-400">{row.token}</td>

                    <td className="py-4 pr-4 text-xs text-neutral-500">{row.yieldNote}</td>

                    <td className="py-4 pr-4 text-xs text-neutral-500">{row.impactNote}</td>

                    <td className="py-4 pr-4">

                      <span

                        className={`inline-block rounded border px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wide ${labelBadgeClass(row.labelStatus)}`}

                      >

                        {c.labelStatus[row.labelStatus]}

                      </span>

                    </td>

                    <td className="px-6 py-4">

                      <a

                        href={row.sourceUrl}

                        target="_blank"

                        rel="noopener noreferrer"

                        className="text-emerald-500 hover:text-emerald-400"

                      >

                        {row.sourceLabel}

                      </a>

                      <p className="mt-1 font-mono text-[9px] text-neutral-600">

                        {c.table.reviewed}: {row.lastReviewed}

                      </p>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </GreenPanel>



      <div className="mt-8 flex flex-wrap items-center gap-4">

        {canExport ? (

          <>

            <button

              type="button"

              onClick={handleExportCsv}

              className="rounded-lg border border-emerald-500/40 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-emerald-500 transition hover:border-emerald-400 hover:text-emerald-400"

            >

              {c.exportCsv}

            </button>

            <button

              type="button"

              onClick={() => void handleExportPdf()}

              disabled={pdfState === "generating"}

              className="rounded-lg border border-emerald-500/40 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-emerald-500 transition hover:border-emerald-400 hover:text-emerald-400 disabled:cursor-wait disabled:opacity-60"

            >

              {pdfLabel}

            </button>

          </>

        ) : null}

        {hasShareableState ? (

          <>

            <button

              type="button"

              onClick={() => void handleShareLink()}

              className="rounded-lg border border-emerald-500/40 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-emerald-500 transition hover:border-emerald-400 hover:text-emerald-400"

            >

              {c.copyCompareLink}

            </button>

            <button

              type="button"

              onClick={() => void handleSaveSnapshot()}

              disabled={snapshotState === "saving"}

              className="rounded-lg border border-emerald-500/40 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-emerald-500 transition hover:border-emerald-400 hover:text-emerald-400 disabled:cursor-wait disabled:opacity-60"

            >

              {snapshotState === "saving" ? c.snapshotSaving : c.saveSnapshotLink}

            </button>

          </>

        ) : null}

        {shareFeedback ? (

          <span className="font-mono text-[10px] text-neutral-500">{shareFeedback}</span>

        ) : null}

        <Link

          href={AUROS_COMPARE_ROUTE}

          className="font-mono text-[11px] uppercase tracking-wider text-emerald-500 hover:text-emerald-400"

        >

          {c.aurosCompareCta} →

        </Link>

        <Link

          href={GREEN_REGISTRY_ROUTE}

          className="font-mono text-[11px] uppercase tracking-wider text-emerald-500 hover:text-emerald-400"

        >

          {c.registryCta} →

        </Link>

      </div>



      <GreenDisclaimer>{m.disclaimer}</GreenDisclaimer>

      <GreenBackLink href={GREEN_ROUTE}>{c.backLink}</GreenBackLink>

    </div>

  );

}

