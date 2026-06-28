import type { RegistryConnectProvider } from "./types";

export type VerraLiveProject = {
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

/** Fetch public Verra registry UI API (best-effort — falls back to catalog/inferred). */
export async function fetchVerraProjectLive(serial: string): Promise<VerraLiveProject | null> {
  const projectId = projectIdFromSerial(serial);
  if (!projectId) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(
      `https://registry.verra.org/uiapi/resource/resourceSummary/${projectId}`,
      {
        headers: { Accept: "application/json" },
        signal: controller.signal,
        next: { revalidate: 86400 },
      }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as Record<string, unknown>;

    const name =
      (typeof data.resourceName === "string" && data.resourceName) ||
      (typeof data.name === "string" && data.name) ||
      (typeof data.projectName === "string" && data.projectName) ||
      null;
    if (!name) return null;

    const country =
      (typeof data.country === "string" && data.country) ||
      (typeof data.countryName === "string" && data.countryName) ||
      null;

    const description =
      (typeof data.description === "string" && data.description) ||
      (typeof data.resourceDescription === "string" && data.resourceDescription) ||
      `Verra VCS project ${serial}`;

    const projectType =
      (typeof data.projectType === "string" && data.projectType) ||
      (typeof data.resourceType === "string" && data.resourceType) ||
      null;

    const status =
      (typeof data.status === "string" && data.status) ||
      (typeof data.resourceStatus === "string" && data.resourceStatus) ||
      null;

    return {
      project_name: name,
      country,
      description: `${description} Verra VCS ${serial}`,
      project_type: projectType,
      status,
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export function providerSupportsLiveFetch(provider: RegistryConnectProvider): boolean {
  return provider === "verra";
}
