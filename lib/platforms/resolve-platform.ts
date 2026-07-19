import "server-only";

import { normalizePartnerCode } from "@/lib/partner-attribution";
import { getPartnerByCode, type PartnerRecord } from "@/lib/partners/registry";
import {
  pickPlatformFromCandidates,
  resolveWebhookTarget,
} from "@/lib/platforms/resolve-platform-pure";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type ResolvePlatformInput = {
  wizardPlatform?: string | null;
  referredBy?: string | null;
};

export { pickPlatformFromCandidates, resolveWebhookTarget };

/** Resolve target platform tenant for a dossier submit. */
export async function resolvePlatformPartner(
  input: ResolvePlatformInput
): Promise<PartnerRecord | null> {
  const tip = (input.wizardPlatform ?? "").trim();
  const ref = normalizePartnerCode(input.referredBy ?? "");

  if (ref) {
    const byRef = await getPartnerByCode(ref);
    if (byRef?.kind === "platform" && byRef.status === "active") {
      return byRef;
    }
  }

  if (tip) {
    const supabase = getSupabaseServerClient();
    const { data: byCode } = await supabase
      .from("partners")
      .select("*")
      .eq("kind", "platform")
      .eq("status", "active")
      .ilike("code", tip)
      .maybeSingle();
    if (byCode) {
      return mapLite(byCode as Record<string, unknown>);
    }

    const { data: list } = await supabase
      .from("partners")
      .select("*")
      .eq("kind", "platform")
      .eq("status", "active")
      .limit(50);
    const picked = pickPlatformFromCandidates(
      (list ?? []).map((r) => mapLite(r as Record<string, unknown>)),
      tip,
      null
    );
    if (picked) return picked;
  }

  const defaultCode = process.env.DEFAULT_PLATFORM_PARTNER_CODE?.trim();
  if (defaultCode) {
    const def = await getPartnerByCode(defaultCode);
    if (def?.kind === "platform" && def.status === "active") return def;
  }

  return null;
}

function mapLite(row: Record<string, unknown>): PartnerRecord {
  return {
    id: String(row.id),
    code: String(row.code),
    company: String(row.company),
    email: String(row.email ?? "").toLowerCase(),
    contact_name: row.contact_name ? String(row.contact_name) : null,
    clerk_user_id: row.clerk_user_id ? String(row.clerk_user_id) : null,
    status: (row.status as PartnerRecord["status"]) ?? "active",
    kind: row.kind === "platform" ? "platform" : "apporteur",
    webhook_url: row.webhook_url ? String(row.webhook_url) : null,
    webhook_secret: row.webhook_secret ? String(row.webhook_secret) : null,
    created_at: String(row.created_at ?? ""),
    activated_at: row.activated_at ? String(row.activated_at) : null,
  };
}
