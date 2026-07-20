import { resolveCatalogLocale, type CatalogMap, type Locale } from "@/lib/i18n";

import type {
  EuGbsEligibility,
  GreenAssetClass,
  GreenCompliancePriorityKey,
  SfdrArticle,
} from "./scoring/green-compliance";

export type GreenComplianceCopy = {
  panelEyebrow: string;
  alignmentSuffix: string;
  taxonomyUnit: string;
  sfdrLabel: string;
  gbsLabel: string;
  csrdCheckLink: string;
  disclaimer: string;
  sfdrLabels: Record<SfdrArticle, string>;
  gbsLabels: Record<EuGbsEligibility, string>;
  assetClassLabels: Record<GreenAssetClass, string>;
  priorities: Record<GreenCompliancePriorityKey, string>;
};

const FR: GreenComplianceCopy = {
  panelEyebrow: "Green Score · EU Taxonomy",
  alignmentSuffix: "— alignement indicatif",
  taxonomyUnit: "/100 Taxonomy",
  sfdrLabel: "Classification SFDR",
  gbsLabel: "EU Green Bond Standard",
  csrdCheckLink: "Tester votre scope CSRD →",
  disclaimer:
    "Score d'alignement indicatif — pas une certification EU Taxonomy, SFDR ou EU GBS officielle. Validez avec un conseil ESG qualifié.",
  sfdrLabels: {
    article_6: "SFDR Article 6",
    article_8: "SFDR Article 8",
    article_9: "SFDR Article 9",
  },
  gbsLabels: {
    eligible: "Éligible EU GBS",
    conditional: "EU GBS — sous conditions",
    not_eligible: "Hors EU Green Bond Standard",
  },
  assetClassLabels: {
    renewable: "Énergie renouvelable",
    carbon: "Crédits carbone",
    green_bond: "Green bond",
    biodiversity: "Biodiversité",
    agriculture: "Agriculture durable",
    other_green: "Actif vert",
  },
  priorities: {
    document_taxonomy:
      "Documenter l'alignement EU Taxonomy (objectifs climat + DNSH + safeguards).",
    sfdr_communication:
      "Structurer la communication ESG pour viser SFDR Article 8 ou 9.",
    gbs_allocation:
      "Compléter le rapport d'allocation EU Green Bond Standard (≥ 85 % Taxonomy).",
    carbon_standard:
      "Préciser le standard carbone (Verra VCS, Gold Standard) et l'additionnalité.",
    renewable_production:
      "Ajouter les preuves de production (MWh) et la traçabilité REC/PPA.",
  },
};

const EN: GreenComplianceCopy = {
  panelEyebrow: "Green Score · EU Taxonomy",
  alignmentSuffix: "— indicative alignment",
  taxonomyUnit: "/100 Taxonomy",
  sfdrLabel: "SFDR classification",
  gbsLabel: "EU Green Bond Standard",
  csrdCheckLink: "Check your CSRD scope →",
  disclaimer:
    "Indicative alignment score — not an official EU Taxonomy, SFDR or EU GBS certification. Validate with qualified ESG counsel.",
  sfdrLabels: {
    article_6: "SFDR Article 6",
    article_8: "SFDR Article 8",
    article_9: "SFDR Article 9",
  },
  gbsLabels: {
    eligible: "EU GBS eligible",
    conditional: "EU GBS — conditional",
    not_eligible: "Outside EU Green Bond Standard",
  },
  assetClassLabels: {
    renewable: "Renewable energy",
    carbon: "Carbon credits",
    green_bond: "Green bond",
    biodiversity: "Biodiversity",
    agriculture: "Sustainable agriculture",
    other_green: "Green asset",
  },
  priorities: {
    document_taxonomy:
      "Document EU Taxonomy alignment (climate objectives + DNSH + safeguards).",
    sfdr_communication:
      "Structure ESG communication to target SFDR Article 8 or 9.",
    gbs_allocation:
      "Complete EU Green Bond Standard allocation report (≥ 85% Taxonomy).",
    carbon_standard:
      "Specify carbon standard (Verra VCS, Gold Standard) and additionality.",
    renewable_production:
      "Add production evidence (MWh) and REC/PPA traceability.",
  },
};

const ES: GreenComplianceCopy = {
  panelEyebrow: "Green Score · EU Taxonomy",
  alignmentSuffix: "— alineación indicativa",
  taxonomyUnit: "/100 Taxonomy",
  sfdrLabel: "Clasificación SFDR",
  gbsLabel: "EU Green Bond Standard",
  csrdCheckLink: "Probar su ámbito CSRD →",
  disclaimer:
    "Puntuación de alineación indicativa — no es una certificación oficial EU Taxonomy, SFDR o EU GBS. Valide con counsel ESG cualificado.",
  sfdrLabels: {
    article_6: "SFDR Artículo 6",
    article_8: "SFDR Artículo 8",
    article_9: "SFDR Artículo 9",
  },
  gbsLabels: {
    eligible: "Elegible EU GBS",
    conditional: "EU GBS — condicional",
    not_eligible: "Fuera del EU Green Bond Standard",
  },
  assetClassLabels: {
    renewable: "Energía renovable",
    carbon: "Créditos de carbono",
    green_bond: "Green bond",
    biodiversity: "Biodiversidad",
    agriculture: "Agricultura sostenible",
    other_green: "Activo verde",
  },
  priorities: {
    document_taxonomy:
      "Documentar la alineación EU Taxonomy (objetivos climáticos + DNSH + safeguards).",
    sfdr_communication:
      "Estructurar la comunicación ESG para apuntar a SFDR Artículo 8 o 9.",
    gbs_allocation:
      "Completar el informe de asignación EU Green Bond Standard (≥ 85 % Taxonomy).",
    carbon_standard:
      "Precisar el estándar de carbono (Verra VCS, Gold Standard) y la adicionalidad.",
    renewable_production:
      "Añadir pruebas de producción (MWh) y trazabilidad REC/PPA.",
  },
};

const COPY: CatalogMap< GreenComplianceCopy> = { fr: FR, en: EN, es: ES };

export function getGreenComplianceCopy(locale: Locale): GreenComplianceCopy {
  return COPY[resolveCatalogLocale(locale)] ?? FR;
}
