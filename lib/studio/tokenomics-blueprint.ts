import { valueInEur } from "@/lib/platform-match";
import type { WizardData } from "@/lib/wizard-types";

import { inferInstrumentType } from "./regulatory-path";

export type TokenomicsBlueprint = {
  name: string;
  symbol: string;
  totalSupply: number;
  nominalValue: string;
  transferRules: string[];
  revenueMechanics: string[];
  complianceHooks: string[];
  deployNote: string;
};

export function buildTokenomicsBlueprint(data: WizardData): TokenomicsBlueprint {
  const value = valueInEur(data.estimatedValue, data.currency ?? "EUR");
  const instrument = inferInstrumentType(data);
  const slug = data.assetType?.slice(0, 3).toUpperCase() || "RWA";
  const supply =
    value > 0 ? Math.max(1_000, Math.round(value / 1_000)) : 10_000;
  const nominal =
    value > 0
      ? `~€${(value / supply).toFixed(2)} par jeton (indicatif)`
      : "À définir après valorisation";

  const transferRules = [
    "Whitelist obligatoire (KYC validé avant tout transfert)",
    "Restriction par juridiction via oracle de conformité (à brancher en phase 2)",
    "Lock-up émetteur : 6–12 mois recommandé pour offres privées",
  ];

  if (data.investorProfile === "Retail investors (general public)") {
    transferRules.push("Plafond détenteurs retail selon prospectus / MiCA");
  }

  const revenueMechanics: string[] = [];
  if (data.incomeType === "rental" || data.incomeType === "other") {
    revenueMechanics.push(
      "Distribution périodique en stablecoin vers adresses whitelistées",
      "Waterfall : frais SPV → réserves → porteurs de jetons"
    );
  } else {
    revenueMechanics.push(
      "Distribution à l'événement (revente actif ou liquidation SPV)",
      "Pas de coupon récurrent tant qu'aucun flux n'est documenté"
    );
  }

  if (instrument === "security_token_debt") {
    revenueMechanics.push("Coupon fixe ou indexé — calendrier dans le contrat de créance");
  }

  return {
    name: `${data.assetType || "Asset"} Token`,
    symbol: `${slug}`,
    totalSupply: supply,
    nominalValue: nominal,
    transferRules,
    revenueMechanics,
    complianceHooks: [
      "Identity registry on-chain (ERC-3643)",
      "Freeze / forced transfer pour injonctions régulateur",
      "Snapshot pour AG et votes (module à activer)",
    ],
    deployNote:
      "Blueprint paramétrique — déploiement on-chain et audit final via prestataires listés dans AUROS (phase ultérieure).",
  };
}
