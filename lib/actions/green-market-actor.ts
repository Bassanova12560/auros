"use server";

import { auth } from "@clerk/nextjs/server";

import type {
  GreenMarketActorType,
  GreenMarketEnergyType,
} from "@/lib/green/market/types";
import { geocodeCity } from "@/lib/green/market/geocode";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { insertGreenMarketAsset } from "@/lib/green/market/green-market-db";
import { notifyGreenMarketSheets } from "@/lib/green/market/sheets-notify";
import {
  sendGreenMarketInternal,
  sendGreenMarketReceived,
} from "@/lib/emails/send";

const ACTOR_TYPES: GreenMarketActorType[] = ["producer", "storer", "charger", "consumer"];
const ENERGY_TYPES: GreenMarketEnergyType[] = ["solar", "wind", "hydro", "battery", "mixed"];

export type SaveGreenMarketActorInput = {
  type: GreenMarketActorType;
  name: string;
  city: string;
  country: string;
  region?: string;
  description: string;
  contactEmail: string;
  capacityKwh: number;
  pricePerKwh?: number;
  energyType: GreenMarketEnergyType;
};

export type SaveGreenMarketActorResult =
  | { ok: true; id: string; pending: true }
  | { ok: false; error: "invalid" }
  | { ok: false; error: "rate_limit" }
  | { ok: false; error: "database"; message: string };

export async function saveGreenMarketActorAction(
  input: SaveGreenMarketActorInput
): Promise<SaveGreenMarketActorResult> {
  const ip = await getClientIp();
  const { allowed } = checkRateLimit(`green-market-actor:${ip}`, 8, 3_600_000);
  if (!allowed) return { ok: false, error: "rate_limit" };

  const name = input.name.trim();
  const city = input.city.trim();
  const country = input.country.trim();
  const description = input.description.trim();
  const contactEmail = input.contactEmail.trim();
  const region = input.region?.trim();

  if (
    name.length < 2 ||
    city.length < 2 ||
    country.length < 2 ||
    description.length < 20 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail) ||
    !ACTOR_TYPES.includes(input.type) ||
    !ENERGY_TYPES.includes(input.energyType) ||
    !Number.isFinite(input.capacityKwh) ||
    input.capacityKwh <= 0
  ) {
    return { ok: false, error: "invalid" };
  }

  if (
    input.pricePerKwh != null &&
    (!Number.isFinite(input.pricePerKwh) || input.pricePerKwh < 0)
  ) {
    return { ok: false, error: "invalid" };
  }

  const coords = await geocodeCity(city, country);
  const { userId } = await auth();

  const result = await insertGreenMarketAsset({
    type: input.type,
    name,
    city,
    country,
    region,
    description,
    contactEmail,
    capacityKwh: input.capacityKwh,
    pricePerKwh: input.pricePerKwh ?? null,
    energyType: input.energyType,
    lat: coords.lat,
    lon: coords.lon,
    ownerClerkId: userId,
  });

  if (!result.ok) {
    return { ok: false, error: "database", message: result.error };
  }

  void notifyGreenMarketSheets({
    id: result.id,
    actorName: name,
    side: "register",
    energyType: input.energyType,
    volumeKwh: input.capacityKwh,
    pricePerKwh: input.pricePerKwh ?? 0,
    city,
  });

  void sendGreenMarketReceived(contactEmail, {
    name,
    kind: "actor",
    city,
    country,
    locale: "fr",
  });
  void sendGreenMarketInternal({
    kind: "actor",
    name,
    city,
    country,
    email: contactEmail,
    id: result.id,
    table: "green_market_assets",
  });

  return { ok: true, id: result.id, pending: true };
}
