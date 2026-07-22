/**
 * Proof Stream v0 — append-only journal keyed by Asset DNA.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { randomBytes } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

export type ProofStreamAction =
  | "dna.minted"
  | "market.submitted"
  | "market.approved"
  | "market.rejected"
  | "label.submitted"
  | "registry.published"
  | "compliance.updated"
  | "doc.attached"
  | "event.certified";

export type ProofStreamEvent = {
  id: string;
  assetDnaId: string;
  action: ProofStreamAction;
  contentHash?: string;
  meta?: Record<string, unknown>;
  createdAt: string;
};

const DATA_DIR = join(process.cwd(), ".data");
const FILE = join(DATA_DIR, "proof-stream.json");

function load(): ProofStreamEvent[] {
  try {
    if (!existsSync(FILE)) return [];
    const parsed = JSON.parse(readFileSync(FILE, "utf8")) as ProofStreamEvent[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function save(rows: ProofStreamEvent[]): void {
  try {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(FILE, JSON.stringify(rows.slice(-20_000), null, 2), "utf8");
  } catch {
    // ignore
  }
}

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SECRET_KEY?.trim();
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function mirrorEventToSupabase(event: ProofStreamEvent): Promise<void> {
  const supabase = getAdminClient();
  if (!supabase) return;
  const { error } = await supabase.from("proof_stream_events").upsert({
    id: event.id,
    asset_dna_id: event.assetDnaId,
    action: event.action,
    content_hash: event.contentHash ?? null,
    meta: event.meta ?? {},
    created_at: event.createdAt,
  });
  if (error) {
    console.warn("[proof-stream] mirror", error.message);
  }
}

export function appendProofStreamEvent(input: {
  assetDnaId: string;
  action: ProofStreamAction;
  contentHash?: string;
  meta?: Record<string, unknown>;
}): ProofStreamEvent {
  const event: ProofStreamEvent = {
    id: `ps_${randomBytes(10).toString("hex")}`,
    assetDnaId: input.assetDnaId,
    action: input.action,
    contentHash: input.contentHash,
    meta: input.meta,
    createdAt: new Date().toISOString(),
  };
  const all = load();
  all.push(event);
  save(all);
  void mirrorEventToSupabase(event).catch(() => undefined);
  return event;
}

export function listProofStreamEvents(
  assetDnaId: string,
  limit = 50
): ProofStreamEvent[] {
  return load()
    .filter((e) => e.assetDnaId === assetDnaId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, Math.min(limit, 200));
}

export async function listProofStreamEventsAsync(
  assetDnaId: string,
  limit = 50
): Promise<ProofStreamEvent[]> {
  const local = listProofStreamEvents(assetDnaId, limit);
  const supabase = getAdminClient();
  if (!supabase) return local;

  const { data, error } = await supabase
    .from("proof_stream_events")
    .select("*")
    .eq("asset_dna_id", assetDnaId)
    .order("created_at", { ascending: false })
    .limit(Math.min(limit, 200));

  if (error || !data?.length) return local;

  const remote: ProofStreamEvent[] = data.map((row) => ({
    id: String(row.id),
    assetDnaId: String(row.asset_dna_id),
    action: row.action as ProofStreamAction,
    contentHash: row.content_hash ? String(row.content_hash) : undefined,
    meta: (row.meta ?? {}) as Record<string, unknown>,
    createdAt: String(row.created_at),
  }));

  const byId = new Map<string, ProofStreamEvent>();
  for (const e of [...local, ...remote]) byId.set(e.id, e);
  const merged = [...byId.values()].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );
  save([...load().filter((e) => e.assetDnaId !== assetDnaId), ...merged].slice(-20_000));
  return merged.slice(0, Math.min(limit, 200));
}
