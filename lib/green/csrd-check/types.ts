export type CsrdQuestionId =
  | "employees250"
  | "revenue40m"
  | "balance20m"
  | "listedEu"
  | "greenAssets"
  | "hasSustainabilityReport";

export type CsrdAnswers = Record<CsrdQuestionId, boolean | null>;

export type CsrdScopeKey = "out_of_scope" | "listed_sme" | "large_undertaking";

export type CsrdPriorityKey =
  | "sustainability_report"
  | "green_asset_ratio"
  | "esrs_datapoints";

export type CsrdResult = {
  in_scope: boolean;
  scope_from_year: number | null;
  scope_key: CsrdScopeKey;
  preparation_score: number;
  preparation_tier: "early" | "progress" | "ready";
  priority_keys: CsrdPriorityKey[];
};
