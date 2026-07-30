import { resolveCatalogLocale, type CatalogMap, type Locale } from "@/lib/i18n";

export type AcademyHubMessages = {
  schoolsEyebrow: string;
  schoolsTitle: string;
  schoolsIntro: string;
  startLearning: string;
  explore: string;
  certificationsEyebrow: string;
  certificationsTitle: string;
  tracksEyebrow: string;
  tracksTitle: string;
  tracksIntro: string;
  tracksAll: string;
  filterByTrack: string;
  recommended: string;
  modulesTitle: string;
  moduleMinutes: (n: number) => string;
  lessonsCount: (n: number) => string;
  openModule: string;
  progressSignedOut: string;
  progressSignIn: string;
  lessonMarkDone: string;
  lessonDone: string;
  quizTitle: string;
  quizLocked: string;
  quizUnlockHint: string;
  quizSubmit: string;
  quizSubmitting: string;
  quizPass: (score: number, total: number) => string;
  quizFail: (score: number, need: number, total: number) => string;
  quizRetry: string;
  backSchool: string;
  backHub: string;
  fellowNoteLabel: string;
  softCtaTitle: string;
  certPathTitle: string;
  certPathBody: string;
  certPathCta: string;
  diplomaNote: string;
  nftDeferred: string;
  educationalDisclaimer: string;
  levelLabel: (level: number) => string;
  progressLabel: string;
  quizPassedBadge: string;
  saveFailed: string;
  networkError: string;
};

const fr: AcademyHubMessages = {
  schoolsEyebrow: "Trois écoles · RWA ressources",
  schoolsTitle: "Apprendre par filière",
  schoolsIntro:
    "Parcours progressifs 101 → 201 → 301 sur ressources tokenisées, marchés, et agents. Filtrez par métier — contenu expert, sans faux témoignages.",
  startLearning: "Commencer",
  explore: "Explorer",
  certificationsEyebrow: "Attestations",
  certificationsTitle: "Certifier ce que vous avez compris",
  tracksEyebrow: "Corps de métier",
  tracksTitle: "Votre piste",
  tracksIntro:
    "Chaque métier met en avant les modules les plus utiles. Les autres restent accessibles.",
  tracksAll: "Tous les métiers",
  filterByTrack: "Filtrer par métier",
  recommended: "Recommandé pour vous",
  modulesTitle: "Modules",
  moduleMinutes: (n) => `~${n} min`,
  lessonsCount: (n) => `${n} leçons`,
  openModule: "Ouvrir le module",
  progressSignedOut: "Connectez-vous pour enregistrer votre progression et débloquer les quiz de façon durable.",
  progressSignIn: "Se connecter",
  lessonMarkDone: "Marquer comme lu",
  lessonDone: "Lu",
  quizTitle: "Quiz du module",
  quizLocked: "Quiz verrouillé",
  quizUnlockHint: "Lisez les leçons (et connectez-vous) pour débloquer le quiz.",
  quizSubmit: "Valider le quiz",
  quizSubmitting: "Validation…",
  quizPass: (score, total) => `Module validé — ${score}/${total}`,
  quizFail: (score, need, total) => `Score ${score}/${total} — minimum ${need}. Réessayez.`,
  quizRetry: "Réessayer",
  backSchool: "← École",
  backHub: "← Academy",
  fellowNoteLabel: "Fellow",
  softCtaTitle: "Ensuite",
  certPathTitle: "Attestation Fondamentaux",
  certPathBody:
    "Après les modules, passez la certification gratuite (quiz + challenge). Diplôme PDF optionnel 39 € — attestation indicative, pas un agrément.",
  certPathCta: "Passer la certification →",
  diplomaNote: "Diplôme PDF 39 € via Stripe après Fondamentaux — certificat établissement 249 €.",
  nftDeferred: "Mint NFT on-chain du certificat : lab / différé — non live dans ce MVP.",
  educationalDisclaimer:
    "Contenu éducatif AUROS Academy — ne constitue pas un conseil d'investissement, juridique ou réglementaire. Pas d'agrément État / AMF / CSSF. Pas de Qualiopi ni affiliation universitaire revendiquée.",
  levelLabel: (level) => `${level}`,
  progressLabel: "Progression",
  quizPassedBadge: "Quiz réussi",
  saveFailed: "Enregistrement impossible — réessayez connecté.",
  networkError: "Erreur réseau — réessayez.",
};

const en: AcademyHubMessages = {
  schoolsEyebrow: "Three schools · resource RWA",
  schoolsTitle: "Learn by school",
  schoolsIntro:
    "Progressive 101 → 201 → 301 paths on tokenized resources, markets, and agents. Filter by métier — expert tone, no fake testimonials.",
  startLearning: "Start learning",
  explore: "Explore",
  certificationsEyebrow: "Attestations",
  certificationsTitle: "Certify what you understood",
  tracksEyebrow: "Métier tracks",
  tracksTitle: "Your track",
  tracksIntro:
    "Each métier highlights the most useful modules. Others stay available.",
  tracksAll: "All métiers",
  filterByTrack: "Filter by métier",
  recommended: "Recommended for you",
  modulesTitle: "Modules",
  moduleMinutes: (n) => `~${n} min`,
  lessonsCount: (n) => `${n} lessons`,
  openModule: "Open module",
  progressSignedOut: "Sign in to save progress and unlock quizzes durably.",
  progressSignIn: "Sign in",
  lessonMarkDone: "Mark as read",
  lessonDone: "Read",
  quizTitle: "Module quiz",
  quizLocked: "Quiz locked",
  quizUnlockHint: "Read the lessons (and sign in) to unlock the quiz.",
  quizSubmit: "Submit quiz",
  quizSubmitting: "Checking…",
  quizPass: (score, total) => `Module passed — ${score}/${total}`,
  quizFail: (score, need, total) => `Score ${score}/${total} — need ${need}. Try again.`,
  quizRetry: "Retry",
  backSchool: "← School",
  backHub: "← Academy",
  fellowNoteLabel: "Fellow",
  softCtaTitle: "Next",
  certPathTitle: "Fundamentals attestation",
  certPathBody:
    "After modules, take the free certification (quiz + challenge). Optional €39 PDF diploma — indicative attestation, not a license.",
  certPathCta: "Take certification →",
  diplomaNote: "€39 PDF diploma via Stripe after Fundamentals — €249 institution certificate.",
  nftDeferred: "On-chain certificate NFT mint: lab / deferred — not live in this MVP.",
  educationalDisclaimer:
    "Educational content from AUROS Academy — not investment, legal, or regulatory advice. Not a state / AMF / CSSF license. No Qualiopi or university affiliation claimed.",
  levelLabel: (level) => `${level}`,
  progressLabel: "Progress",
  quizPassedBadge: "Quiz passed",
  saveFailed: "Could not save — try again while signed in.",
  networkError: "Network error — try again.",
};

const es: AcademyHubMessages = {
  ...en,
  schoolsEyebrow: "Tres escuelas · RWA de recursos",
  schoolsTitle: "Aprender por escuela",
  startLearning: "Empezar",
  explore: "Explorar",
  backHub: "← Academy",
  educationalDisclaimer:
    "Contenido educativo de AUROS Academy — no es asesoramiento de inversión, jurídico ni regulatorio. Sin licencia estatal / AMF / CSSF. Sin Qualiopi ni afiliación universitaria.",
};

const catalog: CatalogMap<AcademyHubMessages> = { fr, en, es };

export function getAcademyHubMessages(locale: Locale): AcademyHubMessages {
  return catalog[resolveCatalogLocale(locale)] ?? en;
}
