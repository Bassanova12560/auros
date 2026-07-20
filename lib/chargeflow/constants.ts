export const CHARGEFLOW_ROUTE = "/green/chargeflow";
export const CHARGEFLOW_W_ROUTE = "/eau/chargeflow";
export const CHARGEFLOW_F_ROUTE = "/green/chargeflow/flex";
export const CHARGEFLOW_FLEETS_ROUTE = "/green/chargeflow/fleets";
export const CHARGEFLOW_RESERVE_ROUTE = "/green/chargeflow/reserve";
export const CHARGEFLOW_INVENTORY_ROUTE = "/green/chargeflow/inventory";
export const CHARGEFLOW_CONSOLE_ROUTE = "/green/chargeflow/console";
export const CHARGEFLOW_VERIFY_BASE = "/chargeflow";
export const CHARGEFLOW_BATCH_MAX_ITEMS = 50;
export const CHARGEFLOW_LIST_DEFAULT_LIMIT = 50;
export const CHARGEFLOW_LIST_MAX_LIMIT = 100;

export const CHARGEFLOW_STANDARD_E = "AUROS-ChargeFlow-CFU-E" as const;
export const CHARGEFLOW_STANDARD_W = "AUROS-ChargeFlow-CFU-W" as const;
export const CHARGEFLOW_STANDARD_F = "AUROS-ChargeFlow-CFU-F" as const;
/** @deprecated use CHARGEFLOW_STANDARD_E */
export const CHARGEFLOW_STANDARD = CHARGEFLOW_STANDARD_E;

export const CHARGEFLOW_HMAC_PREFIX_E = "auros-cfu-e:v1:";
export const CHARGEFLOW_HMAC_PREFIX_W = "auros-cfu-w:v1:";
export const CHARGEFLOW_HMAC_PREFIX_F = "auros-cfu-f:v1:";
/** @deprecated use CHARGEFLOW_HMAC_PREFIX_E */
export const CHARGEFLOW_HMAC_PREFIX = CHARGEFLOW_HMAC_PREFIX_E;

export type ChargeflowUnitKind = "e" | "w" | "f";
export type ChargeflowStatus = "active" | "retired";

export function hmacPrefixForKind(kind: ChargeflowUnitKind): string {
  if (kind === "w") return CHARGEFLOW_HMAC_PREFIX_W;
  if (kind === "f") return CHARGEFLOW_HMAC_PREFIX_F;
  return CHARGEFLOW_HMAC_PREFIX_E;
}

export function standardForKind(kind: ChargeflowUnitKind): string {
  if (kind === "w") return CHARGEFLOW_STANDARD_W;
  if (kind === "f") return CHARGEFLOW_STANDARD_F;
  return CHARGEFLOW_STANDARD_E;
}

export function kindFromUnitId(id: string): ChargeflowUnitKind {
  if (id.startsWith("cfu_w_")) return "w";
  if (id.startsWith("cfu_f_")) return "f";
  return "e";
}

export function resolveOperatorKey(
  operatorId: string | undefined,
  keyHash: string
): string {
  const trimmed = operatorId?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : keyHash;
}
