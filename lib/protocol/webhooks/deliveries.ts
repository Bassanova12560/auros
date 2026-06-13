import { randomBytes } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { isSupabaseConfigured } from "../auth/keys";
import {
  WEBHOOK_MAX_DELIVERY_ATTEMPTS,
  webhookRetryDelayMs,
} from "./constants";
import {
  dispatchWebhook,
  type WebhookEventPayload,
} from "./sign";

export type WebhookDeliveryStatus =
  | "pending"
  | "delivered"
  | "failed"
  | "dead_letter";

export type WebhookDeliveryRecord = {
  id: string;
  webhook_id: string | null;
  key_hash: string;
  url: string;
  event: string;
  payload: WebhookEventPayload;
  status: WebhookDeliveryStatus;
  attempts: number;
  last_error: string | null;
  created_at: string;
  next_retry_at: string | null;
  delivered_at: string | null;
};

export type ListDeliveriesOptions = {
  limit?: number;
  offset?: number;
  status?: WebhookDeliveryStatus;
};

export type DeliveryAttemptResult = {
  delivery: WebhookDeliveryRecord;
  ok: boolean;
};

const memoryStore: WebhookDeliveryRecord[] = [];
const DATA_DIR = join(process.cwd(), ".data");
const DELIVERIES_FILE = join(DATA_DIR, "protocol-webhook-deliveries.json");

function loadFileStore(): WebhookDeliveryRecord[] {
  try {
    if (!existsSync(DELIVERIES_FILE)) return [];
    const parsed = JSON.parse(readFileSync(DELIVERIES_FILE, "utf8")) as WebhookDeliveryRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveFileStore(records: WebhookDeliveryRecord[]): void {
  try {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(DELIVERIES_FILE, JSON.stringify(records, null, 2), "utf8");
  } catch {
    // dev fallback
  }
}

function syncMemoryFromFile(): void {
  const fromFile = loadFileStore();
  if (fromFile.length === 0) return;
  memoryStore.splice(0, memoryStore.length, ...fromFile);
}

syncMemoryFromFile();

function persistMemory(): void {
  saveFileStore([...memoryStore]);
}

async function supabaseClient() {
  const { getSupabaseServerClient } = await import("@/lib/supabase/server");
  return getSupabaseServerClient();
}

function newDeliveryId(): string {
  return `whd_${randomBytes(10).toString("hex")}`;
}

function rowToRecord(row: Record<string, unknown>): WebhookDeliveryRecord {
  return {
    id: row.id as string,
    webhook_id: (row.webhook_id as string | null) ?? null,
    key_hash: row.key_hash as string,
    url: row.url as string,
    event: row.event as string,
    payload: row.payload as WebhookEventPayload,
    status: row.status as WebhookDeliveryStatus,
    attempts: row.attempts as number,
    last_error: (row.last_error as string | null) ?? null,
    created_at: row.created_at as string,
    next_retry_at: (row.next_retry_at as string | null) ?? null,
    delivered_at: (row.delivered_at as string | null) ?? null,
  };
}

function upsertMemory(record: WebhookDeliveryRecord): void {
  const idx = memoryStore.findIndex((d) => d.id === record.id);
  if (idx === -1) memoryStore.unshift(record);
  else memoryStore[idx] = record;
}

export function deliveryToPublic(record: WebhookDeliveryRecord) {
  return {
    id: record.id,
    webhook_id: record.webhook_id,
    event: record.event,
    status: record.status,
    attempts: record.attempts,
    last_error: record.last_error,
    created_at: record.created_at,
    next_retry_at: record.next_retry_at,
    delivered_at: record.delivered_at,
    url: record.url,
  };
}

async function insertDelivery(
  input: Omit<
    WebhookDeliveryRecord,
    "id" | "status" | "attempts" | "last_error" | "next_retry_at" | "delivered_at"
  > & { id?: string }
): Promise<WebhookDeliveryRecord> {
  const record: WebhookDeliveryRecord = {
    id: input.id ?? newDeliveryId(),
    webhook_id: input.webhook_id,
    key_hash: input.key_hash,
    url: input.url,
    event: input.event,
    payload: input.payload,
    status: "pending",
    attempts: 0,
    last_error: null,
    created_at: input.created_at ?? new Date().toISOString(),
    next_retry_at: null,
    delivered_at: null,
  };

  upsertMemory(record);

  if (isSupabaseConfigured()) {
    try {
      const supabase = await supabaseClient();
      await supabase.from("protocol_webhook_deliveries").insert({
        id: record.id,
        webhook_id: record.webhook_id,
        key_hash: record.key_hash,
        url: record.url,
        event: record.event,
        payload: record.payload,
        status: record.status,
        attempts: record.attempts,
        last_error: record.last_error,
        created_at: record.created_at,
        next_retry_at: record.next_retry_at,
        delivered_at: record.delivered_at,
      });
    } catch {
      persistMemory();
    }
  } else {
    persistMemory();
  }

  return record;
}

async function saveDelivery(record: WebhookDeliveryRecord): Promise<void> {
  upsertMemory(record);

  if (isSupabaseConfigured()) {
    try {
      const supabase = await supabaseClient();
      await supabase
        .from("protocol_webhook_deliveries")
        .update({
          status: record.status,
          attempts: record.attempts,
          last_error: record.last_error,
          next_retry_at: record.next_retry_at,
          delivered_at: record.delivered_at,
        })
        .eq("id", record.id);
    } catch {
      persistMemory();
    }
  } else {
    persistMemory();
  }
}

function failureMessage(result: { ok: boolean; status?: number; error?: string }): string {
  if (result.error) return result.error;
  if (result.status) return `HTTP ${result.status}`;
  return "Delivery failed";
}

export async function attemptDelivery(
  record: WebhookDeliveryRecord
): Promise<DeliveryAttemptResult> {
  const result = await dispatchWebhook(record.url, record.payload);
  const attempts = record.attempts + 1;
  const now = new Date();

  if (result.ok) {
    const updated: WebhookDeliveryRecord = {
      ...record,
      status: "delivered",
      attempts,
      last_error: null,
      next_retry_at: null,
      delivered_at: now.toISOString(),
    };
    await saveDelivery(updated);
    return { delivery: updated, ok: true };
  }

  const errorMsg = failureMessage(result);
  if (attempts >= WEBHOOK_MAX_DELIVERY_ATTEMPTS) {
    const updated: WebhookDeliveryRecord = {
      ...record,
      status: "dead_letter",
      attempts,
      last_error: errorMsg,
      next_retry_at: null,
      delivered_at: null,
    };
    await saveDelivery(updated);
    return { delivery: updated, ok: false };
  }

  const delayMs = webhookRetryDelayMs(attempts);
  const updated: WebhookDeliveryRecord = {
    ...record,
    status: "failed",
    attempts,
    last_error: errorMsg,
    next_retry_at: new Date(now.getTime() + delayMs).toISOString(),
    delivered_at: null,
  };
  await saveDelivery(updated);
  return { delivery: updated, ok: false };
}

export async function enqueueWebhookDelivery(input: {
  url: string;
  payload: WebhookEventPayload;
  key_hash: string;
  webhook_id?: string | null;
}): Promise<DeliveryAttemptResult> {
  const record = await insertDelivery({
    webhook_id: input.webhook_id ?? null,
    key_hash: input.key_hash,
    url: input.url,
    event: input.payload.event,
    payload: input.payload,
    created_at: new Date().toISOString(),
  });
  return attemptDelivery(record);
}

export async function getDelivery(
  id: string,
  keyHash: string
): Promise<WebhookDeliveryRecord | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await supabaseClient();
      const { data } = await supabase
        .from("protocol_webhook_deliveries")
        .select("*")
        .eq("id", id)
        .eq("key_hash", keyHash)
        .maybeSingle();
      if (data) {
        const record = rowToRecord(data as Record<string, unknown>);
        upsertMemory(record);
        return record;
      }
    } catch {
      // fall through
    }
  }
  return memoryStore.find((d) => d.id === id && d.key_hash === keyHash) ?? null;
}

export async function listDeliveriesForWebhook(
  webhookId: string,
  keyHash: string,
  options: ListDeliveriesOptions = {}
): Promise<{ deliveries: WebhookDeliveryRecord[]; total: number }> {
  const limit = Math.min(Math.max(options.limit ?? 20, 1), 100);
  const offset = Math.max(options.offset ?? 0, 0);

  if (isSupabaseConfigured()) {
    try {
      const supabase = await supabaseClient();
      let query = supabase
        .from("protocol_webhook_deliveries")
        .select("*", { count: "exact" })
        .eq("webhook_id", webhookId)
        .eq("key_hash", keyHash)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (options.status) {
        query = query.eq("status", options.status);
      }

      const { data, count } = await query;
      const deliveries = (data ?? []).map((row) =>
        rowToRecord(row as Record<string, unknown>)
      );
      for (const d of deliveries) upsertMemory(d);
      return { deliveries, total: count ?? deliveries.length };
    } catch {
      // fall through
    }
  }

  let filtered = memoryStore.filter(
    (d) => d.webhook_id === webhookId && d.key_hash === keyHash
  );
  if (options.status) {
    filtered = filtered.filter((d) => d.status === options.status);
  }
  filtered.sort((a, b) => b.created_at.localeCompare(a.created_at));
  const total = filtered.length;
  return {
    deliveries: filtered.slice(offset, offset + limit),
    total,
  };
}

export async function listRecentDeliveriesForKey(
  keyHash: string,
  limit = 20
): Promise<WebhookDeliveryRecord[]> {
  const capped = Math.min(Math.max(limit, 1), 50);

  if (isSupabaseConfigured()) {
    try {
      const supabase = await supabaseClient();
      const { data } = await supabase
        .from("protocol_webhook_deliveries")
        .select("*")
        .eq("key_hash", keyHash)
        .order("created_at", { ascending: false })
        .limit(capped);
      return (data ?? []).map((row) => rowToRecord(row as Record<string, unknown>));
    } catch {
      // fall through
    }
  }

  return [...memoryStore]
    .filter((d) => d.key_hash === keyHash)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, capped);
}

export async function replayDelivery(
  id: string,
  keyHash: string
): Promise<DeliveryAttemptResult | null> {
  const existing = await getDelivery(id, keyHash);
  if (!existing) return null;

  const reset: WebhookDeliveryRecord = {
    ...existing,
    status: "pending",
    attempts: 0,
    last_error: null,
    next_retry_at: null,
    delivered_at: null,
  };
  await saveDelivery(reset);
  return attemptDelivery(reset);
}

export async function replayDeadLetterForWebhook(
  webhookId: string,
  keyHash: string
): Promise<{ replayed: number; delivered: number; failed: number }> {
  const { deliveries } = await listDeliveriesForWebhook(webhookId, keyHash, {
    limit: 100,
    status: "dead_letter",
  });

  let delivered = 0;
  let failed = 0;

  for (const d of deliveries) {
    const result = await replayDelivery(d.id, keyHash);
    if (!result) continue;
    if (result.ok) delivered += 1;
    else failed += 1;
  }

  return { replayed: deliveries.length, delivered, failed };
}

export type RetryPendingResult = {
  processed: number;
  delivered: number;
  failed: number;
  dead_letter: number;
};

export async function retryPendingDeliveries(): Promise<RetryPendingResult> {
  const now = new Date().toISOString();
  let pending: WebhookDeliveryRecord[] = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = await supabaseClient();
      const { data } = await supabase
        .from("protocol_webhook_deliveries")
        .select("*")
        .in("status", ["pending", "failed"])
        .lt("attempts", WEBHOOK_MAX_DELIVERY_ATTEMPTS)
        .or(`next_retry_at.lte.${now},next_retry_at.is.null`)
        .order("next_retry_at", { ascending: true, nullsFirst: true })
        .limit(50);
      pending = (data ?? []).map((row) => rowToRecord(row as Record<string, unknown>));
    } catch {
      // fall through
    }
  }

  if (pending.length === 0) {
    pending = memoryStore.filter(
      (d) =>
        (d.status === "pending" || d.status === "failed") &&
        d.attempts < WEBHOOK_MAX_DELIVERY_ATTEMPTS &&
        (d.next_retry_at === null || d.next_retry_at <= now)
    );
  }

  let delivered = 0;
  let failed = 0;
  let deadLetter = 0;

  for (const record of pending) {
    const result = await attemptDelivery(record);
    if (result.ok) delivered += 1;
    else if (result.delivery.status === "dead_letter") deadLetter += 1;
    else failed += 1;
  }

  return {
    processed: pending.length,
    delivered,
    failed,
    dead_letter: deadLetter,
  };
}
