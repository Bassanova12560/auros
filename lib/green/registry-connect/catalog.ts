import type { RegistryConnectEntry } from "./types";

/**
 * Pilot catalog — indicative AUROS mappings for due diligence demos.
 * Expand via Registry Connect ingestion pipeline (v1+).
 */
export const REGISTRY_CONNECT_CATALOG: RegistryConnectEntry[] = [
  {
    serial: "VCS-674",
    provider: "verra",
    project_name: "Brazil Nut Concessions — Madre de Dios",
    project_type: "forestry",
    country: "Peru",
    vintage_year: 2022,
    description:
      "Verra VCS forestry REDD+ Amazon conservation Brazil nut concessions — nature-based credits with community co-benefits",
    compare_id: "moss",
    registry_project_url: "https://registry.verra.org/app/projectDetail/VCS/674",
  },
  {
    serial: "VCS-1112",
    provider: "verra",
    project_name: "Cordillera Azul National Park REDD+",
    project_type: "forestry",
    country: "Peru",
    vintage_year: 2021,
    description:
      "Verra VCS REDD+ forest conservation Cordillera Azul — high biodiversity Peru Amazon",
    registry_project_url: "https://registry.verra.org/app/projectDetail/VCS/1112",
  },
  {
    serial: "VCS-934",
    provider: "verra",
    project_name: "Kariba REDD+ Project",
    project_type: "forestry",
    country: "Zimbabwe",
    vintage_year: 2020,
    description:
      "Verra VCS Kariba REDD+ forest protection Zimbabwe — large-scale nature-based credits",
    registry_project_url: "https://registry.verra.org/app/projectDetail/VCS/934",
  },
  {
    serial: "GS-1234",
    provider: "gold_standard",
    project_name: "Efficient Cookstoves — Rwanda (demo mapping)",
    project_type: "cookstove",
    country: "Rwanda",
    vintage_year: 2023,
    description:
      "Gold Standard cookstove distribution Rwanda — CCP-aligned methodology, strong additionality signal",
    registry_project_url: "https://registry.goldstandard.org/projects/details/1234",
  },
  {
    serial: "GS-5678",
    provider: "gold_standard",
    project_name: "Small-scale Solar — Kenya (demo mapping)",
    project_type: "renewable",
    country: "Kenya",
    vintage_year: 2024,
    description:
      "Gold Standard distributed solar Kenya — renewable energy credits with MRV",
    registry_project_url: "https://registry.goldstandard.org/projects/details/5678",
  },
  {
    serial: "PURO-1001",
    provider: "puro",
    project_name: "Enhanced Rock Weathering — Pilot (demo)",
    project_type: "soil",
    country: "Finland",
    vintage_year: 2024,
    description:
      "Puro.earth enhanced rock weathering carbon removal — durable CDR with scientific MRV",
    registry_project_url: "https://puro.earth/projects",
  },
];

const catalogByKey = new Map<string, RegistryConnectEntry>();
for (const entry of REGISTRY_CONNECT_CATALOG) {
  catalogByKey.set(`${entry.provider}:${entry.serial.toUpperCase()}`, entry);
}

export function findRegistryCatalogEntry(
  provider: RegistryConnectEntry["provider"],
  serial: string
): RegistryConnectEntry | null {
  const key = `${provider}:${serial.toUpperCase()}`;
  return catalogByKey.get(key) ?? null;
}

export function listRegistryConnectSerials(): string[] {
  return REGISTRY_CONNECT_CATALOG.map((e) => e.serial);
}
