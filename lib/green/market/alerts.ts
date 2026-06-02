import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { withinRadiusKm } from "./geo";
import type { GreenMarketActorType } from "./types";

function getAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SECRET_KEY?.trim();
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export type GreenMarketAlertRow = {
  id: string;
  email: string;
  ownerClerkId: string | null;
  city: string;
  lat: number;
  lon: number;
  radiusKm: 5 | 10 | 20;
  actorType: GreenMarketActorType | null;
  active: boolean;
  createdAt: string;
};

export type SaveGreenMarketAlertInput = {
  email: string;
  ownerClerkId?: string | null;
  city: string;
  lat: number;
  lon: number;
  radiusKm: 5 | 10 | 20;
  actorType?: GreenMarketActorType | null;
};

export async function saveGreenMarketAlert(
  input: SaveGreenMarketAlertInput
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const supabase = getAdminClient();
  if (!supabase) return { ok: false, error: "database_unavailable" };

  const { data, error } = await supabase
    .from("green_market_alerts")
    .insert({
      email: input.email.trim().toLowerCase(),
      owner_clerk_id: input.ownerClerkId?.trim() || null,
      city: input.city.trim(),
      lat: input.lat,
      lon: input.lon,
      radius_km: input.radiusKm,
      actor_type: input.actorType ?? null,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("[saveGreenMarketAlert]", error);
    return { ok: false, error: error?.message ?? "insert_failed" };
  }

  return { ok: true, id: String(data.id) };
}

export async function listGreenMarketAlertsForUser(input: {
  ownerClerkId?: string | null;
  email?: string | null;
}): Promise<GreenMarketAlertRow[]> {
  const supabase = getAdminClient();
  if (!supabase) return [];

  const clerkId = input.ownerClerkId?.trim();
  const email = input.email?.trim().toLowerCase();
  if (!clerkId && !email) return [];

  let query = supabase
    .from("green_market_alerts")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false });

  if (clerkId && email) {
    query = query.or(`owner_clerk_id.eq.${clerkId},email.eq.${email}`);
  } else if (clerkId) {
    query = query.eq("owner_clerk_id", clerkId);
  } else {
    query = query.eq("email", email!);
  }

  const { data, error } = await query;
  if (error || !data) {
    console.error("[listGreenMarketAlertsForUser]", error);
    return [];
  }

  return data.map(mapAlertRow);
}

function mapAlertRow(row: Record<string, unknown>): GreenMarketAlertRow {
  return {
    id: String(row.id),
    email: String(row.email),
    ownerClerkId: row.owner_clerk_id ? String(row.owner_clerk_id) : null,
    city: String(row.city),
    lat: Number(row.lat),
    lon: Number(row.lon),
    radiusKm: Number(row.radius_km) as 5 | 10 | 20,
    actorType: row.actor_type
      ? (String(row.actor_type) as GreenMarketActorType)
      : null,
    active: Boolean(row.active),
    createdAt: String(row.created_at),
  };
}

export type NewActorAlertPayload = {
  name: string;
  city: string;
  lat: number;
  lon: number;
  type: GreenMarketActorType;
};

export async function matchGreenMarketAlertsForActor(
  actor: NewActorAlertPayload
): Promise<GreenMarketAlertRow[]> {
  const supabase = getAdminClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("green_market_alerts")
    .select("*")
    .eq("active", true);

  if (error || !data) {
    console.error("[matchGreenMarketAlertsForActor]", error);
    return [];
  }

  return data
    .map(mapAlertRow)
    .filter((alert) => {
      if (alert.actorType && alert.actorType !== actor.type) return false;
      return withinRadiusKm(actor.lat, actor.lon, alert.lat, alert.lon, alert.radiusKm);
    });
}
