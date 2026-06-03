import { createClient, type PostgrestError, type SupabaseClient } from "@supabase/supabase-js";

import { isGreenLabelApplicationIncomplete } from "./label-incomplete-reminder";

export type GreenLabelReminderStats = {
  pendingIncomplete: number;
  remindedOnce: number;
  remindedTwice: number;
  complete: number;
  total: number;
};

function getAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SECRET_KEY?.trim();
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function isMissingTable(error: PostgrestError): boolean {
  const msg = error.message.toLowerCase();
  return (
    error.code === "PGRST204" ||
    error.code === "PGRST205" ||
    error.code === "42P01" ||
    msg.includes("does not exist") ||
    msg.includes("schema cache")
  );
}

export function classifyLabelReminderBucket(row: {
  project_name?: string | null;
  contact_name?: string | null;
  email?: string | null;
  website?: string | null;
  country?: string | null;
  description?: string | null;
  document_path?: string | null;
  reminder_sent_at?: string | null;
  second_reminder_sent_at?: string | null;
}): keyof Omit<GreenLabelReminderStats, "total"> {
  const check = isGreenLabelApplicationIncomplete(row);
  if (!check.incomplete) return "complete";
  if (row.second_reminder_sent_at) return "remindedTwice";
  if (row.reminder_sent_at) return "remindedOnce";
  return "pendingIncomplete";
}

export async function getGreenLabelReminderStats(): Promise<GreenLabelReminderStats | null> {
  const supabase = getAdminClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("green_label_applications")
    .select(
      "project_name,contact_name,email,website,country,description,document_path,reminder_sent_at,second_reminder_sent_at"
    );

  if (error) {
    if (isMissingTable(error)) return null;
    console.error("[green/label-reminder-stats]", error);
    return null;
  }

  const stats: GreenLabelReminderStats = {
    pendingIncomplete: 0,
    remindedOnce: 0,
    remindedTwice: 0,
    complete: 0,
    total: 0,
  };

  for (const row of data ?? []) {
    const bucket = classifyLabelReminderBucket(row);
    stats[bucket]++;
    stats.total++;
  }

  return stats;
}
