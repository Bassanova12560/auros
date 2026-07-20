import "server-only";

import { getSupabaseServerClient } from "@/lib/supabase/server";

import {
  type WetsCategory,
  type WetsCriterion,
  type WetsCriterionScore,
  type WetsGrade,
  type WetsProject,
  type WetsTrustRow,
  computeFinalScore,
  gradeFromFinalScore,
} from "./constants";

export type CreateWetsProjectInput = {
  ownerUserId: string | null;
  name: string;
  ticker?: string | null;
  category: WetsCategory;
  website_url?: string | null;
  description?: string | null;
  legal_structure?: string | null;
  jurisdiction?: string | null;
  interconnection_queue_position?: string | null;
  permits_status?: "unknown" | "none" | "filed" | "obtained" | null;
  behind_the_meter?: boolean;
  pqc_checklist?: Record<string, boolean>;
  pqc_evidence?: Record<
    string,
    { url?: string; excerpt?: string; receipt_id?: string }
  >;
  shield_receipt_id?: string | null;
  is_demo?: boolean;
};

function mapProject(row: Record<string, unknown>): WetsProject {
  const checklist =
    row.pqc_checklist && typeof row.pqc_checklist === "object"
      ? (row.pqc_checklist as Record<string, boolean>)
      : {};
  const permits = row.permits_status
    ? String(row.permits_status)
    : null;
  const evidence =
    row.pqc_evidence && typeof row.pqc_evidence === "object"
      ? (row.pqc_evidence as WetsProject["pqc_evidence"])
      : {};
  return {
    id: String(row.id),
    owner_user_id: row.owner_user_id ? String(row.owner_user_id) : null,
    name: String(row.name),
    ticker: row.ticker ? String(row.ticker) : null,
    category: row.category as WetsCategory,
    website_url: row.website_url ? String(row.website_url) : null,
    description: row.description ? String(row.description) : null,
    legal_structure: row.legal_structure ? String(row.legal_structure) : null,
    jurisdiction: row.jurisdiction ? String(row.jurisdiction) : null,
    status: row.status === "published" ? "published" : "draft",
    public_slug: row.public_slug ? String(row.public_slug) : null,
    report_markdown: row.report_markdown ? String(row.report_markdown) : null,
    report_html: row.report_html ? String(row.report_html) : null,
    interconnection_queue_position: row.interconnection_queue_position
      ? String(row.interconnection_queue_position)
      : null,
    permits_status:
      permits === "none" ||
      permits === "filed" ||
      permits === "obtained" ||
      permits === "unknown"
        ? permits
        : null,
    behind_the_meter: Boolean(row.behind_the_meter),
    pqc_checklist: checklist,
    pqc_evidence: evidence,
    shield_receipt_id: row.shield_receipt_id
      ? String(row.shield_receipt_id)
      : null,
    is_demo: Boolean(row.is_demo),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export async function listWetsTrustScores(opts?: {
  ownerUserId?: string;
  publishedOnly?: boolean;
}): Promise<{ rows: WetsTrustRow[]; error: string | null }> {
  try {
    const supabase = getSupabaseServerClient();
    let q = supabase
      .from("wets_project_trust_scores")
      .select("*")
      .order("created_at", { ascending: false });
    if (opts?.publishedOnly) q = q.eq("status", "published");
    if (opts?.ownerUserId) q = q.eq("owner_user_id", opts.ownerUserId);
    const { data, error } = await q;
    if (error) return { rows: [], error: error.message };
    const rows: WetsTrustRow[] = (data ?? []).map((r) => ({
      id: String(r.id),
      name: String(r.name),
      ticker: r.ticker ? String(r.ticker) : null,
      category: r.category as WetsCategory,
      status: r.status === "published" ? "published" : "draft",
      jurisdiction: r.jurisdiction ? String(r.jurisdiction) : null,
      public_slug: r.public_slug ? String(r.public_slug) : null,
      owner_user_id: r.owner_user_id ? String(r.owner_user_id) : null,
      is_demo: Boolean(r.is_demo),
      created_at: String(r.created_at),
      final_score: Number(r.final_score),
      grade: r.grade as WetsGrade,
    }));
    return { rows, error: null };
  } catch (e) {
    return {
      rows: [],
      error: e instanceof Error ? e.message : "Supabase unavailable",
    };
  }
}

export async function getWetsProject(
  id: string
): Promise<{ project: WetsProject | null; error: string | null }> {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("wets_projects")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) return { project: null, error: error.message };
    if (!data) return { project: null, error: null };
    return { project: mapProject(data as Record<string, unknown>), error: null };
  } catch (e) {
    return {
      project: null,
      error: e instanceof Error ? e.message : "Supabase unavailable",
    };
  }
}

export async function getWetsProjectBySlug(
  slug: string
): Promise<{ project: WetsProject | null; error: string | null }> {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("wets_projects")
      .select("*")
      .eq("public_slug", slug)
      .eq("status", "published")
      .maybeSingle();
    if (error) return { project: null, error: error.message };
    if (!data) return { project: null, error: null };
    return { project: mapProject(data as Record<string, unknown>), error: null };
  } catch (e) {
    return {
      project: null,
      error: e instanceof Error ? e.message : "Supabase unavailable",
    };
  }
}

export async function listWetsCriteria(
  projectId: string
): Promise<{ criteria: WetsCriterionScore[]; error: string | null }> {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("wets_score_criteria")
      .select("category, score, weight, justification, sources")
      .eq("project_id", projectId);
    if (error) return { criteria: [], error: error.message };
    const criteria: WetsCriterionScore[] = (data ?? []).map((r) => ({
      category: r.category as WetsCriterion,
      score: Number(r.score),
      weight: Number(r.weight),
      justification: r.justification ? String(r.justification) : "",
      sources: Array.isArray(r.sources)
        ? (r.sources as unknown[]).map(String)
        : [],
    }));
    return { criteria, error: null };
  } catch (e) {
    return {
      criteria: [],
      error: e instanceof Error ? e.message : "Supabase unavailable",
    };
  }
}

export async function createWetsProject(
  input: CreateWetsProjectInput
): Promise<{ project: WetsProject | null; error: string | null }> {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("wets_projects")
      .insert({
        owner_user_id: input.ownerUserId,
        name: input.name.trim(),
        ticker: input.ticker?.trim() || null,
        category: input.category,
        website_url: input.website_url?.trim() || null,
        description: input.description?.trim() || null,
        legal_structure: input.legal_structure?.trim() || null,
        jurisdiction: input.jurisdiction?.trim() || null,
        interconnection_queue_position:
          input.interconnection_queue_position?.trim() || null,
        permits_status: input.permits_status ?? "unknown",
        behind_the_meter: Boolean(input.behind_the_meter),
        pqc_checklist: input.pqc_checklist ?? {},
        pqc_evidence: input.pqc_evidence ?? {},
        shield_receipt_id: input.shield_receipt_id?.trim() || null,
        is_demo: Boolean(input.is_demo),
        status: "draft",
      })
      .select("*")
      .single();
    if (error || !data) {
      return { project: null, error: error?.message ?? "Insert failed" };
    }
    return { project: mapProject(data as Record<string, unknown>), error: null };
  } catch (e) {
    return {
      project: null,
      error: e instanceof Error ? e.message : "Supabase unavailable",
    };
  }
}

export async function upsertWetsCriteria(
  projectId: string,
  criteria: WetsCriterionScore[]
): Promise<{ error: string | null }> {
  try {
    const supabase = getSupabaseServerClient();
    const rows = criteria.map((c) => ({
      project_id: projectId,
      category: c.category,
      score: Math.max(0, Math.min(10, c.score)),
      weight: c.weight,
      justification: c.justification,
      sources: c.sources,
      scored_at: new Date().toISOString(),
    }));
    const { error } = await supabase.from("wets_score_criteria").upsert(rows, {
      onConflict: "project_id,category",
    });
    await supabase
      .from("wets_projects")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", projectId);
    return { error: error?.message ?? null };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Supabase unavailable" };
  }
}

export async function publishWetsProject(
  projectId: string,
  reportMarkdown: string,
  reportHtml: string
): Promise<{ slug: string | null; error: string | null }> {
  try {
    const supabase = getSupabaseServerClient();
    const slug = `wets-${projectId.replace(/-/g, "").slice(0, 12)}`;
    const { error } = await supabase
      .from("wets_projects")
      .update({
        status: "published",
        public_slug: slug,
        report_markdown: reportMarkdown,
        report_html: reportHtml,
        updated_at: new Date().toISOString(),
      })
      .eq("id", projectId);
    return { slug: error ? null : slug, error: error?.message ?? null };
  } catch (e) {
    return {
      slug: null,
      error: e instanceof Error ? e.message : "Supabase unavailable",
    };
  }
}

export type WetsRiskEvent = {
  id: string;
  region: string;
  event_type: string;
  description: string | null;
  source_url: string | null;
  event_date: string | null;
  severity: "low" | "medium" | "high";
  related_project_id: string | null;
  created_at: string;
};

export async function listWetsRiskEvents(opts?: {
  region?: string;
  projectId?: string;
}): Promise<{ events: WetsRiskEvent[]; error: string | null }> {
  try {
    const supabase = getSupabaseServerClient();
    let q = supabase
      .from("wets_risk_events")
      .select("*")
      .order("event_date", { ascending: false, nullsFirst: false })
      .limit(100);
    if (opts?.region) q = q.ilike("region", `%${opts.region}%`);
    if (opts?.projectId) q = q.eq("related_project_id", opts.projectId);
    const { data, error } = await q;
    if (error) return { events: [], error: error.message };
    const events: WetsRiskEvent[] = (data ?? []).map((r) => ({
      id: String(r.id),
      region: String(r.region),
      event_type: String(r.event_type),
      description: r.description ? String(r.description) : null,
      source_url: r.source_url ? String(r.source_url) : null,
      event_date: r.event_date ? String(r.event_date) : null,
      severity:
        r.severity === "high" || r.severity === "low" ? r.severity : "medium",
      related_project_id: r.related_project_id
        ? String(r.related_project_id)
        : null,
      created_at: String(r.created_at),
    }));
    return { events, error: null };
  } catch (e) {
    return {
      events: [],
      error: e instanceof Error ? e.message : "Supabase unavailable",
    };
  }
}

export async function createWetsRiskEvent(input: {
  region: string;
  event_type: string;
  description?: string;
  source_url?: string;
  event_date?: string;
  severity?: "low" | "medium" | "high";
  related_project_id?: string;
}): Promise<{ error: string | null }> {
  try {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("wets_risk_events").insert({
      region: input.region.trim(),
      event_type: input.event_type,
      description: input.description?.trim() || null,
      source_url: input.source_url?.trim() || null,
      event_date: input.event_date || null,
      severity: input.severity ?? "medium",
      related_project_id: input.related_project_id || null,
    });
    return { error: error?.message ?? null };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Supabase unavailable" };
  }
}

export function buildPublicReportMarkdown(input: {
  project: WetsProject;
  criteria: WetsCriterionScore[];
}): { markdown: string; html: string; final_score: number; grade: WetsGrade } {
  const final_score = computeFinalScore(input.criteria);
  const grade = gradeFromFinalScore(final_score);
  const lines = [
    `# ${input.project.name}${input.project.ticker ? ` (${input.project.ticker})` : ""}`,
    ``,
    `**AUROS Water/Energy Trust Score: ${final_score}/10 · Grade ${grade}**`,
    ``,
    input.project.description ?? "",
    ``,
    `Jurisdiction: ${input.project.jurisdiction ?? "—"}`,
    `Category: ${input.project.category}`,
    ``,
    `## Breakdown`,
    ...input.criteria.map(
      (c) =>
        `### ${c.category} — ${c.score}/10 (weight ${c.weight})\n${c.justification}\nSources: ${c.sources.join(", ") || "—"}`
    ),
    ``,
    `---`,
    `*${"AUROS Water/Energy Trust Score — indicative. Not investment advice."}*`,
  ];
  const markdown = lines.join("\n");
  const html = `<article class="wets-report"><h1>${escapeHtml(input.project.name)}</h1><p class="grade">Score ${final_score}/10 · Grade ${grade}</p><p>${escapeHtml(input.project.description ?? "")}</p>${input.criteria
    .map(
      (c) =>
        `<section><h2>${escapeHtml(c.category)} — ${c.score}/10</h2><p>${escapeHtml(c.justification)}</p></section>`
    )
    .join("")}<p class="disclaimer">Indicative — not investment advice.</p></article>`;
  return { markdown, html, final_score, grade };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
