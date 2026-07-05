import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { normalizePartnerCode } from "@/lib/partner-attribution";

function getAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SECRET_KEY?.trim();
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export type PartnerCodeCheck =
  | { ok: true; enforced: boolean; label?: string }
  | { ok: false; reason: "invalid_format" | "not_registered" | "inactive" }
  | { ok: false; reason: "database_unavailable" };

/** When partner_codes is empty, all normalized codes are accepted (open mode). */
export async function validatePartnerCode(raw: string): Promise<PartnerCodeCheck> {
  const code = normalizePartnerCode(raw);
  if (!code) return { ok: false, reason: "invalid_format" };

  const supabase = getAdminClient();
  if (!supabase) return { ok: false, reason: "database_unavailable" };

  const { count, error: countError } = await supabase
    .from("partner_codes")
    .select("code", { count: "exact", head: true });

  if (countError) {
    if (countError.message.includes("does not exist")) {
      return { ok: true, enforced: false };
    }
    console.error("[validatePartnerCode/count]", countError);
    return { ok: false, reason: "database_unavailable" };
  }

  if (!count || count === 0) {
    return { ok: true, enforced: false };
  }

  const { data, error } = await supabase
    .from("partner_codes")
    .select("code, label, active")
    .eq("code", code)
    .maybeSingle();

  if (error) {
    console.error("[validatePartnerCode/lookup]", error);
    return { ok: false, reason: "database_unavailable" };
  }

  if (!data) return { ok: false, reason: "not_registered" };
  if (!data.active) return { ok: false, reason: "inactive" };

  return {
    ok: true,
    enforced: true,
    label: data.label ? String(data.label) : undefined,
  };
}
