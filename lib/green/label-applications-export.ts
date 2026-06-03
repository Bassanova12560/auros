import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import {
  matchesGreenLabelExportFilter,
  parseGreenLabelExportFilter,
  type GreenLabelExportFilter,
} from "./label-export-filter";

export type GreenLabelApplicationExportRow = {
  id: string;
  org: string;
  email: string;
  status: string;
  preferredLocale: string | null;
  reminderSentAt: string | null;
  secondReminderSentAt: string | null;
  hasDocument: boolean;
  createdAt: string;
};

function getAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SECRET_KEY?.trim();
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export { parseGreenLabelExportFilter, type GreenLabelExportFilter };

/** Label applications for ops CSV export, optionally filtered by status / relance bucket. */
export async function listGreenLabelApplicationsForExport(
  filterInput: string | null | undefined = "all"
): Promise<GreenLabelApplicationExportRow[]> {
  const filter = parseGreenLabelExportFilter(filterInput);
  const supabase = getAdminClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("green_label_applications")
    .select(
      "id,project_name,contact_name,email,website,country,description,status,preferred_locale,reminder_sent_at,second_reminder_sent_at,document_path,created_at"
    )
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("[listGreenLabelApplicationsForExport]", error);
    return [];
  }

  return data
    .map((row) => ({
      id: String(row.id),
      org: String(row.project_name),
      email: String(row.email),
      status: String(row.status),
      preferredLocale: row.preferred_locale ? String(row.preferred_locale) : null,
      reminderSentAt: row.reminder_sent_at ? String(row.reminder_sent_at) : null,
      secondReminderSentAt: row.second_reminder_sent_at
        ? String(row.second_reminder_sent_at)
        : null,
      hasDocument: Boolean(row.document_path),
      createdAt: String(row.created_at),
      contactName: String(row.contact_name ?? ""),
      website: String(row.website ?? ""),
      country: String(row.country ?? ""),
      description: String(row.description ?? ""),
    }))
    .filter((row) => matchesGreenLabelExportFilter(row, filter))
    .map(({ contactName: _c, website: _w, country: _co, description: _d, ...row }) => row);
}

/** @deprecated Use listGreenLabelApplicationsForExport("all") */
export async function listAllGreenLabelApplicationsForExport(): Promise<
  GreenLabelApplicationExportRow[]
> {
  return listGreenLabelApplicationsForExport("all");
}
