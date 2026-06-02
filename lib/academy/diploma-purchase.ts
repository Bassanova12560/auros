import { createClient, type PostgrestError, type SupabaseClient } from "@supabase/supabase-js";
import { randomBytes } from "node:crypto";

import type { DiplomaProductType } from "./diploma-pricing";

import type { AcademyCertificate } from "./types";

export type DiplomaPurchase = {
  id: string;
  productType: DiplomaProductType;
  certId: string | null;
  certSnapshot: AcademyCertificate | null;
  organizationName: string | null;
  contactEmail: string;
  contactName: string | null;
  stripeSessionId: string;
  amountCents: number;
  purchasedAt: string;
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
    error.code === "42P01" ||
    msg.includes("does not exist") ||
    msg.includes("schema cache")
  );
}

function rowToPurchase(row: Record<string, unknown>): DiplomaPurchase {
  return {
    id: String(row.id),
    productType: row.product_type as DiplomaProductType,
    certId: row.cert_id ? String(row.cert_id) : null,
    certSnapshot: row.cert_snapshot
      ? (row.cert_snapshot as AcademyCertificate)
      : null,
    organizationName: row.organization_name ? String(row.organization_name) : null,
    contactEmail: String(row.contact_email),
    contactName: row.contact_name ? String(row.contact_name) : null,
    stripeSessionId: String(row.stripe_session_id),
    amountCents: Number(row.amount_cents),
    purchasedAt: String(row.purchased_at),
  };
}

export function newDiplomaPurchaseId(prefix: "DIP" | "INST"): string {
  return `${prefix}-${randomBytes(5).toString("hex").toUpperCase()}`;
}

export async function insertDiplomaPurchase(input: {
  id: string;
  productType: DiplomaProductType;
  certId?: string | null;
  certSnapshot?: AcademyCertificate | null;
  organizationName?: string | null;
  contactEmail: string;
  contactName?: string | null;
  stripeSessionId: string;
  stripePaymentIntent?: string | null;
  amountCents: number;
}): Promise<{ ok: true; purchase: DiplomaPurchase } | { ok: false; reason: "duplicate" | "database_unavailable" }> {
  const supabase = getAdminClient();
  if (!supabase) return { ok: false, reason: "database_unavailable" };

  try {
    const { data, error } = await supabase
      .from("academy_diploma_purchases")
      .insert({
        id: input.id,
        product_type: input.productType,
        cert_id: input.certId ?? null,
        cert_snapshot: input.certSnapshot ?? null,
        organization_name: input.organizationName ?? null,
        contact_email: input.contactEmail.trim().toLowerCase(),
        contact_name: input.contactName?.trim() || null,
        stripe_session_id: input.stripeSessionId,
        stripe_payment_intent: input.stripePaymentIntent ?? null,
        amount_cents: input.amountCents,
      })
      .select("*")
      .single();

    if (error) {
      if (error.code === "23505") return { ok: false, reason: "duplicate" };
      if (isMissingTable(error)) return { ok: false, reason: "database_unavailable" };
      console.error("[academy/diploma] insert failed", error);
      return { ok: false, reason: "database_unavailable" };
    }

    return { ok: true, purchase: rowToPurchase(data as Record<string, unknown>) };
  } catch (err) {
    console.error("[academy/diploma] insert error", err);
    return { ok: false, reason: "database_unavailable" };
  }
}

export async function getPurchaseByStripeSession(
  sessionId: string
): Promise<DiplomaPurchase | null> {
  const supabase = getAdminClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("academy_diploma_purchases")
    .select("*")
    .eq("stripe_session_id", sessionId)
    .maybeSingle();

  if (error || !data) return null;
  return rowToPurchase(data as Record<string, unknown>);
}

export async function getPurchaseById(id: string): Promise<DiplomaPurchase | null> {
  const supabase = getAdminClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("academy_diploma_purchases")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return rowToPurchase(data as Record<string, unknown>);
}

export async function hasIndividualDiplomaPurchase(certId: string): Promise<boolean> {
  const supabase = getAdminClient();
  if (!supabase) return false;

  const { data, error } = await supabase
    .from("academy_diploma_purchases")
    .select("id")
    .eq("cert_id", certId)
    .eq("product_type", "individual")
    .maybeSingle();

  return !error && Boolean(data);
}
