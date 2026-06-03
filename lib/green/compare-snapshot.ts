import { createClient, type PostgrestError, type SupabaseClient } from "@supabase/supabase-js";
import { customAlphabet } from "nanoid";

import { GREEN_COMPARE_ROWS } from "./compare-data";
import {
  normalizeCompareCountries,
  normalizeCompareOfferIds,
} from "./market/compare-selection";

const SNAPSHOT_ID_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz";
const generateSnapshotId = customAlphabet(SNAPSHOT_ID_ALPHABET, 10);

export const GREEN_COMPARE_SNAPSHOT_TTL_DAYS = 30;
export const GREEN_COMPARE_SNAPSHOT_ROUTE = "/green/compare/s";

export type GreenCompareSnapshotPayload = {
  countries: string[];
  offerIds: string[];
  /** Subset of GREEN_COMPARE_ROWS ids; empty = show all reference rows */
  rwaRowIds: string[];
};

export type GreenCompareSnapshotRecord = {
  id: string;
  payload: GreenCompareSnapshotPayload;
  createdAt: string;
  expiresAt: string;
};

const VALID_RWA_IDS = new Set(GREEN_COMPARE_ROWS.map((row) => row.id));

function getAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SECRET_KEY?.trim();
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function isMissingTable(error: PostgrestError): boolean {
  const msg = error.message.toLowerCase();
  return (
    error.code === "PGRST204" ||
    error.code === "PGRST205" ||
    error.code === "42P01" ||
    msg.includes("does not exist") ||
    msg.includes("schema cache")
  );
}

export function normalizeCompareSnapshotPayload(
  raw: unknown
): GreenCompareSnapshotPayload | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;

  const countries = normalizeCompareCountries(
    Array.isArray(obj.countries)
      ? obj.countries.filter((c): c is string => typeof c === "string")
      : []
  );
  const offerIds = normalizeCompareOfferIds(
    Array.isArray(obj.offerIds)
      ? obj.offerIds.filter((id): id is string => typeof id === "string")
      : []
  );

  const rwaRaw = Array.isArray(obj.rwaRowIds)
    ? obj.rwaRowIds
    : Array.isArray(obj.rwaIds)
      ? obj.rwaIds
      : [];
  const rwaRowIds = rwaRaw
    .filter((id): id is string => typeof id === "string")
    .map((id) => id.trim())
    .filter((id) => VALID_RWA_IDS.has(id));

  if (countries.length === 0 && offerIds.length === 0 && rwaRowIds.length === 0) {
    return null;
  }

  return { countries, offerIds, rwaRowIds };
}

export function buildGreenCompareSnapshotPath(id: string): string {
  return `${GREEN_COMPARE_SNAPSHOT_ROUTE}/${encodeURIComponent(id)}`;
}

export function buildGreenCompareSnapshotUrl(
  id: string,
  origin = ""
): string {
  return `${origin}${buildGreenCompareSnapshotPath(id)}`;
}

export async function createGreenCompareSnapshot(
  payload: GreenCompareSnapshotPayload
): Promise<{ ok: true; id: string; expiresAt: string } | { ok: false; error: "unavailable" }> {
  const supabase = getAdminClient();
  if (!supabase) return { ok: false, error: "unavailable" };

  const id = generateSnapshotId();
  const now = Date.now();
  const expiresAt = new Date(
    now + GREEN_COMPARE_SNAPSHOT_TTL_DAYS * 24 * 60 * 60 * 1000
  ).toISOString();

  const { error } = await supabase.from("green_compare_snapshots").insert({
    id,
    payload,
    expires_at: expiresAt,
  });

  if (error) {
    if (isMissingTable(error)) return { ok: false, error: "unavailable" };
    console.error("[green/compare-snapshot] insert", error);
    return { ok: false, error: "unavailable" };
  }

  return { ok: true, id, expiresAt };
}

export type GreenCompareSnapshotLookup =
  | { status: "active"; snapshot: GreenCompareSnapshotRecord }
  | { status: "expired"; id: string; expiresAt: string }
  | { status: "not_found" };

export async function lookupGreenCompareSnapshot(
  id: string
): Promise<GreenCompareSnapshotLookup> {
  const trimmed = id.trim();
  if (!trimmed || trimmed.length > 32) return { status: "not_found" };

  const supabase = getAdminClient();
  if (!supabase) return { status: "not_found" };

  const { data, error } = await supabase
    .from("green_compare_snapshots")
    .select("id,payload,created_at,expires_at")
    .eq("id", trimmed)
    .maybeSingle();

  if (error) {
    if (isMissingTable(error)) return { status: "not_found" };
    console.error("[green/compare-snapshot] lookup", error);
    return { status: "not_found" };
  }

  if (!data) return { status: "not_found" };

  const expiresAt = String(data.expires_at);
  if (new Date(expiresAt).getTime() < Date.now()) {
    return { status: "expired", id: String(data.id), expiresAt };
  }

  const payload = normalizeCompareSnapshotPayload(data.payload);
  if (!payload) return { status: "not_found" };

  return {
    status: "active",
    snapshot: {
      id: String(data.id),
      payload,
      createdAt: String(data.created_at),
      expiresAt,
    },
  };
}

export async function getGreenCompareSnapshot(
  id: string
): Promise<GreenCompareSnapshotRecord | null> {
  const lookup = await lookupGreenCompareSnapshot(id);
  return lookup.status === "active" ? lookup.snapshot : null;
}

export function filterCompareRowsBySnapshot(
  rwaRowIds: string[]
): typeof GREEN_COMPARE_ROWS {
  if (rwaRowIds.length === 0) return GREEN_COMPARE_ROWS;
  const allowed = new Set(rwaRowIds);
  return GREEN_COMPARE_ROWS.filter((row) => allowed.has(row.id));
}
