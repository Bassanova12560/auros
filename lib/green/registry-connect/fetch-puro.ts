import type { RegistryConnectProvider } from "./types";

export type PuroLiveProject = {
  project_name: string;
  country: string | null;
  description: string;
  project_type: string | null;
  status: string | null;
};

const FETCH_TIMEOUT_MS = 6_000;

function facilityCodeFromSerial(serial: string): string | null {
  const m = serial.match(/(\d{2,6})$/);
  return m ? m[1]! : null;
}

/** Best-effort Puro registry lookup — public summary when API key unavailable. */
export async function fetchPuroProjectLive(serial: string): Promise<PuroLiveProject | null> {
  const code = facilityCodeFromSerial(serial);
  if (!code) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  const endpoints = [
    `https://registry.puro.earth/api/production-facilities/${code}`,
    `https://docs.api.puro.earth/registry/production-facilities/${code}`,
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
        const root = (data.productionFacility as Record<string, unknown> | undefined) ?? data;

        const name =
          (typeof root.name === "string" && root.name) ||
          (typeof root.productionFacilityName === "string" && root.productionFacilityName) ||
          null;
        if (!name) continue;

        const country =
          (typeof root.country === "string" && root.country) ||
          (typeof root.countryName === "string" && root.countryName) ||
          null;

        const methodology =
          (typeof root.methodology === "string" && root.methodology) ||
          (typeof root.methodologyName === "string" && root.methodologyName) ||
          "carbon removal";

        const description =
          (typeof root.description === "string" && root.description) ||
          `Puro.earth ${methodology} carbon removal project ${serial}`;

        return {
          project_name: name,
          country,
          description: `${description} Puro CORC ${serial}`,
          project_type: /biochar|rock|weathering|wood/i.test(methodology) ? methodology : "cdr",
          status: (typeof root.status === "string" && root.status) || "registered",
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

export function providerSupportsPuroLive(provider: RegistryConnectProvider): boolean {
  return provider === "puro";
}
