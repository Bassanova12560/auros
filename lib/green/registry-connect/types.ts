/** Supported carbon registries for Registry Connect v0. */
export type RegistryConnectProvider =
  | "verra"
  | "gold_standard"
  | "puro"
  | "other";

export type RegistryConnectMatchKind = "catalog" | "live" | "inferred" | "partial";

export type RegistryConnectEntry = {
  /** Normalized serial, e.g. VCS-674 */
  serial: string;
  provider: RegistryConnectProvider;
  project_name: string;
  project_type: "forestry" | "renewable" | "cookstove" | "soil" | "other";
  country: string;
  /** Indicative vintage year if known. */
  vintage_year: number | null;
  /** Free-text hints fed into CQS / Nature inference. */
  description: string;
  /** Optional link to AUROS compare reference. */
  compare_id?: string;
  registry_project_url?: string;
};

export type RegistryConnectLookupInput = {
  serial?: string;
  registry?: string;
  /** Free-form query — serial, URL, or project name. */
  q?: string;
};

export type RegistryConnectLookupResult = {
  match: RegistryConnectMatchKind;
  provider: RegistryConnectProvider;
  serial: string;
  project_name: string;
  country: string | null;
  vintage_year: number | null;
  compare_id: string | null;
  registry_urls: {
    project: string | null;
    retirements: string | null;
  };
};
