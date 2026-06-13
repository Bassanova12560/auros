import { DOC_NONE } from "@/lib/wizard-constants";
import type { WizardData } from "@/lib/wizard-types";

import { GREEN_WIZARD_ASSET_TYPE } from "../constants";

export type GreenAssetClass =
  | "renewable"
  | "carbon"
  | "green_bond"
  | "biodiversity"
  | "agriculture"
  | "other_green";

export type SfdrArticle = "article_6" | "article_8" | "article_9";

export type EuGbsEligibility = "eligible" | "conditional" | "not_eligible";

export type GreenComplianceScore = {
  asset_class: GreenAssetClass;
  eu_taxonomy_alignment: number;
  sfdr_classification: SfdrArticle;
  eu_gbs_eligible: EuGbsEligibility;
  /** Max 3 improvement priorities (UX psychology). */
  priorities: string[];
  disclaimer: string;
};

const DISCLAIMER =
  "Score d'alignement indicatif — pas une certification EU Taxonomy, SFDR ou EU GBS officielle. Validez avec un conseil ESG qualifié.";

function textBlob(data: WizardData): string {
  return [
    data.description,
    data.additionalNotes,
    data.incomeDescription,
    data.assetType,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function detectGreenAssetClass(data: WizardData): GreenAssetClass {
  const text = textBlob(data);
  if (
    /carbone|carbon|co2|tco2|verra|gold standard|offset|crédit carbone|credit carbone/.test(
      text
    )
  ) {
    return "carbon";
  }
  if (/green bond|obligation verte|eu gbs|gbss|green note|ofh/.test(text)) {
    return "green_bond";
  }
  if (/biodivers|nature|tnfd|forêt|forest|habitat/.test(text)) {
    return "biodiversity";
  }
  if (/agri|soil|ferme|farm|regenerative|biomasse agr/.test(text)) {
    return "agriculture";
  }
  if (
    data.assetType === GREEN_WIZARD_ASSET_TYPE ||
    /solaire|solar|éolien|wind|hydro|renewable|renouvelable|mwh|rec|ppa/.test(text)
  ) {
    return "renewable";
  }
  if (/vert|green|esg|taxonomy|taxonomie|sfdr|csrd/.test(text)) {
    return "other_green";
  }
  return "other_green";
}

function realDocuments(data: WizardData): string[] {
  return data.documents.filter((d) => d !== DOC_NONE);
}

function taxonomyForClass(data: WizardData, assetClass: GreenAssetClass): number {
  const text = textBlob(data);
  const docs = realDocuments(data);
  let score = 35;

  const climateKeywords =
    /mwh|kwh|solaire|solar|éolien|wind|hydro|carbone|carbon|co2|renewable|renouvelable|efficacité énergétique/.test(
      text
    );
  const dnsKeywords = /dnsh|do no significant harm|biodivers|pollution|eau|water/.test(text);
  const mssKeywords = /minimum safeguard|droits humains|governance|gouvernance|oecd/.test(text);

  if (climateKeywords) score += 25;
  if (docs.length >= 2) score += 12;
  if (data.legalStructure?.trim()) score += 8;
  if (data.country?.trim()) score += 5;
  if (dnsKeywords) score += 10;
  if (mssKeywords) score += 8;

  if (assetClass === "carbon") {
    if (/verra|gold standard|puro|article 6|additionality|permanence/.test(text)) score += 15;
    else score -= 5;
  }
  if (assetClass === "green_bond") {
    if (/allocation report|impact report|85%|taxonomy-aligned|taxonomie/.test(text)) score += 18;
  }
  if (assetClass === "renewable" && /ppa|rec|grid|production|capacité|capacity/.test(text)) {
    score += 10;
  }

  return Math.min(100, Math.max(0, score));
}

function sfdrFromInputs(
  taxonomy: number,
  data: WizardData,
  assetClass: GreenAssetClass
): SfdrArticle {
  const text = textBlob(data);
  const docs = realDocuments(data);
  const hasImpact =
    /impact|durabilit|sustainable|article 9|art\.?\s*9|objectif environnement/.test(text);
  const hasEsgPromotion =
    /esg|article 8|art\.?\s*8|promotion|caractéristique environnement/.test(text);

  if (hasImpact && taxonomy >= 65 && docs.length >= 3) return "article_9";
  if (
    (hasEsgPromotion || assetClass === "green_bond" || assetClass === "renewable") &&
    taxonomy >= 50
  ) {
    return "article_8";
  }
  return "article_6";
}

function gbsFromInputs(
  taxonomy: number,
  assetClass: GreenAssetClass,
  data: WizardData
): EuGbsEligibility {
  const text = textBlob(data);
  if (assetClass !== "green_bond" && !/green bond|obligation verte|eu gbs/.test(text)) {
    return "not_eligible";
  }
  if (taxonomy >= 70 && /allocation|impact report|85%|use of proceeds/.test(text)) {
    return "eligible";
  }
  if (taxonomy >= 45) return "conditional";
  return "not_eligible";
}

function buildPriorities(
  taxonomy: number,
  sfdr: SfdrArticle,
  gbs: EuGbsEligibility,
  assetClass: GreenAssetClass
): string[] {
  const out: string[] = [];
  if (taxonomy < 60) {
    out.push("Documenter l'alignement EU Taxonomy (objectifs climat + DNSH + safeguards).");
  }
  if (sfdr === "article_6") {
    out.push("Structurer la communication ESG pour viser SFDR Article 8 ou 9.");
  }
  if (gbs === "conditional") {
    out.push("Compléter le rapport d'allocation EU Green Bond Standard (≥ 85 % Taxonomy).");
  }
  if (assetClass === "carbon" && taxonomy < 70) {
    out.push("Préciser le standard carbone (Verra VCS, Gold Standard) et l'additionnalité.");
  }
  if (assetClass === "renewable" && taxonomy < 65) {
    out.push("Ajouter les preuves de production (MWh) et la traçabilité REC/PPA.");
  }
  return out.slice(0, 3);
}

export function computeGreenComplianceScore(data: WizardData): GreenComplianceScore {
  const asset_class = detectGreenAssetClass(data);
  const eu_taxonomy_alignment = taxonomyForClass(data, asset_class);
  const sfdr_classification = sfdrFromInputs(eu_taxonomy_alignment, data, asset_class);
  const eu_gbs_eligible = gbsFromInputs(eu_taxonomy_alignment, asset_class, data);
  const priorities = buildPriorities(
    eu_taxonomy_alignment,
    sfdr_classification,
    eu_gbs_eligible,
    asset_class
  );

  return {
    asset_class,
    eu_taxonomy_alignment,
    sfdr_classification,
    eu_gbs_eligible,
    priorities,
    disclaimer: DISCLAIMER,
  };
}

export function isGreenWizardContext(data: WizardData): boolean {
  if (data.assetType === GREEN_WIZARD_ASSET_TYPE) return true;
  const cls = detectGreenAssetClass(data);
  return cls !== "other_green" || /green|vert|esg|taxonom|sfdr|carbone|carbon/.test(textBlob(data));
}
