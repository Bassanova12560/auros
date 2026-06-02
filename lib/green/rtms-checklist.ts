import { GREEN_RTMS_PILLARS } from "./constants";
import type { GreenMessages } from "./i18n";

function csvEscape(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/** Client-safe RTMS checklist CSV from standards pillar bullets. */
export function greenRtmsChecklistToCsv(messages: GreenMessages["standards"]): string {
  const t = messages.checklistTable;
  const header = [t.pillar, t.criterion, t.status, t.notes].map(csvEscape).join(",");

  const rows: string[] = [];
  for (const pillar of GREEN_RTMS_PILLARS) {
    const p = messages.pillars[pillar];
    p.bullets.forEach((bullet, index) => {
      rows.push(
        [
          index === 0 ? p.name : "",
          bullet,
          "",
          "",
        ]
          .map(csvEscape)
          .join(",")
      );
    });
  }

  return [header, ...rows].join("\n");
}

export function downloadGreenRtmsChecklistCsv(
  csv: string,
  filename = "auros-green-rtms-checklist.csv"
): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
