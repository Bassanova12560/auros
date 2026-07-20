import { randomUUID } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { isSupabaseConfigured } from "@/lib/protocol/auth/keys";

import { getWattReservation } from "./store";
import type {
  WattFirmness,
  WattSecondaryListing,
  WattSecondaryListingRequest,
  WattSecondaryStatus,
} from "./types";

const DATA_DIR = join(process.cwd(), ".data");
const FILE = join(DATA_DIR, "watt-secondary-listings.json");

const memory = new Map<string, WattSecondaryListing>();

function loadFile() {
  if (!existsSync(FILE)) return;
  try {
    const raw = JSON.parse(
      readFileSync(FILE, "utf8")
    ) as WattSecondaryListing[];
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

function rowToListing(row: Record<string, unknown>): WattSecondaryListing {
  const zone = (row.zone as WattSecondaryListing["zone"]) ?? { country: "XX" };
  return {
    id: String(row.id),
    key_hash: String(row.key_hash),
    status: row.status as WattSecondaryStatus,
    reservation_id:
      row.reservation_id != null ? String(row.reservation_id) : null,
    cfu_unit_id: row.cfu_unit_id != null ? String(row.cfu_unit_id) : null,
    cfu_verify_url:
      row.cfu_verify_url != null ? String(row.cfu_verify_url) : null,
    indicative_price_eur: Number(row.indicative_price_eur ?? 0),
    compare_ref_id:
      row.compare_ref_id != null ? String(row.compare_ref_id) : null,
    label: row.label != null ? String(row.label) : null,
    note: row.note != null ? String(row.note) : null,
    energy_kwh: row.energy_kwh != null ? Number(row.energy_kwh) : null,
    capacity_kw: row.capacity_kw != null ? Number(row.capacity_kw) : null,
    zone,
    firmness: row.firmness as WattFirmness,
    interest_count: Number(row.interest_count ?? 0),
    created_at: String(row.created_at),
    withdrawn_at: row.withdrawn_at != null ? String(row.withdrawn_at) : null,
  };
}

export async function insertWattSecondaryListing(input: {
  key_hash: string;
  request: WattSecondaryListingRequest;
}): Promise<WattSecondaryListing | { error: string; status: number }> {
  const req = input.request;
  let reservation_id: string | null = null;
  let cfu_unit_id: string | null = req.cfu_unit_id ?? null;
  let cfu_verify_url: string | null = req.cfu_verify_url ?? null;
  let energy_kwh: number | null = req.energy_kwh ?? null;
  let capacity_kw: number | null = req.capacity_kw ?? null;
  let zone = req.zone ?? { country: "XX" };
  let firmness: WattFirmness = req.firmness ?? "firm";

  if (req.reservation_id) {
    const reservation = await getWattReservation(req.reservation_id);
    if (!reservation || reservation.key_hash !== input.key_hash) {
      return { error: "Reservation not found", status: 404 };
    }
    if (
      reservation.status !== "settled" &&
      reservation.status !== "confirmed"
    ) {
      return {
        error: "Only confirmed or settled reservations can be listed",
        status: 409,
      };
    }
    reservation_id = reservation.id;
    cfu_unit_id = reservation.cfu_unit_id ?? cfu_unit_id;
    cfu_verify_url = reservation.cfu_verify_url ?? cfu_verify_url;
    energy_kwh =
      reservation.energy_kwh_delivered ??
      reservation.profile.energy_kwh ??
      energy_kwh;
    capacity_kw =
      reservation.capacity_kw_delivered ??
      reservation.profile.capacity_kw ??
      capacity_kw;
    zone = {
      country: reservation.profile.zone.country,
      ...(reservation.profile.zone.zone_id
        ? { zone_id: reservation.profile.zone.zone_id }
        : {}),
    };
    firmness = reservation.profile.firmness;
  }

  const listing: WattSecondaryListing = {
    id: randomUUID(),
    key_hash: input.key_hash,
    status: "open",
    reservation_id,
    cfu_unit_id,
    cfu_verify_url,
    indicative_price_eur: req.indicative_price_eur,
    compare_ref_id: req.compare_ref_id ?? null,
    label: req.label ?? null,
    note: req.note ?? null,
    energy_kwh,
    capacity_kw,
    zone,
    firmness,
    interest_count: 0,
    created_at: new Date().toISOString(),
    withdrawn_at: null,
  };

  if (isSupabaseConfigured()) {
    try {
      const { getSupabaseServerClient } = await import("@/lib/supabase/server");
      const supabase = getSupabaseServerClient();
      const { data, error } = await supabase
        .from("watt_secondary_listings")
        .insert({
          id: listing.id,
          key_hash: listing.key_hash,
          status: listing.status,
          reservation_id: listing.reservation_id,
          cfu_unit_id: listing.cfu_unit_id,
          cfu_verify_url: listing.cfu_verify_url,
          indicative_price_eur: listing.indicative_price_eur,
          compare_ref_id: listing.compare_ref_id,
          label: listing.label,
          note: listing.note,
          energy_kwh: listing.energy_kwh,
          capacity_kw: listing.capacity_kw,
          zone: listing.zone,
          firmness: listing.firmness,
          interest_count: listing.interest_count,
          created_at: listing.created_at,
        })
        .select("*")
        .maybeSingle();
      if (!error && data) {
        const mapped = rowToListing(data as Record<string, unknown>);
        memory.set(mapped.id, mapped);
        return mapped;
      }
    } catch {
      /* fallback */
    }
  }

  memory.set(listing.id, listing);
  persistFile();
  return listing;
}

export async function getWattSecondaryListing(
  id: string
): Promise<WattSecondaryListing | null> {
  if (isSupabaseConfigured()) {
    try {
      const { getSupabaseServerClient } = await import("@/lib/supabase/server");
      const supabase = getSupabaseServerClient();
      const { data, error } = await supabase
        .from("watt_secondary_listings")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (!error && data) {
        const mapped = rowToListing(data as Record<string, unknown>);
        memory.set(mapped.id, mapped);
        return mapped;
      }
    } catch {
      /* fallback */
    }
  }
  return memory.get(id) ?? null;
}

export async function listWattSecondaryListings(input?: {
  status?: WattSecondaryStatus;
  key_hash?: string;
  limit?: number;
}): Promise<WattSecondaryListing[]> {
  const limit = Math.min(100, Math.max(1, input?.limit ?? 50));

  if (isSupabaseConfigured()) {
    try {
      const { getSupabaseServerClient } = await import("@/lib/supabase/server");
      const supabase = getSupabaseServerClient();
      let q = supabase
        .from("watt_secondary_listings")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);
      if (input?.status) q = q.eq("status", input.status);
      if (input?.key_hash) q = q.eq("key_hash", input.key_hash);
      const { data, error } = await q;
      if (!error && data) {
        const mapped = data.map((row) =>
          rowToListing(row as Record<string, unknown>)
        );
        for (const o of mapped) memory.set(o.id, o);
        return mapped;
      }
    } catch {
      /* fallback */
    }
  }

  let items = [...memory.values()];
  if (input?.status) items = items.filter((o) => o.status === input.status);
  if (input?.key_hash)
    items = items.filter((o) => o.key_hash === input.key_hash);
  return items
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, limit);
}

export async function withdrawWattSecondaryListing(input: {
  id: string;
  keyHash: string;
}): Promise<WattSecondaryListing | { error: string; status: number }> {
  const existing = await getWattSecondaryListing(input.id);
  if (!existing || existing.key_hash !== input.keyHash) {
    return { error: "Listing not found", status: 404 };
  }
  if (existing.status !== "open") {
    return { error: `Cannot withdraw listing in status ${existing.status}`, status: 409 };
  }

  const withdrawnAt = new Date().toISOString();
  const updated: WattSecondaryListing = {
    ...existing,
    status: "withdrawn",
    withdrawn_at: withdrawnAt,
  };

  if (isSupabaseConfigured()) {
    try {
      const { getSupabaseServerClient } = await import("@/lib/supabase/server");
      const supabase = getSupabaseServerClient();
      const { data, error } = await supabase
        .from("watt_secondary_listings")
        .update({ status: "withdrawn", withdrawn_at: withdrawnAt })
        .eq("id", input.id)
        .eq("key_hash", input.keyHash)
        .select("*")
        .maybeSingle();
      if (!error && data) {
        const mapped = rowToListing(data as Record<string, unknown>);
        memory.set(mapped.id, mapped);
        persistFile();
        return mapped;
      }
    } catch {
      /* fallback */
    }
  }

  memory.set(updated.id, updated);
  persistFile();
  return updated;
}

export async function expressWattSecondaryInterest(input: {
  id: string;
}): Promise<WattSecondaryListing | { error: string; status: number }> {
  const existing = await getWattSecondaryListing(input.id);
  if (!existing) {
    return { error: "Listing not found", status: 404 };
  }
  if (existing.status !== "open") {
    return { error: "Listing is not open for interest", status: 409 };
  }

  const updated: WattSecondaryListing = {
    ...existing,
    interest_count: existing.interest_count + 1,
  };

  if (isSupabaseConfigured()) {
    try {
      const { getSupabaseServerClient } = await import("@/lib/supabase/server");
      const supabase = getSupabaseServerClient();
      const { data, error } = await supabase
        .from("watt_secondary_listings")
        .update({ interest_count: updated.interest_count })
        .eq("id", input.id)
        .select("*")
        .maybeSingle();
      if (!error && data) {
        const mapped = rowToListing(data as Record<string, unknown>);
        memory.set(mapped.id, mapped);
        persistFile();
        return mapped;
      }
    } catch {
      /* fallback */
    }
  }

  memory.set(updated.id, updated);
  persistFile();
  return updated;
}
