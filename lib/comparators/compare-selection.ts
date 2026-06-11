import { COMPARATOR_ROUTES } from "./constants";

export const COMPARE_HUB_MAX = 4;
export const COMPARE_HUB_URL_PARAM = "compare";

export function normalizeCompareProductIds(ids: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of ids) {
    const id = raw.trim();
    if (!id || seen.has(id)) continue;
    seen.add(id);
    out.push(id);
    if (out.length >= COMPARE_HUB_MAX) break;
  }
  return out;
}

export function parseCompareProductIdsParam(
  value: string | null | undefined
): string[] {
  if (!value?.trim()) return [];
  return normalizeCompareProductIds(value.split(","));
}

export function encodeCompareProductIdsParam(ids: string[]): string {
  return normalizeCompareProductIds(ids).join(",");
}

export function buildCompareShareUrl(
  pathname: string,
  ids: string[],
  origin = ""
): string {
  const normalized = normalizeCompareProductIds(ids);
  const base = `${origin}${pathname}`;
  if (normalized.length === 0) return base;
  const params = new URLSearchParams();
  params.set(COMPARE_HUB_URL_PARAM, normalized.join(","));
  return `${base}?${params.toString()}`;
}

export function buildCompareHubShareUrl(
  ids: string[],
  origin = ""
): string {
  return buildCompareShareUrl(COMPARATOR_ROUTES.compare, ids, origin);
}

export function toggleCompareProductId(
  selectedIds: string[],
  id: string
): { ids: string[]; added: boolean; reason?: "duplicate" | "full" } {
  const trimmed = id.trim();
  if (!trimmed) return { ids: selectedIds, added: false };

  if (selectedIds.includes(trimmed)) {
    return {
      ids: selectedIds.filter((entry) => entry !== trimmed),
      added: false,
      reason: "duplicate",
    };
  }

  if (selectedIds.length >= COMPARE_HUB_MAX) {
    return { ids: selectedIds, added: false, reason: "full" };
  }

  return { ids: [...selectedIds, trimmed], added: true };
}
