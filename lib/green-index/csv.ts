import type { GreenIndexPayload } from "./types";

export function greenIndexToCsv(
  payload: GreenIndexPayload,
  headers: {
    rank: string;
    name: string;
    type: string;
    composite: string;
    taxonomy: string;
    cqs: string;
    watt: string;
    mom: string;
    source: string;
  }
): string {
  const lines = [
    [
      headers.rank,
      headers.name,
      headers.type,
      headers.composite,
      headers.taxonomy,
      headers.cqs,
      headers.watt,
      headers.mom,
      headers.source,
    ].join(","),
  ];

  for (const row of payload.entries) {
    lines.push(
      [
        row.rank,
        `"${row.name.replace(/"/g, '""')}"`,
        row.type,
        row.composite_score,
        row.taxonomy_score ?? "",
        row.carbon_quality_score ?? "",
        row.watt_score ?? "",
        row.mom_pct ?? "",
        row.sourceUrl,
      ].join(",")
    );
  }

  return lines.join("\n");
}

export function downloadGreenIndexCsv(csv: string, editionIso: string): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `AUROS_Green_Index_${editionIso.slice(0, 7)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
