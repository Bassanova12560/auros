/**
 * Persist Asset DNA records — local file + optional Supabase mirror.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";

import type { AssetDnaRecord } from "./types";

const DATA_DIR = join(process.cwd(), ".data");
const FILE = join(DATA_DIR, "asset-dna.json");

function load(): AssetDnaRecord[] {
  try {
    if (!existsSync(FILE)) return [];
    const parsed = JSON.parse(readFileSync(FILE, "utf8")) as AssetDnaRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function save(rows: AssetDnaRecord[]): void {
  try {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(FILE, JSON.stringify(rows.slice(-5_000), null, 2), "utf8");
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

export function saveAssetDnaLocal(record: AssetDnaRecord): void {
  const all = load();
  const idx = all.findIndex((r) => r.id === record.id);
  if (idx >= 0) all[idx] = record;
  else all.push(record);
  save(all);
}

export function getAssetDnaLocal(id: string): AssetDnaRecord | null {
  return load().find((r) => r.id === id) ?? null;
}

export async function mirrorAssetDnaToSupabase(
  record: AssetDnaRecord
): Promise<void> {
  const supabase = getAdminClient();
  if (!supabase) return;
  const { error } = await supabase.from("asset_dna_records").upsert({
    id: record.id,
    spec_version: record.specVersion,
    asset_class: record.assetClass,
    display_name: record.displayName,
    jurisdiction: record.jurisdiction,
    origin: record.origin,
    documents: record.documents,
    compliance: record.compliance,
    links: record.links ?? {},
    created_at: record.createdAt,
    updated_at: record.updatedAt,
  });
  if (error) {
    console.warn("[asset-dna] mirror", error.message);
  }
}

export async function fetchAssetDnaFromSupabase(
  id: string
): Promise<AssetDnaRecord | null> {
  const supabase = getAdminClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("asset_dna_records")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return {
    id: String(data.id),
    specVersion: "1.0.0",
    assetClass: data.asset_class,
    displayName: String(data.display_name),
    jurisdiction: (data.jurisdiction ?? {}) as AssetDnaRecord["jurisdiction"],
    origin: (data.origin ?? {}) as AssetDnaRecord["origin"],
    documents: (data.documents ?? []) as AssetDnaRecord["documents"],
    compliance: (data.compliance ?? {}) as AssetDnaRecord["compliance"],
    links: (data.links ?? {}) as AssetDnaRecord["links"],
    createdAt: String(data.created_at),
    updatedAt: String(data.updated_at),
  };
}

export async function persistAssetDna(record: AssetDnaRecord): Promise<void> {
  saveAssetDnaLocal(record);
  await mirrorAssetDnaToSupabase(record);
}

export async function resolveAssetDna(
  id: string
): Promise<AssetDnaRecord | null> {
  const local = getAssetDnaLocal(id);
  if (local) return local;
  const remote = await fetchAssetDnaFromSupabase(id);
  if (remote) {
    saveAssetDnaLocal(remote);
    return remote;
  }
  return null;
}
