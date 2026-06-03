import { createClient, type PostgrestError, type SupabaseClient } from "@supabase/supabase-js";

import {
  GREEN_MARKET_ACTORS,
  GREEN_MARKET_OFFERS,
} from "./data";
import {
  defaultGreenMarketOfferDescription,
  type GreenMarketOfferDetail,
} from "./offer-detail";
import type { GreenMarketActorDetail } from "./actor-detail";
import { findDemoGreenMarketOfferById, isGreenMarketOfferUuid, normalizeGreenMarketOfferId } from "./offer-routes";
import {
  findDemoGreenMarketActorById,
  isGreenMarketActorUuid,
  normalizeGreenMarketActorId,
} from "./actor-routes";
import type {
  GreenMarketActor,
  GreenMarketListingTier,
  GreenMarketOffer,
} from "./types";
import { GREEN_MIN_REFERENCED_TO_HIDE_DEMO } from "../constants";

export type GreenMarketMode = "live" | "demo";

export type GreenMarketSnapshot = {
  available: boolean;
  mode: GreenMarketMode;
  actors: GreenMarketActor[];
  offers: GreenMarketOffer[];
};

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

function fallbackSnapshot(): GreenMarketSnapshot {
  return {
    available: false,
    mode: "demo",
    actors: GREEN_MARKET_ACTORS,
    offers: GREEN_MARKET_OFFERS,
  };
}

function resolveListingTier(row: Record<string, unknown>): GreenMarketListingTier {
  if (row.listing_tier === "demo" || row.listing_tier === "verified") {
    return row.listing_tier;
  }
  if (Boolean(row.is_certified)) return "verified";
  return "referenced";
}

function mapAssetRow(row: Record<string, unknown>): GreenMarketActor {
  return {
    id: String(row.external_id ?? row.id),
    type: row.type as GreenMarketActor["type"],
    name: String(row.name),
    lat: Number(row.lat),
    lon: Number(row.lon),
    capacityKwh: Number(row.capacity_kwh),
    pricePerKwh: row.price_per_kwh != null ? Number(row.price_per_kwh) : null,
    energyType: row.energy_type as GreenMarketActor["energyType"],
    isCertified: Boolean(row.is_certified),
    status: row.status as GreenMarketActor["status"],
    city: String(row.city),
    country: row.country ? String(row.country) : "France",
    region: row.region ? String(row.region) : "",
    description: row.description ? String(row.description) : "",
    contactEmail: row.contact_email ? String(row.contact_email) : "",
    listingTier: resolveListingTier(row),
  };
}

function countActorCountries(actors: ReadonlyArray<GreenMarketActor>): number {
  return new Set(actors.map((a) => a.country.trim()).filter(Boolean)).size;
}

/** Live snapshot: hide demo only when referenced pilots span enough countries. */
export function resolveLiveMarketActors(
  dbActors: GreenMarketActor[],
  dbOffers: GreenMarketOffer[]
): { actors: GreenMarketActor[]; offers: GreenMarketOffer[] } {
  const referencedCount = dbActors.filter(
    (a) => a.listingTier === "referenced" || a.listingTier === "verified"
  ).length;

  const nonDemoActors = dbActors.filter((a) => a.listingTier !== "demo");
  const referencedCountryCount = countActorCountries(nonDemoActors);

  const hideDemo =
    referencedCount >= GREEN_MIN_REFERENCED_TO_HIDE_DEMO &&
    referencedCountryCount >= 5;

  let actors = hideDemo ? nonDemoActors : dbActors;
  let offers = hideDemo
    ? dbOffers.filter((o) => o.listingTier !== "demo")
    : dbOffers;

  if (countActorCountries(actors) < 10) {
    const ids = new Set(actors.map((a) => a.id));
    for (const demo of GREEN_MARKET_ACTORS) {
      if (!ids.has(demo.id)) {
        actors.push(demo);
        ids.add(demo.id);
      }
    }
  }

  return { actors, offers };
}

function mapOfferRow(row: Record<string, unknown>): GreenMarketOffer | null {
  const actorName = row.actor_name ? String(row.actor_name) : "";
  const city = row.city ? String(row.city) : "";
  const lat = row.lat != null ? Number(row.lat) : null;
  const lon = row.lon != null ? Number(row.lon) : null;
  if (!actorName || !city || lat == null || lon == null) return null;

  return {
    id: String(row.external_id ?? row.id),
    actorId: row.asset_id ? String(row.asset_id) : "db",
    actorName,
    side: row.side as GreenMarketOffer["side"],
    volumeKwh: Number(row.volume_kwh),
    pricePerKwh: Number(row.price_per_kwh),
    energyType: row.energy_type as GreenMarketOffer["energyType"],
    lat,
    lon,
    city,
    country: row.country ? String(row.country) : "France",
    createdAt: String(row.created_at),
    status: (row.status === "closed" ? "pending" : row.status) as GreenMarketOffer["status"],
    listingTier: resolveListingTier(row),
  };
}

export async function getGreenMarketSnapshot(): Promise<GreenMarketSnapshot> {
  const supabase = getAdminClient();
  if (!supabase) return fallbackSnapshot();

  try {
    const [assetsRes, offersRes] = await Promise.all([
      supabase
        .from("green_market_assets")
        .select("*")
        .eq("status", "available")
        .order("created_at", { ascending: false }),
      supabase
        .from("green_market_offers")
        .select("*")
        .eq("status", "available")
        .order("created_at", { ascending: false }),
    ]);

    if (assetsRes.error && isMissingTable(assetsRes.error)) {
      return fallbackSnapshot();
    }

    const dbActors = (assetsRes.data ?? []).map((row) =>
      mapAssetRow(row as Record<string, unknown>)
    );
    const dbOffers = (offersRes.data ?? [])
      .map((row) => mapOfferRow(row as Record<string, unknown>))
      .filter((o): o is GreenMarketOffer => o != null);

    const { actors, offers } = resolveLiveMarketActors(dbActors, dbOffers);

    return {
      available: true,
      mode: "live",
      actors,
      offers,
    };
  } catch {
    return fallbackSnapshot();
  }
}

export async function insertGreenMarketOffer(
  offer: Omit<GreenMarketOffer, "id" | "createdAt" | "status" | "actorId" | "listingTier"> & {
    actorId?: string;
    contactEmail?: string;
    publish?: boolean;
    ownerClerkId?: string | null;
  }
): Promise<{ ok: true; id: string; pending: boolean } | { ok: false; error: string }> {
  const supabase = getAdminClient();
  if (!supabase) {
    return { ok: false, error: "database_unavailable" };
  }

  const pending = offer.publish !== true;

  const { data, error } = await supabase
    .from("green_market_offers")
    .insert({
      actor_name: offer.actorName,
      side: offer.side,
      volume_kwh: offer.volumeKwh,
      price_per_kwh: offer.pricePerKwh,
      energy_type: offer.energyType,
      city: offer.city,
      country: offer.country,
      lat: offer.lat,
      lon: offer.lon,
      contact_email: offer.contactEmail?.trim() || null,
      listing_tier: "referenced",
      status: pending ? "pending" : "available",
      owner_clerk_id: offer.ownerClerkId?.trim() || null,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("[insertGreenMarketOffer]", error);
    return { ok: false, error: error?.message ?? "insert_failed" };
  }

  return { ok: true, id: String(data.id), pending };
}

function resolveOfferActor(
  offer: GreenMarketOffer,
  actors: GreenMarketActor[]
): GreenMarketActor | null {
  if (offer.actorId && offer.actorId !== "db") {
    const byId = actors.find((a) => a.id === offer.actorId);
    if (byId) return byId;
  }
  return actors.find((a) => a.name === offer.actorName) ?? null;
}

function toOfferDetail(
  offer: GreenMarketOffer,
  actor: GreenMarketActor | null,
  extras: { description?: string; startDate?: string | null; endDate?: string | null }
): GreenMarketOfferDetail {
  const description =
    extras.description?.trim() ||
    actor?.description?.trim() ||
    defaultGreenMarketOfferDescription(offer, "fr");
  return {
    ...offer,
    description,
    startDate: extras.startDate ?? null,
    endDate: extras.endDate ?? null,
    actor,
  };
}

export async function getGreenMarketOfferById(
  rawId: string
): Promise<GreenMarketOfferDetail | null> {
  const id = normalizeGreenMarketOfferId(rawId);
  if (!id) return null;

  const supabase = getAdminClient();

  if (supabase) {
    try {
      let row: Record<string, unknown> | null = null;

      const byExternal = await supabase
        .from("green_market_offers")
        .select("*")
        .eq("external_id", id)
        .in("status", ["available", "pending"])
        .maybeSingle();

      if (byExternal.data) {
        row = byExternal.data as Record<string, unknown>;
      } else if (isGreenMarketOfferUuid(id)) {
        const byUuid = await supabase
          .from("green_market_offers")
          .select("*")
          .eq("id", id)
          .in("status", ["available", "pending"])
          .maybeSingle();
        if (byUuid.data) row = byUuid.data as Record<string, unknown>;
      }

      if (row) {
        const offer = mapOfferRow(row);
        if (!offer) return null;

        let actor: GreenMarketActor | null = null;
        const assetId = row.asset_id ? String(row.asset_id) : null;

        if (assetId) {
          const assetRes = await supabase
            .from("green_market_assets")
            .select("*")
            .eq("id", assetId)
            .maybeSingle();
          if (assetRes.data) {
            actor = mapAssetRow(assetRes.data as Record<string, unknown>);
          }
        }

        if (!actor) {
          const snap = await getGreenMarketSnapshot();
          actor = resolveOfferActor(offer, snap.actors);
        }

        return toOfferDetail(offer, actor, {
          startDate: row.start_date ? String(row.start_date) : null,
          endDate: row.end_date ? String(row.end_date) : null,
          description: actor?.description,
        });
      }
    } catch {
      /* fall through to demo */
    }
  }

  const demo = findDemoGreenMarketOfferById(id);
  if (!demo) return null;

  const actor =
    GREEN_MARKET_ACTORS.find((a) => a.id === demo.actorId) ??
    GREEN_MARKET_ACTORS.find((a) => a.name === demo.actorName) ??
    null;

  return toOfferDetail(demo, actor, { description: actor?.description });
}

export async function listGreenMarketOfferSitemapIds(): Promise<
  Array<{ id: string; createdAt: string }>
> {
  const snap = await getGreenMarketSnapshot();
  return snap.offers
    .filter((o) => o.status === "available")
    .map((o) => ({ id: o.id, createdAt: o.createdAt }));
}

function offersForActor(
  actor: GreenMarketActor,
  offers: GreenMarketOffer[]
): GreenMarketOffer[] {
  return offers.filter(
    (o) =>
      o.status === "available" &&
      (o.actorId === actor.id || o.actorName === actor.name)
  );
}

export async function getGreenMarketActorById(
  rawId: string
): Promise<GreenMarketActorDetail | null> {
  const id = normalizeGreenMarketActorId(rawId);
  if (!id) return null;

  const supabase = getAdminClient();

  if (supabase) {
    try {
      let row: Record<string, unknown> | null = null;

      const byExternal = await supabase
        .from("green_market_assets")
        .select("*")
        .eq("external_id", id)
        .in("status", ["available", "pending"])
        .maybeSingle();

      if (byExternal.data) {
        row = byExternal.data as Record<string, unknown>;
      } else if (isGreenMarketActorUuid(id)) {
        const byUuid = await supabase
          .from("green_market_assets")
          .select("*")
          .eq("id", id)
          .in("status", ["available", "pending"])
          .maybeSingle();
        if (byUuid.data) row = byUuid.data as Record<string, unknown>;
      }

      if (row) {
        const actor = mapAssetRow(row);
        const snap = await getGreenMarketSnapshot();
        return {
          ...actor,
          offers: offersForActor(actor, snap.offers),
        };
      }
    } catch {
      /* fall through to demo */
    }
  }

  const demo = findDemoGreenMarketActorById(id);
  if (!demo) return null;

  const snap = await getGreenMarketSnapshot();
  return {
    ...demo,
    offers: offersForActor(demo, snap.offers),
  };
}

export async function listGreenMarketActorSitemapIds(): Promise<
  Array<{ id: string }>
> {
  const snap = await getGreenMarketSnapshot();
  return snap.actors
    .filter((a) => a.status === "available")
    .map((a) => ({ id: a.id }));
}

export type InsertGreenMarketAssetInput = {
  type: GreenMarketActor["type"];
  name: string;
  city: string;
  country: string;
  region?: string;
  description: string;
  contactEmail: string;
  capacityKwh: number;
  pricePerKwh?: number | null;
  energyType: GreenMarketActor["energyType"];
  lat: number;
  lon: number;
  publish?: boolean;
  ownerClerkId?: string | null;
};

export async function insertGreenMarketAsset(
  input: InsertGreenMarketAssetInput
): Promise<{ ok: true; id: string; pending: boolean } | { ok: false; error: string }> {
  const supabase = getAdminClient();
  if (!supabase) return { ok: false, error: "database_unavailable" };

  const pending = input.publish !== true;

  const { data, error } = await supabase
    .from("green_market_assets")
    .insert({
      type: input.type,
      name: input.name,
      city: input.city,
      country: input.country.trim(),
      region: input.region?.trim() || null,
      description: input.description,
      contact_email: input.contactEmail,
      capacity_kwh: input.capacityKwh,
      price_per_kwh: input.pricePerKwh ?? null,
      energy_type: input.energyType,
      lat: input.lat,
      lon: input.lon,
      listing_tier: "referenced",
      is_certified: false,
      status: pending ? "pending" : "available",
      owner_clerk_id: input.ownerClerkId?.trim() || null,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("[insertGreenMarketAsset]", error);
    return { ok: false, error: error?.message ?? "insert_failed" };
  }

  return { ok: true, id: String(data.id), pending };
}

export async function moderateGreenMarketListing(input: {
  table: "green_market_assets" | "green_market_offers";
  id: string;
  action: "approve" | "reject";
}): Promise<
  | {
      ok: true;
      contactEmail: string | null;
      label: string;
      kind: "actor" | "offer";
    }
  | { ok: false; error: string }
> {
  const supabase = getAdminClient();
  if (!supabase) return { ok: false, error: "database_unavailable" };

  const { data: row, error: fetchErr } = await supabase
    .from(input.table)
    .select("*")
    .eq("id", input.id)
    .maybeSingle();

  if (fetchErr || !row) {
    return { ok: false, error: fetchErr?.message ?? "not_found" };
  }

  const kind = input.table === "green_market_assets" ? "actor" : "offer";
  const label =
    kind === "actor"
      ? String(row.name ?? "")
      : String(row.actor_name ?? "");
  const contactEmail = row.contact_email ? String(row.contact_email) : null;

  if (input.action === "approve") {
    const { error } = await supabase
      .from(input.table)
      .update({ status: "available" })
      .eq("id", input.id);
    if (error) return { ok: false, error: error.message };
    return { ok: true, contactEmail, label, kind };
  }

  const { error } = await supabase
    .from(input.table)
    .update({ status: "closed" })
    .eq("id", input.id);
  if (error) return { ok: false, error: error.message };
  return { ok: true, contactEmail, label, kind };
}

export type PendingGreenMarketListing = {
  id: string;
  table: "green_market_assets" | "green_market_offers";
  kind: "actor" | "offer";
  name: string;
  city: string;
  country: string;
  contactEmail: string | null;
  createdAt: string;
  detail: string;
};

export async function listPendingGreenMarketListings(): Promise<
  PendingGreenMarketListing[]
> {
  const supabase = getAdminClient();
  if (!supabase) return [];

  const [assetsRes, offersRes] = await Promise.all([
    supabase
      .from("green_market_assets")
      .select("id,name,city,country,contact_email,created_at,type,energy_type,capacity_kwh")
      .eq("status", "pending")
      .order("created_at", { ascending: false }),
    supabase
      .from("green_market_offers")
      .select("id,actor_name,city,country,contact_email,created_at,side,volume_kwh,energy_type")
      .eq("status", "pending")
      .order("created_at", { ascending: false }),
  ]);

  const assets: PendingGreenMarketListing[] = (assetsRes.data ?? []).map(
    (row) => ({
      id: String(row.id),
      table: "green_market_assets" as const,
      kind: "actor" as const,
      name: String(row.name),
      city: String(row.city),
      country: row.country ? String(row.country) : "France",
      contactEmail: row.contact_email ? String(row.contact_email) : null,
      createdAt: String(row.created_at),
      detail: `${row.type} · ${row.energy_type} · ${row.capacity_kwh} kWh`,
    })
  );

  const offers: PendingGreenMarketListing[] = (offersRes.data ?? []).map(
    (row) => ({
      id: String(row.id),
      table: "green_market_offers" as const,
      kind: "offer" as const,
      name: String(row.actor_name),
      city: String(row.city),
      country: row.country ? String(row.country) : "France",
      contactEmail: row.contact_email ? String(row.contact_email) : null,
      createdAt: String(row.created_at),
      detail: `${row.side} · ${row.energy_type} · ${row.volume_kwh} kWh`,
    })
  );

  return [...assets, ...offers].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export type MyGreenMarketListing = {
  id: string;
  table: "green_market_assets" | "green_market_offers";
  kind: "actor" | "offer";
  name: string;
  city: string;
  country: string;
  status: string;
  listingTier: GreenMarketListingTier;
  createdAt: string;
  detail: string;
};

export async function listMyGreenMarketListings(input: {
  ownerClerkId?: string | null;
  email?: string | null;
}): Promise<MyGreenMarketListing[]> {
  const supabase = getAdminClient();
  if (!supabase) return [];

  const clerkId = input.ownerClerkId?.trim();
  const email = input.email?.trim().toLowerCase();
  if (!clerkId && !email) return [];

  const ownerFilter = (columnClerk: string, columnEmail: string) => {
    if (clerkId && email) {
      return `${columnClerk}.eq.${clerkId},${columnEmail}.eq.${email}`;
    }
    if (clerkId) return `${columnClerk}.eq.${clerkId}`;
    return `${columnEmail}.eq.${email}`;
  };

  const [assetsRes, offersRes] = await Promise.all([
    supabase
      .from("green_market_assets")
      .select("id,name,city,country,status,listing_tier,created_at,type,energy_type,capacity_kwh")
      .or(ownerFilter("owner_clerk_id", "contact_email"))
      .order("created_at", { ascending: false }),
    supabase
      .from("green_market_offers")
      .select("id,actor_name,city,country,status,listing_tier,created_at,side,volume_kwh,energy_type")
      .or(ownerFilter("owner_clerk_id", "contact_email"))
      .order("created_at", { ascending: false }),
  ]);

  const assets: MyGreenMarketListing[] = (assetsRes.data ?? []).map((row) => ({
    id: String(row.id),
    table: "green_market_assets" as const,
    kind: "actor" as const,
    name: String(row.name),
    city: String(row.city),
    country: row.country ? String(row.country) : "France",
    status: String(row.status),
    listingTier: (row.listing_tier ?? "referenced") as GreenMarketListingTier,
    createdAt: String(row.created_at),
    detail: `${row.type} · ${row.energy_type} · ${row.capacity_kwh} kWh`,
  }));

  const offers: MyGreenMarketListing[] = (offersRes.data ?? []).map((row) => ({
    id: String(row.id),
    table: "green_market_offers" as const,
    kind: "offer" as const,
    name: String(row.actor_name),
    city: String(row.city),
    country: row.country ? String(row.country) : "France",
    status: String(row.status),
    listingTier: (row.listing_tier ?? "referenced") as GreenMarketListingTier,
    createdAt: String(row.created_at),
    detail: `${row.side} · ${row.energy_type} · ${row.volume_kwh} kWh`,
  }));

  return [...assets, ...offers].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getGreenMarketActorByIdForAlerts(
  id: string
): Promise<{
  name: string;
  city: string;
  lat: number;
  lon: number;
  type: GreenMarketActor["type"];
} | null> {
  const supabase = getAdminClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("green_market_assets")
    .select("name,city,lat,lon,type")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;

  return {
    name: String(data.name),
    city: String(data.city),
    lat: Number(data.lat),
    lon: Number(data.lon),
    type: data.type as GreenMarketActor["type"],
  };
}
