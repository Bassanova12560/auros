import { randomBytes } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { isSupabaseConfigured } from "../auth/keys";
import { getMonitor } from "../monitor/store";
import type { ScoreRequest } from "../schemas/score";
import type { ProtocolScoreResult } from "./compute-score";

export type ScoreHistoryRecord = {
  id: number;
  score_id: string;
  key_hash: string;
  score: number;
  grade: string;
  payload: ScoreHistoryPayload;
  created_at: string;
};

export type ScoreHistoryPayload = {
  request: Partial<ScoreRequest>;
  status: ProtocolScoreResult["status"];
  breakdown: ProtocolScoreResult["breakdown"];
  mica_classification: ProtocolScoreResult["mica_classification"];
  monitor_id?: string;
};

const SCORE_ID_RE = /^(scr|mon)_[a-f0-9]{24}$/;

const memoryStore: ScoreHistoryRecord[] = [];
let memoryNextId = 1;
const DATA_DIR = join(process.cwd(), ".data");
const HISTORY_FILE = join(DATA_DIR, "protocol-score-history.json");

function loadFileStore(): ScoreHistoryRecord[] {
  try {
    if (!existsSync(HISTORY_FILE)) return [];
    const parsed = JSON.parse(readFileSync(HISTORY_FILE, "utf8")) as ScoreHistoryRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveFileStore(records: ScoreHistoryRecord[]): void {
  try {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(HISTORY_FILE, JSON.stringify(records, null, 2), "utf8");
  } catch {
    // dev fallback
  }
}

function syncMemoryFromFile(): void {
  const fromFile = loadFileStore();
  if (fromFile.length === 0) return;
  memoryStore.splice(0, memoryStore.length, ...fromFile);
  const maxId = fromFile.reduce((m, r) => Math.max(m, r.id), 0);
  memoryNextId = maxId + 1;
}

syncMemoryFromFile();

async function supabaseClient() {
  const { getSupabaseServerClient } = await import("@/lib/supabase/server");
  return getSupabaseServerClient();
}

export function newScoreId(): string {
  return `scr_${randomBytes(12).toString("hex")}`;
}

export function isValidScoreSessionId(id: string): boolean {
  return SCORE_ID_RE.test(id);
}

function buildPayload(
  request: ScoreRequest,
  result: ProtocolScoreResult,
  monitorId?: string
): ScoreHistoryPayload {
  const { score_id: _scoreId, monitor_id: _monitorId, record_history: _rh, ...requestFields } =
    request;
  return {
    request: requestFields,
    status: result.status,
    breakdown: result.breakdown,
    mica_classification: result.mica_classification,
    ...(monitorId ? { monitor_id: monitorId } : {}),
  };
}

export async function scoreSessionOwnedByKey(
  scoreId: string,
  keyHash: string
): Promise<boolean> {
  if (!isValidScoreSessionId(scoreId)) return false;

  if (scoreId.startsWith("mon_")) {
    const monitor = await getMonitor(scoreId, keyHash);
    return monitor !== null;
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = await supabaseClient();
      const { count } = await supabase
        .from("protocol_score_history")
        .select("*", { count: "exact", head: true })
        .eq("score_id", scoreId)
        .eq("key_hash", keyHash);
      if ((count ?? 0) > 0) return true;
    } catch {
      // fall through
    }
  }

  return memoryStore.some((r) => r.score_id === scoreId && r.key_hash === keyHash);
}

export async function resolveScoreSessionId(
  input: Pick<ScoreRequest, "score_id" | "monitor_id">,
  keyHash: string
): Promise<
  | { ok: true; scoreId: string; monitorId?: string }
  | { ok: false; code: string; message: string }
> {
  if (input.monitor_id) {
    if (!isValidScoreSessionId(input.monitor_id) || !input.monitor_id.startsWith("mon_")) {
      return { ok: false, code: "validation_error", message: "Invalid monitor_id" };
    }
    const monitor = await getMonitor(input.monitor_id, keyHash);
    if (!monitor) {
      return { ok: false, code: "not_found", message: "Monitor introuvable ou accès refusé" };
    }
    if (input.score_id) {
      if (!isValidScoreSessionId(input.score_id)) {
        return { ok: false, code: "validation_error", message: "Invalid score_id" };
      }
      const owned = await scoreSessionOwnedByKey(input.score_id, keyHash);
      if (!owned) {
        return {
          ok: false,
          code: "not_found",
          message: "Score session introuvable ou accès refusé",
        };
      }
      return { ok: true, scoreId: input.score_id, monitorId: input.monitor_id };
    }
    return { ok: true, scoreId: input.monitor_id, monitorId: input.monitor_id };
  }

  if (input.score_id) {
    if (!isValidScoreSessionId(input.score_id)) {
      return { ok: false, code: "validation_error", message: "Invalid score_id" };
    }
    const owned = await scoreSessionOwnedByKey(input.score_id, keyHash);
    if (!owned) {
      return {
        ok: false,
        code: "not_found",
        message: "Score session introuvable ou accès refusé",
      };
    }
    return { ok: true, scoreId: input.score_id };
  }

  return { ok: true, scoreId: newScoreId() };
}

function appendMemory(record: Omit<ScoreHistoryRecord, "id">): ScoreHistoryRecord {
  const full: ScoreHistoryRecord = { ...record, id: memoryNextId++ };
  memoryStore.push(full);
  saveFileStore(memoryStore);
  return full;
}

export async function recordScoreHistory(
  keyHash: string,
  scoreId: string,
  request: ScoreRequest,
  result: ProtocolScoreResult,
  monitorId?: string
): Promise<ScoreHistoryRecord> {
  const payload = buildPayload(request, result, monitorId);
  const row = {
    score_id: scoreId,
    key_hash: keyHash,
    score: result.score,
    grade: result.grade,
    payload,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    try {
      const supabase = await supabaseClient();
      const { data, error } = await supabase
        .from("protocol_score_history")
        .insert({
          score_id: row.score_id,
          key_hash: row.key_hash,
          score: row.score,
          grade: row.grade,
          payload: row.payload,
          created_at: row.created_at,
        })
        .select("id, score_id, key_hash, score, grade, payload, created_at")
        .single();
      if (!error && data) {
        const record = data as ScoreHistoryRecord;
        memoryStore.push(record);
        return record;
      }
    } catch {
      // fall through to file/memory
    }
  }

  return appendMemory(row);
}

export async function listScoreHistory(
  id: string,
  keyHash: string
): Promise<{ kind: "session" | "monitor"; entries: ScoreHistoryRecord[] } | null> {
  if (!isValidScoreSessionId(id)) return null;

  if (id.startsWith("mon_")) {
    const monitor = await getMonitor(id, keyHash);
    if (!monitor) return null;
    const entries = await fetchHistoryRows(id, keyHash, id);
    return { kind: "monitor", entries };
  }

  const owned = await scoreSessionOwnedByKey(id, keyHash);
  if (!owned) return null;
  const entries = await fetchHistoryRows(id, keyHash);
  return { kind: "session", entries };
}

async function fetchHistoryRows(
  scoreId: string,
  keyHash: string,
  monitorId?: string
): Promise<ScoreHistoryRecord[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await supabaseClient();
      let query = supabase
        .from("protocol_score_history")
        .select("id, score_id, key_hash, score, grade, payload, created_at")
        .eq("key_hash", keyHash)
        .order("created_at", { ascending: true });

      if (monitorId) {
        query = query.or(`score_id.eq.${scoreId},payload->>monitor_id.eq.${monitorId}`);
      } else {
        query = query.eq("score_id", scoreId);
      }

      const { data } = await query;
      if (data) return data as ScoreHistoryRecord[];
    } catch {
      // fall through
    }
  }

  return memoryStore
    .filter((r) => {
      if (r.key_hash !== keyHash) return false;
      if (monitorId) {
        return r.score_id === scoreId || r.payload.monitor_id === monitorId;
      }
      return r.score_id === scoreId;
    })
    .sort((a, b) => a.created_at.localeCompare(b.created_at));
}
