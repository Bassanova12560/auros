"use client";

import Link from "next/link";
import { useCallback, useState } from "react";

import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { CompareAlertsForm } from "./CompareAlertsForm";
import { useComparatorPage } from "./useComparatorPage";
import {
  buildCompareDeskMailto,
} from "@/lib/comparators/desk-lead";
import {
  buildCompareDossierHref,
  buildCompareReportPath,
  buildCompareSelectionCsv,
  selectionHasGreenRelevant,
} from "@/lib/comparators/compare-report";
import type { HubProduct } from "@/lib/comparators/compare-hub";
import { GREEN_ROUTE } from "@/lib/green/constants";
import { getPartnerCode } from "@/lib/partner-attribution";
import { track } from "@/lib/analytics";

type CompareMonetizationCtasProps = {
  products: HubProduct[];
};

/**
 * Max 3 primary CTAs: Report · Dossier · Desk (soft).
 * Alerts + CSV + Green are secondary.
 */
export function CompareMonetizationCtas({ products }: CompareMonetizationCtasProps) {
  const { messages, locale } = useComparatorPage();
  const copy = messages.compareHub.monetization;
  const ids = products.map((p) => p.row.id);
  const [csvNote, setCsvNote] = useState<string | null>(null);

  const greenRelevant = selectionHasGreenRelevant(products);

  const handleCsv = useCallback(() => {
    try {
      const csv = buildCompareSelectionCsv(products);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `auros-compare-${ids.join("-").slice(0, 80)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      track("comparator_csv_export", {
        source: "compare_panel",
        count: ids.length,
      });
      setCsvNote(copy.csvDone);
      window.setTimeout(() => setCsvNote(null), 2500);
    } catch {
      setCsvNote(copy.csvLicenceHint);
    }
  }, [copy.csvDone, copy.csvLicenceHint, ids, products]);

  if (products.length < 2) return null;

  const reportHref = buildCompareReportPath(ids);
  const dossierHref = buildCompareDossierHref(ids);
  const deskHref = buildCompareDeskMailto({
    productIds: ids,
    productLabels: products.map((p) => `${p.row.platform} · ${p.row.product}`),
    locale,
    partnerCode: typeof window !== "undefined" ? getPartnerCode() : null,
  });

  return (
    <div className="mt-6 border-t border-white/[0.06] pt-5">
      <p className="font-mono text-[10px] uppercase tracking-wider text-white/35">
        {copy.eyebrow}
      </p>
      <p className="mt-1 max-w-2xl text-sm text-white/55">{copy.subtitle}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <PrimaryButton
          href={reportHref}
          className="!px-4 !py-2.5 !text-[11px]"
          onClick={() =>
            track("comparator_report_cta", {
              source: "compare_panel",
              count: ids.length,
            })
          }
        >
          {copy.reportCta}
        </PrimaryButton>
        <Link
          href={dossierHref}
          className="rounded-full border border-white/15 px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider text-white/75 transition hover:border-white/30 hover:text-white"
          onClick={() =>
            track("comparator_dossier_cta", {
              source: "compare_panel",
              count: ids.length,
            })
          }
        >
          {copy.dossierCta}
        </Link>
        <a
          href={deskHref}
          className="rounded-full border border-white/10 px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider text-white/45 transition hover:border-white/20 hover:text-white/70"
          onClick={() =>
            track("comparator_desk_cta", {
              source: "compare_panel",
              count: ids.length,
            })
          }
        >
          {copy.deskCta}
        </a>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
        <button
          type="button"
          onClick={handleCsv}
          className="font-mono text-[10px] text-white/40 underline-offset-2 transition hover:text-white/65 hover:underline"
        >
          {copy.csvCta}
        </button>
        {csvNote ? (
          <span className="font-mono text-[10px] text-white/35">{csvNote}</span>
        ) : (
          <span className="font-mono text-[10px] text-white/25">
            {copy.csvLicenceHint}
          </span>
        )}
      </div>

      {greenRelevant ? (
        <p className="mt-3">
          <Link
            href={GREEN_ROUTE}
            className="font-mono text-[11px] text-emerald-300/70 underline-offset-2 hover:text-emerald-200 hover:underline"
            onClick={() =>
              track("comparator_green_cta", {
                source: "compare_panel_green_relevant",
                count: ids.length,
              })
            }
          >
            {copy.greenUpsell}
          </Link>
        </p>
      ) : null}

      <CompareAlertsForm productIds={ids} />
    </div>
  );
}
