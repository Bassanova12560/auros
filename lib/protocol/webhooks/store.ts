import { randomBytes } from "node:crypto";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

import { isSupabaseConfigured } from "../auth/keys";
import type { WebhookRegisterRequest } from "../schemas/webhooks";

export type WebhookRecord = {
  id: string;
  key_hash: string;
  url: string;
  events: string[];
  secret_hint: string | null;
  active: boolean;
  created_at: string;
};

const memoryStore = new Map<string, WebhookRecord[]>();
const DATA_DIR = join(process.cwd(), ".data");
const WEBHOOKS_FILE = join(DATA_DIR, "protocol-webhooks.json");

function loadFileStore(): Record<string, WebhookRecord[]> {
  try {
    if (!existsSync(WEBHOOKS_FILE)) return {};
    return JSON.parse(readFileSync(WEBHOOKS_FILE, "utf8")) as Record<
      string,
      WebhookRecord[]
    >;
  } catch {
    return {};
  }
}

function saveFileStore(data: Record<string, WebhookRecord[]>): void {
  try {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(WEBHOOKS_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch {
    // dev fallback
  }
}

function syncMemoryFromFile(): void {
  const data = loadFileStore();
  for (const [keyHash, records] of Object.entries(data)) {
    memoryStore.set(keyHash, records);
  }
}

syncMemoryFromFile();

async function supabaseClient() {
  const { getSupabaseServerClient } = await import("@/lib/supabase/server");
  return getSupabaseServerClient();
}

export async function registerWebhook(
  keyHash: string,
  input: WebhookRegisterRequest
): Promise<WebhookRecord> {
  const record: WebhookRecord = {
    id: `wh_${randomBytes(10).toString("hex")}`,
    key_hash: keyHash,
    url: input.url,
    events: input.events,
    secret_hint: "HMAC-SHA256 via X-AUROS-Signature",
    active: true,
    created_at: new Date().toISOString(),
  };

  const existing = memoryStore.get(keyHash) ?? [];
  existing.push(record);
  memoryStore.set(keyHash, existing);

  if (isSupabaseConfigured()) {
    try {
      const supabase = await supabaseClient();
      await supabase.from("protocol_webhooks").insert({
        id: record.id,
        key_hash: record.key_hash,
        url: record.url,
        events: record.events,
        secret_hint: record.secret_hint,
        active: record.active,
        created_at: record.created_at,
      });
    } catch {
      persistFile();
    }
  } else {
    persistFile();
  }

  return record;
}

function persistFile(): void {
  const data: Record<string, WebhookRecord[]> = {};
  for (const [k, v] of memoryStore.entries()) {
    data[k] = v;
  }
  saveFileStore(data);
}

export async function getWebhook(
  id: string,
  keyHash: string
): Promise<WebhookRecord | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await supabaseClient();
      const { data } = await supabase
        .from("protocol_webhooks")
        .select("*")
        .eq("id", id)
        .eq("key_hash", keyHash)
        .maybeSingle();
      if (data) return data as WebhookRecord;
    } catch {
      // fall through
    }
  }
  const list = memoryStore.get(keyHash) ?? [];
  return list.find((w) => w.id === id) ?? null;
}

export async function listWebhooksForKey(keyHash: string): Promise<WebhookRecord[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await supabaseClient();
      const { data } = await supabase
        .from("protocol_webhooks")
        .select("*")
        .eq("key_hash", keyHash)
        .eq("active", true);
      if (data) {
        memoryStore.set(keyHash, data as WebhookRecord[]);
        return data as WebhookRecord[];
      }
    } catch {
      // fall through
    }
  }
  return memoryStore.get(keyHash) ?? [];
}

export async function deleteWebhook(
  id: string,
  keyHash: string
): Promise<boolean> {
  const list = memoryStore.get(keyHash) ?? [];
  const idx = list.findIndex((w) => w.id === id);
  if (idx === -1) {
    if (isSupabaseConfigured()) {
      try {
        const supabase = await supabaseClient();
        const { data } = await supabase
          .from("protocol_webhooks")
          .select("id")
          .eq("id", id)
          .eq("key_hash", keyHash)
          .maybeSingle();
        if (!data) return false;
        await supabase
          .from("protocol_webhooks")
          .update({ active: false })
          .eq("id", id)
          .eq("key_hash", keyHash);
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }

  list[idx] = { ...list[idx], active: false };
  memoryStore.set(keyHash, list);

  if (isSupabaseConfigured()) {
    try {
      const supabase = await supabaseClient();
      await supabase
        .from("protocol_webhooks")
        .update({ active: false })
        .eq("id", id)
        .eq("key_hash", keyHash);
    } catch {
      persistFile();
    }
  } else {
    persistFile();
  }
  return true;
}
