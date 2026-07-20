import { resolveCatalogLocale, type CatalogMap, type Locale } from "@/lib/i18n";

import type { CsrdPriorityKey, CsrdQuestionId, CsrdScopeKey } from "./types";

export type CsrdCheckerCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  progress: (current: number, total: number) => string;
  yes: string;
  no: string;
  back: string;
  next: string;
  resultLabel: string;
  scopeFromYear: (year: number) => string;
  preparationScore: (score: number) => string;
  wizardCta: string;
  restart: string;
  disclaimer: string;
  scopeLabels: Record<CsrdScopeKey, string>;
  priorities: Record<CsrdPriorityKey, string>;
  questions: { id: CsrdQuestionId; label: string }[];
  faqTitle: string;
  faq: readonly { question: string; answer: string }[];
};

const FR: CsrdCheckerCopy = {
  eyebrow: "AUROS Green · CSRD",
  title: "CSRD Checker",
  intro:
    "Six questions pour estimer si vous entrez en scope CSRD et votre niveau de préparation — gratuit, indicatif, ~2 min.",
  progress: (current, total) => `Question ${current} / ${total}`,
  yes: "Oui",
  no: "Non",
  back: "Retour",
  next: "Continuer",
  resultLabel: "Résultat CSRD",
  scopeFromYear: (year) => `Entrée en scope estimée : exercice ${year}`,
  preparationScore: (score) => `Score de préparation : ${score}/100`,
  wizardCta: "Évaluer mes actifs verts →",
  restart: "Recommencer",
  disclaimer:
    "Estimation indicative du scope CSRD — pas un avis juridique. Vérifiez avec votre auditeur ou conseil ESG.",
  scopeLabels: {
    out_of_scope: "Hors scope CSRD (estimation)",
    listed_sme:
      "Scope CSRD probable — PME cotée (reporting dès exercice 2027)",
    large_undertaking:
      "Scope CSRD probable — grande entreprise (reporting dès exercice 2026)",
  },
  priorities: {
    sustainability_report:
      "Lancer un rapport de durabilité CSRD (double matérialité).",
    green_asset_ratio:
      "Cartographier le Green Asset Ratio et l'alignement EU Taxonomy.",
    esrs_datapoints:
      "Identifier les datapoints ESRS prioritaires pour votre secteur.",
  },
  questions: [
    {
      id: "employees250",
      label: "Votre entreprise compte-t-elle plus de 250 employés ?",
    },
    {
      id: "revenue40m",
      label: "Votre chiffre d'affaires dépasse-t-il 40 M€ ?",
    },
    {
      id: "balance20m",
      label: "Votre total bilan dépasse-t-il 20 M€ ?",
    },
    {
      id: "listedEu",
      label: "Êtes-vous coté sur un marché réglementé de l'UE ?",
    },
    {
      id: "greenAssets",
      label:
        "Détenez-vous des actifs verts (immobilier, énergie, infrastructure) ?",
    },
    {
      id: "hasSustainabilityReport",
      label: "Publiez-vous déjà un rapport de durabilité ?",
    },
  ],
  faqTitle: "Questions fréquentes",
  faq: [
    {
      question: "Qu'est-ce que la CSRD ?",
      answer:
        "La Corporate Sustainability Reporting Directive (CSRD) impose à de nombreuses entreprises de l'UE de publier un rapport de durabilité audité selon les standards ESRS.",
    },
    {
      question: "Ce checker remplace-t-il un conseil juridique ?",
      answer:
        "Non. Il estime si votre entreprise est probablement en scope CSRD et votre niveau de préparation — validez avec un auditeur ou conseil ESG.",
    },
    {
      question: "Que faire après le test CSRD ?",
      answer:
        "Utilisez le wizard AUROS Green pour scorer l'alignement EU Taxonomy de vos actifs verts et préparer un Impact Report.",
    },
  ],
};

const EN: CsrdCheckerCopy = {
  eyebrow: "AUROS Green · CSRD",
  title: "CSRD Checker",
  intro:
    "Six questions to estimate whether you fall under CSRD scope and your readiness level — free, indicative, ~2 min.",
  progress: (current, total) => `Question ${current} / ${total}`,
  yes: "Yes",
  no: "No",
  back: "Back",
  next: "Continue",
  resultLabel: "CSRD result",
  scopeFromYear: (year) => `Estimated in-scope from fiscal year ${year}`,
  preparationScore: (score) => `Readiness score: ${score}/100`,
  wizardCta: "Assess my green assets →",
  restart: "Start over",
  disclaimer:
    "Indicative CSRD scope estimate — not legal advice. Confirm with your auditor or ESG counsel.",
  scopeLabels: {
    out_of_scope: "Outside CSRD scope (estimate)",
    listed_sme:
      "Likely CSRD scope — listed SME (reporting from fiscal year 2027)",
    large_undertaking:
      "Likely CSRD scope — large undertaking (reporting from fiscal year 2026)",
  },
  priorities: {
    sustainability_report:
      "Launch a CSRD sustainability report (double materiality).",
    green_asset_ratio:
      "Map the Green Asset Ratio and EU Taxonomy alignment.",
    esrs_datapoints:
      "Identify priority ESRS datapoints for your sector.",
  },
  questions: [
    {
      id: "employees250",
      label: "Does your company employ more than 250 people?",
    },
    {
      id: "revenue40m",
      label: "Does your revenue exceed €40M?",
    },
    {
      id: "balance20m",
      label: "Does your balance sheet total exceed €20M?",
    },
    {
      id: "listedEu",
      label: "Are you listed on a regulated EU market?",
    },
    {
      id: "greenAssets",
      label: "Do you hold green assets (real estate, energy, infrastructure)?",
    },
    {
      id: "hasSustainabilityReport",
      label: "Do you already publish a sustainability report?",
    },
  ],
  faqTitle: "Frequently asked questions",
  faq: [
    {
      question: "What is CSRD?",
      answer:
        "The Corporate Sustainability Reporting Directive (CSRD) requires many EU companies to publish audited sustainability reports under ESRS standards.",
    },
    {
      question: "Does this checker replace legal counsel?",
      answer:
        "No. It estimates whether your company is likely in CSRD scope and your readiness level — validate with an auditor or ESG counsel.",
    },
    {
      question: "What should I do after the CSRD check?",
      answer:
        "Use the AUROS Green wizard to score EU Taxonomy alignment for your green assets and prepare an Impact Report.",
    },
  ],
};

const ES: CsrdCheckerCopy = {
  eyebrow: "AUROS Green · CSRD",
  title: "CSRD Checker",
  intro:
    "Seis preguntas para estimar si entra en el ámbito CSRD y su nivel de preparación — gratuito, indicativo, ~2 min.",
  progress: (current, total) => `Pregunta ${current} / ${total}`,
  yes: "Sí",
  no: "No",
  back: "Volver",
  next: "Continuar",
  resultLabel: "Resultado CSRD",
  scopeFromYear: (year) => `Entrada en ámbito estimada: ejercicio ${year}`,
  preparationScore: (score) => `Puntuación de preparación: ${score}/100`,
  wizardCta: "Evaluar mis activos verdes →",
  restart: "Reiniciar",
  disclaimer:
    "Estimación indicativa del ámbito CSRD — no es asesoramiento jurídico. Verifique con su auditor o counsel ESG.",
  scopeLabels: {
    out_of_scope: "Fuera del ámbito CSRD (estimación)",
    listed_sme:
      "Probable ámbito CSRD — PYME cotizada (reporting desde ejercicio 2027)",
    large_undertaking:
      "Probable ámbito CSRD — gran empresa (reporting desde ejercicio 2026)",
  },
  priorities: {
    sustainability_report:
      "Iniciar un informe de sostenibilidad CSRD (doble materialidad).",
    green_asset_ratio:
      "Mapear el Green Asset Ratio y la alineación EU Taxonomy.",
    esrs_datapoints:
      "Identificar los datapoints ESRS prioritarios para su sector.",
  },
  questions: [
    {
      id: "employees250",
      label: "¿Su empresa tiene más de 250 empleados?",
    },
    {
      id: "revenue40m",
      label: "¿Su facturación supera los 40 M€?",
    },
    {
      id: "balance20m",
      label: "¿Su balance total supera los 20 M€?",
    },
    {
      id: "listedEu",
      label: "¿Cotiza en un mercado regulado de la UE?",
    },
    {
      id: "greenAssets",
      label:
        "¿Posee activos verdes (inmobiliario, energía, infraestructura)?",
    },
    {
      id: "hasSustainabilityReport",
      label: "¿Ya publica un informe de sostenibilidad?",
    },
  ],
  faqTitle: "Preguntas frecuentes",
  faq: [
    {
      question: "¿Qué es la CSRD?",
      answer:
        "La Corporate Sustainability Reporting Directive (CSRD) exige a muchas empresas de la UE publicar un informe de sostenibilidad auditado según los estándares ESRS.",
    },
    {
      question: "¿Este checker sustituye un asesoramiento jurídico?",
      answer:
        "No. Estima si su empresa está probablemente en ámbito CSRD y su nivel de preparación — valide con un auditor o counsel ESG.",
    },
    {
      question: "¿Qué hacer después del test CSRD?",
      answer:
        "Use el wizard AUROS Green para puntuar la alineación EU Taxonomy de sus activos verdes y preparar un Impact Report.",
    },
  ],
};

const COPY: CatalogMap< CsrdCheckerCopy> = { fr: FR, en: EN, es: ES };

export function getCsrdCheckerCopy(locale: Locale): CsrdCheckerCopy {
  return COPY[resolveCatalogLocale(locale)] ?? FR;
}
