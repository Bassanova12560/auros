import type { GreenCompareRow } from "./compare-data";
import { formatGreenTaxonomyScoreDisplay } from "./compare-taxonomy";
import type { GreenMessages } from "./i18n";
import type { GreenMarketOfferDetail } from "./market/offer-detail";
import { formatGreenMarketOfferTitle } from "./market/offer-detail";
import type { GreenMarketMessages } from "./market-i18n";
import {
  formatGreenMarketLocation,
  formatMarketDate,
  formatMarketNumber,
} from "./market-i18n";
import type { Locale } from "@/lib/i18n";

function csvEscape(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/** Client-safe CSV export for compare table rows. */
export function greenCompareRowsToCsv(
  rows: GreenCompareRow[],
  labels: GreenMessages["compare"]
): string {
  const header = [
    labels.table.project,
    labels.table.type,
    labels.table.token,
    labels.table.yield,
    labels.table.impact,
    labels.table.taxonomy,
    labels.table.label,
    labels.table.source,
    labels.table.reviewed,
  ]
    .map(csvEscape)
    .join(",");

  const body = rows.map((row) =>
    [
      row.name,
      labels.projectTypes[row.type],
      row.token,
      row.yieldNote,
      row.impactNote,
      formatGreenTaxonomyScoreDisplay(row.green_taxonomy_score),
      labels.labelStatus[row.labelStatus],
      row.sourceLabel,
      row.lastReviewed,
    ]
      .map(csvEscape)
      .join(",")
  );

  return [header, ...body].join("\n");
}

/** CSV rows for selected marketplace offers on /green/compare. */
export function greenCompareMarketOffersToCsv(
  offers: GreenMarketOfferDetail[],
  compareLabels: GreenMessages["compare"],
  marketLabels: GreenMarketMessages["market"],
  locale: Locale
): string {
  if (offers.length === 0) return "";

  const header = [
    marketLabels.table.actor,
    compareLabels.marketExport.energy,
    marketLabels.table.side,
    marketLabels.table.volume,
    marketLabels.table.price,
    marketLabels.table.location,
    compareLabels.marketExport.tier,
    marketLabels.table.date,
  ]
    .map(csvEscape)
    .join(",");

  const body = offers.map((offer) =>
    [
      formatGreenMarketOfferTitle(offer, locale),
      marketLabels.energyTypes[offer.energyType],
      marketLabels.sides[offer.side],
      `${formatMarketNumber(offer.volumeKwh, locale)} kWh`,
      `${offer.pricePerKwh.toFixed(3)} €/kWh`,
      formatGreenMarketLocation(offer.city, offer.country),
      marketLabels.listingTier[offer.listingTier],
      formatMarketDate(offer.createdAt, locale),
    ]
      .map(csvEscape)
      .join(",")
  );

  return [compareLabels.marketExport.sectionTitle, header, ...body].join("\n");
}

/** Combined RWA compare + marketplace offers CSV export. */
export function greenCompareFullToCsv(
  rows: GreenCompareRow[],
  offers: GreenMarketOfferDetail[],
  compareLabels: GreenMessages["compare"],
  marketLabels: GreenMarketMessages["market"],
  locale: Locale
): string {
  const parts: string[] = [];

  if (rows.length > 0) {
    parts.push(greenCompareRowsToCsv(rows, compareLabels));
  }

  const marketCsv = greenCompareMarketOffersToCsv(
    offers,
    compareLabels,
    marketLabels,
    locale
  );
  if (marketCsv) {
    if (parts.length > 0) parts.push("");
    parts.push(marketCsv);
  }

  return parts.join("\n");
}

export function downloadGreenCompareCsv(csv: string, filename = "auros-green-compare.csv"): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
