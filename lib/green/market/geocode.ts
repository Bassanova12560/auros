import { resolveCityCoordinates } from "./geo";

export type GeocodeResult = { lat: number; lon: number; source: "nominatim" | "registry" };

/** Geocode a city worldwide via Nominatim; optional country improves accuracy. */
export async function geocodeCity(
  city: string,
  country?: string
): Promise<GeocodeResult> {
  const trimmed = city.trim();
  const countryTrim = country?.trim();
  if (trimmed.length < 2) {
    const fb = resolveCityCoordinates(trimmed, countryTrim);
    return { ...fb, source: "registry" };
  }

  try {
    const query = countryTrim ? `${trimmed}, ${countryTrim}` : trimmed;
    const q = encodeURIComponent(query);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1`,
      {
        headers: { "User-Agent": "AUROS-Green/1.0 (https://auros-delta.vercel.app/green)" },
        next: { revalidate: 86400 },
      }
    );
    if (res.ok) {
      const rows = (await res.json()) as Array<{ lat: string; lon: string }>;
      const hit = rows[0];
      if (hit) {
        return {
          lat: Number(hit.lat),
          lon: Number(hit.lon),
          source: "nominatim",
        };
      }
    }
  } catch {
    // fallback below
  }

  const fb = resolveCityCoordinates(trimmed, countryTrim);
  return { ...fb, source: "registry" };
}

/** @deprecated Use geocodeCity(city, "France") */
export async function geocodeCityFrance(city: string): Promise<GeocodeResult> {
  return geocodeCity(city, "France");
}
