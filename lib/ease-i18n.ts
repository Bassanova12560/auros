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
  depthLinks: {
    ariaLabel: string;
    eyebrow: string;
    links: readonly { href: string; label: string }[];
  };
  focusPages: {
    discover: { title: string; subtitle: string; cta: string };
    howItWorks: { title: string; subtitle: string; cta: string; secondary: string };
    trust: { title: string; subtitle: string; cta: string; secondary: string };
  };
  score: {
    reassurance: string;
    wizardCta: string;
    coachCta: string;
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
    scorePath: "Estimez d'abord en une phrase, ou lancez le wizard directement.",
  },
  depthLinks: {
    ariaLabel: "Approfondir AUROS",
    eyebrow: "Aller plus loin",
    links: [
      { href: "/estimate", label: "Score indicatif" },
      { href: "/how-it-works", label: "Comment ça marche" },
      { href: "/discover", label: "Découvrir AUROS" },
      { href: "/trust", label: "Confiance & conformité" },
      { href: "/green", label: "AUROS Green" },
    ],
  },
  focusPages: {
    discover: {
      title: "Découvrir AUROS",
      subtitle:
        "Plateformes, conformité, exemples — explorez à votre rythme, puis lancez le wizard.",
      cta: "Créer mon dossier",
    },
    howItWorks: {
      title: "Comment ça marche",
      subtitle: "Un parcours guidé de la description d'actif au dossier institutionnel.",
      cta: "Lancer le wizard",
      secondary: "Tester le score d'abord",
    },
    trust: {
      title: "Confiance & conformité",
      subtitle:
        "Studio de préparation sérieux — scores indicatifs, data room structurée, pas de conseil juridique.",
      cta: "Créer mon dossier",
      secondary: "Comparateur juridictions",
    },
  },
  score: {
    reassurance:
      "Ce score est indicatif. Le wizard structure tout le reste, étape par étape.",
    wizardCta: "Dossier guidé (~12 min)",
    coachCta: "Coach RWA — prochain pas",
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
    scorePath: "Estimate in one sentence first, or start the wizard directly.",
  },
  depthLinks: {
    ariaLabel: "Explore AUROS",
    eyebrow: "Go deeper",
    links: [
      { href: "/estimate", label: "Indicative score" },
      { href: "/how-it-works", label: "How it works" },
      { href: "/discover", label: "Discover AUROS" },
      { href: "/trust", label: "Trust & compliance" },
      { href: "/green", label: "AUROS Green" },
    ],
  },
  focusPages: {
    discover: {
      title: "Discover AUROS",
      subtitle:
        "Platforms, compliance, examples — explore at your pace, then start when ready.",
      cta: "Create my dossier",
    },
    howItWorks: {
      title: "How it works",
      subtitle: "One guided path from asset description to institutional dossier.",
      cta: "Start the wizard",
      secondary: "Try the score first",
    },
    trust: {
      title: "Trust & compliance",
      subtitle:
        "Serious preparation studio — indicative scores, structured data room, no legal advice.",
      cta: "Create my dossier",
      secondary: "Jurisdiction comparator",
    },
  },
  score: {
    reassurance:
      "This score is indicative. The wizard structures everything else, step by step.",
    wizardCta: "Guided dossier (~12 min)",
    coachCta: "RWA coach — next step",
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
    scorePath: "Estime primero en una frase, o inicie el wizard directamente.",
  },
  depthLinks: {
    ariaLabel: "Explorar AUROS",
    eyebrow: "Profundizar",
    links: [
      { href: "/estimate", label: "Puntuación indicativa" },
      { href: "/how-it-works", label: "Cómo funciona" },
      { href: "/discover", label: "Descubrir AUROS" },
      { href: "/trust", label: "Confianza y cumplimiento" },
      { href: "/green", label: "AUROS Green" },
    ],
  },
  focusPages: {
    discover: {
      title: "Descubrir AUROS",
      subtitle:
        "Plataformas, cumplimiento, ejemplos — explore a su ritmo, luego inicie el wizard.",
      cta: "Crear mi dossier",
    },
    howItWorks: {
      title: "Cómo funciona",
      subtitle: "Un recorrido guiado desde la descripción del activo al dossier institucional.",
      cta: "Iniciar el wizard",
      secondary: "Probar la puntuación primero",
    },
    trust: {
      title: "Confianza y cumplimiento",
      subtitle:
        "Estudio de preparación serio — puntuaciones indicativas, data room estructurada, sin asesoramiento legal.",
      cta: "Crear mi dossier",
      secondary: "Comparador de jurisdicciones",
    },
  },
  score: {
    reassurance:
      "Puntuación indicativa. El wizard estructura el resto paso a paso.",
    wizardCta: "Dossier guiado (~12 min)",
    coachCta: "Coach RWA — siguiente paso",
    jurisdictionsCta: "¿Dónde tokenizar? Comparador de jurisdicciones",
  },
};

export function getEaseMessages(locale: Locale): EaseMessages {
  if (locale === "fr") return FR;
  if (locale === "es") return ES;
  return EN;
}