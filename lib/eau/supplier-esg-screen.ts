/**
 * Supplier ESG / greenwashing screen — indicative claim vs proof check.
 * Not a certification, CSRD audit, or live vendor database.
 */

export type SupplierScreenBand = "elevated" | "moderate" | "contained";

export type SupplierScreenResult = {
  score: number;
  grade: "A" | "B" | "C" | "D" | "F";
  risk_tier: SupplierScreenBand;
  signals: string[];
  priorities: string[];
  claim_flags: string[];
  disclaimer: string;
};

const DISCLAIMER =
  "AUROS supplier ESG screen — indicative claim hygiene only. Not CSRD assurance, TNFD certification, or a live supplier database. Counsel and third-party audit required.";

function gradeFromScore(score: number): SupplierScreenResult["grade"] {
  if (score >= 80) return "A";
  if (score >= 65) return "B";
  if (score >= 50) return "C";
  if (score >= 35) return "D";
  return "F";
}

function tier(score: number): SupplierScreenBand {
  if (score < 45) return "elevated";
  if (score < 65) return "moderate";
  return "contained";
}

/**
 * Higher = lower washing risk (bank-friendly). 0–100.
 */
export function computeSupplierEsgScreen(input: {
  supplier_name?: string;
  claim_text: string;
  evidence_urls?: string[];
  region?: string;
}): SupplierScreenResult {
  const text = `${input.supplier_name ?? ""} ${input.claim_text} ${input.region ?? ""}`.toLowerCase();
  const signals: string[] = [];
  const claim_flags: string[] = [];
  const priorities: string[] = [];
  let score = 62;

  const urls = (input.evidence_urls ?? []).map((u) => u.trim()).filter(Boolean);
  const hasHttps = urls.some((u) => /^https:\/\//i.test(u));

  if (/100\s*%\s*(green|vert|renewable|renouvelable)|carbon\s*neutral|net[\s-]*zero\s*garanti/i.test(text)) {
    score -= 18;
    claim_flags.push("absolute_green_claim");
    signals.push("Claim absolu (100% / net-zero garanti) — preuve scope requise");
  }
  if (/go\s*\/?\s*rec|garantie\s*d.?origine|i-?rec/i.test(text) && !hasHttps) {
    score -= 12;
    claim_flags.push("go_rec_without_url");
    signals.push("Mention GO/REC sans URL de certificat");
  }
  if (/csrd|taxonomy|taxonomie|tnfd|sbti/i.test(text) && !hasHttps) {
    score -= 10;
    claim_flags.push("framework_name_drop");
    signals.push("Cadre ESG nommé sans lien de preuve / rapport");
  }
  if (/offset|compensation\s*carbone|plant(e|ons)?\s*des?\s*arbres/i.test(text)) {
    score -= 8;
    claim_flags.push("offset_heavy");
    signals.push("Compensation / offset — vérifier additionnalité");
  }
  if (hasHttps) {
    score += 14;
    signals.push("Au moins une URL https de preuve fournie");
  } else {
    score -= 15;
    claim_flags.push("no_evidence_url");
    signals.push("Aucune URL de preuve — claim marketing seul");
    priorities.push("Joindre URL audit / certificat / scope 1–3");
  }
  if (/iso\s*14001|emissions?\s*report|rapport\s*(esg|rse|durabilit)/i.test(text) && hasHttps) {
    score += 8;
    signals.push("Référence rapport / ISO + preuve URL");
  }
  if (/lithium|cobalt|conflict\s*mineral|minerais?\s*de\s*conflit/i.test(text) && !hasHttps) {
    score -= 10;
    claim_flags.push("critical_minerals_unsourced");
    signals.push("Minerais critiques sans source de diligence");
    priorities.push("Cartographier chaîne cobalt/lithium (preuve)");
  }

  score = Math.max(5, Math.min(98, score));

  if (priorities.length < 3) {
    priorities.push("Exiger scope + année + méthodologie sur le claim");
  }
  if (priorities.length < 3) {
    priorities.push("Croiser avec WELHR / WETS si actif eau-énergie");
  }

  return {
    score,
    grade: gradeFromScore(score),
    risk_tier: tier(score),
    signals: signals.slice(0, 8),
    priorities: priorities.slice(0, 3),
    claim_flags,
    disclaimer: DISCLAIMER,
  };
}
