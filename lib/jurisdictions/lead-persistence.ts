import type { PostgrestError } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

export type JurisdictionLeadInsert = {
  kind: "guide" | "quote";
  first_name: string;
  email: string;
  project_type: string;
  jurisdictions: string[];
  locale: string;
  project_value?: string | null;
  message?: string | null;
  ai_brief?: string | null;
  ai_quote?: string | null;
  ai_quote_provider?: string | null;
  lead_score?: number;
  lead_tier?: string | null;
};

function isMissingColumnOrTable(error: PostgrestError): boolean {
  const msg = error.message.toLowerCase();
  return (
    error.code === "PGRST204" ||
    error.code === "42703" ||
    error.code === "42P01" ||
    msg.includes("column") ||
    msg.includes("does not exist") ||
    msg.includes("schema cache")
  );
}

/** Inserts a lead; retries without optional automation columns if migration 0006 is missing. */
export async function insertJurisdictionLead(
  supabase: SupabaseClient,
  row: JurisdictionLeadInsert
): Promise<{ id: string } | { error: PostgrestError }> {
  const full = { ...row };
  const { data, error } = await supabase
    .from("jurisdiction_leads")
    .insert(full)
    .select("id")
    .single();

  if (!error && data?.id) {
    return { id: data.id as string };
  }

  if (!error || !isMissingColumnOrTable(error)) {
    return { error: error! };
  }

  const fallback: Record<string, unknown> = {
    kind: row.kind,
    first_name: row.first_name,
    email: row.email,
    project_type: row.project_type,
    jurisdictions: row.jurisdictions,
    locale: row.locale,
  };

  if (row.project_value != null) fallback.project_value = row.project_value;
  if (row.message != null) fallback.message = row.message;

  const briefText = row.ai_brief ?? row.ai_quote ?? null;
  if (briefText) fallback.ai_brief = briefText;

  const { data: fallbackData, error: fallbackError } = await supabase
    .from("jurisdiction_leads")
    .insert(fallback)
    .select("id")
    .single();

  if (fallbackError || !fallbackData?.id) {
    return { error: fallbackError ?? error };
  }

  return { id: fallbackData.id as string };
}
