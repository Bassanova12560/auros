export type CsrdQuestionId =  | "employees250"
  | "revenue40m"
  | "balance20m"
  | "listedEu"
  | "greenAssets"
  | "hasSustainabilityReport";

export type CsrdAnswers = Record<CsrdQuestionId, boolean | null>;

export type CsrdResult = {
  in_scope: boolean;
  scope_from_year: number | null;
  scope_label: string;
  preparation_score: number;
  preparation_tier: "early" | "progress" | "ready";
  priorities: string[];
  disclaimer: string;
};
