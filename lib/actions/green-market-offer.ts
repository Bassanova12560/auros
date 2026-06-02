"use server";

import { auth } from "@clerk/nextjs/server";

import type {
  GreenMarketEnergyType,
  GreenMarketOfferSide,
} from "@/lib/green/market/types";
import { geocodeCity } from "@/lib/green/market/geocode";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { insertGreenMarketOffer } from "@/lib/green/market/green-market-db";
import { notifyGreenMarketSheets } from "@/lib/green/market/sheets-notify";
import {
  sendGreenMarketInternal,
  sendGreenMarketReceived,
} from "@/lib/emails/send";

const ENERGY_TYPES: GreenMarketEnergyType[] = [
  "solar",
  "wind",
  "hydro",
  "battery",
  "mixed",
];

export type SaveGreenMarketOfferInput = {
  actorName: string;
  side: GreenMarketOfferSide;
  energyType: GreenMarketEnergyType;
  volumeKwh: number;
  pricePerKwh: number;
  city: string;
  country: string;
  contactEmail?: string;
};

export type SaveGreenMarketOfferResult =
  | { ok: true; id: string; pending: boolean }
  | { ok: false; error: "invalid" }
  | { ok: false; error: "rate_limit" }
  | { ok: false; error: "database"; message: string };

export async function saveGreenMarketOfferAction(
  input: SaveGreenMarketOfferInput
): Promise<SaveGreenMarketOfferResult> {
  const ip = await getClientIp();
  const { allowed } = checkRateLimit(`green-market-offer:${ip}`, 8, 3_600_000);
  if (!allowed) return { ok: false, error: "rate_limit" };

  const actorName = input.actorName.trim();
  const city = input.city.trim();
  const country = input.country.trim();
  const contactEmail = input.contactEmail?.trim();

  if (
    actorName.length < 2 ||
    city.length < 2 ||
    country.length < 2 ||
    !ENERGY_TYPES.includes(input.energyType) ||
    !["sell", "buy"].includes(input.side) ||
    !Number.isFinite(input.volumeKwh) ||
    input.volumeKwh <= 0 ||
    !Number.isFinite(input.pricePerKwh) ||
    input.pricePerKwh < 0
  ) {
    return { ok: false, error: "invalid" };
  }

  if (contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
    return { ok: false, error: "invalid" };
  }

  const coords = await geocodeCity(city, country);
  const { userId } = await auth();
  const payload = {
    actorName,
    side: input.side,
    energyType: input.energyType,
    volumeKwh: input.volumeKwh,
    pricePerKwh: input.pricePerKwh,
    city,
    country,
    lat: coords.lat,
    lon: coords.lon,
    contactEmail,
    ownerClerkId: userId,
  };

  const result = await insertGreenMarketOffer(payload);
  if (!result.ok) {
    return { ok: false, error: "database", message: result.error };
  }

  void notifyGreenMarketSheets({ ...payload, id: result.id });

  if (contactEmail) {
    void sendGreenMarketReceived(contactEmail, {
      name: actorName,
      kind: "offer",
      city,
      country,
      locale: "fr",
    });
  }
  if (contactEmail) {
    void sendGreenMarketInternal({
      kind: "offer",
      name: actorName,
      city,
      country,
      email: contactEmail,
      id: result.id,
      table: "green_market_offers",
    });
  }

  return { ok: true, id: result.id, pending: result.pending };
}
