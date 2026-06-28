import type { RegistryConnectProvider } from "./types";

export type GoldStandardLiveProject = {
  project_name: string;
  country: string | null;
  description: string;
  project_type: string | null;
  status: string | null;
};

const FETCH_TIMEOUT_MS = 6_000;

function projectIdFromSerial(serial: string): string | null {
  const m = serial.match(/(\d{2,6})$/);
  return m ? m[1]! : null;
}

/** Fetch public Gold Standard registry (best-effort). */
export async function fetchGoldStandardProjectLive(
  serial: string
): Promise<GoldStandardLiveProject | null> {
  const projectId = projectIdFromSerial(serial);
  if (!projectId) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  const endpoints = [
    `https://registry.goldstandard.org/api/public/projects/${projectId}`,
    `https://registry.goldstandard.org/api/v1/projects/${projectId}`,
  ];

  try {
    for (const url of endpoints) {
      try {
        const res = await fetch(url, {
          headers: { Accept: "application/json" },
          signal: controller.signal,
          next: { revalidate: 86400 },
        });
        if (!res.ok) continue;
        const data = (await res.json()) as Record<string, unknown>;
        const root = (data.project as Record<string, unknown> | undefined) ?? data;

        const name =
          (typeof root.name === "string" && root.name) ||
          (typeof root.projectName === "string" && root.projectName) ||
          null;
        if (!name) continue;

        const country =
          (typeof root.country === "string" && root.country) ||
          (typeof root.countryName === "string" && root.countryName) ||
          null;

        const description =
          (typeof root.description === "string" && root.description) ||
          `Gold Standard project ${serial}`;

        return {
          project_name: name,
          country,
          description: `${description} Gold Standard ${serial}`,
          project_type:
            (typeof root.type === "string" && root.type) ||
            (typeof root.projectType === "string" && root.projectType) ||
            null,
          status: (typeof root.status === "string" && root.status) || null,
        };
      } catch {
        continue;
      }
    }
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export function providerSupportsGoldStandardLive(provider: RegistryConnectProvider): boolean {
  return provider === "gold_standard";
}
