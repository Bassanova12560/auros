import "server-only";

import { getSupabaseServerClient } from "@/lib/supabase/server";

import { scoreTrustPack, type PackChecklist, type PackEvidence, type PackGrade } from "./score";
import { TRUST_PACK_IDS, type TrustPackId } from "./taxonomy";

export type TrustPackAssessment = {
  id: string;
  owner_user_id: string | null;
  pack_id: TrustPackId;
  name: string;
  jurisdiction: string | null;
  description: string | null;
  website_url: string | null;
  checklist: PackChecklist;
  evidence: PackEvidence;
  shield_receipt_id: string | null;
  final_score: number;
  grade: PackGrade;
  status: "draft" | "published";
  public_slug: string | null;
  is_demo: boolean;
  created_at: string;
  updated_at: string;
};

function isPackId(v: string): v is TrustPackId {
  return (TRUST_PACK_IDS as readonly string[]).includes(v);
}

function mapRow(row: Record<string, unknown>): TrustPackAssessment {
  const packRaw = String(row.pack_id ?? "");
  const pack_id: TrustPackId = isPackId(packRaw) ? packRaw : "real_estate";
  return {
    id: String(row.id),
    owner_user_id: row.owner_user_id ? String(row.owner_user_id) : null,
    pack_id,
    name: String(row.name),
    jurisdiction: row.jurisdiction ? String(row.jurisdiction) : null,
    description: row.description ? String(row.description) : null,
    website_url: row.website_url ? String(row.website_url) : null,
    checklist:
      row.checklist && typeof row.checklist === "object"
        ? (row.checklist as PackChecklist)
        : {},
    evidence:
      row.evidence && typeof row.evidence === "object"
        ? (row.evidence as PackEvidence)
        : {},
    shield_receipt_id: row.shield_receipt_id
      ? String(row.shield_receipt_id)
      : null,
    final_score: Number(row.final_score ?? 0),
    grade: (row.grade as PackGrade) || "D",
    status: row.status === "published" ? "published" : "draft",
    public_slug: row.public_slug ? String(row.public_slug) : null,
    is_demo: Boolean(row.is_demo),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export async function createTrustPackAssessment(input: {
  ownerUserId: string | null;
  packId: TrustPackId;
  name: string;
  jurisdiction?: string | null;
  description?: string | null;
  website_url?: string | null;
  checklist: PackChecklist;
  evidence: PackEvidence;
  shield_receipt_id?: string | null;
  is_demo?: boolean;
}): Promise<{ assessment: TrustPackAssessment | null; error: string | null }> {
  try {
    const scored = scoreTrustPack({
      packId: input.packId,
      checklist: input.checklist,
      evidence: input.evidence,
    });
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("trust_pack_assessments")
      .insert({
        owner_user_id: input.ownerUserId,
        pack_id: input.packId,
        name: input.name.trim(),
        jurisdiction: input.jurisdiction?.trim() || null,
        description: input.description?.trim() || null,
        website_url: input.website_url?.trim() || null,
        checklist: input.checklist,
        evidence: input.evidence,
        shield_receipt_id: input.shield_receipt_id?.trim() || null,
        final_score: scored.score,
        grade: scored.grade,
        status: "draft",
        is_demo: Boolean(input.is_demo),
      })
      .select("*")
      .single();
    if (error || !data) {
      return { assessment: null, error: error?.message ?? "Insert failed" };
    }
    return { assessment: mapRow(data as Record<string, unknown>), error: null };
  } catch (e) {
    return {
      assessment: null,
      error: e instanceof Error ? e.message : "Supabase unavailable",
    };
  }
}

export async function getTrustPackAssessment(
  id: string
): Promise<{ assessment: TrustPackAssessment | null; error: string | null }> {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("trust_pack_assessments")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) return { assessment: null, error: error.message };
    if (!data) return { assessment: null, error: null };
    return {
      assessment: mapRow(data as Record<string, unknown>),
      error: null,
    };
  } catch (e) {
    return {
      assessment: null,
      error: e instanceof Error ? e.message : "Supabase unavailable",
    };
  }
}

export async function getTrustPackBySlug(
  slug: string
): Promise<{ assessment: TrustPackAssessment | null; error: string | null }> {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("trust_pack_assessments")
      .select("*")
      .eq("public_slug", slug)
      .eq("status", "published")
      .maybeSingle();
    if (error) return { assessment: null, error: error.message };
    if (!data) return { assessment: null, error: null };
    return {
      assessment: mapRow(data as Record<string, unknown>),
      error: null,
    };
  } catch (e) {
    return {
      assessment: null,
      error: e instanceof Error ? e.message : "Supabase unavailable",
    };
  }
}

export async function listPublishedTrustPacks(): Promise<{
  rows: TrustPackAssessment[];
  error: string | null;
}> {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("trust_pack_assessments")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) return { rows: [], error: error.message };
    return {
      rows: (data ?? []).map((r) => mapRow(r as Record<string, unknown>)),
      error: null,
    };
  } catch (e) {
    return {
      rows: [],
      error: e instanceof Error ? e.message : "Supabase unavailable",
    };
  }
}

export async function listOwnerTrustPacks(
  ownerUserId: string
): Promise<{ rows: TrustPackAssessment[]; error: string | null }> {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("trust_pack_assessments")
      .select("*")
      .eq("owner_user_id", ownerUserId)
      .order("updated_at", { ascending: false })
      .limit(50);
    if (error) return { rows: [], error: error.message };
    return {
      rows: (data ?? []).map((r) => mapRow(r as Record<string, unknown>)),
      error: null,
    };
  } catch (e) {
    return {
      rows: [],
      error: e instanceof Error ? e.message : "Supabase unavailable",
    };
  }
}

export async function publishTrustPackAssessment(
  id: string
): Promise<{ slug: string | null; error: string | null }> {
  try {
    const supabase = getSupabaseServerClient();
    const slug = `pack-${id.replace(/-/g, "").slice(0, 12)}`;
    const { data, error } = await supabase
      .from("trust_pack_assessments")
      .update({
        status: "published",
        public_slug: slug,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("public_slug")
      .single();
    if (error) return { slug: null, error: error.message };
    return { slug: data?.public_slug ? String(data.public_slug) : slug, error: null };
  } catch (e) {
    return {
      slug: null,
      error: e instanceof Error ? e.message : "Supabase unavailable",
    };
  }
}
