import { randomUUID } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { isSupabaseConfigured } from "@/lib/protocol/auth/keys";

import type {
  WattMatchReason,
  WattReservation,
  WattReserveRequest,
  WattSuggestedUnitKind,
} from "./types";

const DATA_DIR = join(process.cwd(), ".data");
const FILE = join(DATA_DIR, "watt-reservations.json");

const memory = new Map<string, WattReservation>();

function loadFile() {
  if (!existsSync(FILE)) return;
  try {
    const raw = JSON.parse(readFileSync(FILE, "utf8")) as WattReservation[];
    for (const d of raw) memory.set(d.id, d);
  } catch {
    /* ignore */
  }
}

function persistFile() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(FILE, JSON.stringify([...memory.values()], null, 2));
}

loadFile();

function rowToReservation(row: Record<string, unknown>): WattReservation {
  return {
    id: String(row.id),
    key_hash: String(row.key_hash),
    status: row.status as WattReservation["status"],
    profile: row.profile as WattReserveRequest,
    match_score: Number(row.match_score ?? 0),
    match_reasons: (row.match_reasons as WattMatchReason[]) ?? [],
    suggested_unit_kind: row.suggested_unit_kind as WattSuggestedUnitKind,
    created_at: String(row.created_at),
  };
}

export async function insertWattReservation(input: {
  key_hash: string;
  profile: WattReserveRequest;
  match_score: number;
  match_reasons: WattMatchReason[];
  suggested_unit_kind: WattSuggestedUnitKind;
}): Promise<WattReservation> {
  const reservation: WattReservation = {
    id: randomUUID(),
    key_hash: input.key_hash,
    status: "pending_confirm",
    profile: input.profile,
    match_score: input.match_score,
    match_reasons: input.match_reasons,
    suggested_unit_kind: input.suggested_unit_kind,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    try {
      const { getSupabaseServerClient } = await import("@/lib/supabase/server");
      const supabase = getSupabaseServerClient();
      const { data, error } = await supabase
        .from("watt_reservations")
        .insert({
          id: reservation.id,
          key_hash: reservation.key_hash,
          status: reservation.status,
          profile: reservation.profile,
          match_score: reservation.match_score,
          match_reasons: reservation.match_reasons,
          suggested_unit_kind: reservation.suggested_unit_kind,
          created_at: reservation.created_at,
        })
        .select("*")
        .maybeSingle();
      if (!error && data) {
        const mapped = rowToReservation(data as Record<string, unknown>);
        memory.set(mapped.id, mapped);
        return mapped;
      }
    } catch {
      /* fallback file */
    }
  }

  memory.set(reservation.id, reservation);
  persistFile();
  return reservation;
}

export async function getWattReservation(
  id: string
): Promise<WattReservation | null> {
  if (isSupabaseConfigured()) {
    try {
      const { getSupabaseServerClient } = await import("@/lib/supabase/server");
      const supabase = getSupabaseServerClient();
      const { data, error } = await supabase
        .from("watt_reservations")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (!error && data) {
        const mapped = rowToReservation(data as Record<string, unknown>);
        memory.set(mapped.id, mapped);
        return mapped;
      }
    } catch {
      /* fallback */
    }
  }
  return memory.get(id) ?? null;
}
