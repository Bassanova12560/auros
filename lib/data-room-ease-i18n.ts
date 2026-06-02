import type { Locale } from "@/lib/i18n";

export type DataRoomEaseMessages = {
  prioritiesTitle: string;
  progressLabel: string;
  listToggle: string;
  listHide: string;
  reassurance: string;
  headlines: {
    complete: string;
    progress: string;
    start: string;
  };
  sublines: {
    complete: string;
    progress: string;
    start: string;
  };
};

const FR: DataRoomEaseMessages = {
  prioritiesTitle: "Prochaines pièces — 3 priorités max",
  progressLabel: "Data room couverte",
  listToggle: "Voir la liste complète (15 documents)",
  listHide: "Masquer le détail",
  reassurance:
    "Vous n'avez pas besoin de tout aujourd'hui. Cochez ou déposez au fil de l'eau — la soumission reste possible avec un dossier partiel.",
  headlines: {
    complete: "Data room bien avancée",
    progress: "Bon rythme — quelques pièces clés suffisent pour la suite",
    start: "C'est normal de commencer léger",
  },
  sublines: {
    complete:
      "Les plateformes valident souvent le juridique en dernier. Vous pouvez affiner avant soumission.",
    progress:
      "Concentrez-vous sur les 3 priorités ci-dessous. Le reste peut suivre après génération du dossier.",
    start:
      "La plupart des porteurs n'ont pas les 15 documents dès le jour 1. AUROS structure d'abord, vous complétez ensuite.",
  },
};

const EN: DataRoomEaseMessages = {
  prioritiesTitle: "Next documents — up to 3 priorities",
  progressLabel: "Data room coverage",
  listToggle: "Show full checklist (15 documents)",
  listHide: "Hide details",
  reassurance:
    "You don't need everything today. Check off or upload over time — partial dossiers are expected.",
  headlines: {
    complete: "Data room is in good shape",
    progress: "Good pace — a few key documents unlock the next step",
    start: "Starting light is normal",
  },
  sublines: {
    complete:
      "Platforms often validate legal items last. You can still refine before submission.",
    progress:
      "Focus on the 3 priorities below. The rest can follow after your dossier is generated.",
    start:
      "Most issuers don't have all 15 documents on day one. AUROS frames first, you complete later.",
  },
};

const ES: DataRoomEaseMessages = {
  ...EN,
  prioritiesTitle: "Próximos documentos — máximo 3 prioridades",
  progressLabel: "Cobertura data room",
  listToggle: "Ver lista completa (15 documentos)",
  listHide: "Ocultar detalle",
  reassurance:
    "No necesita todo hoy. Marque o suba con calma — un dossier parcial es habitual.",
  headlines: {
    complete: "Data room muy avanzada",
    progress: "Buen ritmo — unas piezas clave bastan para seguir",
    start: "Empezar con poco es normal",
  },
  sublines: {
    complete:
      "Las plataformas suelen validar lo jurídico al final. Puede afinar antes de enviar.",
    progress:
      "Enfóquese en las 3 prioridades. El resto puede venir después del dossier.",
    start:
      "Pocos tienen los 15 documentos el día 1. AUROS estructura primero, usted completa después.",
  },
};

export function getDataRoomEaseMessages(locale: Locale): DataRoomEaseMessages {
  if (locale === "fr") return FR;
  if (locale === "es") return ES;
  return EN;
}
