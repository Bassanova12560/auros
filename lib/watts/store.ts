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
    cfu_unit_id: row.cfu_unit_id != null ? String(row.cfu_unit_id) : null,
    cfu_verify_url:
      row.cfu_verify_url != null ? String(row.cfu_verify_url) : null,
    confirmed_at: row.confirmed_at != null ? String(row.confirmed_at) : null,
    settled_at: row.settled_at != null ? String(row.settled_at) : null,
    delivery_ref: row.delivery_ref != null ? String(row.delivery_ref) : null,
    delivered_at: row.delivered_at != null ? String(row.delivered_at) : null,
    energy_kwh_delivered:
      row.energy_kwh_delivered != null
        ? Number(row.energy_kwh_delivered)
        : null,
    capacity_kw_delivered:
      row.capacity_kw_delivered != null
        ? Number(row.capacity_kw_delivered)
        : null,
    settle_reason:
      row.settle_reason != null ? String(row.settle_reason) : null,
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
    cfu_unit_id: null,
    cfu_verify_url: null,
    confirmed_at: null,
    settled_at: null,
    delivery_ref: null,
    delivered_at: null,
    energy_kwh_delivered: null,
    capacity_kw_delivered: null,
    settle_reason: null,
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

export async function markWattReservationConfirmed(input: {
  id: string;
  cfu_unit_id: string;
  cfu_verify_url: string;
}): Promise<WattReservation> {
  const confirmedAt = new Date().toISOString();
  const existing = await getWattReservation(input.id);
  if (!existing) {
    throw new Error(`Watt reservation ${input.id} not found`);
  }

  const updated: WattReservation = {
    ...existing,
    status: "confirmed",
    cfu_unit_id: input.cfu_unit_id,
    cfu_verify_url: input.cfu_verify_url,
    confirmed_at: confirmedAt,
  };

  if (isSupabaseConfigured()) {
    try {
      const { getSupabaseServerClient } = await import("@/lib/supabase/server");
      const supabase = getSupabaseServerClient();
      const { data, error } = await supabase
        .from("watt_reservations")
        .update({
          status: "confirmed",
          cfu_unit_id: input.cfu_unit_id,
          cfu_verify_url: input.cfu_verify_url,
          confirmed_at: confirmedAt,
        })
        .eq("id", input.id)
        .select("*")
        .maybeSingle();
      if (!error && data) {
        const mapped = rowToReservation(data as Record<string, unknown>);
        memory.set(mapped.id, mapped);
        persistFile();
        return mapped;
      }
    } catch {
      /* fallback file */
    }
  }

  memory.set(updated.id, updated);
  persistFile();
  return updated;
}

export async function markWattReservationSettled(input: {
  id: string;
  delivery_ref: string | null;
  delivered_at: string;
  energy_kwh_delivered: number | null;
  capacity_kw_delivered: number | null;
  settle_reason: string | null;
}): Promise<WattReservation> {
  const settledAt = new Date().toISOString();
  const existing = await getWattReservation(input.id);
  if (!existing) {
    throw new Error(`Watt reservation ${input.id} not found`);
  }

  const updated: WattReservation = {
    ...existing,
    status: "settled",
    settled_at: settledAt,
    delivery_ref: input.delivery_ref,
    delivered_at: input.delivered_at,
    energy_kwh_delivered: input.energy_kwh_delivered,
    capacity_kw_delivered: input.capacity_kw_delivered,
    settle_reason: input.settle_reason,
  };

  if (isSupabaseConfigured()) {
    try {
      const { getSupabaseServerClient } = await import("@/lib/supabase/server");
      const supabase = getSupabaseServerClient();
      const { data, error } = await supabase
        .from("watt_reservations")
        .update({
          status: "settled",
          settled_at: settledAt,
          delivery_ref: input.delivery_ref,
          delivered_at: input.delivered_at,
          energy_kwh_delivered: input.energy_kwh_delivered,
          capacity_kw_delivered: input.capacity_kw_delivered,
          settle_reason: input.settle_reason,
        })
        .eq("id", input.id)
        .select("*")
        .maybeSingle();
      if (!error && data) {
        const mapped = rowToReservation(data as Record<string, unknown>);
        memory.set(mapped.id, mapped);
        persistFile();
        return mapped;
      }
    } catch {
      /* fallback file */
    }
  }

  memory.set(updated.id, updated);
  persistFile();
  return updated;
}
