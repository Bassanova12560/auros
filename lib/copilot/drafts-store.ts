import { randomUUID } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { isSupabaseConfigured } from "@/lib/protocol/auth/keys";

import type {
  CopilotDraft,
  CopilotDraftKind,
  CopilotDraftStatus,
} from "./types";

const DATA_DIR = join(process.cwd(), ".data");
const FILE = join(DATA_DIR, "copilot-drafts.json");

const memory = new Map<string, CopilotDraft>();

function loadFile() {
  if (!existsSync(FILE)) return;
  try {
    const raw = JSON.parse(readFileSync(FILE, "utf8")) as CopilotDraft[];
    for (const d of raw) memory.set(d.id, d);
  } catch {
    /* ignore */
  }
}

function persistFile() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(FILE, JSON.stringify([...memory.values()], null, 2));
}

loadFile();

function rowToDraft(row: Record<string, unknown>): CopilotDraft {
  return {
    id: String(row.id),
    kind: row.kind as CopilotDraftKind,
    status: row.status as CopilotDraftStatus,
    title: String(row.title),
    rationale: String(row.rationale ?? ""),
    proposed_patch: (row.proposed_patch as Record<string, unknown>) ?? {},
    confidence: Number(row.confidence ?? 0),
    product_id: (row.product_id as string | null) ?? null,
    apply_result: (row.apply_result as string | null) ?? null,
    created_at: String(row.created_at),
    reviewed_at: (row.reviewed_at as string | null) ?? null,
    review_note: (row.review_note as string | null) ?? null,
  };
}

export async function insertCopilotDraft(input: {
  kind: CopilotDraftKind;
  title: string;
  rationale: string;
  proposed_patch: Record<string, unknown>;
  confidence: number;
  product_id?: string | null;
}): Promise<CopilotDraft> {
  const draft: CopilotDraft = {
    id: randomUUID(),
    kind: input.kind,
    status: "pending",
    title: input.title,
    rationale: input.rationale,
    proposed_patch: input.proposed_patch,
    confidence: Math.min(1, Math.max(0, input.confidence)),
    product_id: input.product_id ?? null,
    apply_result: null,
    created_at: new Date().toISOString(),
    reviewed_at: null,
    review_note: null,
  };

  if (isSupabaseConfigured()) {
    try {
      const { getSupabaseServerClient } = await import("@/lib/supabase/server");
      const supabase = getSupabaseServerClient();
      const { data, error } = await supabase
        .from("copilot_drafts")
        .insert({
          id: draft.id,
          kind: draft.kind,
          status: draft.status,
          title: draft.title,
          rationale: draft.rationale,
          proposed_patch: draft.proposed_patch,
          confidence: draft.confidence,
          product_id: draft.product_id,
        })
        .select("*")
        .single();
      if (!error && data) return rowToDraft(data as Record<string, unknown>);
    } catch (e) {
      console.warn("[copilot-drafts] supabase insert fallback", e);
    }
  }

  memory.set(draft.id, draft);
  persistFile();
  return draft;
}

export async function listCopilotDrafts(query?: {
  status?: CopilotDraftStatus;
  kind?: CopilotDraftKind;
  limit?: number;
}): Promise<CopilotDraft[]> {
  const limit = Math.min(query?.limit ?? 50, 100);

  if (isSupabaseConfigured()) {
    try {
      const { getSupabaseServerClient } = await import("@/lib/supabase/server");
      const supabase = getSupabaseServerClient();
      let q = supabase
        .from("copilot_drafts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);
      if (query?.status) q = q.eq("status", query.status);
      if (query?.kind) q = q.eq("kind", query.kind);
      const { data, error } = await q;
      if (!error && data) {
        return (data as Record<string, unknown>[]).map(rowToDraft);
      }
    } catch (e) {
      console.warn("[copilot-drafts] supabase list fallback", e);
    }
  }

  let items = [...memory.values()];
  if (query?.status) items = items.filter((d) => d.status === query.status);
  if (query?.kind) items = items.filter((d) => d.kind === query.kind);
  items.sort((a, b) => b.created_at.localeCompare(a.created_at));
  return items.slice(0, limit);
}

export async function getCopilotDraft(
  id: string
): Promise<CopilotDraft | null> {
  if (isSupabaseConfigured()) {
    try {
      const { getSupabaseServerClient } = await import("@/lib/supabase/server");
      const supabase = getSupabaseServerClient();
      const { data, error } = await supabase
        .from("copilot_drafts")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (!error && data) return rowToDraft(data as Record<string, unknown>);
    } catch {
      /* fallback */
    }
  }
  return memory.get(id) ?? null;
}

export async function reviewCopilotDraft(input: {
  id: string;
  status: "approved" | "rejected";
  review_note?: string;
}): Promise<CopilotDraft | null> {
  const existing = await getCopilotDraft(input.id);
  if (!existing || existing.status !== "pending") return null;

  const apply_result =
    input.status === "approved"
      ? "queued_for_manual_merge"
      : "rejected_no_apply";
  const reviewed_at = new Date().toISOString();
  const review_note = input.review_note?.trim() || null;

  if (isSupabaseConfigured()) {
    try {
      const { getSupabaseServerClient } = await import("@/lib/supabase/server");
      const supabase = getSupabaseServerClient();
      const { data, error } = await supabase
        .from("copilot_drafts")
        .update({
          status: input.status,
          reviewed_at,
          review_note,
          apply_result,
        })
        .eq("id", input.id)
        .eq("status", "pending")
        .select("*")
        .maybeSingle();
      if (!error && data) return rowToDraft(data as Record<string, unknown>);
    } catch (e) {
      console.warn("[copilot-drafts] supabase review fallback", e);
    }
  }

  const updated: CopilotDraft = {
    ...existing,
    status: input.status,
    reviewed_at,
    review_note,
    apply_result,
  };
  memory.set(updated.id, updated);
  persistFile();
  return updated;
}
