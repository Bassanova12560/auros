import { randomUUID } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { isSupabaseConfigured } from "@/lib/protocol/auth/keys";

import type {
  WattCapacityOffer,
  WattCapacityOfferRequest,
  WattFirmness,
  WattOfferStatus,
} from "./types";

const DATA_DIR = join(process.cwd(), ".data");
const FILE = join(DATA_DIR, "watt-capacity-offers.json");

const memory = new Map<string, WattCapacityOffer>();

function loadFile() {
  if (!existsSync(FILE)) return;
  try {
    const raw = JSON.parse(readFileSync(FILE, "utf8")) as WattCapacityOffer[];
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

function rowToOffer(row: Record<string, unknown>): WattCapacityOffer {
  const zone = (row.zone as WattCapacityOffer["zone"]) ?? { country: "XX" };
  const timeWindow =
    (row.time_window as WattCapacityOffer["window"] | undefined) ??
    (row.window as WattCapacityOffer["window"]);
  return {
    id: String(row.id),
    key_hash: String(row.key_hash),
    status: row.status as WattOfferStatus,
    window: timeWindow,
    capacity_kw: row.capacity_kw != null ? Number(row.capacity_kw) : null,
    energy_kwh: row.energy_kwh != null ? Number(row.energy_kwh) : null,
    zone,
    carbon_intensity_gco2_kwh:
      row.carbon_intensity_gco2_kwh != null
        ? Number(row.carbon_intensity_gco2_kwh)
        : null,
    firmness: row.firmness as WattFirmness,
    producer_ref: row.producer_ref != null ? String(row.producer_ref) : null,
    label: row.label != null ? String(row.label) : null,
    created_at: String(row.created_at),
    withdrawn_at: row.withdrawn_at != null ? String(row.withdrawn_at) : null,
  };
}

function validateOfferWindow(req: WattCapacityOfferRequest): string | null {
  const start = new Date(req.window.start);
  const end = new Date(req.window.end);
  if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime())) {
    return "Invalid offer window timestamps";
  }
  if (end.getTime() <= start.getTime()) {
    return "end must be after start";
  }
  const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  if (hours > 168) {
    return "Offer window must be ≤ 7 days";
  }
  return null;
}

export async function insertWattCapacityOffer(input: {
  key_hash: string;
  request: WattCapacityOfferRequest;
}): Promise<WattCapacityOffer | { error: string }> {
  const windowError = validateOfferWindow(input.request);
  if (windowError) return { error: windowError };

  const offer: WattCapacityOffer = {
    id: randomUUID(),
    key_hash: input.key_hash,
    status: "open",
    window: input.request.window,
    capacity_kw: input.request.capacity_kw ?? null,
    energy_kwh: input.request.energy_kwh ?? null,
    zone: {
      country: input.request.zone.country,
      ...(input.request.zone.zone_id
        ? { zone_id: input.request.zone.zone_id }
        : {}),
    },
    carbon_intensity_gco2_kwh:
      input.request.carbon_intensity_gco2_kwh ?? null,
    firmness: input.request.firmness,
    producer_ref: input.request.producer_ref ?? null,
    label: input.request.label ?? null,
    created_at: new Date().toISOString(),
    withdrawn_at: null,
  };

  if (isSupabaseConfigured()) {
    try {
      const { getSupabaseServerClient } = await import("@/lib/supabase/server");
      const supabase = getSupabaseServerClient();
      const { data, error } = await supabase
        .from("watt_capacity_offers")
        .insert({
          id: offer.id,
          key_hash: offer.key_hash,
          status: offer.status,
          time_window: offer.window,
          capacity_kw: offer.capacity_kw,
          energy_kwh: offer.energy_kwh,
          zone: offer.zone,
          carbon_intensity_gco2_kwh: offer.carbon_intensity_gco2_kwh,
          firmness: offer.firmness,
          producer_ref: offer.producer_ref,
          label: offer.label,
          created_at: offer.created_at,
        })
        .select("*")
        .maybeSingle();
      if (!error && data) {
        const mapped = rowToOffer(data as Record<string, unknown>);
        memory.set(mapped.id, mapped);
        return mapped;
      }
    } catch {
      /* fallback */
    }
  }

  memory.set(offer.id, offer);
  persistFile();
  return offer;
}

export async function getWattCapacityOffer(
  id: string
): Promise<WattCapacityOffer | null> {
  if (isSupabaseConfigured()) {
    try {
      const { getSupabaseServerClient } = await import("@/lib/supabase/server");
      const supabase = getSupabaseServerClient();
      const { data, error } = await supabase
        .from("watt_capacity_offers")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (!error && data) {
        const mapped = rowToOffer(data as Record<string, unknown>);
        memory.set(mapped.id, mapped);
        return mapped;
      }
    } catch {
      /* fallback */
    }
  }
  return memory.get(id) ?? null;
}

export async function listWattCapacityOffers(input?: {
  status?: WattOfferStatus;
  country?: string;
  key_hash?: string;
  limit?: number;
}): Promise<WattCapacityOffer[]> {
  const limit = Math.min(100, Math.max(1, input?.limit ?? 50));

  if (isSupabaseConfigured()) {
    try {
      const { getSupabaseServerClient } = await import("@/lib/supabase/server");
      const supabase = getSupabaseServerClient();
      let q = supabase
        .from("watt_capacity_offers")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);
      if (input?.status) q = q.eq("status", input.status);
      if (input?.key_hash) q = q.eq("key_hash", input.key_hash);
      if (input?.country) {
        q = q.contains("zone", { country: input.country });
      }
      const { data, error } = await q;
      if (!error && data) {
        const mapped = data.map((row) =>
          rowToOffer(row as Record<string, unknown>)
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
  if (input?.key_hash) items = items.filter((o) => o.key_hash === input.key_hash);
  if (input?.country) {
    const c = input.country.trim().toUpperCase();
    items = items.filter((o) => o.zone.country.trim().toUpperCase() === c);
  }
  return items
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, limit);
}

export async function withdrawWattCapacityOffer(input: {
  id: string;
  keyHash: string;
}): Promise<WattCapacityOffer | { error: string; status: number }> {
  const existing = await getWattCapacityOffer(input.id);
  if (!existing || existing.key_hash !== input.keyHash) {
    return { error: "Offer not found", status: 404 };
  }
  if (existing.status === "withdrawn") {
    return { error: "Offer already withdrawn", status: 409 };
  }

  const withdrawnAt = new Date().toISOString();
  const updated: WattCapacityOffer = {
    ...existing,
    status: "withdrawn",
    withdrawn_at: withdrawnAt,
  };

  if (isSupabaseConfigured()) {
    try {
      const { getSupabaseServerClient } = await import("@/lib/supabase/server");
      const supabase = getSupabaseServerClient();
      const { data, error } = await supabase
        .from("watt_capacity_offers")
        .update({ status: "withdrawn", withdrawn_at: withdrawnAt })
        .eq("id", input.id)
        .eq("key_hash", input.keyHash)
        .select("*")
        .maybeSingle();
      if (!error && data) {
        const mapped = rowToOffer(data as Record<string, unknown>);
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
