import "server-only";

import { randomBytes } from "node:crypto";

import {
  normalizePartnerCode,
  suggestPartnerCode,
} from "@/lib/partner-attribution";
import {
  listPartnerReferrals,
  summarizePartnerReferrals,
} from "@/lib/partners/referral-report";
import { countPartnerPaidReferrals } from "@/lib/partners/paid-referrals";
import type {
  PartnerKind,
  PartnerRecord,
  PartnerStats,
  PartnerStatus,
} from "@/lib/partners/types";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type { PartnerKind, PartnerRecord, PartnerStats, PartnerStatus };
export { suggestPartnerCode };

function mapRow(row: Record<string, unknown>): PartnerRecord {
  const kindRaw = String(row.kind ?? "apporteur");
  const kind: PartnerKind =
    kindRaw === "platform" ? "platform" : "apporteur";
  return {
    id: String(row.id),
    code: String(row.code),
    company: String(row.company),
    email: String(row.email).toLowerCase(),
    contact_name: row.contact_name ? String(row.contact_name) : null,
    clerk_user_id: row.clerk_user_id ? String(row.clerk_user_id) : null,
    status: row.status as PartnerStatus,
    kind,
    webhook_url: row.webhook_url ? String(row.webhook_url) : null,
    webhook_secret: row.webhook_secret ? String(row.webhook_secret) : null,
    created_at: String(row.created_at),
    activated_at: row.activated_at ? String(row.activated_at) : null,
  };
}

async function allocateUniqueCode(preferred: string): Promise<string> {
  const supabase = getSupabaseServerClient();
  let candidate = normalizePartnerCode(preferred) ?? "PARTNER";
  for (let attempt = 0; attempt < 8; attempt++) {
    const { data } = await supabase
      .from("partners")
      .select("id")
      .ilike("code", candidate)
      .maybeSingle();
    if (!data) return candidate;
    const suffix = randomBytes(2).toString("hex").toUpperCase();
    candidate = normalizePartnerCode(`${preferred.slice(0, 28)}-${suffix}`) ?? `P-${suffix}`;
  }
  return `P-${randomBytes(4).toString("hex").toUpperCase()}`;
}

export type CreatePendingPartnerInput = {
  company: string;
  email: string;
  contactName: string;
  requestId?: string;
};

export async function createPendingPartner(
  input: CreatePendingPartnerInput
): Promise<{ ok: true; partner: PartnerRecord } | { ok: false; message: string }> {
  const email = input.email.trim().toLowerCase();
  const company = input.company.trim();
  const contactName = input.contactName.trim();
  if (!company || !email || !contactName) {
    return { ok: false, message: "company, email and contactName required" };
  }

  const supabase = getSupabaseServerClient();

  const { data: existing } = await supabase
    .from("partners")
    .select("*")
    .eq("email", email)
    .in("status", ["pending", "active"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing) {
    const partner = mapRow(existing as Record<string, unknown>);
    if (input.requestId) {
      await supabase
        .from("partner_requests")
        .update({ partner_id: partner.id })
        .eq("id", input.requestId);
    }
    return { ok: true, partner };
  }

  const code = await allocateUniqueCode(suggestPartnerCode(company));
  const { data, error } = await supabase
    .from("partners")
    .insert({
      code,
      company,
      email,
      contact_name: contactName,
      status: "pending",
    })
    .select("*")
    .single();

  if (error || !data) {
    console.error("[createPendingPartner]", error);
    return { ok: false, message: error?.message ?? "Insert failed" };
  }

  const partner = mapRow(data as Record<string, unknown>);
  if (input.requestId) {
    await supabase
      .from("partner_requests")
      .update({ partner_id: partner.id })
      .eq("id", input.requestId);
  }

  return { ok: true, partner };
}

export type ActivatePartnerInput = {
  id?: string;
  email?: string;
  code: string;
  clerkUserId?: string | null;
  kind?: PartnerKind;
  webhookUrl?: string | null;
  webhookSecret?: string | null;
};

export async function activatePartner(
  input: ActivatePartnerInput
): Promise<{ ok: true; partner: PartnerRecord } | { ok: false; message: string }> {
  const code = normalizePartnerCode(input.code);
  if (!code) {
    return { ok: false, message: "Invalid partner code (2–48 chars A-Z0-9_-)" };
  }

  const supabase = getSupabaseServerClient();

  let partnerId = input.id?.trim() || null;
  if (!partnerId && input.email?.trim()) {
    const { data: byEmail } = await supabase
      .from("partners")
      .select("id")
      .eq("email", input.email.trim().toLowerCase())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    partnerId = byEmail?.id ? String(byEmail.id) : null;
  }
  if (!partnerId) {
    return { ok: false, message: "Partner id or email required" };
  }

  const { data: conflict } = await supabase
    .from("partners")
    .select("id")
    .ilike("code", code)
    .neq("id", partnerId)
    .maybeSingle();
  if (conflict) {
    return { ok: false, message: `Code ${code} already in use` };
  }

  const patch: Record<string, unknown> = {
    code,
    status: "active",
    activated_at: new Date().toISOString(),
  };
  if (input.clerkUserId !== undefined) {
    patch.clerk_user_id = input.clerkUserId;
  }
  if (input.kind) {
    patch.kind = input.kind;
  }
  if (input.webhookUrl !== undefined) {
    patch.webhook_url = input.webhookUrl?.trim() || null;
  }
  if (input.webhookSecret !== undefined) {
    patch.webhook_secret = input.webhookSecret?.trim() || null;
  }

  const { data, error } = await supabase
    .from("partners")
    .update(patch)
    .eq("id", partnerId)
    .select("*")
    .single();

  if (error || !data) {
    console.error("[activatePartner]", error);
    return { ok: false, message: error?.message ?? "Update failed" };
  }

  return { ok: true, partner: mapRow(data as Record<string, unknown>) };
}

export async function getPartnerByClerkUserId(
  clerkUserId: string
): Promise<PartnerRecord | null> {
  if (!clerkUserId.trim()) return null;
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("partners")
    .select("*")
    .eq("clerk_user_id", clerkUserId)
    .maybeSingle();
  if (error) {
    console.error("[getPartnerByClerkUserId]", error);
    return null;
  }
  return data ? mapRow(data as Record<string, unknown>) : null;
}

export async function getPartnerByCode(code: string): Promise<PartnerRecord | null> {
  const normalized = normalizePartnerCode(code);
  if (!normalized) return null;
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("partners")
    .select("*")
    .ilike("code", normalized)
    .maybeSingle();
  if (error) {
    console.error("[getPartnerByCode]", error);
    return null;
  }
  return data ? mapRow(data as Record<string, unknown>) : null;
}

export async function getPartnerByEmail(
  email: string
): Promise<PartnerRecord | null> {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return null;
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("partners")
    .select("*")
    .eq("email", normalized)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) {
    console.error("[getPartnerByEmail]", error);
    return null;
  }
  return data ? mapRow(data as Record<string, unknown>) : null;
}

/** Bind Clerk user to an active partner matching email (first login). */
export async function bindPartnerClerkUser(
  email: string,
  clerkUserId: string
): Promise<PartnerRecord | null> {
  const partner = await getPartnerByEmail(email);
  if (!partner || partner.status !== "active") return null;
  if (partner.clerk_user_id && partner.clerk_user_id !== clerkUserId) {
    return null;
  }
  if (partner.clerk_user_id === clerkUserId) return partner;

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("partners")
    .update({ clerk_user_id: clerkUserId })
    .eq("id", partner.id)
    .select("*")
    .single();
  if (error || !data) {
    console.error("[bindPartnerClerkUser]", error);
    return null;
  }
  return mapRow(data as Record<string, unknown>);
}

export async function resolvePartnerForClerkUser(
  clerkUserId: string,
  email: string | null
): Promise<PartnerRecord | null> {
  const byClerk = await getPartnerByClerkUserId(clerkUserId);
  if (byClerk) return byClerk;
  if (!email) return null;
  return bindPartnerClerkUser(email, clerkUserId);
}

export async function getPartnerStats(code: string): Promise<PartnerStats> {
  const normalized = normalizePartnerCode(code) ?? code.toUpperCase();
  const rows = await listPartnerReferrals(normalized);
  const summary = summarizePartnerReferrals(rows).find(
    (s) => s.partnerCode === normalized
  ) ?? { partnerCode: normalized, leads: 0, dossiers: 0, total: 0 };
  const paid = countPartnerPaidReferrals(normalized);
  return {
    ...summary,
    paid,
    total: summary.total + paid,
    commissionStatus: "estimated",
  };
}
