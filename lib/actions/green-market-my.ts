"use server";

import { auth, currentUser } from "@clerk/nextjs/server";

import { geocodeCity } from "@/lib/green/market/geocode";
import {
  listGreenMarketAlertsForUser,
  saveGreenMarketAlert,
  type GreenMarketAlertRow,
} from "@/lib/green/market/alerts";
import {
  listGreenLabelApplicationsByEmail,
  type GreenLabelApplicationRow,
} from "@/lib/green/label-applications";
import {
  listMyGreenMarketListings,
  type MyGreenMarketListing,
} from "@/lib/green/market/green-market-db";
import type {
  GreenMarketActorType,
  GreenMarketRadiusKm,
} from "@/lib/green/market/types";
import { isValidCaptureEmail } from "@/lib/email-capture";

export type GreenMyDashboard = {
  listings: MyGreenMarketListing[];
  alerts: GreenMarketAlertRow[];
  labelApplications: GreenLabelApplicationRow[];
  email: string | null;
};

export async function getGreenMyDashboardAction(): Promise<
  GreenMyDashboard | { ok: false; error: "unauthenticated" }
> {
  const { userId } = await auth();
  if (!userId) return { ok: false, error: "unauthenticated" };

  const user = await currentUser();
  const email =
    user?.primaryEmailAddress?.emailAddress?.trim().toLowerCase() ?? null;

  const [listings, alerts, labelApplications] = await Promise.all([
    listMyGreenMarketListings({ ownerClerkId: userId, email }),
    listGreenMarketAlertsForUser({ ownerClerkId: userId, email }),
    email ? listGreenLabelApplicationsByEmail(email) : Promise.resolve([]),
  ]);

  return { listings, alerts, labelApplications, email };
}

export type SaveGreenMarketAlertActionInput = {
  city: string;
  country?: string;
  radiusKm: GreenMarketRadiusKm;
  actorType?: GreenMarketActorType | "";
  email?: string;
};

export type SaveGreenMarketAlertActionResult =
  | { ok: true; id: string }
  | { ok: false; error: "unauthenticated" | "invalid" | "database"; message?: string };

export async function saveGreenMarketAlertAction(
  input: SaveGreenMarketAlertActionInput
): Promise<SaveGreenMarketAlertActionResult> {
  const { userId } = await auth();
  const user = userId ? await currentUser() : null;
  const clerkEmail = user?.primaryEmailAddress?.emailAddress?.trim().toLowerCase();
  const email = (input.email?.trim().toLowerCase() || clerkEmail || "").trim();

  if (!email || !isValidCaptureEmail(email)) {
    return { ok: false, error: "invalid" };
  }

  const city = input.city.trim();
  if (city.length < 2) {
    return { ok: false, error: "invalid" };
  }

  if (![5, 10, 20].includes(input.radiusKm)) {
    return { ok: false, error: "invalid" };
  }

  const country = input.country?.trim();
  const coords = await geocodeCity(city, country || undefined);
  const actorType =
    input.actorType && input.actorType.length > 0 ? input.actorType : null;

  const result = await saveGreenMarketAlert({
    email,
    ownerClerkId: userId,
    city,
    lat: coords.lat,
    lon: coords.lon,
    radiusKm: input.radiusKm,
    actorType,
  });

  if (!result.ok) {
    return { ok: false, error: "database", message: result.error };
  }

  return { ok: true, id: result.id };
}
