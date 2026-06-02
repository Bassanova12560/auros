import type { SupabaseClient } from "@supabase/supabase-js";

import { GREEN_MARKET_ACTORS, GREEN_MARKET_OFFERS } from "./data";
import { seedGreenReferencedPilots } from "./referenced-seed";
import { upsertByExternalId } from "./upsert-external-id";

export async function seedGreenMarketData(supabase: SupabaseClient): Promise<void> {
  for (const a of GREEN_MARKET_ACTORS) {
    await upsertByExternalId(supabase, "green_market_assets", a.id, {
      type: a.type,
      lat: a.lat,
      lon: a.lon,
      capacity_kwh: a.capacityKwh,
      price_per_kwh: a.pricePerKwh,
      energy_type: a.energyType,
      is_certified: a.isCertified,
      status: a.status,
      name: a.name,
      city: a.city,
      country: a.country,
      region: a.region,
      description: a.description,
      contact_email: a.contactEmail,
      listing_tier: a.listingTier,
    });
  }

  for (const o of GREEN_MARKET_OFFERS) {
    await upsertByExternalId(supabase, "green_market_offers", o.id, {
      actor_name: o.actorName,
      side: o.side,
      volume_kwh: o.volumeKwh,
      price_per_kwh: o.pricePerKwh,
      energy_type: o.energyType,
      city: o.city,
      country: o.country,
      lat: o.lat,
      lon: o.lon,
      status: o.status,
      created_at: o.createdAt,
      listing_tier: o.listingTier,
    });
  }

  await seedGreenReferencedPilots(supabase);
}
