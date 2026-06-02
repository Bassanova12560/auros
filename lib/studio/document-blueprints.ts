import type { WizardData } from "@/lib/wizard-types";

import { buildTokenomicsBlueprint } from "./tokenomics-blueprint";
import { inferInstrumentType, mapRegulatoryPath } from "./regulatory-path";

export type DocumentBlueprintSection = {
  id: string;
  title: string;
  status: "draft" | "outline";
  outline: string[];
  prefilled?: string;
};

/** Semi-structured legal pack outlines — not a substitute for counsel. */
export function buildDocumentBlueprints(
  data: WizardData
): DocumentBlueprintSection[] {
  const reg = mapRegulatoryPath(data);
  const instrument = inferInstrumentType(data);
  const tok = buildTokenomicsBlueprint(data);
  const loc = [data.city, data.country].filter(Boolean).join(", ") || "—";
  const value = `${data.estimatedValue?.toLocaleString() ?? "—"} ${data.currency ?? "EUR"}`;

  return [
    {
      id: "spv_statutes",
      title: "Statuts SPV / articles of association",
      status: "outline",
      outline: [
        "Objet social : détention et tokenisation de l'actif",
        "Capital et parts — lien avec l'offre de jetons",
        "Gouvernance (administrateur, AG, quorum)",
        "Clause blockchain : registre des membres tenu on-chain",
      ],
      prefilled: `Véhicule recommandé : ${reg.structureRecommendation}. Actif : ${data.assetType}, ${loc}.`,
    },
    {
      id: "subscription",
      title: "Contrat de souscription / Subscription agreement",
      status: "outline",
      outline: [
        "Montant souscrit et nombre de jetons",
        "Représentations investisseur (éligibilité, KYC)",
        "Conditions suspensives (due diligence, audit SC)",
        "Droit de transfert soumis à whitelist",
      ],
    },
    {
      id: "whitepaper",
      title: "Livre blanc (sections obligatoires)",
      status: "draft",
      outline: [
        "Résumé exécutif",
        "Description de l'actif et localisation",
        "Structure juridique et régime",
        "Tokenomics & droits attachés",
        "Risques principaux",
        "Calendrier & use of proceeds",
      ],
      prefilled: `Actif : ${data.assetType}. Valeur indicative : ${value}. Instrument : ${instrument}. Régime : ${reg.regime}. Supply indicative : ${tok.totalSupply} jetons (${tok.symbol}).`,
    },
    {
      id: "prospectus",
      title: "Prospectus / Investment memorandum",
      status: "outline",
      outline: [
        "Informations clés (KID/PRIIPs si retail EU)",
        "Facteurs de risque détaillés",
        "Frais et conflits d'intérêts",
        "Documents incorporés par référence",
      ],
      prefilled: `Profil cible : ${
        data.investorProfile?.trim() &&
        data.investorProfile !== "investorProfile"
          ? data.investorProfile
          : "I don't know yet"
      }. ${reg.summary}`,
    },
    {
      id: "token_clause",
      title: "Clause jeton dans les statuts / SHA",
      status: "draft",
      outline: [
        "Le jeton représente [créance/participation]",
        "Registre on-chain = registre des transferts officiel",
        "Événements de défaut et freeze réglementaire",
      ],
      prefilled: `Standard cible : ${tok.name}. Transferts : whitelist obligatoire. ${tok.transferRules[0]}`,
    },
  ];
}
