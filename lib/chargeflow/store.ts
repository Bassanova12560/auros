import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

import { isSupabaseConfigured } from "@/lib/protocol/auth/keys";

import {
  disclaimerForKind,
  type ChargeflowAurosEnrichment,
} from "./canonical";
import {
  CHARGEFLOW_LIST_DEFAULT_LIMIT,
  CHARGEFLOW_LIST_MAX_LIMIT,
  kindFromUnitId,
  resolveOperatorKey,
  standardForKind,
  type ChargeflowStatus,
  type ChargeflowUnitKind,
} from "./constants";
import { newChargeflowUnitId } from "./signing";

export type ChargeflowPublicSnapshot = {
  standard: string;
  unit_kind: ChargeflowUnitKind;
  energy_kwh?: number;
  external_session_id?: string;
  volume_m3?: number;
  external_flow_id?: string;
  capacity_kw?: number;
  external_window_id?: string;
  direction?: string;
  started_at: string;
  ended_at: string;
  operator_id?: string;
  country?: string;
  renewable_claim?: string;
  generation_source?: string;
  watt_rating?: number | null;
  watt_tier?: "high" | "mid" | "early" | null;
  energy_value_eur_indicative?: number | null;
  h2o_rating?: number | null;
  h2o_tier?: "high" | "mid" | "low" | null;
  h2o_asset_class?: string | null;
  flow_m3_indicative?: number | null;
  capacity_kw_indicative?: number | null;
  program_hint?: string | null;
  issued_at: string;
};

export type ChargeflowRecord = {
  id: string;
  unit_kind: ChargeflowUnitKind;
  content_hash: string;
  signature: string;
  key_hash: string;
  status: ChargeflowStatus;
  retired_at: string | null;
  retire_reason: string | null;
  operator_id: string | null;
  external_ref: string;
  public: ChargeflowPublicSnapshot;
  created_at: string;
  disclaimer: string;
};

const memoryStore = new Map<string, ChargeflowRecord>();
const DATA_DIR = join(process.cwd(), ".data");
const CHARGEFLOW_FILE = join(DATA_DIR, "protocol-chargeflow-units.json");

function normalizeRecord(raw: ChargeflowRecord): ChargeflowRecord {
  const kind =
    raw.unit_kind ??
    kindFromUnitId(raw.id) ??
    ("e" as ChargeflowUnitKind);
  return {
    ...raw,
    unit_kind: kind,
    status: raw.status ?? "active",
    retired_at: raw.retired_at ?? null,
    retire_reason: raw.retire_reason ?? null,
    operator_id: raw.operator_id ?? raw.public?.operator_id ?? null,
    external_ref:
      raw.external_ref ??
      raw.public?.external_session_id ??
      raw.public?.external_flow_id ??
      raw.public?.external_window_id ??
      raw.id,
    public: {
      ...raw.public,
      unit_kind: raw.public?.unit_kind ?? kind,
      standard: raw.public?.standard ?? standardForKind(kind),
    },
  };
}

function loadFileStore(): ChargeflowRecord[] {
  try {
    if (!existsSync(CHARGEFLOW_FILE)) return [];
    const parsed = JSON.parse(
      readFileSync(CHARGEFLOW_FILE, "utf8")
    ) as ChargeflowRecord[];
    return Array.isArray(parsed) ? parsed.map(normalizeRecord) : [];
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

function uniquenessMatches(
  record: ChargeflowRecord,
  unitKind: ChargeflowUnitKind,
  keyHash: string,
  operatorId: string | undefined,
  externalRef: string
): boolean {
  if (record.status !== "active") return false;
  if (record.unit_kind !== unitKind) return false;
  if (record.key_hash !== keyHash) return false;
  if (record.external_ref !== externalRef) return false;
  const a = resolveOperatorKey(record.operator_id ?? undefined, keyHash);
  const b = resolveOperatorKey(operatorId, keyHash);
  return a === b;
}

export async function findActiveChargeflowConflict(
  unitKind: ChargeflowUnitKind,
  keyHash: string,
  operatorId: string | undefined,
  externalRef: string
): Promise<ChargeflowRecord | null> {
  for (const record of memoryStore.values()) {
    if (uniquenessMatches(record, unitKind, keyHash, operatorId, externalRef)) {
      return record;
    }
  }
  for (const record of loadFileStore()) {
    if (uniquenessMatches(record, unitKind, keyHash, operatorId, externalRef)) {
      memoryStore.set(record.id, record);
      return record;
    }
  }
  if (!isSupabaseConfigured()) return null;
  try {
    const { getSupabaseServerClient } = await import("@/lib/supabase/server");
    const supabase = getSupabaseServerClient();
    const operatorKey = resolveOperatorKey(operatorId, keyHash);
    const { data, error } = await supabase
      .from("protocol_chargeflow_units")
      .select("*")
      .eq("unit_kind", unitKind)
      .eq("key_hash", keyHash)
      .eq("external_ref", externalRef)
      .eq("status", "active");
    if (error || !data?.length) return null;
    for (const row of data) {
      const record = rowToRecord(row);
      if (
        resolveOperatorKey(record.operator_id ?? undefined, keyHash) ===
        operatorKey
      ) {
        memoryStore.set(record.id, record);
        return record;
      }
    }
  } catch {
    return null;
  }
  return null;
}

function rowToRecord(row: Record<string, unknown>): ChargeflowRecord {
  return normalizeRecord({
    id: String(row.id),
    unit_kind: (row.unit_kind as ChargeflowUnitKind) ?? "e",
    content_hash: String(row.content_hash),
    signature: String(row.signature),
    key_hash: String(row.key_hash),
    status: (row.status as ChargeflowStatus) ?? "active",
    retired_at: (row.retired_at as string | null) ?? null,
    retire_reason: (row.retire_reason as string | null) ?? null,
    operator_id: (row.operator_id as string | null) ?? null,
    external_ref: String(row.external_ref ?? ""),
    public: row.public_snapshot as ChargeflowPublicSnapshot,
    created_at: String(row.created_at),
    disclaimer: String(row.disclaimer),
  });
}

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
      unit_kind: record.unit_kind,
      status: record.status,
      retired_at: record.retired_at,
      retire_reason: record.retire_reason,
      operator_id: record.operator_id,
      external_ref: record.external_ref,
    });
  } catch {
    // table may not exist yet
  }
}

async function trySupabaseUpdate(record: ChargeflowRecord): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    const { getSupabaseServerClient } = await import("@/lib/supabase/server");
    const supabase = getSupabaseServerClient();
    await supabase
      .from("protocol_chargeflow_units")
      .update({
        status: record.status,
        retired_at: record.retired_at,
        retire_reason: record.retire_reason,
        public_snapshot: record.public,
      })
      .eq("id", record.id);
  } catch {
    // ignore
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
    return rowToRecord(data as Record<string, unknown>);
  } catch {
    return null;
  }
}

export function chargeflowRecordFromParts(input: {
  keyHash: string;
  contentHash: string;
  signature: string;
  publicSnapshot: ChargeflowPublicSnapshot;
  unitKind: ChargeflowUnitKind;
  externalRef: string;
  operatorId?: string;
  unitId?: string;
}): ChargeflowRecord {
  const id = input.unitId ?? newChargeflowUnitId(input.unitKind);
  return {
    id,
    unit_kind: input.unitKind,
    content_hash: input.contentHash,
    signature: input.signature,
    key_hash: input.keyHash,
    status: "active",
    retired_at: null,
    retire_reason: null,
    operator_id: input.operatorId?.trim() || null,
    external_ref: input.externalRef,
    public: input.publicSnapshot,
    created_at: new Date().toISOString(),
    disclaimer: disclaimerForKind(input.unitKind),
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

export type ChargeflowListQuery = {
  unit_kind?: ChargeflowUnitKind;
  status?: ChargeflowStatus;
  operator_id?: string;
  limit?: number;
  offset?: number;
};

export type ChargeflowListItem = {
  id: string;
  unit_kind: ChargeflowUnitKind;
  status: ChargeflowStatus;
  created_at: string;
  retired_at: string | null;
  operator_id: string | null;
  external_ref: string;
  content_hash: string;
  energy_kwh?: number;
  volume_m3?: number;
  capacity_kw?: number;
  generation_source?: string | null;
  verify_url: string;
};

export function toChargeflowListItem(
  record: ChargeflowRecord
): ChargeflowListItem {
  const item: ChargeflowListItem = {
    id: record.id,
    unit_kind: record.unit_kind,
    status: record.status,
    created_at: record.created_at,
    retired_at: record.retired_at,
    operator_id: record.operator_id,
    external_ref: record.external_ref,
    content_hash: record.content_hash,
    generation_source: record.public.generation_source ?? null,
    verify_url: chargeflowVerifyUrl(record.id),
  };
  if (record.public.energy_kwh != null) item.energy_kwh = record.public.energy_kwh;
  if (record.public.volume_m3 != null) item.volume_m3 = record.public.volume_m3;
  if (record.public.capacity_kw != null) {
    item.capacity_kw = record.public.capacity_kw;
  }
  return item;
}

function collectLocalRecordsForKey(keyHash: string): ChargeflowRecord[] {
  const byId = new Map<string, ChargeflowRecord>();
  for (const record of loadFileStore()) {
    if (record.key_hash === keyHash) byId.set(record.id, record);
  }
  for (const record of memoryStore.values()) {
    if (record.key_hash === keyHash) byId.set(record.id, record);
  }
  return [...byId.values()].sort(
    (a, b) => Date.parse(b.created_at) - Date.parse(a.created_at)
  );
}

export async function listChargeflowForKey(
  keyHash: string,
  query: ChargeflowListQuery = {}
): Promise<{ items: ChargeflowListItem[]; total: number }> {
  const limit = Math.min(
    Math.max(query.limit ?? CHARGEFLOW_LIST_DEFAULT_LIMIT, 1),
    CHARGEFLOW_LIST_MAX_LIMIT
  );
  const offset = Math.max(query.offset ?? 0, 0);

  if (isSupabaseConfigured()) {
    try {
      const { getSupabaseServerClient } = await import("@/lib/supabase/server");
      const supabase = getSupabaseServerClient();
      let q = supabase
        .from("protocol_chargeflow_units")
        .select("*", { count: "exact" })
        .eq("key_hash", keyHash)
        .order("created_at", { ascending: false });
      if (query.unit_kind) q = q.eq("unit_kind", query.unit_kind);
      if (query.status) q = q.eq("status", query.status);
      if (query.operator_id) q = q.eq("operator_id", query.operator_id);
      const { data, error, count } = await q.range(
        offset,
        offset + limit - 1
      );
      if (!error && data) {
        const items = (data as Record<string, unknown>[]).map((row) => {
          const record = rowToRecord(row);
          memoryStore.set(record.id, record);
          return toChargeflowListItem(record);
        });
        return { items, total: count ?? items.length };
      }
    } catch {
      // fall through to local
    }
  }

  let filtered = collectLocalRecordsForKey(keyHash);
  if (query.unit_kind) {
    filtered = filtered.filter((r) => r.unit_kind === query.unit_kind);
  }
  if (query.status) {
    filtered = filtered.filter((r) => r.status === query.status);
  }
  if (query.operator_id) {
    filtered = filtered.filter((r) => r.operator_id === query.operator_id);
  }
  const total = filtered.length;
  const items = filtered
    .slice(offset, offset + limit)
    .map(toChargeflowListItem);
  return { items, total };
}

export async function retireChargeflowRecord(
  id: string,
  keyHash: string,
  reason?: string
): Promise<
  | { record: ChargeflowRecord }
  | { error: string; status: number }
> {
  const existing = await getChargeflowById(id);
  if (!existing) {
    return { error: "ChargeFlow unit not found", status: 404 };
  }
  if (existing.key_hash !== keyHash && keyHash !== "demo") {
    return { error: "Forbidden — API key does not own this unit", status: 403 };
  }
  if (existing.status === "retired") {
    return { record: existing };
  }
  const updated: ChargeflowRecord = {
    ...existing,
    status: "retired",
    retired_at: new Date().toISOString(),
    retire_reason: reason?.trim() || null,
  };
  memoryStore.set(id, updated);
  saveFileStore([...memoryStore.values()]);
  await trySupabaseUpdate(updated);
  return { record: updated };
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

export function buildPublicSnapshotE(
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
    generation_source?: string;
  }
): ChargeflowPublicSnapshot {
  return {
    standard: standardForKind("e"),
    unit_kind: "e",
    energy_kwh: energyKwh,
    external_session_id: externalSessionId,
    started_at: startedAt,
    ended_at: endedAt,
    ...(extras.operator_id ? { operator_id: extras.operator_id } : {}),
    ...(extras.country ? { country: extras.country } : {}),
    ...(extras.renewable_claim
      ? { renewable_claim: extras.renewable_claim }
      : {}),
    ...(extras.generation_source
      ? { generation_source: extras.generation_source }
      : {}),
    watt_rating: auros.watt_rating ?? null,
    watt_tier: auros.watt_tier ?? null,
    energy_value_eur_indicative: auros.energy_value_eur_indicative ?? null,
    issued_at: issuedAt,
  };
}

export function buildPublicSnapshotW(
  issuedAt: string,
  volumeM3: number,
  externalFlowId: string,
  startedAt: string,
  endedAt: string,
  auros: ChargeflowAurosEnrichment,
  extras: {
    operator_id?: string;
    country?: string;
  }
): ChargeflowPublicSnapshot {
  return {
    standard: standardForKind("w"),
    unit_kind: "w",
    volume_m3: volumeM3,
    external_flow_id: externalFlowId,
    started_at: startedAt,
    ended_at: endedAt,
    ...(extras.operator_id ? { operator_id: extras.operator_id } : {}),
    ...(extras.country ? { country: extras.country } : {}),
    h2o_rating: auros.h2o_rating ?? null,
    h2o_tier: auros.h2o_tier ?? null,
    h2o_asset_class: auros.h2o_asset_class ?? null,
    flow_m3_indicative: auros.flow_m3_indicative ?? volumeM3,
    issued_at: issuedAt,
  };
}

export function buildPublicSnapshotF(
  issuedAt: string,
  capacityKw: number,
  externalWindowId: string,
  startedAt: string,
  endedAt: string,
  auros: ChargeflowAurosEnrichment,
  extras: {
    operator_id?: string;
    country?: string;
    direction?: string;
    generation_source?: string;
  }
): ChargeflowPublicSnapshot {
  return {
    standard: standardForKind("f"),
    unit_kind: "f",
    capacity_kw: capacityKw,
    external_window_id: externalWindowId,
    started_at: startedAt,
    ended_at: endedAt,
    ...(extras.direction ? { direction: extras.direction } : {}),
    ...(extras.operator_id ? { operator_id: extras.operator_id } : {}),
    ...(extras.country ? { country: extras.country } : {}),
    ...(extras.generation_source
      ? { generation_source: extras.generation_source }
      : {}),
    watt_rating: auros.watt_rating ?? null,
    watt_tier: auros.watt_tier ?? null,
    capacity_kw_indicative: auros.capacity_kw_indicative ?? capacityKw,
    program_hint: auros.program_hint ?? null,
    issued_at: issuedAt,
  };
}

/** @deprecated use buildPublicSnapshotE */
export const buildPublicSnapshot = buildPublicSnapshotE;
