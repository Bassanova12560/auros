import { GREEN_REGISTRY_PROJECT_ROUTE } from "./constants";

export type GreenRegistryTierFilter = "all" | "verified" | "pilot";

export const GREEN_REGISTRY_TIER_URL_PARAM = "tier";

export function parseRegistryTierParam(
  value: string | null | undefined
): GreenRegistryTierFilter {
  if (value === "verified" || value === "pilot") return value;
  return "all";
}

export function greenRegistryProjectPath(id: string): string {
  return `${GREEN_REGISTRY_PROJECT_ROUTE}/${encodeURIComponent(id)}`;
}

export function normalizeGreenRegistryProjectId(raw: string): string {
  try {
    return decodeURIComponent(raw.trim());
  } catch {
    return raw.trim();
  }
}
