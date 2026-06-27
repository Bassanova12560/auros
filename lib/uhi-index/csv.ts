import type { UhiIndexPayload } from "./types";

export function uhiIndexToCsv(
  payload: UhiIndexPayload,
  headers: {
    rank: string;
    name: string;
    segment: string;
    uhi: string;
    watt: string;
    taxonomy: string;
    yield: string;
    mom: string;
    source: string;
  }
): string {
  const lines = [
    [
      headers.rank,
      headers.name,
      headers.segment,
      headers.uhi,
      headers.watt,
      headers.taxonomy,
      headers.yield,
      headers.mom,
      headers.source,
    ].join(","),
  ];

  for (const row of payload.entries) {
    lines.push(
      [
        row.rank,
        `"${row.name.replace(/"/g, '""')}"`,
        row.segment,
        row.uhi_score,
        row.watt_score ?? "",
        row.taxonomy_score ?? "",
        row.indicative_yield_pct ?? "",
        row.mom_pct ?? "",
        row.sourceUrl,
      ].join(",")
    );
  }

  return lines.join("\n");
}

export function downloadUhiIndexCsv(csv: string, editionIso: string): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `AUROS_UHI_Index_${editionIso.slice(0, 7)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
