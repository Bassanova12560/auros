import { GREEN_MARKET_ROUTE } from "../constants";
import type {
  GreenMarketActorType,
  GreenMarketEnergyType,
  GreenMarketListingTier,
  GreenMarketOfferSide,
  GreenMarketRadiusKm,
} from "./types";

export type GreenMarketUrlFilters = {
  actor?: GreenMarketActorType | "all";
  radius?: GreenMarketRadiusKm | 0;
  energy?: GreenMarketEnergyType | "all";
  side?: GreenMarketOfferSide | "all";
  tier?: GreenMarketListingTier | "all";
  q?: string;
};

const ACTOR_TYPES = new Set(["producer", "storer", "charger", "consumer"]);
const ENERGY_TYPES = new Set(["solar", "wind", "hydro", "battery", "mixed"]);
const SIDES = new Set(["buy", "sell"]);
const TIERS = new Set(["demo", "referenced", "verified"]);
const RADII = new Set([5, 10, 20]);

export function encodeGreenMarketFilters(filters: GreenMarketUrlFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.actor && filters.actor !== "all") params.set("actor", filters.actor);
  if (filters.radius) params.set("radius", String(filters.radius));
  if (filters.energy && filters.energy !== "all") params.set("energy", filters.energy);
  if (filters.side && filters.side !== "all") params.set("side", filters.side);
  if (filters.tier && filters.tier !== "all") params.set("tier", filters.tier);
  const q = filters.q?.trim();
  if (q) params.set("q", q);
  return params;
}

export function decodeGreenMarketFilters(
  params: URLSearchParams
): GreenMarketUrlFilters {
  const out: GreenMarketUrlFilters = {};
  const actor = params.get("actor");
  if (actor && ACTOR_TYPES.has(actor)) {
    out.actor = actor as GreenMarketActorType;
  }
  const radius = Number(params.get("radius"));
  if (RADII.has(radius)) out.radius = radius as GreenMarketRadiusKm;
  const energy = params.get("energy");
  if (energy && ENERGY_TYPES.has(energy)) {
    out.energy = energy as GreenMarketEnergyType;
  }
  const side = params.get("side");
  if (side && SIDES.has(side)) out.side = side as GreenMarketOfferSide;
  const tier = params.get("tier");
  if (tier && TIERS.has(tier)) out.tier = tier as GreenMarketListingTier;
  const q = params.get("q")?.trim();
  if (q) out.q = q;
  return out;
}

export function buildGreenMarketShareUrl(
  filters: GreenMarketUrlFilters,
  origin?: string
): string {
  const base = origin?.replace(/\/$/, "") ?? "";
  const params = encodeGreenMarketFilters(filters);
  const query = params.toString();
  return `${base}${GREEN_MARKET_ROUTE}${query ? `?${query}` : ""}`;
}
