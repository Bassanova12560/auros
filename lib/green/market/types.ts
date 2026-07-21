export type GreenMarketListingTier = "demo" | "referenced" | "verified";

export type GreenMarketActorType = "producer" | "storer" | "charger" | "consumer";

export type GreenMarketEnergyType = "solar" | "wind" | "hydro" | "battery" | "mixed";

export type GreenMarketStatus = "available" | "pending";

export type GreenMarketOfferSide = "sell" | "buy";

export type GreenMarketActor = {
  id: string;
  type: GreenMarketActorType;
  name: string;
  lat: number;
  lon: number;
  capacityKwh: number;
  pricePerKwh: number | null;
  energyType: GreenMarketEnergyType;
  isCertified: boolean;
  status: GreenMarketStatus;
  city: string;
  country: string;
  region: string;
  description: string;
  contactEmail: string;
  listingTier: GreenMarketListingTier;
  /** Asset DNA id when minted (auros:dna:v1:…) */
  assetDnaId?: string;
};

export type GreenMarketOffer = {
  id: string;
  actorId: string;
  actorName: string;
  side: GreenMarketOfferSide;
  volumeKwh: number;
  pricePerKwh: number;
  energyType: GreenMarketEnergyType;
  lat: number;
  lon: number;
  city: string;
  country: string;
  createdAt: string;
  status: GreenMarketStatus;
  listingTier: GreenMarketListingTier;
};

export type GreenMarketRadiusKm = 5 | 10 | 20;

export const GREEN_MARKET_CENTER = {
  lat: 25,
  lon: 10,
} as const;

export const GREEN_MARKET_OFFERS_STORAGE_KEY = "auros_green_market_offers";
