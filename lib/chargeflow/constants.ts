export const CHARGEFLOW_ROUTE = "/green/chargeflow";
export const CHARGEFLOW_W_ROUTE = "/eau/chargeflow";
export const CHARGEFLOW_VERIFY_BASE = "/chargeflow";

export const CHARGEFLOW_STANDARD_E = "AUROS-ChargeFlow-CFU-E" as const;
export const CHARGEFLOW_STANDARD_W = "AUROS-ChargeFlow-CFU-W" as const;
/** @deprecated use CHARGEFLOW_STANDARD_E */
export const CHARGEFLOW_STANDARD = CHARGEFLOW_STANDARD_E;

export const CHARGEFLOW_HMAC_PREFIX_E = "auros-cfu-e:v1:";
export const CHARGEFLOW_HMAC_PREFIX_W = "auros-cfu-w:v1:";
/** @deprecated use CHARGEFLOW_HMAC_PREFIX_E */
export const CHARGEFLOW_HMAC_PREFIX = CHARGEFLOW_HMAC_PREFIX_E;

export type ChargeflowUnitKind = "e" | "w";
export type ChargeflowStatus = "active" | "retired";

export function hmacPrefixForKind(kind: ChargeflowUnitKind): string {
  return kind === "w" ? CHARGEFLOW_HMAC_PREFIX_W : CHARGEFLOW_HMAC_PREFIX_E;
}

export function standardForKind(kind: ChargeflowUnitKind): string {
  return kind === "w" ? CHARGEFLOW_STANDARD_W : CHARGEFLOW_STANDARD_E;
}

export function kindFromUnitId(id: string): ChargeflowUnitKind {
  return id.startsWith("cfu_w_") ? "w" : "e";
}

export function resolveOperatorKey(
  operatorId: string | undefined,
  keyHash: string
): string {
  const trimmed = operatorId?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : keyHash;
}
