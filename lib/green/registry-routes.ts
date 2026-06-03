import { GREEN_REGISTRY_PROJECT_ROUTE } from "./constants";

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
