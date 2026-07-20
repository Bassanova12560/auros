/** Map wizard asset labels to Protocol asset_type enum. */
export function wizardAssetToProtocolType(
  assetType: string | null | undefined
):
  | "real_estate"
  | "private_fund"
  | "bonds"
  | "private_credit"
  | "commodities"
  | "stablecoins"
  | "low_carbon_power"
  | "other" {
  const raw = (assetType ?? "").toLowerCase();
  if (
    raw.includes("real") ||
    raw.includes("immo") ||
    raw.includes("estate") ||
    raw === "renewable" ||
    raw.includes("green")
  ) {
    if (raw.includes("nuclear") || raw.includes("power")) return "low_carbon_power";
    if (raw.includes("renewable") || raw.includes("green")) return "other";
    return "real_estate";
  }
  if (raw.includes("bond") || raw.includes("obligation")) return "bonds";
  if (raw.includes("credit") || raw.includes("private credit"))
    return "private_credit";
  if (raw.includes("fund") || raw.includes("fonds")) return "private_fund";
  if (raw.includes("commodit") || raw.includes("gold")) return "commodities";
  if (raw.includes("stable")) return "stablecoins";
  if (
    raw.includes("nuclear") ||
    raw.includes("power") ||
    raw.includes("low.carbon") ||
    raw.includes("low_carbon")
  ) {
    return "low_carbon_power";
  }
  return "other";
}

export type AurosShareSeal = {
  attest_id: string;
  verify_url: string;
  content_hash?: string;
  sealed_at: string;
};

export function readShareSeal(
  dossier: Record<string, unknown>
): AurosShareSeal | null {
  const raw = dossier._auros_seal;
  if (!raw || typeof raw !== "object") return null;
  const s = raw as Record<string, unknown>;
  if (typeof s.attest_id !== "string" || typeof s.verify_url !== "string") {
    return null;
  }
  return {
    attest_id: s.attest_id,
    verify_url: s.verify_url,
    content_hash:
      typeof s.content_hash === "string" ? s.content_hash : undefined,
    sealed_at:
      typeof s.sealed_at === "string"
        ? s.sealed_at
        : new Date().toISOString(),
  };
}
