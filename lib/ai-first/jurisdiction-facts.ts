import type { JurisdictionMessages } from "@/lib/jurisdictions/i18n";
import { jurisdictionLabel } from "@/lib/jurisdictions/i18n";
import type { Jurisdiction } from "@/lib/jurisdictions/types";

import type { AiFirstFact } from "./types";

function eur(value: number): string {
  return value.toLocaleString("fr-FR");
}

/** Structured facts from lib/jurisdictions/data.ts for AI-first catalog & RAG. */
export function buildJurisdictionFacts(
  j: Jurisdiction,
  messages: JurisdictionMessages
): AiFirstFact[] {
  const name = jurisdictionLabel(messages, j.id);
  const status = [
    j.recommended ? "recommandée AUROS" : null,
    j.bestValue ? "meilleur rapport qualité-prix AUROS" : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const facts: AiFirstFact[] = [
    {
      key: `${name} — frais setup (État + conseil)`,
      value: `${eur(j.feeMinEur)}–${eur(j.feeMaxEur)} € (médiane ${eur(j.totalCostMid)} €)`,
    },
    {
      key: `${name} — délai production`,
      value: `${j.delayMinMonths}–${j.delayMaxMonths} mois`,
    },
    {
      key: `${name} — délai licence max`,
      value: `${j.licenseMaxMonths} mois`,
    },
    {
      key: `${name} — régulateur / licence`,
      value: messages.licenses[j.licenseKey],
    },
    {
      key: `${name} — fiscalité investisseur`,
      value: messages.tax[j.taxKey],
    },
    {
      key: `${name} — niveau KYC`,
      value: messages.kyc[j.kycLevel],
    },
    {
      key: `${name} — actifs couverts`,
      value: messages.assets[j.assetsKey],
    },
    {
      key: `${name} — profil investisseur`,
      value: messages.audience[j.audienceKey],
    },
    {
      key: `${name} — investisseurs minimum`,
      value: messages.minInvestors[j.minInvestorsKey],
    },
    {
      key: `${name} — score AUROS`,
      value: `${j.score}/5`,
    },
    {
      key: `${name} — stabilité juridiction`,
      value: messages.stabilityLabels[j.stabilityTier],
    },
  ];

  if (status) {
    facts.push({ key: `${name} — statut comparateur`, value: status });
  }

  return facts;
}

/** One-line summary per jurisdiction for hub pages. */
export function buildJurisdictionSummary(
  j: Jurisdiction,
  messages: JurisdictionMessages
): AiFirstFact {
  const name = jurisdictionLabel(messages, j.id);
  return {
    key: name,
    value: `${eur(j.feeMinEur)}–${eur(j.feeMaxEur)} € · ${j.delayMinMonths}–${j.delayMaxMonths} mois · ${messages.licenses[j.licenseKey]} · score ${j.score}/5`,
  };
}
