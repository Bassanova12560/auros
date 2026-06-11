import type { JurisdictionAssetType } from "@/lib/jurisdictions/types";

export const JURISDICTION_PICKER_ROUTE = "/tools/jurisdiction-picker";

/** 0 = thorough / premium OK / tax low priority · 100 = fast / budget / tax high */
export type JurisdictionPriorities = {
  speed: number;
  cost: number;
  tax: number;
};

export type AssetFilter = "all" | JurisdictionAssetType;

export type RationaleId =
  | "fast_track"
  | "cost_efficient"
  | "tax_favorable"
  | "asset_fit"
  | "eu_passport"
  | "stability"
  | "institutional";

export type JurisdictionRecommendation = {
  id: string;
  score: number;
  rationaleId: RationaleId;
};

export type JurisdictionPickerResult = {
  recommendations: JurisdictionRecommendation[];
};
