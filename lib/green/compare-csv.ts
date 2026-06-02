import type { GreenCompareRow } from "./compare-data";
import type { GreenMessages } from "./i18n";

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
      labels.labelStatus[row.labelStatus],
      row.sourceLabel,
      row.lastReviewed,
    ]
      .map(csvEscape)
      .join(",")
  );

  return [header, ...body].join("\n");
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
