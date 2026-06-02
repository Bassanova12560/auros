import type { Locale } from "@/lib/i18n";
import {
  WIZARD_PHASES,
  wizardPhaseForStep,
  wizardPhaseIndex,
} from "@/lib/wizard-phases";
import { TOTAL_STEPS } from "@/lib/wizard-constants";

export type JourneyMessages = {
  moment: string;
  minutesLeft: (n: number) => string;
  inThisPart: (current: number, total: number) => string;
  shellNote: string;
  phaseIntro: Record<string, string>;
  stepReassurance: Partial<Record<number, string>>;
};

const FR: JourneyMessages = {
  moment: "Partie",
  minutesLeft: (n) => `~${n} min restantes`,
  inThisPart: (c, t) => `Question ${c} sur ${t} dans cette partie`,
  shellNote: "Réponses indicatives · révisables à tout moment · sauvegarde automatique",
  phaseIntro: {
    asset:
      "On pose les bases de l'actif. Aucune pièce officielle n'est exigée ici — seulement ce que vous savez aujourd'hui.",
    strategy:
      "Vos objectifs et le calendrier orientent le matching plateforme. Estimation, pas engagement.",
    compliance:
      "Le cadre réglementaire se précise. Les cases « pas encore » ou champs partiels sont normaux.",
    summary:
      "Dernière étape : le dossier IA structure vos réponses. Vous complétez la data room ensuite.",
  },
  stepReassurance: {
    2: "Une description honnête suffit — le dossier IA enrichira le reste.",
    5: "Cochez ce que vous avez déjà ; le reste pourra être ajouté plus tard.",
    10: "Structure juridique indicative — un cabinet validera avant émission.",
    12: "Cochez ce qui s'applique ; « aucun » est une réponse valide.",
  },
};

const EN: JourneyMessages = {
  moment: "Part",
  minutesLeft: (n) => `~${n} min left`,
  inThisPart: (c, t) => `Question ${c} of ${t} in this part`,
  shellNote: "Indicative answers · editable anytime · auto-saved",
  phaseIntro: {
    asset:
      "We capture the asset basics. No official documents required here — only what you know today.",
    strategy:
      "Goals and timeline shape your dossier roadmap. Estimates, not commitments.",
    compliance:
      "Regulatory framing takes shape. Partial answers or « not yet » are normal.",
    summary:
      "Final step: the AI dossier structures your inputs. Complete the data room later.",
  },
  stepReassurance: {
    2: "An honest description is enough — the AI dossier will enrich the rest.",
    5: "Check what you already have; you can add the rest later.",
    10: "Indicative legal structure — counsel validates before issuance.",
    12: "Tick what applies; « none » is a valid answer.",
  },
};

const ES: JourneyMessages = {
  moment: "Parte",
  minutesLeft: (n) => `~${n} min restantes`,
  inThisPart: (c, t) => `Pregunta ${c} de ${t} en esta parte`,
  shellNote: "Respuestas indicativas · editables · autoguardado",
  phaseIntro: {
    asset:
      "Bases del activo. No se exigen documentos oficiales aquí — solo lo que sabe hoy.",
    strategy:
      "Objetivos y calendario orientan el matching. Estimaciones, no compromisos.",
    compliance:
      "Marco regulatorio. Respuestas parciales o « aún no » son normales.",
    summary:
      "Último paso: el dossier IA estructura sus respuestas. Complete la data room después.",
  },
  stepReassurance: {
    2: "Una descripción honesta basta — el dossier IA completará el resto.",
    5: "Marque lo que ya tiene; el resto puede añadirse después.",
    10: "Estructura jurídica indicativa — asesoría validará antes de emitir.",
    12: "Marque lo aplicable; « ninguno » es válido.",
  },
};

export function getJourneyMessages(locale: Locale): JourneyMessages {
  if (locale === "fr") return FR;
  if (locale === "es") return ES;
  return EN;
}

const MINUTES_PER_STEP = 0.75;

export function estimatedMinutesLeft(step: number): number {
  const remaining = Math.max(1, TOTAL_STEPS - step + 1);
  return Math.max(1, Math.ceil(remaining * MINUTES_PER_STEP));
}

export function stepPositionInPhase(step: number): {
  indexInPhase: number;
  totalInPhase: number;
} {
  const phase = wizardPhaseForStep(step);
  if (!phase) return { indexInPhase: 1, totalInPhase: 1 };
  const idx = phase.steps.indexOf(step);
  return {
    indexInPhase: idx >= 0 ? idx + 1 : 1,
    totalInPhase: phase.steps.length,
  };
}

export function phaseIntroForStep(step: number, locale: Locale): string | null {
  const phase = wizardPhaseForStep(step);
  if (!phase) return null;
  return getJourneyMessages(locale).phaseIntro[phase.id] ?? null;
}

export function stepReassuranceForStep(
  step: number,
  locale: Locale
): string | null {
  return getJourneyMessages(locale).stepReassurance[step] ?? null;
}

export function phaseCount(): number {
  return WIZARD_PHASES.length;
}

export { wizardPhaseIndex, wizardPhaseForStep };
