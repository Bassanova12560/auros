import type { Locale } from "@/lib/i18n";

export type WizardModesMessages = {
  exploreLabel: string;
  proLabel: string;
  exploreTitle: string;
  exploreSubtitle: string;
  explorePrice: string;
  proTitle: string;
  proSubtitle: string;
  proPrice: string;
  exploreNote: string;
  proNote: string;
  shellExplore: string;
  shellPro: string;
  stepOf: (current: number, total: number) => string;
};

const FR: WizardModesMessages = {
  exploreLabel: "Explore",
  proLabel: "Pro",
  exploreTitle: "Aperçu gratuit de mon actif",
  exploreSubtitle: "~3 min · 5 questions · score indicatif",
  explorePrice: "Gratuit",
  proTitle: "Dossier institutionnel complet",
  proSubtitle: "~12 min · 19 questions · analyse MiCA",
  proPrice: "À partir de 490 €",
  exploreNote:
    "Résultat indicatif — vous affinez la conformité dans le parcours Pro.",
  proNote:
    "Parcours institutionnel — data room, conformité MiCA et dossier PDF complet.",
  shellExplore: "Explore · indicatif · 3 priorités max",
  shellPro: "Pro · institutionnel · dossier complet",
  stepOf: (c, t) => `Étape ${c}/${t}`,
};

const EN: WizardModesMessages = {
  exploreLabel: "Explore",
  proLabel: "Pro",
  exploreTitle: "Free asset preview",
  exploreSubtitle: "~3 min · 5 questions · indicative score",
  explorePrice: "Free",
  proTitle: "Full institutional dossier",
  proSubtitle: "~12 min · 19 questions · MiCA analysis",
  proPrice: "From €490",
  exploreNote:
    "Indicative result — refine compliance in the Pro path.",
  proNote:
    "Institutional path — data room, MiCA compliance and full PDF dossier.",
  shellExplore: "Explore · indicative · max 3 priorities",
  shellPro: "Pro · institutional · full dossier",
  stepOf: (c, t) => `Step ${c}/${t}`,
};

const ES: WizardModesMessages = {
  ...EN,
  exploreTitle: "Vista previa gratuita de mi activo",
  exploreSubtitle: "~3 min · 5 preguntas · puntuación indicativa",
  explorePrice: "Gratis",
  proTitle: "Dossier institucional completo",
  proSubtitle: "~12 min · 19 preguntas · análisis MiCA",
  proPrice: "Desde 490 €",
  exploreNote:
    "Resultado indicativo — afine el cumplimiento en el recorrido Pro.",
  proNote:
    "Recorrido institucional — data room, MiCA y dossier PDF completo.",
  shellExplore: "Explore · indicativo · máx. 3 prioridades",
  shellPro: "Pro · institucional · dossier completo",
  stepOf: (c, t) => `Paso ${c}/${t}`,
};

export function getWizardModesMessages(locale: Locale): WizardModesMessages {
  if (locale === "fr") return FR;
  if (locale === "es") return ES;
  return EN;
}
