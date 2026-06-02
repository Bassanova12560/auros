import type { Locale } from "@/lib/i18n";

import { ACADEMY_PASS_SCORE, ACADEMY_QUIZ_LENGTH, CERT_VALIDITY_DAYS } from "./constants";
import { getAcademyPageMessages, type AcademyPageMessages } from "./i18n-pages";

export type AcademyLocale = Locale;

export type AcademyTierCopy = {
  price: string;
  name: string;
  headline: string;
  description: string;
  cta: string;
};

export type AcademyMessages = AcademyCoreMessages & AcademyPageMessages;

type AcademyCoreMessages = {
  header: {
    backToApp: string;
    languageAria: string;
  };
  home: {
    eyebrow: string;
    title: string;
    intro: string;
    verifyTitle: string;
    verifyBody: string;
    startFree: string;
    viewProgram: string;
    scopeTitle: string;
    scopeMeasures: readonly string[];
    scopeDoesNot: readonly string[];
    registryLink: string;
  };
  tiers: {
    fundamentals: AcademyTierCopy;
    praticien: AcademyTierCopy;
    entreprise: AcademyTierCopy;
  };
  praticien: {
    title: string;
    intro: string;
    bullets: readonly string[];
    notify: string;
    back: string;
  };
  entreprise: {
    title: string;
    intro: string;
    teamNote: string;
    back: string;
  };
  fundamentals: {
    introEyebrow: string;
    title: string;
    intro: (quizLen: number, passScore: number, validityDays: number) => string;
    bullets: readonly string[];
    nameLabel: string;
    namePlaceholder: string;
    start: string;
    preparing: string;
    question: (current: number, total: number) => string;
    readHint: string;
    nextQuestion: string;
    validateQuiz: string;
    changeAnswer: string;
    validatingQuiz: string;
    challengeEyebrow: (score: number, total: number) => string;
    pointLabel: (index: number, label: string) => string;
    minTimeHint: (seconds: number) => string;
    minWordsHint: (min: number) => string;
    challengePlaceholder: string;
    submitChallenge: string;
    validatingChallenge: string;
    certifiedEyebrow: (level: number) => string;
    congrats: (name: string) => string;
    validUntil: (date: string) => string;
    deliverable: string;
    verifyPage: string;
    backAcademy: string;
    failTiming: string;
    failChallenge: string;
    failGeneric: string;
    quizScore: (score: number, total: number) => string;
    retry: string;
  };
  reasons: Record<string, string>;
  errors: {
    network: string;
    sessionStart: string;
    nameMin: string;
    completeChallenge: string;
    genericFail: (reason: string) => string;
    checkout: Record<string, string> & { default: string };
  };
  diploma: {
    purchasedEyebrow: string;
    purchasedBody: string;
    downloadPdf: string;
    upsellEyebrow: (price: string) => string;
    upsellBody: string;
    emailLabel: string;
    emailPlaceholder: string;
    checkout: (price: string) => string;
    redirecting: string;
  };
  institution: {
    eyebrow: (price: string) => string;
    title: string;
    body: string;
    orgLabel: string;
    orgPlaceholder: string;
    contactLabel: string;
    contactPlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    checkout: (price: string) => string;
    redirecting: string;
  };
  mailto: {
    praticienSubject: string;
  };
  tierNames: {
    fundamentals: string;
    praticien: string;
    entreprise: string;
  };
  disclaimer: string;
  gradeFeedback: {
    pass: string;
    fail: (labels: string) => string;
    incomplete: string;
    pasteBomb: string;
    duplicateFields: string;
  };
};

const fr: AcademyCoreMessages = {
  header: {
    backToApp: "auros.app →",
    languageAria: "Langue",
  },
  home: {
    eyebrow: "Formation · Attestation vérifiable",
    title: "AUROS Academy",
    intro:
      "Commencez par la certification Fondamentaux (gratuite). Les parcours Praticien et équipe ne sont pas encore ouverts.",
    verifyTitle: "Vérifier une attestation",
    verifyBody:
      "Chaque certifié reçoit un lien unique /academy/verify/… — partageable sur LinkedIn, CV ou data room.",
    startFree: "Commencer la certification gratuite →",
    viewProgram: "Voir le programme →",
    scopeTitle: "Ce que mesure — et ne mesure pas — la certification",
    scopeMeasures: [
      "Vocabulaire RWA et ordre des décisions (juridiction → structuration → tech)",
      "Compréhension data room, due diligence et limites réglementaires",
      "Capacité à formuler les disclaimers AUROS (attestation indicative)",
    ],
    scopeDoesNot: [
      "Expertise émetteur ou investisseur sur un deal réel",
      "Agrément AMF, CSSF ou conseil juridique",
      "Niveau praticien ou certification équipe (parcours à venir)",
    ],
    registryLink: "Voir le registre public →",
  },
  tiers: {
    fundamentals: {
      price: "Gratuit",
      name: "Certification Fondamentaux RWA",
      headline: "Les bases de la tokenisation d'actifs réels",
      description:
        "Quiz + 3 réponses courtes guidées — vocabulaire RWA, data room, juridictions. Attestation vérifiable 90 jours. Diplôme PDF optionnel 39 €.",
      cta: "Obtenir la certification",
    },
    praticien: {
      price: "Liste d'attente",
      name: "Certification Praticien RWA",
      headline: "Parcours émetteur — cas pratiques par type d'actif",
      description:
        "Immobilier, obligations, fonds — arbitrage juridiction et checklist émission. Parcours en préparation, pas encore ouvert.",
      cta: "Me prévenir à l'ouverture",
    },
    entreprise: {
      price: "249 €",
      name: "Certification Entreprise",
      headline: "Équipes et organisations RWA",
      description:
        "Certificat établissement PDF disponible. Parcours équipe complet (licences, registre, badges) pas encore ouvert.",
      cta: "Commander le certificat",
    },
  },
  praticien: {
    title: "Certification Praticien RWA",
    intro:
      "Parcours avancé pour émetteurs et professionnels : cas par type d'actif, arbitrage juridiction, checklist émission. Ce parcours n'est pas encore ouvert.",
    bullets: [
      "Immobilier, obligations, fonds, crédit privé",
      "Études de cas guidées",
      "Badge praticien vérifiable",
    ],
    notify: "Me prévenir à l'ouverture →",
    back: "← AUROS Academy",
  },
  entreprise: {
    title: "Certification Entreprise",
    intro:
      "Le certificat établissement PDF est disponible. Le parcours équipe (licences volume, registre public, badges collaborateurs) n'est pas encore ouvert.",
    teamNote: "Parcours équipe : contactez-nous pour un devis sur mesure.",
    back: "← AUROS Academy",
  },
  fundamentals: {
    introEyebrow: "Gratuit · ~15 min · intégrité niveau 2",
    title: "Certification Fondamentaux RWA",
    intro: (quizLen, passScore, validityDays) =>
      `${quizLen} questions tirées aléatoirement (réponses jamais exposées), puis 3 réponses courtes guidées avec critères visibles. Score minimum ${passScore}/${quizLen}. Attestation nominative valide ${validityDays} jours avec micro-renouvellement.`,
    bullets: [
      "Lisez chaque question — le quiz vérifie le temps de lecture, pas un piège",
      "3 points clés RWA — 2–4 phrases chacun, validation automatique",
      "Renouvellement micro-parcours avant expiration",
    ],
    nameLabel: "Nom complet (sur l'attestation)",
    namePlaceholder: "Prénom Nom",
    start: "Commencer le parcours",
    preparing: "Préparation…",
    question: (current, total) => `Question ${current} / ${total}`,
    readHint: "Prenez le temps de lire — sélectionnez une réponse puis confirmez.",
    nextQuestion: "Question suivante",
    validateQuiz: "Valider le quiz",
    changeAnswer: "Changer ma réponse",
    validatingQuiz: "Validation du quiz…",
    challengeEyebrow: (score, total) => `Validation pratique · quiz ${score}/${total} validé`,
    pointLabel: (index, label) => `Point ${index} — ${label}`,
    minTimeHint: (seconds) =>
      `~${seconds} s minimum · critères affichés sous chaque question`,
    minWordsHint: (min) => `Minimum ${min} mots · réponse distincte par point`,
    challengePlaceholder: "2–4 phrases avec les mots-clés suggérés…",
    submitChallenge: "Soumettre les 3 points",
    validatingChallenge: "Validation…",
    certifiedEyebrow: (level) => `Certifié · intégrité niveau ${level}`,
    congrats: (name) => `Félicitations, ${name}`,
    validUntil: (date) => `ID · valide jusqu'au ${date}`,
    deliverable:
      "Votre livrable gratuit : page de vérification (lien partageable, valide 90 jours, renouvelable).",
    verifyPage: "Page de vérification",
    backAcademy: "Retour Academy",
    failTiming: "Temps de parcours insuffisant",
    failChallenge: "Validation pratique à corriger",
    failGeneric: "Parcours non validé",
    quizScore: (score, total) => `Score quiz : ${score}/${total}`,
    retry: "Réessayer",
  },
  reasons: {
    invalid_session: "Session expirée — recommencez le parcours.",
    session_expired: "Session expirée — recommencez le parcours.",
    answer_too_fast:
      "Détection anti-automatisation : trop de clics instantanés. Prenez le temps de lire chaque question (~20 s minimum sur l'ensemble du quiz).",
    quiz_completed_too_fast:
      "Quiz terminé trop vite pour une lecture réelle (~20 s minimum). Reprenez en lisant chaque question.",
    score_too_low: "Score insuffisant au quiz (minimum 8/10).",
    challenge_too_fast:
      "Défi soumis trop tôt — prenez le temps de rédiger chaque point (2–4 phrases).",
    too_short: "Réponse trop courte pour ce point.",
    incomplete_fields: "Complétez les 3 points avant de soumettre.",
    invalid_fields: "Format de réponse invalide — recommencez le parcours.",
    challenge_failed:
      "Un ou plusieurs points ne couvrent pas encore les critères — voir le détail ci-dessous.",
    cert_delivery_failed:
      "Vos réponses sont validées, mais l'attestation n'a pas pu être émise. Réessayez dans un instant.",
    response_rejected: "Réponse rejetée (format ou contenu suspect).",
    session_already_used: "Session déjà utilisée — recommencez depuis le début.",
    service_unavailable: "Service temporairement indisponible — réessayez dans un instant.",
  },
  errors: {
    network: "Connexion impossible. Vérifiez votre réseau et réessayez.",
    sessionStart: "Impossible de démarrer la session.",
    nameMin: "Indiquez votre nom complet (2 caractères minimum).",
    completeChallenge: "Complétez les 3 points avant de soumettre.",
    genericFail: (reason) => `Parcours non validé (${reason}).`,
    checkout: {
      server_error: "Erreur serveur. Réessayez dans un instant.",
      invalid_response: "Réponse serveur inattendue. Réessayez.",
      stripe_unconfigured: "Paiement temporairement indisponible.",
      checkout_failed: "Impossible de créer la session de paiement.",
      missing_cert: "Attestation introuvable. Recommencez depuis votre page de certification.",
      invalid_cert: "Attestation invalide ou expirée.",
      missing_organization: "Indiquez le nom de l'établissement.",
      missing_email: "Indiquez une adresse email valide.",
      default: "Impossible de démarrer le paiement. Réessayez.",
    },
  },
  diploma: {
    purchasedEyebrow: "Diplôme PDF",
    purchasedBody: "Document permanent — retéléchargeable à tout moment.",
    downloadPdf: "Télécharger le PDF",
    upsellEyebrow: (price) => `Diplôme PDF — ${price} · une fois`,
    upsellBody:
      "Document permanent pour CV ou LinkedIn. L'attestation en ligne se renouvelle tous les 90 jours — le PDF reste à vie.",
    emailLabel: "Email (reçu Stripe)",
    emailPlaceholder: "vous@entreprise.com",
    checkout: (price) => `Obtenir le diplôme — ${price}`,
    redirecting: "Redirection Stripe…",
  },
  institution: {
    eyebrow: (price) => `Certificat établissement · ${price} · une fois`,
    title: "Diplôme institution permanent",
    body: "Document officiel AUROS Academy pour votre organisation (bureaux, intranet, RH). Paiement unique — le certificat reste à vie.",
    orgLabel: "Nom de l'établissement",
    orgPlaceholder: "Société / Institution",
    contactLabel: "Contact RH / direction",
    contactPlaceholder: "Prénom Nom",
    emailLabel: "Email professionnel",
    emailPlaceholder: "rh@entreprise.com",
    checkout: (price) => `Commander — ${price}`,
    redirecting: "Redirection Stripe…",
  },
  mailto: {
    praticienSubject: "AUROS Academy Praticien",
  },
  tierNames: {
    fundamentals: "Certification Fondamentaux RWA",
    praticien: "Certification Praticien RWA",
    entreprise: "Certification Entreprise RWA",
  },
  disclaimer:
    "Formation indicative AUROS Academy — non agréée État, AMF ou CSSF. Ne remplace pas un conseil juridique ou réglementaire. Validité 90 jours — renouvellement micro-parcours requis.",
  gradeFeedback: {
    pass: "Validation réussie — les 3 points clés sont couverts. Attestation délivrée.",
    fail: (labels) =>
      `Point(s) à compléter : ${labels}. Relisez les indices sous chaque question.`,
    incomplete: "Réponses incomplètes — développez chaque point avec les mots-clés suggérés.",
    pasteBomb: "Réponse rejetée (format suspect). Rédigez vos propres phrases courtes.",
    duplicateFields:
      "Les réponses semblent identiques — rédigez un contenu distinct pour chaque point.",
  },
};

const en: AcademyCoreMessages = {
  header: {
    backToApp: "auros.app →",
    languageAria: "Language",
  },
  home: {
    eyebrow: "Training · Verifiable certificate",
    title: "AUROS Academy",
    intro:
      "Start with the free Fundamentals certification. Practitioner and team tracks are not open yet.",
    verifyTitle: "Verify a certificate",
    verifyBody:
      "Each graduate receives a unique /academy/verify/… link — shareable on LinkedIn, CV, or data room.",
    startFree: "Start free certification →",
    viewProgram: "View program →",
    scopeTitle: "What the certification measures — and does not",
    scopeMeasures: [
      "RWA vocabulary and decision order (jurisdiction → structure → tech)",
      "Understanding data room, due diligence, and regulatory limits",
      "Ability to state AUROS disclaimers (indicative certificate)",
    ],
    scopeDoesNot: [
      "Issuer or investor expertise on a real deal",
      "AMF, CSSF approval, or legal advice",
      "Practitioner level or team certification (coming soon)",
    ],
    registryLink: "View public registry →",
  },
  tiers: {
    fundamentals: {
      price: "Free",
      name: "RWA Fundamentals Certification",
      headline: "Basics of real-world asset tokenization",
      description:
        "Quiz + 3 guided short answers — RWA vocabulary, data room, jurisdictions. Verifiable 90-day certificate. Optional PDF diploma €39.",
      cta: "Get certified",
    },
    praticien: {
      price: "Waitlist",
      name: "RWA Practitioner Certification",
      headline: "Issuer track — practical cases by asset type",
      description:
        "Real estate, bonds, funds — jurisdiction choice and issuance checklist. Track in preparation, not open yet.",
      cta: "Notify me at launch",
    },
    entreprise: {
      price: "€249",
      name: "Enterprise Certification",
      headline: "RWA teams and organizations",
      description:
        "Institution PDF certificate available. Full team track (licenses, registry, badges) not open yet.",
      cta: "Order institution certificate",
    },
  },
  praticien: {
    title: "RWA Practitioner Certification",
    intro:
      "Advanced track for issuers and professionals: cases by asset type, jurisdiction choice, issuance checklist. This track is not open yet.",
    bullets: [
      "Real estate, bonds, funds, private credit",
      "Guided case studies",
      "Verifiable practitioner badge",
    ],
    notify: "Notify me at launch →",
    back: "← AUROS Academy",
  },
  entreprise: {
    title: "Enterprise Certification",
    intro:
      "The institution PDF certificate is available. The full team track (volume licenses, public registry, team badges) is not open yet.",
    teamNote: "Team track: contact us for a custom quote.",
    back: "← AUROS Academy",
  },
  fundamentals: {
    introEyebrow: "Free · ~15 min · integrity level 2",
    title: "RWA Fundamentals Certification",
    intro: (quizLen, passScore, validityDays) =>
      `${quizLen} random questions (answers never exposed), then 3 guided short answers with visible criteria. Minimum score ${passScore}/${quizLen}. Named certificate valid ${validityDays} days with micro-renewal.`,
    bullets: [
      "Read each question — the quiz checks reading time, not trick questions",
      "3 key RWA points — 2–4 sentences each, automatic validation",
      "Micro-renewal before expiry",
    ],
    nameLabel: "Full name (on certificate)",
    namePlaceholder: "First Last",
    start: "Start the track",
    preparing: "Preparing…",
    question: (current, total) => `Question ${current} / ${total}`,
    readHint: "Take your time — select an answer then confirm.",
    nextQuestion: "Next question",
    validateQuiz: "Submit quiz",
    changeAnswer: "Change my answer",
    validatingQuiz: "Validating quiz…",
    challengeEyebrow: (score, total) => `Practical validation · quiz ${score}/${total} passed`,
    pointLabel: (index, label) => `Point ${index} — ${label}`,
    minTimeHint: (seconds) =>
      `~${seconds} s minimum · criteria shown under each question`,
    minWordsHint: (min) => `Minimum ${min} words · distinct answer per point`,
    challengePlaceholder: "2–4 sentences with suggested keywords…",
    submitChallenge: "Submit 3 points",
    validatingChallenge: "Validating…",
    certifiedEyebrow: (level) => `Certified · integrity level ${level}`,
    congrats: (name) => `Congratulations, ${name}`,
    validUntil: (date) => `ID · valid until ${date}`,
    deliverable:
      "Your free deliverable: verification page (shareable link, valid 90 days, renewable).",
    verifyPage: "Verification page",
    backAcademy: "Back to Academy",
    failTiming: "Insufficient time on track",
    failChallenge: "Practical validation needs correction",
    failGeneric: "Track not validated",
    quizScore: (score, total) => `Quiz score: ${score}/${total}`,
    retry: "Try again",
  },
  reasons: {
    invalid_session: "Session expired — restart the track.",
    session_expired: "Session expired — restart the track.",
    answer_too_fast:
      "Anti-automation: too many instant clicks. Take time to read each question (~20 s minimum for the whole quiz).",
    quiz_completed_too_fast:
      "Quiz completed too fast for real reading (~20 s minimum). Retry while reading each question.",
    score_too_low: "Insufficient quiz score (minimum 8/10).",
    challenge_too_fast:
      "Challenge submitted too soon — take time to write each point (2–4 sentences).",
    too_short: "Answer too short for this point.",
    incomplete_fields: "Complete all 3 points before submitting.",
    invalid_fields: "Invalid answer format — restart the track.",
    challenge_failed:
      "One or more points do not yet meet the criteria — see details below.",
    cert_delivery_failed:
      "Your answers are validated, but the certificate could not be issued. Retry shortly.",
    response_rejected: "Answer rejected (suspicious format or content).",
    session_already_used: "Session already used — start again from the beginning.",
    service_unavailable: "Service temporarily unavailable — try again shortly.",
  },
  errors: {
    network: "Connection failed. Check your network and try again.",
    sessionStart: "Could not start session.",
    nameMin: "Enter your full name (minimum 2 characters).",
    completeChallenge: "Complete all 3 points before submitting.",
    genericFail: (reason) => `Track not validated (${reason}).`,
    checkout: {
      server_error: "Server error. Try again shortly.",
      invalid_response: "Unexpected server response. Try again.",
      stripe_unconfigured: "Payment temporarily unavailable.",
      checkout_failed: "Could not create checkout session.",
      missing_cert: "Certificate not found. Start again from your certification page.",
      invalid_cert: "Invalid or expired certificate.",
      missing_organization: "Enter your organization name.",
      missing_email: "Enter a valid email address.",
      default: "Could not start payment. Try again.",
    },
  },
  diploma: {
    purchasedEyebrow: "PDF diploma",
    purchasedBody: "Permanent document — downloadable anytime.",
    downloadPdf: "Download PDF",
    upsellEyebrow: (price) => `PDF diploma — ${price} · one-time`,
    upsellBody:
      "Permanent document for CV or LinkedIn. Online certificate renews every 90 days — PDF lasts forever.",
    emailLabel: "Email (Stripe receipt)",
    emailPlaceholder: "you@company.com",
    checkout: (price) => `Get diploma — ${price}`,
    redirecting: "Redirecting to Stripe…",
  },
  institution: {
    eyebrow: (price) => `Institution certificate · ${price} · one-time`,
    title: "Permanent institution diploma",
    body: "Official AUROS Academy document for your organization (office, intranet, HR). One-time payment — certificate lasts forever.",
    orgLabel: "Organization name",
    orgPlaceholder: "Company / Institution",
    contactLabel: "HR / leadership contact",
    contactPlaceholder: "First Last",
    emailLabel: "Work email",
    emailPlaceholder: "hr@company.com",
    checkout: (price) => `Order — ${price}`,
    redirecting: "Redirecting to Stripe…",
  },
  mailto: {
    praticienSubject: "AUROS Academy Practitioner",
  },
  tierNames: {
    fundamentals: "RWA Fundamentals Certification",
    praticien: "RWA Practitioner Certification",
    entreprise: "Enterprise RWA Certification",
  },
  disclaimer:
    "Indicative AUROS Academy training — not approved by any state, AMF, or CSSF. Does not replace legal or regulatory advice. Valid 90 days — micro-renewal required.",
  gradeFeedback: {
    pass: "Validation passed — all 3 key points covered. Certificate issued.",
    fail: (labels) =>
      `Point(s) to complete: ${labels}. Re-read the hints under each question.`,
    incomplete: "Incomplete answers — expand each point with suggested keywords.",
    pasteBomb: "Answer rejected (suspicious format). Write your own short sentences.",
    duplicateFields:
      "Answers look identical — write distinct content for each point.",
  },
};

const es: AcademyCoreMessages = {
  header: {
    backToApp: "auros.app →",
    languageAria: "Idioma",
  },
  home: {
    eyebrow: "Formación · Certificado verificable",
    title: "AUROS Academy",
    intro:
      "Empiece por la certificación Fundamentos (gratuita). Los recorridos Practicante y equipo aún no están abiertos.",
    verifyTitle: "Verificar un certificado",
    verifyBody:
      "Cada certificado recibe un enlace único /academy/verify/… — compartible en LinkedIn, CV o data room.",
    startFree: "Empezar certificación gratuita →",
    viewProgram: "Ver programa →",
    scopeTitle: "Qué mide — y qué no mide — la certificación",
    scopeMeasures: [
      "Vocabulario RWA y orden de decisiones (jurisdicción → estructura → tech)",
      "Comprensión de data room, due diligence y límites regulatorios",
      "Capacidad de formular disclaimers AUROS (certificado indicativo)",
    ],
    scopeDoesNot: [
      "Experiencia emisor o inversor en un deal real",
      "Homologación AMF, CSSF o asesoramiento jurídico",
      "Nivel practicante o certificación de equipo (próximamente)",
    ],
    registryLink: "Ver registro público →",
  },
  tiers: {
    fundamentals: {
      price: "Gratis",
      name: "Certificación Fundamentos RWA",
      headline: "Bases de la tokenización de activos reales",
      description:
        "Quiz + 3 respuestas cortas guiadas — vocabulario RWA, data room, jurisdicciones. Certificado verificable 90 días. Diploma PDF opcional 39 €.",
      cta: "Obtener la certificación",
    },
    praticien: {
      price: "Lista de espera",
      name: "Certificación Practicante RWA",
      headline: "Recorrido emisor — casos por tipo de activo",
      description:
        "Inmobiliario, bonos, fondos — arbitraje de jurisdicción y checklist de emisión. Recorrido en preparación, aún no abierto.",
      cta: "Avísame al abrir",
    },
    entreprise: {
      price: "249 €",
      name: "Certificación Empresa",
      headline: "Equipos y organizaciones RWA",
      description:
        "Certificado de establecimiento PDF disponible. Recorrido equipo completo (licencias, registro, badges) aún no abierto.",
      cta: "Pedir certificado de establecimiento",
    },
  },
  praticien: {
    title: "Certificación Practicante RWA",
    intro:
      "Recorrido avanzado para emisores y profesionales: casos por activo, jurisdicción, checklist de emisión. Este recorrido aún no está abierto.",
    bullets: [
      "Inmobiliario, bonos, fondos, crédito privado",
      "Casos prácticos guiados",
      "Badge practicante verificable",
    ],
    notify: "Avísame al abrir →",
    back: "← AUROS Academy",
  },
  entreprise: {
    title: "Certificación Empresa",
    intro:
      "El certificado de establecimiento PDF está disponible. El recorrido equipo (licencias, registro público, badges) aún no está abierto.",
    teamNote: "Recorrido equipo: contáctenos para un presupuesto a medida.",
    back: "← AUROS Academy",
  },
  fundamentals: {
    introEyebrow: "Gratis · ~15 min · integridad nivel 2",
    title: "Certificación Fundamentos RWA",
    intro: (quizLen, passScore, validityDays) =>
      `${quizLen} preguntas aleatorias (respuestas nunca expuestas), luego 3 respuestas cortas guiadas con criterios visibles. Puntuación mínima ${passScore}/${quizLen}. Certificado nominal válido ${validityDays} días con micro-renovación.`,
    bullets: [
      "Lea cada pregunta — el quiz verifica tiempo de lectura, no trampas",
      "3 puntos clave RWA — 2–4 frases cada uno, validación automática",
      "Micro-renovación antes del vencimiento",
    ],
    nameLabel: "Nombre completo (en el certificado)",
    namePlaceholder: "Nombre Apellido",
    start: "Empezar el recorrido",
    preparing: "Preparando…",
    question: (current, total) => `Pregunta ${current} / ${total}`,
    readHint: "Tómese su tiempo — seleccione una respuesta y confirme.",
    nextQuestion: "Siguiente pregunta",
    validateQuiz: "Validar quiz",
    changeAnswer: "Cambiar mi respuesta",
    validatingQuiz: "Validando quiz…",
    challengeEyebrow: (score, total) => `Validación práctica · quiz ${score}/${total} validado`,
    pointLabel: (index, label) => `Punto ${index} — ${label}`,
    minTimeHint: (seconds) =>
      `~${seconds} s mínimo · criterios bajo cada pregunta`,
    minWordsHint: (min) => `Mínimo ${min} palabras · respuesta distinta por punto`,
    challengePlaceholder: "2–4 frases con palabras clave sugeridas…",
    submitChallenge: "Enviar los 3 puntos",
    validatingChallenge: "Validando…",
    certifiedEyebrow: (level) => `Certificado · integridad nivel ${level}`,
    congrats: (name) => `Enhorabuena, ${name}`,
    validUntil: (date) => `ID · válido hasta ${date}`,
    deliverable:
      "Entregable gratuito: página de verificación (enlace compartible, válido 90 días, renovable).",
    verifyPage: "Página de verificación",
    backAcademy: "Volver a Academy",
    failTiming: "Tiempo de recorrido insuficiente",
    failChallenge: "Validación práctica por corregir",
    failGeneric: "Recorrido no validado",
    quizScore: (score, total) => `Puntuación quiz: ${score}/${total}`,
    retry: "Reintentar",
  },
  reasons: {
    invalid_session: "Sesión expirada — reinicie el recorrido.",
    session_expired: "Sesión expirada — reinicie el recorrido.",
    answer_too_fast:
      "Anti-automatización: demasiados clics instantáneos. Tómese tiempo para leer (~20 s mínimo en todo el quiz).",
    quiz_completed_too_fast:
      "Quiz terminado demasiado rápido (~20 s mínimo). Reintente leyendo cada pregunta.",
    score_too_low: "Puntuación insuficiente (mínimo 8/10).",
    challenge_too_fast:
      "Desafío enviado demasiado pronto — redacte 2–4 frases por punto.",
    too_short: "Respuesta demasiado corta para este punto.",
    incomplete_fields: "Complete los 3 puntos antes de enviar.",
    invalid_fields: "Formato inválido — reinicie el recorrido.",
    challenge_failed:
      "Uno o más puntos no cumplen aún los criterios — vea el detalle abajo.",
    cert_delivery_failed:
      "Respuestas validadas, pero no se pudo emitir el certificado. Reintente en un momento.",
    response_rejected: "Respuesta rechazada (formato o contenido sospechoso).",
    session_already_used: "Sesión ya usada — empiece de nuevo.",
    service_unavailable: "Servicio temporalmente no disponible — reintente.",
  },
  errors: {
    network: "Conexión imposible. Compruebe su red e inténtelo de nuevo.",
    sessionStart: "No se pudo iniciar la sesión.",
    nameMin: "Indique su nombre completo (mínimo 2 caracteres).",
    completeChallenge: "Complete los 3 puntos antes de enviar.",
    genericFail: (reason) => `Recorrido no validado (${reason}).`,
    checkout: {
      server_error: "Error del servidor. Inténtelo en un momento.",
      invalid_response: "Respuesta inesperada del servidor. Inténtelo de nuevo.",
      stripe_unconfigured: "Pago temporalmente no disponible.",
      checkout_failed: "No se pudo crear la sesión de pago.",
      missing_cert: "Certificado no encontrado. Reinicie desde su página de certificación.",
      invalid_cert: "Certificado inválido o caducado.",
      missing_organization: "Indique el nombre de la organización.",
      missing_email: "Indique una dirección de email válida.",
      default: "No se pudo iniciar el pago. Inténtelo de nuevo.",
    },
  },
  diploma: {
    purchasedEyebrow: "Diploma PDF",
    purchasedBody: "Documento permanente — descargable en cualquier momento.",
    downloadPdf: "Descargar PDF",
    upsellEyebrow: (price) => `Diploma PDF — ${price} · una vez`,
    upsellBody:
      "Documento permanente para CV o LinkedIn. El certificado online se renueva cada 90 días — el PDF es para siempre.",
    emailLabel: "Email (recibo Stripe)",
    emailPlaceholder: "usted@empresa.com",
    checkout: (price) => `Obtener diploma — ${price}`,
    redirecting: "Redirigiendo a Stripe…",
  },
  institution: {
    eyebrow: (price) => `Certificado establecimiento · ${price} · una vez`,
    title: "Diploma institucional permanente",
    body: "Documento oficial AUROS Academy para su organización (oficina, intranet, RRHH). Pago único — certificado permanente.",
    orgLabel: "Nombre del establecimiento",
    orgPlaceholder: "Empresa / Institución",
    contactLabel: "Contacto RRHH / dirección",
    contactPlaceholder: "Nombre Apellido",
    emailLabel: "Email profesional",
    emailPlaceholder: "rrhh@empresa.com",
    checkout: (price) => `Pedir — ${price}`,
    redirecting: "Redirigiendo a Stripe…",
  },
  mailto: {
    praticienSubject: "AUROS Academy Practicante",
  },
  tierNames: {
    fundamentals: "Certificación Fundamentos RWA",
    praticien: "Certificación Practicante RWA",
    entreprise: "Certificación Empresa RWA",
  },
  disclaimer:
    "Formación indicativa AUROS Academy — no homologada por Estado, AMF ni CSSF. No sustituye asesoramiento jurídico o regulatorio. Validez 90 días — micro-recorrido de renovación requerido.",
  gradeFeedback: {
    pass: "Validación correcta — 3 puntos clave cubiertos. Certificado emitido.",
    fail: (labels) =>
      `Punto(s) por completar: ${labels}. Relea las pistas bajo cada pregunta.`,
    incomplete: "Respuestas incompletas — desarrolle cada punto con palabras clave.",
    pasteBomb: "Respuesta rechazada (formato sospechoso). Escriba sus propias frases.",
    duplicateFields:
      "Las respuestas parecen idénticas — redacte contenido distinto para cada punto.",
  },
};

const CATALOG: Record<AcademyLocale, AcademyCoreMessages> = { fr, en, es };

export function getAcademyMessages(locale: AcademyLocale): AcademyMessages {
  return { ...CATALOG[locale], ...getAcademyPageMessages(locale) };
}

export function academyQuizIntro(locale: AcademyLocale): string {
  const m = getAcademyMessages(locale);
  return m.fundamentals.intro(ACADEMY_QUIZ_LENGTH, ACADEMY_PASS_SCORE, CERT_VALIDITY_DAYS);
}

export function formatCertDate(
  locale: AcademyLocale,
  iso: string,
  style: "short" | "long" = "short"
): string {
  const tag = locale === "es" ? "es-ES" : locale === "en" ? "en-GB" : "fr-FR";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(
    tag,
    style === "long" ? { year: "numeric", month: "long", day: "numeric" } : undefined
  );
}

export function diplomaCheckoutErrorMessage(locale: AcademyLocale, error: string): string {
  const checkout = getAcademyMessages(locale).errors.checkout;
  return checkout[error] ?? checkout.default;
}
