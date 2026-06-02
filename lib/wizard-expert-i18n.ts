import type { Locale } from "@/lib/i18n";

export type WizardExpertMessages = {
  expressLabel: string;
  standardLabel: string;
  expressTitle: string;
  expressSubtitle: string;
  standardTitle: string;
  standardSubtitle: string;
  expressNote: string;
  shellExpress: string;
  stepOf: (current: number, total: number) => string;
};

const FR: WizardExpertMessages = {
  expressLabel: "Parcours express",
  standardLabel: "Parcours complet",
  expressTitle: "Je connais déjà le processus",
  expressSubtitle: "~6 min · actif, data room indicative, plateforme, contact",
  standardTitle: "Première tokenisation ou dossier à structurer",
  standardSubtitle: "~12 min · conformité et calendrier détaillés",
  expressNote:
    "Les champs juridiques avancés sont pré-remplis de façon indicative — vous les affinez dans le dossier.",
  shellExpress: "Express · indicatif · complétable ensuite",
  stepOf: (c, t) => `Étape ${c}/${t}`,
};

const EN: WizardExpertMessages = {
  expressLabel: "Express path",
  standardLabel: "Full path",
  expressTitle: "I know the process already",
  expressSubtitle: "~6 min · asset, indicative data room, platform, contact",
  standardTitle: "First tokenization or need full structuring",
  standardSubtitle: "~12 min · detailed compliance and timeline",
  expressNote:
    "Advanced legal fields are filled indicatively — refine them in your dossier.",
  shellExpress: "Express · indicative · refine later",
  stepOf: (c, t) => `Step ${c}/${t}`,
};

const ES: WizardExpertMessages = {
  ...EN,
  expressLabel: "Recorrido express",
  standardLabel: "Recorrido completo",
  expressTitle: "Ya conozco el proceso",
  expressSubtitle: "~6 min · activo, data room indicativa, plataforma, contacto",
  standardTitle: "Primera tokenización o dossier a estructurar",
  standardSubtitle: "~12 min · cumplimiento y calendario detallados",
  expressNote:
    "Los campos jurídicos avanzados son indicativos — afínelos en el dossier.",
  shellExpress: "Express · indicativo · completar después",
  stepOf: (c, t) => `Paso ${c}/${t}`,
};

export function getWizardExpertMessages(locale: Locale): WizardExpertMessages {
  if (locale === "fr") return FR;
  if (locale === "es") return ES;
  return EN;
}
