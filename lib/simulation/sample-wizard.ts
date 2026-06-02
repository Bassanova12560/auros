import { normalizeWizardData } from "@/lib/wizard-types";
import type { WizardData } from "@/lib/wizard-types";

/** Villa Bordeaux — dossier RWA complet pour démo / tests. */
export const SIMULATION_WIZARD_RAW: Partial<WizardData> = {
  assetType: "Real estate",
  description:
    "Villa de 180 m2 à Bordeaux, louée, titre clair, expertise 2024, objectif revenus et liquidité pour tokenisation RWA institutionnelle.",
  estimatedValue: 1_200_000,
  currency: "EUR",
  country: "France",
  city: "Bordeaux",
  documents: [
    "proof_of_ownership",
    "valuation_report",
    "legal_opinion",
    "kyc_aml_policy",
    "spv_documents",
    "prospectus",
  ],
  goals: ["income", "liquidity"],
  timeline: "Within 3 months",
  platform: "AUROS dossier",
  firstName: "Adrien",
  email: "simulate@auros.test",
  legalStructure: "Through a company / SCI",
  incomeType: "rental",
  incomeAmountYear: 48_000,
  incomeDescription: "Location longue durée — bail commercial",
  legalStatus: [
    "Clear title — no disputes",
    "Tax compliant in jurisdiction",
    "No mortgage or encumbrance",
  ],
  investorProfile: "Accredited investors only",
  additionalNotes: "Simulation AUROS — pas de données réelles.",
};

export function getSimulationWizardData(): WizardData {
  return normalizeWizardData(SIMULATION_WIZARD_RAW);
}
