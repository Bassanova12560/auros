import { GREEN_COMPARE_ROUTE } from "../constants";
import { GREEN_COMPARE_ROWS } from "../compare-data";

export const GREEN_COMPARE_OFFERS_KEY = "auros_green_compare_offers";
export const GREEN_COMPARE_OFFERS_MAX = 4;
export const GREEN_COMPARE_OFFERS_URL_PARAM = "offers";
export const GREEN_COMPARE_COUNTRIES_URL_PARAM = "countries";
export const GREEN_COMPARE_RWA_URL_PARAM = "rwa";

const VALID_RWA_IDS = new Set(GREEN_COMPARE_ROWS.map((row) => row.id));

export function normalizeCompareCountries(countries: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of countries) {
    const c = raw.trim();
    if (!c || seen.has(c.toLowerCase())) continue;
    seen.add(c.toLowerCase());
    out.push(c);
  }
  return out;
}

export function parseCompareCountriesParam(
  value: string | null | undefined
): string[] {
  if (!value?.trim()) return [];
  return normalizeCompareCountries(value.split(","));
}

/** Case-insensitive country match for compare/registry filters. Empty selection = no filter. */
export function projectMatchesCompareCountries(
  country: string,
  selectedCountries: string[]
): boolean {
  if (selectedCountries.length === 0) return true;
  const normalized = country.trim().toLowerCase();
  if (!normalized) return false;
  return selectedCountries.some((c) => c.trim().toLowerCase() === normalized);
}

export function encodeCompareCountriesParam(countries: string[]): string {
  return normalizeCompareCountries(countries).join(",");
}

export function normalizeCompareRwaRowIds(ids: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of ids) {
    const id = raw.trim();
    if (!id || !VALID_RWA_IDS.has(id) || seen.has(id)) continue;
    seen.add(id);
    out.push(id);
  }
  return out;
}

export function parseCompareRwaRowIdsParam(value: string | null | undefined): string[] {
  if (!value?.trim()) return [];
  return normalizeCompareRwaRowIds(value.split(","));
}

export function encodeCompareRwaRowIdsParam(ids: string[]): string {
  return normalizeCompareRwaRowIds(ids).join(",");
}

/** Omit rwa param when all reference rows are selected (backward compatible). */
export function compareRwaRowIdsForShare(selectedIds: string[]): string[] {
  const normalized = normalizeCompareRwaRowIds(selectedIds);
  if (normalized.length === 0 || normalized.length >= VALID_RWA_IDS.size) return [];
  return normalized;
}

function hasStorage(): boolean {
  return typeof localStorage !== "undefined";
}

export function normalizeCompareOfferIds(ids: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of ids) {
    const id = raw.trim();
    if (!id || seen.has(id)) continue;
    seen.add(id);
    out.push(id);
    if (out.length >= GREEN_COMPARE_OFFERS_MAX) break;
  }
  return out;
}

export function parseCompareOfferIdsParam(value: string | null | undefined): string[] {
  if (!value?.trim()) return [];
  return normalizeCompareOfferIds(value.split(","));
}

export function readCompareOfferIds(): string[] {
  if (!hasStorage()) return [];
  try {
    const raw = localStorage.getItem(GREEN_COMPARE_OFFERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? normalizeCompareOfferIds(parsed) : [];
  } catch {
    return [];
  }
}

export function writeCompareOfferIds(ids: string[]): string[] {
  const next = normalizeCompareOfferIds(ids);
  if (hasStorage()) {
    localStorage.setItem(GREEN_COMPARE_OFFERS_KEY, JSON.stringify(next));
  }
  return next;
}

export function addCompareOfferId(id: string): {
  ids: string[];
  added: boolean;
  reason?: "duplicate" | "full";
} {
  const trimmed = id.trim();
  if (!trimmed) return { ids: readCompareOfferIds(), added: false };

  const existing = readCompareOfferIds();
  if (existing.includes(trimmed)) {
    return { ids: existing, added: false, reason: "duplicate" };
  }
  if (existing.length >= GREEN_COMPARE_OFFERS_MAX) {
    return { ids: existing, added: false, reason: "full" };
  }

  const next = writeCompareOfferIds([trimmed, ...existing]);
  return { ids: next, added: true };
}

export function removeCompareOfferId(id: string): string[] {
  const next = readCompareOfferIds().filter((entry) => entry !== id);
  return writeCompareOfferIds(next);
}

export function mergeCompareOfferIds(urlIds: string[]): string[] {
  const merged = normalizeCompareOfferIds([...urlIds, ...readCompareOfferIds()]);
  return writeCompareOfferIds(merged);
}

export function buildGreenCompareUrl(
  ids: string[],
  origin = ""
): string {
  return buildGreenCompareShareUrl({ offerIds: ids, origin });
}

export type GreenCompareShareParams = {
  offerIds: string[];
  countries?: string[];
  rwaRowIds?: string[];
  origin?: string;
};

/** Public share URL for /green/compare — offers + optional countries + RWA row filter. */
export function buildGreenCompareShareUrl({
  offerIds,
  countries = [],
  rwaRowIds = [],
  origin = "",
}: GreenCompareShareParams): string {
  const normalizedIds = normalizeCompareOfferIds(offerIds);
  const normalizedCountries = normalizeCompareCountries(countries);
  const normalizedRwa = compareRwaRowIdsForShare(rwaRowIds);
  const base = `${origin}${GREEN_COMPARE_ROUTE}`;
  const params = new URLSearchParams();
  if (normalizedIds.length > 0) {
    params.set(GREEN_COMPARE_OFFERS_URL_PARAM, normalizedIds.join(","));
  }
  if (normalizedCountries.length > 0) {
    params.set(GREEN_COMPARE_COUNTRIES_URL_PARAM, normalizedCountries.join(","));
  }
  if (normalizedRwa.length > 0) {
    params.set(GREEN_COMPARE_RWA_URL_PARAM, normalizedRwa.join(","));
  }
  const query = params.toString();
  return query ? `${base}?${query}` : base;
}

export function isOfferInCompareSelection(id: string): boolean {
  return readCompareOfferIds().includes(id.trim());
}
