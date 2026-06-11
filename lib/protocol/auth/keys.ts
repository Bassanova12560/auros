import { createHash, randomBytes } from "node:crypto";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

import { nanoid } from "nanoid";

import {
  DEMO_API_KEY,
  FREE_TIER_MONTHLY_LIMIT,
  KEY_PREFIX_LIVE,
  KEY_PREFIX_TEST,
} from "../constants";

/** True when Supabase server client can be used — production key store. */
export function isSupabaseConfigured(): boolean {
  return (
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.SUPABASE_SECRET_KEY)
  );
}

export type ApiKeyTier = "free" | "premium" | "monitor" | "enterprise";

export type ApiKeyRecord = {
  id: string;
  email: string;
  key_hash: string;
  prefix: "live" | "test";
  tier: ApiKeyTier;
  created_at: string;
  requests_this_month: number;
  month_key: string;
};

const memoryStore = new Map<string, ApiKeyRecord>();
const DATA_DIR = join(process.cwd(), ".data");
const KEYS_FILE = join(DATA_DIR, "protocol-api-keys.json");

function hashKey(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

function currentMonthKey(): string {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
}

function loadFileStore(): ApiKeyRecord[] {
  try {
    if (!existsSync(KEYS_FILE)) return [];
    const raw = readFileSync(KEYS_FILE, "utf8");
    const parsed = JSON.parse(raw) as ApiKeyRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveFileStore(records: ApiKeyRecord[]): void {
  try {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(KEYS_FILE, JSON.stringify(records, null, 2), "utf8");
  } catch {
    // dev fallback — memory only
  }
}

function syncMemoryFromFile(): void {
  for (const record of loadFileStore()) {
    memoryStore.set(record.key_hash, record);
  }
}

syncMemoryFromFile();

function generateRawKey(prefix: "live" | "test"): string {
  const token = nanoid(32);
  return prefix === "live" ? `${KEY_PREFIX_LIVE}${token}` : `${KEY_PREFIX_TEST}${token}`;
}

async function trySupabaseUpsert(record: ApiKeyRecord): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return false;
  }
  try {
    const { getSupabaseServerClient } = await import("@/lib/supabase/server");
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("api_keys").upsert({
      id: record.id,
      email: record.email,
      key_hash: record.key_hash,
      prefix: record.prefix,
      tier: record.tier,
      created_at: record.created_at,
      requests_this_month: record.requests_this_month,
      month_key: record.month_key,
    });
    return !error;
  } catch {
    return false;
  }
}

async function trySupabaseFindByHash(keyHash: string): Promise<ApiKeyRecord | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }
  try {
    const { getSupabaseServerClient } = await import("@/lib/supabase/server");
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("api_keys")
      .select("*")
      .eq("key_hash", keyHash)
      .maybeSingle();
    if (error || !data) return null;
    return data as ApiKeyRecord;
  } catch {
    return null;
  }
}

async function trySupabaseIncrement(keyHash: string, monthKey: string): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    const { getSupabaseServerClient } = await import("@/lib/supabase/server");
    const supabase = getSupabaseServerClient();
    const existing = await trySupabaseFindByHash(keyHash);
    if (!existing) return;
    const count =
      existing.month_key === monthKey ? existing.requests_this_month + 1 : 1;
    await supabase
      .from("api_keys")
      .update({ requests_this_month: count, month_key: monthKey })
      .eq("key_hash", keyHash);
  } catch {
    // ignore
  }
}

export function isValidKeyFormat(raw: string): boolean {
  return (
    raw === DEMO_API_KEY ||
    raw.startsWith(KEY_PREFIX_LIVE) ||
    raw.startsWith(KEY_PREFIX_TEST)
  );
}

export async function validateApiKey(
  raw: string
): Promise<{ valid: boolean; isDemo: boolean; keyHash: string | null; email?: string }> {
  if (!raw || !isValidKeyFormat(raw)) {
    return { valid: false, isDemo: false, keyHash: null };
  }
  if (raw === DEMO_API_KEY) {
    return { valid: true, isDemo: true, keyHash: "demo" };
  }

  const keyHash = hashKey(raw);
  let record: ApiKeyRecord | null | undefined = null;
  if (isSupabaseConfigured()) {
    record = await trySupabaseFindByHash(keyHash);
    if (record) memoryStore.set(keyHash, record);
  }
  if (!record) {
    record = memoryStore.get(keyHash);
  }
  if (!record) {
    const fromFile = loadFileStore().find((r) => r.key_hash === keyHash);
    if (fromFile) {
      record = fromFile;
      memoryStore.set(keyHash, fromFile);
    }
  }
  if (!record) return { valid: false, isDemo: false, keyHash: null };
  return { valid: true, isDemo: false, keyHash, email: record.email };
}

export async function incrementKeyUsage(keyHash: string): Promise<number> {
  if (keyHash === "demo") return 0;
  const monthKey = currentMonthKey();
  const record = memoryStore.get(keyHash);
  if (record) {
    if (record.month_key !== monthKey) {
      record.requests_this_month = 1;
      record.month_key = monthKey;
    } else {
      record.requests_this_month += 1;
    }
    memoryStore.set(keyHash, record);
    if (!isSupabaseConfigured()) {
      const all = [...memoryStore.values()];
      saveFileStore(all);
    }
    await trySupabaseIncrement(keyHash, monthKey);
    return record.requests_this_month;
  }
  if (isSupabaseConfigured()) {
    await trySupabaseIncrement(keyHash, monthKey);
  }
  return 1;
}

export async function getKeyUsage(keyHash: string): Promise<number> {
  if (keyHash === "demo") return 0;
  let record = isSupabaseConfigured() ? await trySupabaseFindByHash(keyHash) : null;
  if (!record) record = memoryStore.get(keyHash) ?? null;
  const monthKey = currentMonthKey();
  if (!record) return 0;
  return record.month_key === monthKey ? record.requests_this_month : 0;
}

export async function findKeyRecord(keyHash: string): Promise<ApiKeyRecord | null> {
  if (keyHash === "demo") return null;
  if (isSupabaseConfigured()) {
    const record = await trySupabaseFindByHash(keyHash);
    if (record) {
      memoryStore.set(keyHash, record);
      return record;
    }
  }
  const fromMemory = memoryStore.get(keyHash);
  if (fromMemory) return fromMemory;
  const fromFile = loadFileStore().find((r) => r.key_hash === keyHash);
  if (fromFile) {
    memoryStore.set(keyHash, fromFile);
    return fromFile;
  }
  return null;
}

export async function createApiKey(email: string): Promise<{
  apiKey: string;
  tier: "free";
  monthlyLimit: number;
}> {
  const prefix: "live" | "test" = process.env.NODE_ENV === "production" ? "live" : "test";
  const apiKey = generateRawKey(prefix);
  const record: ApiKeyRecord = {
    id: randomBytes(16).toString("hex"),
    email: email.toLowerCase(),
    key_hash: hashKey(apiKey),
    prefix,
    tier: "free",
    created_at: new Date().toISOString(),
    requests_this_month: 0,
    month_key: currentMonthKey(),
  };

  memoryStore.set(record.key_hash, record);

  if (isSupabaseConfigured()) {
    const ok = await trySupabaseUpsert(record);
    if (!ok) {
      const all = [...memoryStore.values()];
      saveFileStore(all);
    }
  } else {
    const all = [...memoryStore.values()];
    saveFileStore(all);
  }

  return { apiKey, tier: "free", monthlyLimit: FREE_TIER_MONTHLY_LIMIT };
}

export { hashKey, FREE_TIER_MONTHLY_LIMIT };
