import type { Locale } from "@/lib/i18n";

export type EaseMessages = {
  essentialsLabel: string;
  prioritiesTitle: string;
  detailsToggle: string;
  detailsHide: string;
  generateAnyway: string;
  generateNote: string;
  headlines: {
    ready: string;
    progress: string;
    start: string;
  };
  sublines: {
    ready: string;
    progress: string;
    start: string;
  };
  gaps: {
    description: string;
    valueLocation: string;
    documents: string;
    compliance: string;
    contact: string;
    dataRoom: string;
    ownership: string;
    valuation: string;
    legalOpinion: string;
  };
  landing: {
    exploreTitle: string;
    exploreSubtitle: string;
    scorePath: string;
  };
  score: {
    reassurance: string;
    wizardCta: string;
    jurisdictionsCta: string;
  };
};

const FR: EaseMessages = {
  essentialsLabel: "Essentiels couverts",
  prioritiesTitle: "Pour gagner en admission — 3 priorités max",
  detailsToggle: "Voir le détail des réponses",
  detailsHide: "Masquer le détail",
  generateAnyway: "Générer mon dossier",
  generateNote:
    "Même incomplet, le dossier IA structure vos réponses. Vous pourrez compléter la data room ensuite.",
  headlines: {
    ready: "Vous pouvez générer sereinement",
    progress: "Bon départ — quelques points à renforcer",
    start: "C'est normal de ne pas tout avoir",
  },
  sublines: {
    ready:
      "AUROS produit un dossier indicatif à partir de ce que vous avez saisi.",
    progress:
      "Le rapport met en avant les manques sans bloquer — vous affinez après.",
    start:
      "La plupart des porteurs commencent ainsi. Le dossier pose le cadre pour la suite.",
  },
  gaps: {
    description: "Ajouter une description plus précise (étape 2)",
    valueLocation: "Préciser valeur et localisation (étapes 3–4)",
    documents: "Indiquer les documents disponibles (étape 5)",
    compliance: "Compléter structure et conformité (étapes 10–14)",
    contact: "Ajouter prénom et e-mail (étape 9)",
    dataRoom: "Cocher les pièces déjà disponibles (étape 5)",
    ownership: "Titre de propriété à prévoir",
    valuation: "Expertise / valorisation à prévoir",
    legalOpinion: "Avis juridique à prévoir",
  },
  landing: {
    exploreTitle: "En savoir plus",
    exploreSubtitle:
      "Plateformes, conformité, exemples — ouvrez seulement si vous voulez approfondir.",
    scorePath: "Le plus simple : une phrase ci-dessous, résultat en quelques secondes.",
  },
  score: {
    reassurance:
      "Ce score est indicatif. Le wizard structure tout le reste, étape par étape.",
    wizardCta: "Dossier guidé (~12 min)",
    jurisdictionsCta: "Où tokeniser ? Comparateur juridictions",
  },
};

const EN: EaseMessages = {
  essentialsLabel: "Essentials covered",
  prioritiesTitle: "To improve admission — up to 3 priorities",
  detailsToggle: "Show answer details",
  detailsHide: "Hide details",
  generateAnyway: "Generate my dossier",
  generateNote:
    "Even if incomplete, the AI dossier structures your answers. You can complete the data room later.",
  headlines: {
    ready: "You're good to generate",
    progress: "Solid start — a few items to strengthen",
    start: "It's normal not to have everything yet",
  },
  sublines: {
    ready: "AUROS builds an indicative dossier from what you entered.",
    progress:
      "The report highlights gaps without blocking you — refine afterward.",
    start:
      "Most issuers start here. The dossier frames the path forward.",
  },
  gaps: {
    description: "Add a clearer description (step 2)",
    valueLocation: "Add value and location (steps 3–4)",
    documents: "Declare available documents (step 5)",
    compliance: "Complete structure & compliance (steps 10–14)",
    contact: "Add name and email (step 9)",
    dataRoom: "Check off documents you already have (step 5)",
    ownership: "Proof of ownership to obtain",
    valuation: "Independent valuation to obtain",
    legalOpinion: "Legal opinion to obtain",
  },
  landing: {
    exploreTitle: "Learn more",
    exploreSubtitle:
      "Platforms, compliance, examples — open only if you want depth.",
    scorePath: "Simplest path: one sentence below, result in seconds.",
  },
  score: {
    reassurance:
      "This score is indicative. The wizard structures everything else, step by step.",
    wizardCta: "Guided dossier (~12 min)",
    jurisdictionsCta: "Where to tokenize? Jurisdiction comparator",
  },
};

const ES: EaseMessages = {
  ...EN,
  essentialsLabel: "Esenciales cubiertos",
  prioritiesTitle: "Para mejorar la admisión — máximo 3 prioridades",
  detailsToggle: "Ver detalle de respuestas",
  detailsHide: "Ocultar detalle",
  generateAnyway: "Generar mi dossier",
  generateNote:
    "Aunque esté incompleto, el dossier IA estructura sus respuestas. Podrá completar la data room después.",
  headlines: {
    ready: "Puede generar con tranquilidad",
    progress: "Buen inicio — algunos puntos a reforzar",
    start: "Es normal no tenerlo todo",
  },
  sublines: {
    ready: "AUROS genera un dossier indicativo con lo que indicó.",
    progress:
      "El informe señala lagunas sin bloquear — refine después.",
    start:
      "La mayoría empieza así. El dossier marca el camino.",
  },
  gaps: {
    description: "Descripción más precisa (paso 2)",
    valueLocation: "Valor y ubicación (pasos 3–4)",
    documents: "Documentos disponibles (paso 5)",
    compliance: "Estructura y cumplimiento (pasos 10–14)",
    contact: "Nombre y e-mail (paso 9)",
    dataRoom: "Marcar documentos ya disponibles (paso 5)",
    ownership: "Título de propiedad por obtener",
    valuation: "Valoración independiente por obtener",
    legalOpinion: "Opinión legal por obtener",
  },
  landing: {
    exploreTitle: "Saber más",
    exploreSubtitle:
      "Plataformas, cumplimiento, ejemplos — solo si quiere profundizar.",
    scorePath: "Lo más simple: una frase abajo, resultado al instante.",
  },
  score: {
    reassurance:
      "Puntuación indicativa. El wizard estructura el resto paso a paso.",
    wizardCta: "Dossier guiado (~12 min)",
    jurisdictionsCta: "¿Dónde tokenizar? Comparador de jurisdicciones",
  },
};

export function getEaseMessages(locale: Locale): EaseMessages {
  if (locale === "fr") return FR;
  if (locale === "es") return ES;
  return EN;
}