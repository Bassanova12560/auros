import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

import { isSupabaseConfigured } from "@/lib/protocol/auth/keys";

import { CHARGEFLOW_DISCLAIMER } from "./canonical";
import type { ChargeflowAurosEnrichment } from "./canonical";
import { newChargeflowUnitId, requireChargeflowSignature } from "./signing";

export type ChargeflowPublicSnapshot = {
  standard: string;
  energy_kwh: number;
  external_session_id: string;
  started_at: string;
  ended_at: string;
  operator_id?: string;
  country?: string;
  renewable_claim?: string;
  watt_rating: number | null;
  watt_tier: "high" | "mid" | "early" | null;
  energy_value_eur_indicative: number | null;
  issued_at: string;
};

export type ChargeflowRecord = {
  id: string;
  content_hash: string;
  signature: string;
  key_hash: string;
  public: ChargeflowPublicSnapshot;
  created_at: string;
  disclaimer: string;
};

const memoryStore = new Map<string, ChargeflowRecord>();
const DATA_DIR = join(process.cwd(), ".data");
const CHARGEFLOW_FILE = join(DATA_DIR, "protocol-chargeflow-units.json");

function loadFileStore(): ChargeflowRecord[] {
  try {
    if (!existsSync(CHARGEFLOW_FILE)) return [];
    const parsed = JSON.parse(
      readFileSync(CHARGEFLOW_FILE, "utf8")
    ) as ChargeflowRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveFileStore(records: ChargeflowRecord[]): void {
  try {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(CHARGEFLOW_FILE, JSON.stringify(records, null, 2), "utf8");
  } catch {
    // dev fallback
  }
}

function syncMemoryFromFile(): void {
  for (const record of loadFileStore()) {
    memoryStore.set(record.id, record);
  }
}

syncMemoryFromFile();

async function trySupabaseInsert(record: ChargeflowRecord): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    const { getSupabaseServerClient } = await import("@/lib/supabase/server");
    const supabase = getSupabaseServerClient();
    await supabase.from("protocol_chargeflow_units").insert({
      id: record.id,
      content_hash: record.content_hash,
      signature: record.signature,
      key_hash: record.key_hash,
      public_snapshot: record.public,
      created_at: record.created_at,
      disclaimer: record.disclaimer,
    });
  } catch {
    // table may not exist yet
  }
}

async function trySupabaseFindById(id: string): Promise<ChargeflowRecord | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { getSupabaseServerClient } = await import("@/lib/supabase/server");
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("protocol_chargeflow_units")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error || !data) return null;
    const row = data as {
      id: string;
      content_hash: string;
      signature: string;
      key_hash: string;
      public_snapshot: ChargeflowPublicSnapshot;
      created_at: string;
      disclaimer: string;
    };
    return {
      id: row.id,
      content_hash: row.content_hash,
      signature: row.signature,
      key_hash: row.key_hash,
      public: row.public_snapshot,
      created_at: row.created_at,
      disclaimer: row.disclaimer,
    };
  } catch {
    return null;
  }
}

export function chargeflowRecordFromParts(
  keyHash: string,
  contentHash: string,
  signature: string,
  publicSnapshot: ChargeflowPublicSnapshot,
  unitId?: string
): ChargeflowRecord {
  return {
    id: unitId ?? newChargeflowUnitId(),
    content_hash: contentHash,
    signature,
    key_hash: keyHash,
    public: publicSnapshot,
    created_at: new Date().toISOString(),
    disclaimer: CHARGEFLOW_DISCLAIMER,
  };
}

export async function createChargeflowRecord(
  record: ChargeflowRecord
): Promise<ChargeflowRecord> {
  memoryStore.set(record.id, record);
  saveFileStore([...memoryStore.values()]);
  await trySupabaseInsert(record);
  return record;
}

export async function getChargeflowById(
  id: string
): Promise<ChargeflowRecord | null> {
  const mem = memoryStore.get(id);
  if (mem) return mem;
  const fromFile = loadFileStore().find((r) => r.id === id);
  if (fromFile) {
    memoryStore.set(id, fromFile);
    return fromFile;
  }
  const fromDb = await trySupabaseFindById(id);
  if (fromDb) {
    memoryStore.set(id, fromDb);
    return fromDb;
  }
  return null;
}

export function siteOriginForChargeflow(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://getauros.com"
  );
}

export function chargeflowVerifyPath(id: string): string {
  return `/chargeflow/${encodeURIComponent(id)}`;
}

export function chargeflowVerifyUrl(id: string): string {
  return `${siteOriginForChargeflow()}${chargeflowVerifyPath(id)}`;
}

export { requireChargeflowSignature };

export function buildPublicSnapshot(
  issuedAt: string,
  energyKwh: number,
  externalSessionId: string,
  startedAt: string,
  endedAt: string,
  auros: ChargeflowAurosEnrichment,
  extras: {
    operator_id?: string;
    country?: string;
    renewable_claim?: string;
  }
): ChargeflowPublicSnapshot {
  return {
    standard: "AUROS-ChargeFlow-CFU-E",
    energy_kwh: energyKwh,
    external_session_id: externalSessionId,
    started_at: startedAt,
    ended_at: endedAt,
    ...(extras.operator_id ? { operator_id: extras.operator_id } : {}),
    ...(extras.country ? { country: extras.country } : {}),
    ...(extras.renewable_claim
      ? { renewable_claim: extras.renewable_claim }
      : {}),
    watt_rating: auros.watt_rating,
    watt_tier: auros.watt_tier,
    energy_value_eur_indicative: auros.energy_value_eur_indicative,
    issued_at: issuedAt,
  };
}
