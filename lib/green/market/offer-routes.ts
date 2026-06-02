import { GREEN_MARKET_OFFER_ROUTE, GREEN_MARKET_ROUTE } from "../constants";
import { GREEN_MARKET_OFFERS } from "./data";
import type { GreenMarketOffer } from "./types";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Public path for a marketplace offer detail page. */
export function greenMarketOfferPath(id: string): string {
  return `${GREEN_MARKET_OFFER_ROUTE}/${encodeURIComponent(id.trim())}`;
}

/** Absolute share URL for a single offer (optional origin for tests). */
export function buildGreenMarketOfferShareUrl(id: string, origin?: string): string {
  const base = origin?.replace(/\/$/, "") ?? "";
  return `${base}${greenMarketOfferPath(id)}`;
}

/** Link back to marketplace with actor name pre-filled in search. */
export function buildGreenMarketActorFocusUrl(actorName: string, origin?: string): string {
  const base = origin?.replace(/\/$/, "") ?? "";
  const params = new URLSearchParams();
  const q = actorName.trim();
  if (q) params.set("q", q);
  const query = params.toString();
  return `${base}${GREEN_MARKET_ROUTE}${query ? `?${query}` : ""}`;
}

export function isGreenMarketOfferUuid(id: string): boolean {
  return UUID_RE.test(id.trim());
}

/** Normalize route param — decode URI and trim. */
export function normalizeGreenMarketOfferId(raw: string): string {
  try {
    return decodeURIComponent(raw).trim();
  } catch {
    return raw.trim();
  }
}

/** Resolve offer id from demo seed data (sync, for tests and demo fallback). */
export function findDemoGreenMarketOfferById(id: string): GreenMarketOffer | null {
  const normalized = normalizeGreenMarketOfferId(id);
  if (!normalized) return null;
  return GREEN_MARKET_OFFERS.find((o) => o.id === normalized) ?? null;
}
