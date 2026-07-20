/**
 * Mirror Shield receipts / usage / audit to Supabase when configured.
 * Local memory+file remain the hot path; DB keeps multi-instance Vercel consistent.
 */

import { isSupabaseConfigured } from "@/lib/protocol/auth/keys";

import type { ShieldAuditEvent } from "./audit";
import type { ShieldReceipt } from "./tap";

async function client() {
  const { getSupabaseServerClient } = await import("@/lib/supabase/server");
  return getSupabaseServerClient();
}

export async function mirrorReceiptToSupabase(
  receipt: ShieldReceipt
): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    const supabase = await client();
    await supabase.from("shield_receipts").upsert({
      id: receipt.id,
      shield_version: receipt.shield_version,
      kind: receipt.kind,
      content_hash: receipt.content_hash,
      local_signature: receipt.local_signature,
      cloud_signature: receipt.cloud_signature,
      profile: receipt.profile,
      tenant_ref: receipt.tenant_ref,
      label: receipt.label,
      plan: receipt.plan,
      verify_url: receipt.verify_url,
      created_at: receipt.created_at,
      disclaimer: receipt.disclaimer,
    });
  } catch (e) {
    console.error("[shield-persist] receipt", e);
  }
}

export async function fetchReceiptFromSupabase(
  id: string
): Promise<ShieldReceipt | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = await client();
    const { data, error } = await supabase
      .from("shield_receipts")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error || !data) return null;
    return rowToReceipt(data as Record<string, unknown>);
  } catch {
    return null;
  }
}

export async function fetchReceiptsFromSupabase(
  tenantRef: string | undefined,
  limit: number
): Promise<ShieldReceipt[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = await client();
    let q = supabase
      .from("shield_receipts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (tenantRef) q = q.eq("tenant_ref", tenantRef);
    const { data, error } = await q;
    if (error || !data) return [];
    return (data as Record<string, unknown>[]).map(rowToReceipt);
  } catch {
    return [];
  }
}

export async function mirrorUsageToSupabase(
  keyHash: string,
  month: string,
  count: number
): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    const supabase = await client();
    await supabase.from("shield_tap_usage").upsert({
      key_hash: keyHash,
      month,
      count,
    });
  } catch (e) {
    console.error("[shield-persist] usage", e);
  }
}

export async function fetchUsageFromSupabase(
  keyHash: string,
  month: string
): Promise<number | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = await client();
    const { data } = await supabase
      .from("shield_tap_usage")
      .select("count")
      .eq("key_hash", keyHash)
      .eq("month", month)
      .maybeSingle();
    if (!data || typeof (data as { count?: number }).count !== "number") {
      return null;
    }
    return (data as { count: number }).count;
  } catch {
    return null;
  }
}

export async function mirrorAuditToSupabase(
  event: ShieldAuditEvent
): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    const supabase = await client();
    await supabase.from("shield_audit").upsert({
      id: event.id,
      key_hash: event.key_hash,
      action: event.action,
      receipt_id: event.receipt_id ?? null,
      pack_id: event.pack_id ?? null,
      content_hash: event.content_hash ?? null,
      meta: event.meta ?? {},
      created_at: event.created_at,
    });
  } catch (e) {
    console.error("[shield-persist] audit", e);
  }
}

export async function fetchAuditFromSupabase(
  keyHash: string,
  limit: number
): Promise<ShieldAuditEvent[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = await client();
    const { data, error } = await supabase
      .from("shield_audit")
      .select("*")
      .eq("key_hash", keyHash)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error || !data) return [];
    return (data as Record<string, unknown>[]).map((row) => ({
      id: String(row.id),
      key_hash: String(row.key_hash),
      action: row.action as ShieldAuditEvent["action"],
      receipt_id: row.receipt_id ? String(row.receipt_id) : undefined,
      pack_id: row.pack_id ? String(row.pack_id) : undefined,
      content_hash: row.content_hash ? String(row.content_hash) : undefined,
      meta: (row.meta as Record<string, unknown>) ?? undefined,
      created_at: String(row.created_at),
    }));
  } catch {
    return [];
  }
}

function rowToReceipt(row: Record<string, unknown>): ShieldReceipt {
  return {
    id: String(row.id),
    shield_version: String(row.shield_version),
    kind: row.kind as ShieldReceipt["kind"],
    content_hash: String(row.content_hash),
    local_signature: row.local_signature
      ? String(row.local_signature)
      : null,
    cloud_signature: String(row.cloud_signature),
    profile: row.profile as ShieldReceipt["profile"],
    tenant_ref: row.tenant_ref ? String(row.tenant_ref) : null,
    label: row.label ? String(row.label) : null,
    created_at: String(row.created_at),
    plan: (row.plan as "free" | "premium") ?? "free",
    verify_url: String(row.verify_url),
    payload_retained: false,
    disclaimer: String(row.disclaimer),
  };
}
