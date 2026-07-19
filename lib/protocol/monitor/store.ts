import { randomBytes } from "node:crypto";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

import { isSupabaseConfigured } from "../auth/keys";
import type { MonitorRequest } from "../schemas/monitor";

import {
  baselineFeedIdsForMonitor,
  REGULATORY_RULES_VERSION,
} from "./delta";

export type MonitorRecord = {
  id: string;
  key_hash: string;
  email: string | null;
  asset_type: string;
  jurisdiction: string;
  structure: string;
  webhook_url: string | null;
  alert_on: string[];
  baseline_score: number | null;
  /** Twin snapshot — curated ruleset version at creation. */
  rules_version: string;
  /** Feed item ids matched at creation; delta = new matches outside this set. */
  baseline_feed_ids: string[];
  status: "active" | "paused" | "deleted";
  created_at: string;
  updated_at: string;
  last_checked_at: string | null;
  last_alert_at: string | null;
};

function normalizeMonitorRow(data: MonitorRecord): MonitorRecord {
  return {
    ...data,
    rules_version: data.rules_version ?? REGULATORY_RULES_VERSION,
    baseline_feed_ids: Array.isArray(data.baseline_feed_ids)
      ? data.baseline_feed_ids
      : [],
  };
}

const memoryStore = new Map<string, MonitorRecord>();
const DATA_DIR = join(process.cwd(), ".data");
const MONITORS_FILE = join(DATA_DIR, "protocol-monitors.json");

function loadFileStore(): MonitorRecord[] {
  try {
    if (!existsSync(MONITORS_FILE)) return [];
    const parsed = JSON.parse(readFileSync(MONITORS_FILE, "utf8")) as MonitorRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveFileStore(records: MonitorRecord[]): void {
  try {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(MONITORS_FILE, JSON.stringify(records, null, 2), "utf8");
  } catch {
    // dev fallback
  }
}

function syncMemoryFromFile(): void {
  for (const record of loadFileStore()) {
    if (record.status !== "deleted") memoryStore.set(record.id, record);
  }
}

syncMemoryFromFile();

async function supabaseClient() {
  const { getSupabaseServerClient } = await import("@/lib/supabase/server");
  return getSupabaseServerClient();
}

export async function countActiveMonitors(keyHash: string): Promise<number> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await supabaseClient();
      const { count } = await supabase
        .from("protocol_monitors")
        .select("*", { count: "exact", head: true })
        .eq("key_hash", keyHash)
        .eq("status", "active");
      return count ?? 0;
    } catch {
      // fall through
    }
  }
  return [...memoryStore.values()].filter(
    (m) => m.key_hash === keyHash && m.status === "active"
  ).length;
}

export async function createMonitor(
  keyHash: string,
  input: MonitorRequest,
  email?: string
): Promise<MonitorRecord> {
  const now = new Date().toISOString();
  const jurisdiction = input.jurisdiction.toLowerCase();
  const baseline_feed_ids = baselineFeedIdsForMonitor({
    jurisdiction,
    asset_type: input.asset_type,
    alert_on: input.alert_on,
  });
  const record: MonitorRecord = {
    id: `mon_${randomBytes(12).toString("hex")}`,
    key_hash: keyHash,
    email: input.email ?? email ?? null,
    asset_type: input.asset_type,
    jurisdiction,
    structure: input.structure,
    webhook_url: input.webhook_url ?? null,
    alert_on: input.alert_on,
    baseline_score: input.baseline_score ?? null,
    rules_version: REGULATORY_RULES_VERSION,
    baseline_feed_ids,
    status: "active",
    created_at: now,
    updated_at: now,
    last_checked_at: null,
    last_alert_at: null,
  };

  memoryStore.set(record.id, record);

  if (isSupabaseConfigured()) {
    try {
      const supabase = await supabaseClient();
      const { error } = await supabase.from("protocol_monitors").insert({
        id: record.id,
        key_hash: record.key_hash,
        email: record.email,
        asset_type: record.asset_type,
        jurisdiction: record.jurisdiction,
        structure: record.structure,
        webhook_url: record.webhook_url,
        alert_on: record.alert_on,
        baseline_score: record.baseline_score,
        rules_version: record.rules_version,
        baseline_feed_ids: record.baseline_feed_ids,
        status: record.status,
        created_at: record.created_at,
        updated_at: record.updated_at,
      });
      if (error) {
        saveFileStore([...memoryStore.values()]);
      }
    } catch {
      saveFileStore([...memoryStore.values()]);
    }
  } else {
    saveFileStore([...memoryStore.values()]);
  }

  return record;
}

export async function getMonitor(
  id: string,
  keyHash: string
): Promise<MonitorRecord | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await supabaseClient();
      const { data } = await supabase
        .from("protocol_monitors")
        .select("*")
        .eq("id", id)
        .eq("key_hash", keyHash)
        .neq("status", "deleted")
        .maybeSingle();
      if (data) {
        const record = normalizeMonitorRow(data as MonitorRecord);
        memoryStore.set(id, record);
        return record;
      }
    } catch {
      // fall through
    }
  }
  const record = memoryStore.get(id);
  if (!record || record.key_hash !== keyHash || record.status === "deleted") {
    return null;
  }
  return normalizeMonitorRow(record);
}

export async function listMonitorsForKey(keyHash: string): Promise<MonitorRecord[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await supabaseClient();
      const { data } = await supabase
        .from("protocol_monitors")
        .select("*")
        .eq("key_hash", keyHash)
        .neq("status", "deleted")
        .order("created_at", { ascending: false });
      if (data) {
        return (data as MonitorRecord[]).map(normalizeMonitorRow);
      }
    } catch {
      // fall through
    }
  }
  return [...memoryStore.values()]
    .filter((m) => m.key_hash === keyHash && m.status !== "deleted")
    .map(normalizeMonitorRow)
    .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
}

export async function deleteMonitor(id: string, keyHash: string): Promise<boolean> {
  const existing = await getMonitor(id, keyHash);
  if (!existing) return false;

  const updated: MonitorRecord = {
    ...existing,
    status: "deleted",
    updated_at: new Date().toISOString(),
  };
  memoryStore.set(id, updated);

  if (isSupabaseConfigured()) {
    try {
      const supabase = await supabaseClient();
      await supabase
        .from("protocol_monitors")
        .update({ status: "deleted", updated_at: updated.updated_at })
        .eq("id", id)
        .eq("key_hash", keyHash);
    } catch {
      saveFileStore([...memoryStore.values()]);
    }
  } else {
    saveFileStore([...memoryStore.values()]);
  }
  return true;
}

export async function listActiveMonitors(): Promise<MonitorRecord[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await supabaseClient();
      const { data } = await supabase
        .from("protocol_monitors")
        .select("*")
        .eq("status", "active");
      if (data) return (data as MonitorRecord[]).map(normalizeMonitorRow);
    } catch {
      // fall through
    }
  }
  return [...memoryStore.values()]
    .filter((m) => m.status === "active")
    .map(normalizeMonitorRow);
}

export async function markMonitorChecked(
  id: string,
  alertSent: boolean
): Promise<void> {
  const now = new Date().toISOString();
  const record = memoryStore.get(id);
  if (record) {
    record.last_checked_at = now;
    if (alertSent) record.last_alert_at = now;
    record.updated_at = now;
    memoryStore.set(id, record);
  }
  if (isSupabaseConfigured()) {
    try {
      const supabase = await supabaseClient();
      await supabase
        .from("protocol_monitors")
        .update({
          last_checked_at: now,
          ...(alertSent ? { last_alert_at: now } : {}),
          updated_at: now,
        })
        .eq("id", id);
    } catch {
      if (record) saveFileStore([...memoryStore.values()]);
    }
  }
}
