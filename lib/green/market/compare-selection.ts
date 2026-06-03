import { GREEN_COMPARE_ROUTE } from "../constants";

export const GREEN_COMPARE_OFFERS_KEY = "auros_green_compare_offers";
export const GREEN_COMPARE_OFFERS_MAX = 4;
export const GREEN_COMPARE_OFFERS_URL_PARAM = "offers";

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
  const normalized = normalizeCompareOfferIds(ids);
  const base = `${origin}${GREEN_COMPARE_ROUTE}`;
  if (normalized.length === 0) return base;
  const params = new URLSearchParams();
  params.set(GREEN_COMPARE_OFFERS_URL_PARAM, normalized.join(","));
  return `${base}?${params.toString()}`;
}

export function isOfferInCompareSelection(id: string): boolean {
  return readCompareOfferIds().includes(id.trim());
}
