import { classifyLabelReminderBucket } from "./label-reminder-stats";
import type { GreenLabelApplicationExportRow } from "./label-applications-export";

export type GreenLabelExportFilter =
  | "all"
  | "pending"
  | "in_review"
  | "approved"
  | "rejected"
  | "incomplete"
  | "reminded_1"
  | "reminded_2";

export const GREEN_LABEL_EXPORT_FILTERS: readonly GreenLabelExportFilter[] = [
  "all",
  "pending",
  "in_review",
  "approved",
  "rejected",
  "incomplete",
  "reminded_1",
  "reminded_2",
] as const;

export function parseGreenLabelExportFilter(
  value: string | null | undefined
): GreenLabelExportFilter {
  if (
    value &&
    (GREEN_LABEL_EXPORT_FILTERS as readonly string[]).includes(value)
  ) {
    return value as GreenLabelExportFilter;
  }
  return "all";
}

type LabelExportFilterSource = GreenLabelApplicationExportRow & {
  contactName: string;
  website: string;
  country: string;
  description: string;
};

export function matchesGreenLabelExportFilter(
  row: LabelExportFilterSource,
  filter: GreenLabelExportFilter
): boolean {
  if (filter === "all") return true;

  if (
    filter === "pending" ||
    filter === "in_review" ||
    filter === "approved" ||
    filter === "rejected"
  ) {
    return row.status === filter;
  }

  const bucket = classifyLabelReminderBucket({
    project_name: row.org,
    contact_name: row.contactName,
    email: row.email,
    website: row.website,
    country: row.country,
    description: row.description,
    document_path: row.hasDocument ? "present" : null,
    reminder_sent_at: row.reminderSentAt,
    second_reminder_sent_at: row.secondReminderSentAt,
  });

  if (filter === "incomplete") return bucket === "pendingIncomplete";
  if (filter === "reminded_1") return bucket === "remindedOnce";
  if (filter === "reminded_2") return bucket === "remindedTwice";
  return true;
}
