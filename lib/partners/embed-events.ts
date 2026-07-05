import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { normalizePartnerCode } from "@/lib/partner-attribution";
import type { Locale } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n";

export type PartnerEmbedEventType = "h2o_score" | "h2o_passport_cta";

export type RecordPartnerEmbedEventInput = {
  partnerCode: string;
  eventType: PartnerEmbedEventType;
  rating?: number | null;
  tier?: string | null;
  previewId?: string | null;
  locale?: Locale | string | null;
};

function getAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SECRET_KEY?.trim();
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function recordPartnerEmbedEvent(
  input: RecordPartnerEmbedEventInput,
): Promise<{ ok: true } | { ok: false; reason: "invalid" | "database" }> {
  const partnerCode = normalizePartnerCode(input.partnerCode);
  if (!partnerCode) return { ok: false, reason: "invalid" };

  const supabase = getAdminClient();
  if (!supabase) return { ok: false, reason: "database" };

  const locale =
    input.locale && isLocale(String(input.locale).slice(0, 2) as Locale)
      ? String(input.locale).slice(0, 2)
      : null;

  const { error } = await supabase.from("partner_embed_events").insert({
    partner_code: partnerCode,
    event_type: input.eventType,
    rating:
      typeof input.rating === "number" && Number.isFinite(input.rating)
        ? Math.round(input.rating)
        : null,
    tier: input.tier?.trim() || null,
    preview_id: input.previewId?.trim() || null,
    locale,
  });

  if (error) {
    if (error.message.includes("does not exist")) {
      return { ok: false, reason: "database" };
    }
    console.error("[recordPartnerEmbedEvent]", error);
    return { ok: false, reason: "database" };
  }

  return { ok: true };
}

export async function countPartnerEmbedEvents(
  partnerCode: string,
): Promise<number | null> {
  const code = normalizePartnerCode(partnerCode);
  if (!code) return 0;

  const supabase = getAdminClient();
  if (!supabase) return null;

  const { count, error } = await supabase
    .from("partner_embed_events")
    .select("id", { count: "exact", head: true })
    .eq("partner_code", code);

  if (error) {
    if (error.message.includes("does not exist")) return 0;
    console.error("[countPartnerEmbedEvents]", error);
    return null;
  }

  return count ?? 0;
}
