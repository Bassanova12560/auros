import type { GreenMarketUrlFilters } from "./market-share";

export const GREEN_MARKET_SAVED_SEARCHES_KEY = "auros_green_market_saved_searches";
export const GREEN_MARKET_SAVED_SEARCHES_MAX = 5;

export type GreenMarketSavedSearch = {
  id: string;
  name: string;
  filters: GreenMarketUrlFilters;
  savedAt: string;
};

function hasStorage(): boolean {
  return typeof localStorage !== "undefined";
}

export function readGreenMarketSavedSearches(): GreenMarketSavedSearch[] {
  if (!hasStorage()) return [];
  try {
    const raw = localStorage.getItem(GREEN_MARKET_SAVED_SEARCHES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as GreenMarketSavedSearch[];
    return Array.isArray(parsed) ? parsed.slice(0, GREEN_MARKET_SAVED_SEARCHES_MAX) : [];
  } catch {
    return [];
  }
}

export function writeGreenMarketSavedSearches(items: GreenMarketSavedSearch[]): void {
  if (!hasStorage()) return;
  localStorage.setItem(
    GREEN_MARKET_SAVED_SEARCHES_KEY,
    JSON.stringify(items.slice(0, GREEN_MARKET_SAVED_SEARCHES_MAX))
  );
}

export function saveGreenMarketSearch(
  name: string,
  filters: GreenMarketUrlFilters
): GreenMarketSavedSearch[] {
  const trimmed = name.trim().slice(0, 48);
  if (!trimmed) return readGreenMarketSavedSearches();

  const entry: GreenMarketSavedSearch = {
    id: crypto.randomUUID(),
    name: trimmed,
    filters,
    savedAt: new Date().toISOString(),
  };

  const existing = readGreenMarketSavedSearches().filter(
    (s) => s.name.toLowerCase() !== trimmed.toLowerCase()
  );
  const next = [entry, ...existing].slice(0, GREEN_MARKET_SAVED_SEARCHES_MAX);
  writeGreenMarketSavedSearches(next);
  return next;
}

export function removeGreenMarketSavedSearch(id: string): GreenMarketSavedSearch[] {
  const next = readGreenMarketSavedSearches().filter((s) => s.id !== id);
  writeGreenMarketSavedSearches(next);
  return next;
}
