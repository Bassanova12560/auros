import { createClient, type PostgrestError, type SupabaseClient } from "@supabase/supabase-js";

import type { AcademyCertificate } from "./types";

export type AcademyRegistryStats = {
  available: boolean;
  totalIssued: number;
  activeCount: number;
  institutions: { name: string; purchasedAt: string }[];
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

/** Best-effort append-only log — never blocks certificate delivery. */
export async function logCertificateIssuance(cert: AcademyCertificate): Promise<void> {
  const supabase = getAdminClient();
  if (!supabase) return;

  try {
    const { error } = await supabase.from("academy_cert_registry").upsert(
      {
        cert_id: cert.id,
        tier: cert.tier,
        issued_at: cert.issuedAt,
        expires_at: cert.expiresAt,
        curriculum_version: cert.curriculumVersion,
        integrity_level: cert.integrityLevel ?? 2,
        renewal_generation: cert.renewalGeneration ?? 0,
      },
      { onConflict: "cert_id" }
    );
    if (error && !isMissingTable(error)) {
      console.error("[academy/registry] log failed", error);
    }
  } catch (err) {
    console.error("[academy/registry] log error", err);
  }
}

export async function getRegistryStats(): Promise<AcademyRegistryStats> {
  const empty: AcademyRegistryStats = {
    available: false,
    totalIssued: 0,
    activeCount: 0,
    institutions: [],
  };

  const supabase = getAdminClient();
  if (!supabase) return empty;

  try {
    const now = new Date().toISOString();

    const [totalRes, activeRes, instRes] = await Promise.all([
      supabase.from("academy_cert_registry").select("cert_id", { count: "exact", head: true }),
      supabase
        .from("academy_cert_registry")
        .select("cert_id", { count: "exact", head: true })
        .gt("expires_at", now),
      supabase
        .from("academy_diploma_purchases")
        .select("organization_name, purchased_at")
        .eq("product_type", "institution")
        .not("organization_name", "is", null)
        .order("purchased_at", { ascending: false })
        .limit(24),
    ]);

    if (totalRes.error && isMissingTable(totalRes.error)) return empty;

    const institutions = (instRes.data ?? [])
      .map((row) => ({
        name: String(row.organization_name ?? "").trim(),
        purchasedAt: String(row.purchased_at),
      }))
      .filter((row) => row.name.length >= 2);

    return {
      available: true,
      totalIssued: totalRes.count ?? 0,
      activeCount: activeRes.count ?? 0,
      institutions,
    };
  } catch (err) {
    console.error("[academy/registry] stats error", err);
    return empty;
  }
}
