import type { RwaIndexPayload } from "./types";

function csvEscape(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function formatApy(value: number | null): string {
  if (value === null) return "";
  return value.toFixed(2);
}

export function rwaIndexToCsv(payload: RwaIndexPayload, categoryLabels: Record<string, string>): string {
  const header = [
    "edition",
    "category",
    "product_count",
    "products_with_yield",
    "apy_min_pct",
    "apy_max_pct",
    "apy_median_pct",
    "apy_average_pct",
    "illustrative",
    "source_note",
    "compare_href",
  ]
    .map(csvEscape)
    .join(",");

  const body = payload.categories.map((row) =>
    [
      payload.editionIso,
      categoryLabels[row.id] ?? row.id,
      String(row.stats.productCount),
      String(row.stats.productsWithYield),
      formatApy(row.stats.min),
      formatApy(row.stats.max),
      formatApy(row.stats.median),
      formatApy(row.stats.average),
      row.isIllustrative ? "yes" : "no",
      row.sourceNote,
      row.compareHref,
    ]
      .map(csvEscape)
      .join(",")
  );

  const meta = [
    "",
    csvEscape("meta_key"),
    csvEscape("meta_value"),
    "",
    csvEscape("generated_at"),
    csvEscape(payload.generatedAt),
    "",
    csvEscape("data_fetched_at"),
    csvEscape(payload.dataFetchedAt),
    "",
    csvEscape("total_products"),
    csvEscape(String(payload.totalProducts)),
    "",
    csvEscape("active_jurisdictions"),
    csvEscape(String(payload.activeJurisdictions)),
  ].join(",");

  return [header, ...body, "", "# metadata", meta].join("\n");
}

export function downloadRwaIndexCsv(csv: string, editionIso: string): void {
  const month = editionIso.slice(0, 7);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `auros-rwa-index-${month}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
}
