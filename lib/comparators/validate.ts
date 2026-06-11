export type ManualProductInput = {
  id: string;
  project: string;
  platform: string;
  product: string;
  apy: number;
  tvlUsd?: number;
  chains: string[];
  link: string;
  affiliate_link?: string;
  logo?: string;
  category?: string;
  jurisdiction?: string;
};

/** @deprecated use ManualProductInput */
export type ManualPoolInput = ManualProductInput;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isManualProduct(value: unknown): value is ManualProductInput {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === "string" &&
    typeof value.project === "string" &&
    typeof value.platform === "string" &&
    typeof value.product === "string" &&
    typeof value.apy === "number" &&
    Number.isFinite(value.apy) &&
    Array.isArray(value.chains) &&
    value.chains.every((c) => typeof c === "string") &&
    typeof value.link === "string" &&
    (value.category === undefined || typeof value.category === "string") &&
    (value.jurisdiction === undefined || typeof value.jurisdiction === "string")
  );
}

/** Valide et filtre les entrées manuelles du JSON — ignore les entrées invalides. */
export function parseManualProducts(raw: unknown): ManualProductInput[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(isManualProduct);
}

/** @deprecated use parseManualProducts */
export function parseManualPools(raw: unknown): ManualPoolInput[] {
  return parseManualProducts(raw);
}
