import { GREEN_MARKET_ACTORS, GREEN_MARKET_OFFERS } from "./data";
import { GREEN_MARKET_CENTER } from "./types";

const EARTH_RADIUS_KM = 6371;

function normalizeCityKey(city: string): string {
  return city
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

const CITY_COORDS = (() => {
  const map = new Map<string, { lat: number; lon: number }>();
  const register = (city: string, country: string | undefined, lat: number, lon: number) => {
    const cityKey = normalizeCityKey(city);
    if (!map.has(cityKey)) map.set(cityKey, { lat, lon });
    if (country) {
      const scoped = `${cityKey}|${normalizeCityKey(country)}`;
      map.set(scoped, { lat, lon });
    }
  };
  for (const a of GREEN_MARKET_ACTORS) {
    register(a.city, a.country, a.lat, a.lon);
  }
  for (const o of GREEN_MARKET_OFFERS) {
    register(o.city, o.country, o.lat, o.lon);
  }
  return map;
})();

export const WORLD_MAP_BOUNDS = {
  southWest: { lat: -58, lon: -170 },
  northEast: { lat: 72, lon: 170 },
} as const;

/** @deprecated Prefer WORLD_MAP_BOUNDS — kept for tests */
export const FRANCE_MAP_BOUNDS = {
  southWest: { lat: 41.25, lon: -5.15 },
  northEast: { lat: 51.1, lon: 9.65 },
} as const;

export function globalLatLngBounds(): [[number, number], [number, number]] {
  return [
    [WORLD_MAP_BOUNDS.southWest.lat, WORLD_MAP_BOUNDS.southWest.lon],
    [WORLD_MAP_BOUNDS.northEast.lat, WORLD_MAP_BOUNDS.northEast.lon],
  ];
}

export function franceLatLngBounds(): [[number, number], [number, number]] {
  return [
    [FRANCE_MAP_BOUNDS.southWest.lat, FRANCE_MAP_BOUNDS.southWest.lon],
    [FRANCE_MAP_BOUNDS.northEast.lat, FRANCE_MAP_BOUNDS.northEast.lon],
  ];
}

/** Centroid of actor positions for map filters; falls back to world center. */
export function greenMarketCentroid(
  actors: ReadonlyArray<{ lat: number; lon: number }>
): { lat: number; lon: number } {
  if (actors.length === 0) return GREEN_MARKET_CENTER;
  const lat = actors.reduce((s, a) => s + a.lat, 0) / actors.length;
  const lon = actors.reduce((s, a) => s + a.lon, 0) / actors.length;
  return { lat, lon };
}

/** Resolve lat/lon from known marketplace cities; fallback to world center. */
export function resolveCityCoordinates(
  city: string,
  country?: string
): { lat: number; lon: number } {
  const cityKey = normalizeCityKey(city);
  const scoped = country
    ? `${cityKey}|${normalizeCityKey(country)}`
    : cityKey;
  return CITY_COORDS.get(scoped) ?? CITY_COORDS.get(cityKey) ?? GREEN_MARKET_CENTER;
}

export function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
}

export function withinRadiusKm(
  lat: number,
  lon: number,
  centerLat: number,
  centerLon: number,
  radiusKm: number
): boolean {
  return haversineKm(lat, lon, centerLat, centerLon) <= radiusKm;
}
