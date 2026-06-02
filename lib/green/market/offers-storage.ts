import type { GreenMarketOffer } from "./types";
import { GREEN_MARKET_OFFERS_STORAGE_KEY } from "./types";

export function readStoredGreenMarketOffers(): GreenMarketOffer[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(GREEN_MARKET_OFFERS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as GreenMarketOffer[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeStoredGreenMarketOffer(offer: GreenMarketOffer): void {
  const existing = readStoredGreenMarketOffers();
  localStorage.setItem(
    GREEN_MARKET_OFFERS_STORAGE_KEY,
    JSON.stringify([offer, ...existing])
  );
}

export function createLocalOfferId(): string {
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
