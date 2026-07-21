import type { AssetDnaClass } from "./types";

const CLASS_SHORT: Record<AssetDnaClass, string> = {
  green_energy: "ge",
  water_rights: "wr",
  energy_infra: "ei",
  fleet_ev: "fe",
  compute: "cp",
  other: "ot",
};

const DNA_ID_RE =
  /^auros:dna:v1:(ge|wr|ei|fe|cp|ot):[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Build canonical Asset DNA id. */
export function buildAssetDnaId(assetClass: AssetDnaClass, uuid: string): string {
  const short = CLASS_SHORT[assetClass];
  const id = uuid.trim().toLowerCase();
  return `auros:dna:v1:${short}:${id}`;
}

export function isValidAssetDnaId(id: string): boolean {
  return DNA_ID_RE.test(id.trim());
}

export function parseAssetDnaId(
  id: string
): { version: "v1"; classShort: string; uuid: string } | null {
  const raw = id.trim();
  if (!isValidAssetDnaId(raw)) return null;
  const parts = raw.split(":");
  return {
    version: "v1",
    classShort: parts[3]!,
    uuid: parts[4]!,
  };
}

export function assetDnaClassFromShort(
  short: string
): AssetDnaClass | null {
  const entry = (Object.entries(CLASS_SHORT) as [AssetDnaClass, string][]).find(
    ([, s]) => s === short
  );
  return entry?.[0] ?? null;
}
