import { randomBytes } from "node:crypto";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

import { isSupabaseConfigured } from "../auth/keys";
import type { RegulatoryTag } from "./feed";
import type { RegulatorySubscribeRequest } from "../schemas/regulatory";

export type RegulatorySubscription = {
  id: string;
  key_hash: string;
  email: string | null;
  jurisdictions: string[];
  tags: RegulatoryTag[];
  webhook_url: string | null;
  status: "active" | "deleted";
  created_at: string;
  updated_at: string;
  last_notified_at: string | null;
};

const memoryStore = new Map<string, RegulatorySubscription>();
const DATA_DIR = join(process.cwd(), ".data");
const SUBS_FILE = join(DATA_DIR, "protocol-regulatory-subscriptions.json");

function loadFileStore(): RegulatorySubscription[] {
  try {
    if (!existsSync(SUBS_FILE)) return [];
    const parsed = JSON.parse(readFileSync(SUBS_FILE, "utf8")) as RegulatorySubscription[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveFileStore(records: RegulatorySubscription[]): void {
  try {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(SUBS_FILE, JSON.stringify(records, null, 2), "utf8");
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

export async function countActiveRegulatorySubscriptions(
  keyHash: string
): Promise<number> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await supabaseClient();
      const { count } = await supabase
        .from("protocol_regulatory_subscriptions")
        .select("*", { count: "exact", head: true })
        .eq("key_hash", keyHash)
        .eq("status", "active");
      return count ?? 0;
    } catch {
      // fall through
    }
  }
  return [...memoryStore.values()].filter(
    (s) => s.key_hash === keyHash && s.status === "active"
  ).length;
}

export async function createRegulatorySubscription(
  keyHash: string,
  input: RegulatorySubscribeRequest,
  email?: string
): Promise<RegulatorySubscription> {
  const now = new Date().toISOString();
  const record: RegulatorySubscription = {
    id: `regsub_${randomBytes(12).toString("hex")}`,
    key_hash: keyHash,
    email: input.email ?? email ?? null,
    jurisdictions: input.jurisdictions.map((j) => j.toLowerCase()),
    tags: input.tags ?? [],
    webhook_url: input.webhook_url ?? null,
    status: "active",
    created_at: now,
    updated_at: now,
    last_notified_at: null,
  };

  memoryStore.set(record.id, record);

  if (isSupabaseConfigured()) {
    try {
      const supabase = await supabaseClient();
      const { error } = await supabase.from("protocol_regulatory_subscriptions").insert({
        id: record.id,
        key_hash: record.key_hash,
        email: record.email,
        jurisdictions: record.jurisdictions,
        tags: record.tags,
        webhook_url: record.webhook_url,
        status: record.status,
        created_at: record.created_at,
        updated_at: record.updated_at,
      });
      if (error) saveFileStore([...memoryStore.values()]);
    } catch {
      saveFileStore([...memoryStore.values()]);
    }
  } else {
    saveFileStore([...memoryStore.values()]);
  }

  return record;
}

export async function getRegulatorySubscription(
  id: string,
  keyHash: string
): Promise<RegulatorySubscription | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await supabaseClient();
      const { data } = await supabase
        .from("protocol_regulatory_subscriptions")
        .select("*")
        .eq("id", id)
        .eq("key_hash", keyHash)
        .neq("status", "deleted")
        .maybeSingle();
      if (data) {
        const record = data as RegulatorySubscription;
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
  return record;
}

export async function deleteRegulatorySubscription(
  id: string,
  keyHash: string
): Promise<boolean> {
  const existing = await getRegulatorySubscription(id, keyHash);
  if (!existing) return false;

  const updated: RegulatorySubscription = {
    ...existing,
    status: "deleted",
    updated_at: new Date().toISOString(),
  };
  memoryStore.set(id, updated);

  if (isSupabaseConfigured()) {
    try {
      const supabase = await supabaseClient();
      await supabase
        .from("protocol_regulatory_subscriptions")
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

export async function listActiveRegulatorySubscriptions(): Promise<
  RegulatorySubscription[]
> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await supabaseClient();
      const { data } = await supabase
        .from("protocol_regulatory_subscriptions")
        .select("*")
        .eq("status", "active");
      if (data) return data as RegulatorySubscription[];
    } catch {
      // fall through
    }
  }
  return [...memoryStore.values()].filter((s) => s.status === "active");
}

export async function markRegulatorySubscriptionNotified(id: string): Promise<void> {
  const now = new Date().toISOString();
  const record = memoryStore.get(id);
  if (record) {
    record.last_notified_at = now;
    record.updated_at = now;
    memoryStore.set(id, record);
  }
  if (isSupabaseConfigured()) {
    try {
      const supabase = await supabaseClient();
      await supabase
        .from("protocol_regulatory_subscriptions")
        .update({ last_notified_at: now, updated_at: now })
        .eq("id", id);
    } catch {
      if (record) saveFileStore([...memoryStore.values()]);
    }
  }
}
