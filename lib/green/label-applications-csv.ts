import type { GreenLabelApplicationExportRow } from "./label-applications-export";

function csvEscape(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

const CSV_HEADERS = [
  "id",
  "org",
  "email",
  "status",
  "preferred_locale",
  "reminder_sent_at",
  "second_reminder_sent_at",
  "document_path",
  "created_at",
] as const;

export function greenLabelApplicationsToCsv(
  rows: GreenLabelApplicationExportRow[]
): string {
  const header = CSV_HEADERS.join(",");
  const body = rows.map((row) =>
    [
      row.id,
      row.org,
      row.email,
      row.status,
      row.preferredLocale ?? "",
      row.reminderSentAt ?? "",
      row.secondReminderSentAt ?? "",
      row.hasDocument ? "yes" : "no",
      row.createdAt,
    ]
      .map((v) => csvEscape(String(v)))
      .join(",")
  );
  return [header, ...body].join("\n");
}

export function suggestedGreenLabelApplicationsCsvFilename(): string {
  const date = new Date().toISOString().slice(0, 10);
  return `auros-green-label-applications_${date}.csv`;
}
