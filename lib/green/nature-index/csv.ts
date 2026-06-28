import type { NatureIndexPayload } from "./types";

export function natureIndexToCsv(payload: NatureIndexPayload): string {
  const lines = ["rank,name,type,nature_score,cqs,ecosystem,country"];
  for (const row of payload.entries) {
    lines.push(
      [
        row.rank,
        `"${row.name.replace(/"/g, '""')}"`,
        row.type,
        row.nature_score,
        row.cqs ?? "",
        `"${row.ecosystem.replace(/"/g, '""')}"`,
        row.country_hint ?? "",
      ].join(",")
    );
  }
  return lines.join("\n");
}

export function downloadNatureIndexCsv(csv: string, editionIso: string): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `AUROS_Nature_Score_Index_${editionIso.slice(0, 7)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
