import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { sendGreenLabelIncompleteReminder } from "@/lib/emails/send";
import { absoluteUrl } from "@/lib/comparators/site";
import { GREEN_LABEL_ROUTE } from "./constants";
import { normalizeGreenLabelPreferredLocale } from "./label-locale";
import type { Locale } from "@/lib/i18n";

const REMINDER_AFTER_MS = 24 * 60 * 60 * 1000;

function getAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SECRET_KEY?.trim();
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export type GreenLabelApplicationIncompleteRow = {
  id: string;
  projectName: string;
  contactName: string;
  email: string;
  preferredLocale: Locale;
  createdAt: string;
  missingDocument: boolean;
  missingFields: string[];
};

export function isGreenLabelApplicationIncomplete(row: {
  project_name?: string | null;
  contact_name?: string | null;
  email?: string | null;
  website?: string | null;
  country?: string | null;
  description?: string | null;
  document_path?: string | null;
}): { incomplete: boolean; missingDocument: boolean; missingFields: string[] } {
  const missingFields: string[] = [];
  if (!String(row.project_name ?? "").trim()) missingFields.push("project_name");
  if (!String(row.contact_name ?? "").trim()) missingFields.push("contact_name");
  if (!String(row.email ?? "").trim()) missingFields.push("email");
  if (!String(row.website ?? "").trim()) missingFields.push("website");
  if (!String(row.country ?? "").trim()) missingFields.push("country");
  if (String(row.description ?? "").trim().length < 20) missingFields.push("description");

  const missingDocument = !row.document_path;
  return {
    incomplete: missingFields.length > 0 || missingDocument,
    missingDocument,
    missingFields,
  };
}

function mapIncompleteRow(row: Record<string, unknown>): GreenLabelApplicationIncompleteRow {
  const check = isGreenLabelApplicationIncomplete(row);
  return {
    id: String(row.id),
    projectName: String(row.project_name),
    contactName: String(row.contact_name),
    email: String(row.email),
    preferredLocale: normalizeGreenLabelPreferredLocale(
      row.preferred_locale as string | null | undefined
    ),
    createdAt: String(row.created_at),
    missingDocument: check.missingDocument,
    missingFields: check.missingFields,
  };
}

export async function listIncompleteLabelApplicationsForReminder(options?: {
  force?: boolean;
}): Promise<GreenLabelApplicationIncompleteRow[]> {
  const supabase = getAdminClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("green_label_applications")
    .select(
      "id,project_name,contact_name,email,website,country,description,document_path,preferred_locale,created_at,reminder_sent_at,status"
    )
    .eq("status", "pending")
    .is("reminder_sent_at", null)
    .is("registry_project_id", null)
    .order("created_at", { ascending: true });

  if (error || !data) {
    console.error("[listIncompleteLabelApplicationsForReminder]", error);
    return [];
  }

  const cutoff = Date.now() - REMINDER_AFTER_MS;

  return data
    .filter((row) => {
      const check = isGreenLabelApplicationIncomplete(row);
      if (!check.incomplete) return false;
      if (options?.force) return true;
      return new Date(String(row.created_at)).getTime() <= cutoff;
    })
    .map((row) => mapIncompleteRow(row));
}

export type SendGreenLabelReminderResult =
  | { ok: true; sent: boolean; reason?: "already_sent" | "complete" | "too_early" }
  | { ok: false; error: "not_found" | "database" | "email" };

export async function sendGreenLabelIncompleteReminderForApplication(
  applicationId: string,
  options?: { force?: boolean }
): Promise<SendGreenLabelReminderResult> {
  const supabase = getAdminClient();
  if (!supabase) return { ok: false, error: "database" };

  const { data: row, error } = await supabase
    .from("green_label_applications")
    .select(
      "id,project_name,contact_name,email,website,country,description,document_path,preferred_locale,created_at,reminder_sent_at,status,registry_project_id"
    )
    .eq("id", applicationId)
    .maybeSingle();

  if (error || !row) return { ok: false, error: "not_found" };

  if (row.reminder_sent_at) {
    return { ok: true, sent: false, reason: "already_sent" };
  }

  if (row.status !== "pending" || row.registry_project_id) {
    return { ok: true, sent: false, reason: "complete" };
  }

  const check = isGreenLabelApplicationIncomplete(row);
  if (!check.incomplete) {
    return { ok: true, sent: false, reason: "complete" };
  }

  if (!options?.force) {
    const cutoff = Date.now() - REMINDER_AFTER_MS;
    if (new Date(String(row.created_at)).getTime() > cutoff) {
      return { ok: true, sent: false, reason: "too_early" };
    }
  }

  const locale = normalizeGreenLabelPreferredLocale(
    row.preferred_locale as string | null | undefined
  );
  const labelUrl = absoluteUrl(GREEN_LABEL_ROUTE);
  const myUrl = absoluteUrl("/green/my");

  const emailed = await sendGreenLabelIncompleteReminder(String(row.email), {
    contactName: String(row.contact_name),
    projectName: String(row.project_name),
    missingDocument: check.missingDocument,
    labelUrl,
    myUrl,
    locale,
  });

  if (!emailed) return { ok: false, error: "email" };

  const now = new Date().toISOString();
  const { error: updateErr } = await supabase
    .from("green_label_applications")
    .update({ reminder_sent_at: now })
    .eq("id", applicationId)
    .is("reminder_sent_at", null);

  if (updateErr) {
    console.error("[sendGreenLabelIncompleteReminderForApplication]", updateErr);
    return { ok: false, error: "database" };
  }

  return { ok: true, sent: true };
}

export async function runGreenLabelIncompleteReminderCron(): Promise<{
  scanned: number;
  sent: number;
  skipped: number;
  errors: number;
}> {
  const candidates = await listIncompleteLabelApplicationsForReminder();
  let sent = 0;
  let skipped = 0;
  let errors = 0;

  for (const app of candidates) {
    const result = await sendGreenLabelIncompleteReminderForApplication(app.id);
    if (!result.ok) {
      errors += 1;
      continue;
    }
    if (result.sent) sent += 1;
    else skipped += 1;
  }

  return { scanned: candidates.length, sent, skipped, errors };
}
