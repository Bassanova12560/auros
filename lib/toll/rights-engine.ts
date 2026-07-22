/**
 * AUROS Rights Engine v0 — programmable rights mapping (indicative model).
 */

export type AurosRightKind =
  | "ownership"
  | "revenue_share"
  | "collateral"
  | "governance"
  | "certificate"
  | "cashflow_waterfall"
  | "usufruct"
  | "other";

export type AurosRightSlice = {
  id: string;
  kind: AurosRightKind;
  label: string;
  /** 0–1 share when applicable */
  share?: number;
  beneficiary?: string;
  limits?: string;
  startsAt?: string;
  endsAt?: string;
};

export type AurosRightsModel = {
  assetDnaId: string;
  slices: AurosRightSlice[];
  notes: string[];
  disclaimer: string;
};

export function buildIndicativeRightsModel(input: {
  assetDnaId: string;
  displayName?: string;
  revenueSharePct?: number;
}): AurosRightsModel {
  const share =
    typeof input.revenueSharePct === "number"
      ? Math.max(0, Math.min(1, input.revenueSharePct / 100))
      : undefined;
  const slices: AurosRightSlice[] = [
    {
      id: "rev_1",
      kind: "revenue_share",
      label: "Indicative revenue participation",
      share,
      limits: "Does not imply ownership of underlying infrastructure",
    },
    {
      id: "own_note",
      kind: "ownership",
      label: "Underlying asset ownership — unspecified (model TBD)",
      limits: "Require legal structuring — AUROS does not invent title",
    },
  ];
  return {
    assetDnaId: input.assetDnaId,
    slices,
    notes: [
      input.displayName
        ? `Model draft for ${input.displayName}`
        : "Model draft",
      "Rights Engine v0 is a structuring aid — not a legal opinion.",
    ],
    disclaimer:
      "Indicative rights mapping only. Counsel must validate before issuance.",
  };
}
