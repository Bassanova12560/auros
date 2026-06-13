import type { CsrdAnswers, CsrdResult } from "./types";

const DISCLAIMER =
  "Estimation indicative du scope CSRD — pas un avis juridique. Vérifiez avec votre auditeur ou conseil ESG.";

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
  let scope_label = "Hors scope CSRD (estimation)";

  if (in_scope) {
    if (listed && !large) {
      scope_from_year = 2027;
      scope_label = "Scope CSRD probable — PME cotée (reporting dès exercice 2027)";
    } else {
      scope_from_year = 2026;
      scope_label = "Scope CSRD probable — grande entreprise (reporting dès exercice 2026)";
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

  const priorities: string[] = [];
  if (in_scope && answers.hasSustainabilityReport !== true) {
    priorities.push("Lancer un rapport de durabilité CSRD (double matérialité).");
  }
  if (answers.greenAssets === true && preparation_score < 60) {
    priorities.push("Cartographier le Green Asset Ratio et l'alignement EU Taxonomy.");
  }
  if (in_scope && answers.hasSustainabilityReport === false) {
    priorities.push("Identifier les datapoints ESRS prioritaires pour votre secteur.");
  }

  return {
    in_scope,
    scope_from_year,
    scope_label,
    preparation_score,
    preparation_tier,
    priorities: priorities.slice(0, 3),
    disclaimer: DISCLAIMER,
  };
}
