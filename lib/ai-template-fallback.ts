import type { Locale } from "@/lib/i18n";
import type { DossierContent, WizardData } from "@/lib/wizard-types";

/** Zero-cost dossier when all AI providers fail or budget exhausted. */
export function generateTemplateDossier(
  data: WizardData,
  locale: Locale
): DossierContent {
  const loc = [data.city, data.country].filter(Boolean).join(", ") || "—";
  const value = `${data.estimatedValue.toLocaleString()} ${data.currency}`;
  const goals = data.goals.length ? data.goals.join(", ") : "—";
  const docs = data.documents.length ? data.documents.join(", ") : "—";

  if (locale === "en") {
    return {
      legalDescription: `Asset type: ${data.assetType}. Location: ${loc}. Ownership structure: ${data.legalStructure || "to be confirmed"}. This indicative summary is based on information you provided and does not constitute legal advice.`,
      valuation: `Estimated value: ${value}. Market context should be validated with an independent appraisal. Tokenization typically references this baseline with liquidity and compliance adjustments validated by advisors.`,
      dueDiligence: `Documentation on file: ${docs}. Recommended next steps: title review, insurance confirmation, and KYC readiness. Gaps should be closed before investor-facing issuance.`,
      kycPreFilled: `Investor profile target: ${data.investorProfile || "not specified"}. Pre-fill identity, source of funds, and beneficial ownership for the issuing SPV or platform onboarding.`,
      micaCompliance: `EU MiCA relevance depends on instrument classification and investor type. A formal legal opinion is required before marketing tokenized interests in the EEA.`,
      smartContract: `ERC-3643-style permissioned tokens are commonly used for RWA. Parameters (transfer rules, freeze, corporate actions) should match the chosen platform: ${data.platform || "TBD"}.`,
    };
  }

  if (locale === "es") {
    return {
      legalDescription: `Tipo de activo: ${data.assetType}. Ubicación: ${loc}. Estructura: ${data.legalStructure || "por confirmar"}. Resumen indicativo basado en sus datos; no constituye asesoramiento legal.`,
      valuation: `Valor estimado: ${value}. Conviene validar con tasación independiente antes de emitir.`,
      dueDiligence: `Documentación indicada: ${docs}. Pasos recomendados: revisión de título, seguros y preparación KYC.`,
      kycPreFilled: `Perfil inversor: ${data.investorProfile || "no indicado"}. Preparar KYC del SPV y beneficiarios finales.`,
      micaCompliance: `La aplicación de MiCA depende de la clasificación del instrumento. Se requiere opinión legal antes de comercializar en la UE.`,
      smartContract: `Tokens permissionados (p. ej. ERC-3643) son habituales en RWA. Parámetros alineados con la plataforma: ${data.platform || "por definir"}.`,
    };
  }

  return {
    legalDescription: `Type d'actif : ${data.assetType}. Localisation : ${loc}. Structure : ${data.legalStructure || "à confirmer"}. Synthèse indicative basée sur vos informations — pas un conseil juridique.`,
    valuation: `Valorisation indicative : ${value}. Une expertise indépendante est recommandée avant toute émission.`,
    dueDiligence: `Documents déclarés : ${docs}. Prochaines étapes : vérification du titre, assurance, préparation KYC.`,
    kycPreFilled: `Profil cible : ${data.investorProfile || "non précisé"}. Pré-remplir identité, origine des fonds et bénéficiaires effectifs pour la plateforme.`,
    micaCompliance: `L'applicabilité MiCA dépend de la qualification de l'instrument. Avis juridique requis avant commercialisation dans l'UE.`,
    smartContract: `Jetons permissionnés (ex. ERC-3643) fréquents en RWA. Paramètres alignés sur la plateforme : ${data.platform || "à définir"}. Objectifs déclarés : ${goals}.`,
  };
}
