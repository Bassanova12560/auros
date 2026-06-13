import type { CsrdAnswers, CsrdPriorityKey, CsrdResult, CsrdScopeKey } from "./types";

function isLargeUndertaking(answers: CsrdAnswers): boolean {
  return (
    answers.employees250 === true ||
    (answers.revenue40m === true && answers.balance20m === true)
  );
}

export function computeCsrdScope(answers: CsrdAnswers): CsrdResult {
  const large = isLargeUndertaking(answers);
  const listed = answers.listedEu === true;
  const in_scope = large || listed;

  let scope_from_year: number | null = null;
  let scope_key: CsrdScopeKey = "out_of_scope";

  if (in_scope) {
    if (listed && !large) {
      scope_from_year = 2027;
      scope_key = "listed_sme";
    } else {
      scope_from_year = 2026;
      scope_key = "large_undertaking";
    }
  }

  let preparation_score = 20;
  if (answers.hasSustainabilityReport === true) preparation_score += 35;
  if (answers.greenAssets === true) preparation_score += 20;
  if (answers.hasSustainabilityReport === false) preparation_score += 5;
  if (in_scope) preparation_score += 15;
  preparation_score = Math.min(100, preparation_score);

  const preparation_tier: CsrdResult["preparation_tier"] =
    preparation_score >= 70 ? "ready" : preparation_score >= 45 ? "progress" : "early";

  const priority_keys: CsrdPriorityKey[] = [];
  if (in_scope && answers.hasSustainabilityReport !== true) {
    priority_keys.push("sustainability_report");
  }
  if (answers.greenAssets === true && preparation_score < 60) {
    priority_keys.push("green_asset_ratio");
  }
  if (in_scope && answers.hasSustainabilityReport === false) {
    priority_keys.push("esrs_datapoints");
  }

  return {
    in_scope,
    scope_from_year,
    scope_key,
    preparation_score,
    preparation_tier,
    priority_keys: priority_keys.slice(0, 3),
  };
}
