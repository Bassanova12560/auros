import { resolveCatalogLocale, type CatalogMap, type Locale } from "@/lib/i18n";

export type WizardStepsMessages = {
  stepLabel: (step: number, tag: string) => string;
  common: {
    country: string;
    city: string;
    cityPlaceholder: string;
    selectCountry: string;
    europe: string;
    world: string;
    exactAmount: string;
    currency: string;
    estimatedValueAria: string;
    firstName: string;
    email: string;
    emailInvalid: string;
    consentRequired: string;
    marketingConsent: string;
    footerNoSpam: string;
    footerDelivery: string;
    annualIncomeEur: string;
    incomeDescription: string;
    incomePlaceholder: string;
  };
  s1: { tag: string; title: string; subtitle: string; assetType: string };
  s2: {
    tag: string;
    title: string;
    subtitle: string;
    placeholder: string;
    exampleHint: string;
    words: (count: number, min: number, remaining: number) => string;
  };
  s3: { tag: string; title: string; subtitle: string };
  s4: { tag: string; title: string; subtitle: string; jurisdictionsCta: string };
  s5: { tag: string; title: string; subtitle: string; dataRoomHint?: string };
  s6: { tag: string; title: string; subtitle: string; requiredNote: string };
  s7: { tag: string; title: string; subtitle: string; urgencyAria: string };
  s8: { tag: string; title: string; subtitle: string; platformAria: string };
  s9: { tag: string; title: string; subtitle: string };
  s10: { tag: string; title: string; subtitle: string };
  s11: { tag: string; title: string; subtitle: string };
  s12: { tag: string; title: string; subtitle: string };
  s13: { tag: string; title: string; subtitle: string };
  s14: { tag: string; title: string; subtitle: string; placeholder: string };
  s15: {
    tag: string;
    title: string;
    subtitle: string;
    rows: {
      asset: string;
      description: string;
      value: string;
      location: string;
      documents: string;
      objectives: string;
      timeline: string;
      platform: string;
      contact: string;
      legalStructure: string;
      income: string;
      legalStatus: string;
      investorProfile: string;
      notes: string;
    };
    ctaSaving: string;
    ctaGenerate: string;
    ctaRetry: string;
    admissionHint?: string;
    saveErrorAuth: string;
    saveErrorPrefix: string;
    docCount: (n: number) => string;
  };
};

const FR: WizardStepsMessages = {
  stepLabel: (_step, tag) => tag,
  common: {
    country: "Pays",
    city: "Ville",
    cityPlaceholder: "Ville",
    selectCountry: "Sélectionner un pays",
    europe: "Europe",
    world: "Reste du monde",
    exactAmount: "Montant exact",
    currency: "Devise",
    estimatedValueAria: "Valeur estimée",
    firstName: "Prénom",
    email: "Adresse e-mail",
    emailInvalid: "Veuillez saisir une adresse e-mail valide",
    consentRequired: "Le consentement est requis pour continuer.",
    marketingConsent:
      "J'accepte de recevoir mon analyse et des nouveautés occasionnelles d'AUROS",
    footerNoSpam: "Pas de spam, jamais.",
    footerDelivery: "Votre dossier sera envoyé à cette adresse.",
    annualIncomeEur: "Montant annuel (EUR)",
    incomeDescription: "Description des revenus",
    incomePlaceholder: "Licences, dividendes, redevances…",
  },
  s1: {
    tag: "L'actif",
    title: "Quel actif tokenisez-vous ?",
    subtitle: "Choisissez la catégorie qui correspond le mieux à votre actif.",
    assetType: "Type d'actif",
  },
  s2: {
    tag: "L'actif",
    title: "Décrivez votre actif",
    subtitle:
      "Plus votre description est précise, plus le dossier sera pertinent.",
    placeholder: "Décrivez votre actif ici…",
    exampleHint:
      "Exemple : maison en pierre 180 m² à Bordeaux, rénovée en 2019, actuellement louée.",
    words: (count, min, remaining) =>
      remaining > 0
        ? `${String(count).padStart(3, "0")} / ${min} mots · ${remaining} restants`
        : `${String(count).padStart(3, "0")} / ${min} mots · prêt`,
  },
  s3: {
    tag: "Valeur",
    title: "Quelle est la valeur estimée ?",
    subtitle: "Curseur pour une fourchette rapide, ou saisissez le montant exact.",
  },
  s4: {
    tag: "Localisation",
    title: "Où se situe l'actif ?",
    subtitle: "La juridiction influence la structure de tokenisation.",
    jurisdictionsCta: "Comparer les juridictions de tokenisation",
  },
  s5: {
    tag: "Data room",
    title: "Votre package de due diligence",
    subtitle:
      "15 documents en 5 phases — cochez ce que vous avez déjà. Plus le dossier est complet, plus votre score de maturité augmente.",
    dataRoomHint: "Data room · 5 phases ·",
  },
  s6: {
    tag: "Objectif",
    title: "Quel est votre objectif ?",
    subtitle:
      "Sélectionnez au moins un objectif — nous adaptons la structure à vos priorités.",
    requiredNote: "Sélectionnez au moins un objectif.",
  },
  s7: {
    tag: "Calendrier",
    title: "Quel est votre horizon ?",
    subtitle: "Choisissez le délai qui correspond à votre appétence.",
    urgencyAria: "Urgence",
  },
  s8: {
    tag: "Parcours",
    title: "Comment souhaitez-vous avancer avec AUROS ?",
    subtitle:
      "Choisissez l'accompagnement qui vous convient — nous ne listons pas de places tierces ici.",
    platformAria: "Parcours AUROS",
  },
  s9: {
    tag: "Contact",
    title: "Où envoyer votre dossier ?",
    subtitle: "Deux champs — nous livrons le dossier dès qu'il est prêt.",
  },
  s10: {
    tag: "Structure juridique",
    title: "Comment détenez-vous cet actif aujourd'hui ?",
    subtitle:
      "Choisissez une option — la structure de détention influence la faisabilité.",
  },
  s11: {
    tag: "Revenus",
    title: "Votre actif génère-t-il des revenus ?",
    subtitle:
      "Les flux de trésorerie renforcent l'attractivité pour les investisseurs tokenisés.",
  },
  s12: {
    tag: "Statut juridique",
    title: "Quel est le statut juridique de l'actif ?",
    subtitle:
      "Cochez tout ce qui s'applique — les plateformes vérifient ces points en due diligence.",
  },
  s13: {
    tag: "Profil investisseur",
    title: "Qui investirait dans votre actif tokenisé ?",
    subtitle:
      "Sélectionnez un profil — cadre réglementaire (MiCA, prospectus, KYC).",
  },
  s14: {
    tag: "Compléments",
    title: "Autre chose à nous signaler ?",
    subtitle: "Optionnel — contexte, urgence, contraintes.",
    placeholder:
      "Contexte additionnel, circonstances particulières, urgence ou exigences spécifiques…",
  },
  s15: {
    tag: "Récapitulatif",
    title: "Presque terminé",
    subtitle:
      "Pas besoin d'avoir toutes les pièces maintenant — générez le dossier, complétez la data room ensuite.",
    rows: {
      asset: "Actif",
      description: "Description",
      value: "Valeur",
      location: "Localisation",
      documents: "Documents",
      objectives: "Objectifs",
      timeline: "Calendrier",
      platform: "Parcours AUROS",
      contact: "Contact",
      legalStructure: "Structure juridique",
      income: "Revenus",
      legalStatus: "Statut juridique",
      investorProfile: "Profil investisseur",
      notes: "Notes",
    },
    admissionHint: "Maturité du dossier",
    ctaSaving: "Génération du dossier…",
    ctaGenerate: "Générer mon dossier →",
    ctaRetry: "Réessayer · Générer mon dossier",
    saveErrorAuth: "Connectez-vous pour enregistrer le dossier.",
    saveErrorPrefix: "Impossible d'enregistrer le dossier.",
    docCount: (n) => `${n} document${n > 1 ? "s" : ""}`,
  },
};

const EN: WizardStepsMessages = {
  stepLabel: (_step, tag) => tag,
  common: {
    country: "Country",
    city: "City",
    cityPlaceholder: "City",
    selectCountry: "Select a country",
    europe: "Europe",
    world: "Rest of world",
    exactAmount: "Exact amount",
    currency: "Currency",
    estimatedValueAria: "Estimated value",
    firstName: "First name",
    email: "Email address",
    emailInvalid: "Please enter a valid email address",
    consentRequired: "Consent is required to continue.",
    marketingConsent:
      "I agree to receive my analysis and occasional AUROS updates",
    footerNoSpam: "No spam, ever.",
    footerDelivery: "Your dossier will be sent to this address.",
    annualIncomeEur: "Annual amount (EUR)",
    incomeDescription: "Income description",
    incomePlaceholder: "Licenses, dividends, royalties…",
  },
  s1: {
    tag: "Asset",
    title: "Which asset are you tokenizing?",
    subtitle: "Pick the category that best matches your asset.",
    assetType: "Asset type",
  },
  s2: {
    tag: "Asset",
    title: "Describe your asset",
    subtitle: "The more precise your description, the stronger the dossier.",
    placeholder: "Describe your asset here…",
    exampleHint:
      "Example: 180 m² stone house in Bordeaux, renovated 2019, currently rented.",
    words: (count, min, remaining) =>
      remaining > 0
        ? `${String(count).padStart(3, "0")} / ${min} words · ${remaining} left`
        : `${String(count).padStart(3, "0")} / ${min} words · ready`,
  },
  s3: {
    tag: "Value",
    title: "What is the estimated value?",
    subtitle: "Use the slider for a quick range, or enter the exact amount.",
  },
  s4: {
    tag: "Location",
    title: "Where is the asset located?",
    subtitle: "Jurisdiction shapes your tokenization structure.",
    jurisdictionsCta: "Compare tokenization jurisdictions",
  },
  s5: {
    tag: "Data room",
    title: "Your due diligence package",
    subtitle:
      "15 documents across 5 phases — check what you already have. A complete data room raises your dossier readiness score.",
    dataRoomHint: "Data room · 5 phases ·",
  },
  s6: {
    tag: "Objective",
    title: "What is your objective?",
    subtitle: "One or more choices — we adapt the structure to your priorities.",
    requiredNote: "Select at least one objective.",
  },
  s7: {
    tag: "Timeline",
    title: "What is your timeline?",
    subtitle: "Choose the timeframe that matches your appetite.",
    urgencyAria: "Urgency",
  },
  s8: {
    tag: "Path",
    title: "How would you like to proceed with AUROS?",
    subtitle:
      "Pick the support level that fits — we do not list third-party venues here.",
    platformAria: "AUROS path",
  },
  s9: {
    tag: "Contact",
    title: "Where should we send your dossier?",
    subtitle: "Two fields — we deliver the dossier as soon as it's ready.",
  },
  s10: {
    tag: "Legal structure",
    title: "How do you hold this asset today?",
    subtitle:
      "Select one option — ownership structure affects feasibility and tokenization design.",
  },
  s11: {
    tag: "Revenue",
    title: "Does your asset generate income?",
    subtitle: "Cash flows improve attractiveness for tokenized investors.",
  },
  s12: {
    tag: "Legal status",
    title: "What is the asset's legal status?",
    subtitle: "Check all that apply — platforms verify these in due diligence.",
  },
  s13: {
    tag: "Investor profile",
    title: "Who would invest in your tokenized asset?",
    subtitle:
      "Select a profile — regulatory framing (MiCA, prospectus, KYC).",
  },
  s14: {
    tag: "Additional",
    title: "Anything else we should know?",
    subtitle: "Optional — context, urgency, constraints.",
    placeholder:
      "Additional context, special circumstances, urgency or specific requirements…",
  },
  s15: {
    tag: "Summary",
    title: "Almost done",
    subtitle:
      "You don't need every document yet — generate the dossier, complete the data room later.",
    rows: {
      asset: "Asset",
      description: "Description",
      value: "Value",
      location: "Location",
      documents: "Documents",
      objectives: "Objectives",
      timeline: "Timeline",
      platform: "AUROS path",
      contact: "Contact",
      legalStructure: "Legal structure",
      income: "Income",
      legalStatus: "Legal status",
      investorProfile: "Investor profile",
      notes: "Notes",
    },
    ctaSaving: "Generating dossier…",
    admissionHint: "Dossier readiness",
    ctaGenerate: "Generate my dossier →",
    ctaRetry: "Retry · Generate my dossier",
    saveErrorAuth: "Sign in to save your dossier.",
    saveErrorPrefix: "Could not save dossier.",
    docCount: (n) => `${n} document${n === 1 ? "" : "s"}`,
  },
};

const ES: WizardStepsMessages = {
  ...EN,
  stepLabel: (_step, tag) => tag,
  common: {
    ...EN.common,
    country: "País",
    city: "Ciudad",
    cityPlaceholder: "Ciudad",
    selectCountry: "Seleccionar un país",
    europe: "Europa",
    world: "Resto del mundo",
    exactAmount: "Importe exacto",
    currency: "Divisa",
    firstName: "Nombre",
    email: "Correo electrónico",
    emailInvalid: "Introduzca un correo válido",
    consentRequired: "Se requiere consentimiento para continuar.",
    marketingConsent:
      "Acepto recibir mi análisis y novedades ocasionales de AUROS",
    footerNoSpam: "Sin spam, nunca.",
    footerDelivery: "Su dossier se enviará a esta dirección.",
    annualIncomeEur: "Importe anual (EUR)",
    incomeDescription: "Descripción de ingresos",
    incomePlaceholder: "Licencias, dividendos, regalías…",
  },
  s1: {
    tag: "Activo",
    title: "¿Qué activo tokeniza?",
    subtitle: "Elija la categoría que mejor describa su activo.",
    assetType: "Tipo de activo",
  },
  s8: {
    tag: "Recorrido",
    title: "¿Cómo desea avanzar con AUROS?",
    subtitle:
      "Elija el nivel de acompañamiento — no listamos plataformas externas aquí.",
    platformAria: "Recorrido AUROS",
  },
  s2: {
    tag: "Activo",
    title: "Describa su activo",
    subtitle: "Cuanto más precisa sea la descripción, más sólido será el dossier.",
    placeholder: "Describa su activo aquí…",
    exampleHint:
      "Ejemplo: casa de piedra de 180 m² en Burdeos, renovada en 2019, actualmente alquilada.",
    words: (count, min, remaining) =>
      remaining > 0
        ? `${String(count).padStart(3, "0")} / ${min} palabras · ${remaining} restantes`
        : `${String(count).padStart(3, "0")} / ${min} palabras · listo`,
  },
  s15: {
    ...EN.s15,
    tag: "Resumen",
    title: "Casi listo",
    subtitle:
      "No necesita todas las piezas ahora — genere el dossier y complete la data room después.",
    rows: {
      asset: "Activo",
      description: "Descripción",
      value: "Valor",
      location: "Ubicación",
      documents: "Documentos",
      objectives: "Objetivos",
      timeline: "Calendario",
      platform: "Recorrido AUROS",
      contact: "Contacto",
      legalStructure: "Estructura jurídica",
      income: "Ingresos",
      legalStatus: "Estado jurídico",
      investorProfile: "Perfil inversor",
      notes: "Notas",
    },
    admissionHint: "Madurez del dossier",
    ctaSaving: "Generando dossier…",
    ctaGenerate: "Generar mi dossier →",
    ctaRetry: "Reintentar · Generar mi dossier",
    saveErrorAuth: "Inicie sesión para guardar el dossier.",
    saveErrorPrefix: "No se pudo guardar el dossier.",
    docCount: (n) => `${n} documento${n === 1 ? "" : "s"}`,
  },
};

const CATALOG: CatalogMap< WizardStepsMessages> = { fr: FR, en: EN, es: ES };

export function getWizardStepsMessages(locale: Locale): WizardStepsMessages {
  return CATALOG[resolveCatalogLocale(locale)] ?? FR;
}
