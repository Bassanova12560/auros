import type { CertificateStatus } from "./types";
import type { AcademyLocale } from "./i18n";

export type AcademyPageMessages = {
  verify: {
    eyebrow: string;
    title: string;
    notFoundTitle: string;
    holder: string;
    certification: string;
    issuedOn: string;
    validUntil: string;
    integrity: string;
    integrityLevel: (level: number, curriculum: string, renewalGen: number) => string;
    scopeTitle: string;
    scopeBody: string;
    certId: string;
    expiresLegacy: string;
    renewCta: string;
    backLink: string;
    status: Record<CertificateStatus, string>;
  };
  registry: {
    eyebrow: string;
    title: string;
    intro: string;
    totalIssued: string;
    activeCount: string;
    institutionsTitle: string;
    institutionsEmpty: string;
    institutionsNote: string;
    privacyNote: string;
    statsUnavailable: string;
    backLink: string;
  };
  renewal: {
    loading: string;
    quizEyebrow: (current: number, total: number) => string;
    minTime: (seconds: number) => string;
    minWordsHint: (min: number) => string;
    submit: string;
    submitting: string;
    successTitle: string;
    successBody: (generation: number, expiry: string) => string;
    verifyCta: string;
    backLink: string;
    retry: string;
    unavailableTitle: string;
    notDueYet: string;
    unavailableGeneric: string;
    invalidLink: string;
    reasons: Record<string, string>;
  };
  diplomaSuccess: {
    eyebrow: string;
    titleReady: string;
    titlePending: string;
    bodyIndividual: (price: string) => string;
    bodyInstitution: (org: string, price: string) => string;
    downloadPdf: string;
    verifyNote: string;
    registryLink: string;
    backLink: string;
    missingSession: string;
    paymentPending: string;
    confirmFailed: string;
  };
  reminder: {
    optionalEyebrow: string;
    optionalBody: string;
    emailLabel: string;
    emailPlaceholder: string;
    consent: string;
    activate: string;
    activating: string;
    done: string;
    errorOptIn: string;
    errorEmail: string;
    errorInvalidEmail: string;
    errorGeneric: string;
    errorNetwork: string;
  };
  unsubscribe: {
    titleSuccess: string;
    bodySuccess: string;
    titleInvalid: string;
    bodyInvalid: string;
    backLink: string;
  };
};

const fr: AcademyPageMessages = {
  verify: {
    eyebrow: "AUROS Academy · Vérification",
    title: "Attestation authentique",
    notFoundTitle: "Attestation introuvable",
    holder: "Titulaire",
    certification: "Certification",
    issuedOn: "Délivré le",
    validUntil: "Valide jusqu'au",
    integrity: "Intégrité",
    integrityLevel: (level, curriculum, renewalGen) =>
      `Niveau ${level}${curriculum ? ` · programme ${curriculum}` : ""}${renewalGen > 0 ? ` · renouvellement #${renewalGen}` : ""}`,
    scopeTitle: "Périmètre certifié",
    scopeBody:
      "Niveau 2 = maîtrise des fondamentaux RWA (vocabulaire, phase 0, data room, disclaimers). Ne certifie pas l'expertise émetteur ni un agrément régulateur.",
    certId: "ID attestation",
    expiresLegacy: "Non renseignée (legacy)",
    renewCta: "Renouveler (micro-parcours)",
    backLink: "AUROS Academy →",
    status: {
      active: "Active",
      expired: "Expirée — renouvellement requis",
      renewal_due: "Renouvellement recommandé (≤ 14 jours)",
    },
  },
  renewal: {
    loading: "Chargement du micro-parcours…",
    quizEyebrow: (c, t) => `Micro-màj · question ${c} / ${t}`,
    minTime: (s) => `~${s} s minimum`,
    minWordsHint: (min) => `Minimum ${min} mots · réponse en 2–4 phrases`,
    submit: "Renouveler l'attestation",
    submitting: "Validation…",
    successTitle: "Attestation renouvelée",
    successBody: (gen, exp) => `Génération ${gen} — valide jusqu'au ${exp}`,
    verifyCta: "Vérifier",
    backLink: "Academy →",
    retry: "Recommencer le micro-parcours",
    unavailableTitle: "Renouvellement indisponible",
    notDueYet:
      "Votre attestation est encore active — revenez dans les 14 jours avant expiration.",
    unavailableGeneric: "Impossible de renouveler cette attestation.",
    invalidLink: "Lien de renouvellement invalide — ouvrez depuis votre page de vérification.",
    reasons: {
      renewal_quiz_failed: "Réponses incorrectes au micro-quiz.",
      challenge_failed: "Réponse courte à corriger — relisez les critères.",
      challenge_too_fast: "Réponse envoyée trop vite — rédigez 2–4 phrases.",
      session_expired: "Session expirée — recommencez.",
      invalid_renewal_session: "Session de renouvellement invalide.",
      invalid_certificate: "Attestation invalide ou expirée.",
      session_already_used: "Session déjà utilisée — recommencez.",
      service_unavailable: "Service temporairement indisponible.",
    },
  },
  diplomaSuccess: {
    eyebrow: "AUROS Academy · Diplôme",
    titleReady: "Merci — votre diplôme est prêt",
    titlePending: "Confirmation en cours",
    bodyIndividual: (price) => `Diplôme Fondamentaux RWA · ${price} · document permanent`,
    bodyInstitution: (org, price) =>
      `Certificat établissement · ${org} · ${price} · document permanent`,
    downloadPdf: "Télécharger le PDF",
    verifyNote:
      "Votre page de vérification en ligne reste inchangée — partagez le même lien /academy/verify/…",
    registryLink: "Voir le registre public →",
    backLink: "← AUROS Academy",
    missingSession: "Session de paiement introuvable.",
    paymentPending: "Paiement en cours de validation… Actualisez dans quelques secondes.",
    confirmFailed: "Impossible de confirmer le paiement.",
  },
  reminder: {
    optionalEyebrow: "Plus pour vous · optionnel",
    optionalBody:
      "Recevoir un rappel amical avant que le statut passe à « renouvellement recommandé ». Aucune obligation de renouveler — votre lien verify reste actif.",
    emailLabel: "E-mail",
    emailPlaceholder: "vous@entreprise.com",
    consent:
      "J'accepte de recevoir au plus 2 rappels AUROS Academy (micro-màj optionnelle). Pas de spam, pas d'obligation.",
    activate: "Activer les rappels amicaux",
    activating: "Activation…",
    done: "Rappels amicaux activés — au plus 2 e-mails optionnels (~14 j et ~3 j avant expiration). Désinscription en un clic dans chaque message.",
    errorOptIn: "Cochez la case pour activer les rappels optionnels.",
    errorEmail: "Indiquez une adresse e-mail valide.",
    errorInvalidEmail: "E-mail invalide.",
    errorGeneric: "Impossible d'activer les rappels pour le moment.",
    errorNetwork: "Erreur réseau.",
  },
  unsubscribe: {
    titleSuccess: "Rappels désactivés",
    bodySuccess:
      "Vous ne recevrez plus d'e-mails de rappel AUROS Academy pour cette attestation. Votre page verify reste accessible — le renouvellement reste optionnel.",
    titleInvalid: "Lien invalide",
    bodyInvalid: "Ce lien de désinscription est invalide ou déjà utilisé.",
    backLink: "AUROS Academy →",
  },
  registry: {
    eyebrow: "AUROS Academy · Registre",
    title: "Registre public",
    intro:
      "Statistiques agrégées et établissements ayant commandé un certificat institution. Aucun nom personnel publié — conformité RGPD.",
    totalIssued: "Attestations délivrées",
    activeCount: "Attestations actives",
    institutionsTitle: "Établissements certifiés (PDF institution)",
    institutionsEmpty: "Aucun établissement publié pour le moment.",
    institutionsNote:
      "Liste limitée aux organisations ayant acheté le certificat établissement AUROS Academy.",
    privacyNote:
      "Les titulaires individuels ne sont pas listés publiquement — seule la page /verify/… partagée par le certifié fait foi.",
    statsUnavailable:
      "Statistiques en cours d'initialisation — les compteurs se rempliront au fil des certifications.",
    backLink: "← AUROS Academy",
  },
};

const en: AcademyPageMessages = {
  verify: {
    eyebrow: "AUROS Academy · Verification",
    title: "Authentic certificate",
    notFoundTitle: "Certificate not found",
    holder: "Holder",
    certification: "Certification",
    issuedOn: "Issued on",
    validUntil: "Valid until",
    integrity: "Integrity",
    integrityLevel: (level, curriculum, renewalGen) =>
      `Level ${level}${curriculum ? ` · curriculum ${curriculum}` : ""}${renewalGen > 0 ? ` · renewal #${renewalGen}` : ""}`,
    scopeTitle: "Certified scope",
    scopeBody:
      "Level 2 = RWA fundamentals literacy (vocabulary, phase 0, data room, disclaimers). Does not certify issuer expertise or regulatory approval.",
    certId: "Certificate ID",
    expiresLegacy: "Not set (legacy)",
    renewCta: "Renew (micro-track)",
    backLink: "AUROS Academy →",
    status: {
      active: "Active",
      expired: "Expired — renewal required",
      renewal_due: "Renewal recommended (≤ 14 days)",
    },
  },
  renewal: {
    loading: "Loading micro-track…",
    quizEyebrow: (c, t) => `Micro-update · question ${c} / ${t}`,
    minTime: (s) => `~${s} s minimum`,
    minWordsHint: (min) => `Minimum ${min} words · 2–4 sentence answer`,
    submit: "Renew certificate",
    submitting: "Validating…",
    successTitle: "Certificate renewed",
    successBody: (gen, exp) => `Generation ${gen} — valid until ${exp}`,
    verifyCta: "Verify",
    backLink: "Academy →",
    retry: "Restart micro-track",
    unavailableTitle: "Renewal unavailable",
    notDueYet: "Your certificate is still active — return within 14 days of expiry.",
    unavailableGeneric: "Unable to renew this certificate.",
    invalidLink: "Invalid renewal link — open from your verification page.",
    reasons: {
      renewal_quiz_failed: "Incorrect micro-quiz answers.",
      challenge_failed: "Short answer needs correction — re-read criteria.",
      challenge_too_fast: "Answer submitted too fast — write 2–4 sentences.",
      session_expired: "Session expired — start again.",
      invalid_renewal_session: "Invalid renewal session.",
      invalid_certificate: "Invalid or expired certificate.",
      session_already_used: "Session already used — start again.",
      service_unavailable: "Service temporarily unavailable.",
    },
  },
  diplomaSuccess: {
    eyebrow: "AUROS Academy · Diploma",
    titleReady: "Thank you — your diploma is ready",
    titlePending: "Confirming payment",
    bodyIndividual: (price) => `Fundamentals RWA diploma · ${price} · permanent document`,
    bodyInstitution: (org, price) =>
      `Institution certificate · ${org} · ${price} · permanent document`,
    downloadPdf: "Download PDF",
    verifyNote:
      "Your online verification page is unchanged — share the same /academy/verify/… link",
    registryLink: "View public registry →",
    backLink: "← AUROS Academy",
    missingSession: "Payment session not found.",
    paymentPending: "Payment validating… Refresh in a few seconds.",
    confirmFailed: "Could not confirm payment.",
  },
  reminder: {
    optionalEyebrow: "Optional · for you",
    optionalBody:
      "Get a friendly reminder before status becomes « renewal recommended ». No obligation to renew — your verify link stays active.",
    emailLabel: "Email",
    emailPlaceholder: "you@company.com",
    consent:
      "I agree to receive at most 2 AUROS Academy reminders (optional micro-update). No spam, no obligation.",
    activate: "Enable friendly reminders",
    activating: "Enabling…",
    done: "Reminders enabled — at most 2 optional emails (~14 d and ~3 d before expiry). One-click unsubscribe in each message.",
    errorOptIn: "Check the box to enable optional reminders.",
    errorEmail: "Enter a valid email address.",
    errorInvalidEmail: "Invalid email.",
    errorGeneric: "Could not enable reminders right now.",
    errorNetwork: "Network error.",
  },
  unsubscribe: {
    titleSuccess: "Reminders disabled",
    bodySuccess:
      "You will no longer receive AUROS Academy reminder emails for this certificate. Your verify page stays accessible — renewal remains optional.",
    titleInvalid: "Invalid link",
    bodyInvalid: "This unsubscribe link is invalid or already used.",
    backLink: "AUROS Academy →",
  },
  registry: {
    eyebrow: "AUROS Academy · Registry",
    title: "Public registry",
    intro:
      "Aggregate stats and institutions that ordered an institution certificate. No personal names published — GDPR compliant.",
    totalIssued: "Certificates issued",
    activeCount: "Active certificates",
    institutionsTitle: "Certified institutions (institution PDF)",
    institutionsEmpty: "No institutions published yet.",
    institutionsNote:
      "List limited to organizations that purchased the AUROS Academy institution certificate.",
    privacyNote:
      "Individual holders are not listed publicly — only the /verify/… page shared by the holder is authoritative.",
    statsUnavailable:
      "Statistics initializing — counters will fill as certifications are issued.",
    backLink: "← AUROS Academy",
  },
};

const es: AcademyPageMessages = {
  verify: {
    eyebrow: "AUROS Academy · Verificación",
    title: "Certificado auténtico",
    notFoundTitle: "Certificado no encontrado",
    holder: "Titular",
    certification: "Certificación",
    issuedOn: "Emitido el",
    validUntil: "Válido hasta",
    integrity: "Integridad",
    integrityLevel: (level, curriculum, renewalGen) =>
      `Nivel ${level}${curriculum ? ` · programa ${curriculum}` : ""}${renewalGen > 0 ? ` · renovación #${renewalGen}` : ""}`,
    scopeTitle: "Alcance certificado",
    scopeBody:
      "Nivel 2 = dominio de fundamentos RWA (vocabulario, fase 0, data room, disclaimers). No certifica experiencia emisor ni homologación regulatoria.",
    certId: "ID certificado",
    expiresLegacy: "No indicada (legacy)",
    renewCta: "Renovar (micro-recorrido)",
    backLink: "AUROS Academy →",
    status: {
      active: "Activo",
      expired: "Expirado — renovación requerida",
      renewal_due: "Renovación recomendada (≤ 14 días)",
    },
  },
  renewal: {
    loading: "Cargando micro-recorrido…",
    quizEyebrow: (c, t) => `Micro-actualización · pregunta ${c} / ${t}`,
    minTime: (s) => `~${s} s mínimo`,
    minWordsHint: (min) => `Mínimo ${min} palabras · respuesta en 2–4 frases`,
    submit: "Renovar certificado",
    submitting: "Validando…",
    successTitle: "Certificado renovado",
    successBody: (gen, exp) => `Generación ${gen} — válido hasta ${exp}`,
    verifyCta: "Verificar",
    backLink: "Academy →",
    retry: "Reiniciar micro-recorrido",
    unavailableTitle: "Renovación no disponible",
    notDueYet: "Su certificado sigue activo — vuelva en los 14 días previos al vencimiento.",
    unavailableGeneric: "No se puede renovar este certificado.",
    invalidLink: "Enlace de renovación inválido — ábralo desde su página de verificación.",
    reasons: {
      renewal_quiz_failed: "Respuestas incorrectas en el micro-quiz.",
      challenge_failed: "Respuesta corta por corregir — relea los criterios.",
      challenge_too_fast: "Respuesta enviada demasiado pronto — redacte 2–4 frases.",
      session_expired: "Sesión expirada — reinicie.",
      invalid_renewal_session: "Sesión de renovación inválida.",
      invalid_certificate: "Certificado inválido o caducado.",
      session_already_used: "Sesión ya utilizada — reinicie.",
      service_unavailable: "Servicio temporalmente no disponible.",
    },
  },
  diplomaSuccess: {
    eyebrow: "AUROS Academy · Diploma",
    titleReady: "Gracias — su diploma está listo",
    titlePending: "Confirmando pago",
    bodyIndividual: (price) => `Diploma Fundamentos RWA · ${price} · documento permanente`,
    bodyInstitution: (org, price) =>
      `Certificado establecimiento · ${org} · ${price} · documento permanente`,
    downloadPdf: "Descargar PDF",
    verifyNote:
      "Su página de verificación online no cambia — comparta el mismo enlace /academy/verify/…",
    registryLink: "Ver registro público →",
    backLink: "← AUROS Academy",
    missingSession: "Sesión de pago no encontrada.",
    paymentPending: "Validando pago… Actualice en unos segundos.",
    confirmFailed: "No se pudo confirmar el pago.",
  },
  reminder: {
    optionalEyebrow: "Opcional · para usted",
    optionalBody:
      "Recibir un recordatorio amable antes de que el estado pase a « renovación recomendada ». Sin obligación de renovar — su enlace verify sigue activo.",
    emailLabel: "Email",
    emailPlaceholder: "usted@empresa.com",
    consent:
      "Acepto recibir como máximo 2 recordatorios AUROS Academy (micro-actualización opcional). Sin spam, sin obligación.",
    activate: "Activar recordatorios",
    activating: "Activando…",
    done: "Recordatorios activados — como máximo 2 emails opcionales (~14 d y ~3 d antes del vencimiento). Baja en un clic en cada mensaje.",
    errorOptIn: "Marque la casilla para activar recordatorios opcionales.",
    errorEmail: "Indique un email válido.",
    errorInvalidEmail: "Email inválido.",
    errorGeneric: "No se pudieron activar los recordatorios.",
    errorNetwork: "Error de red.",
  },
  unsubscribe: {
    titleSuccess: "Recordatorios desactivados",
    bodySuccess:
      "Ya no recibirá emails de recordatorio AUROS Academy para este certificado. Su página verify sigue accesible — la renovación sigue siendo opcional.",
    titleInvalid: "Enlace inválido",
    bodyInvalid: "Este enlace de baja es inválido o ya fue utilizado.",
    backLink: "AUROS Academy →",
  },
  registry: {
    eyebrow: "AUROS Academy · Registro",
    title: "Registro público",
    intro:
      "Estadísticas agregadas y establecimientos que pidieron certificado institucional. Sin nombres personales — conforme RGPD.",
    totalIssued: "Certificados emitidos",
    activeCount: "Certificados activos",
    institutionsTitle: "Establecimientos certificados (PDF institución)",
    institutionsEmpty: "Ningún establecimiento publicado por ahora.",
    institutionsNote:
      "Lista limitada a organizaciones que compraron el certificado de establecimiento AUROS Academy.",
    privacyNote:
      "Los titulares individuales no se listan públicamente — solo la página /verify/… compartida por el titular hace fe.",
    statsUnavailable:
      "Estadísticas en inicialización — los contadores se llenarán con las certificaciones.",
    backLink: "← AUROS Academy",
  },
};

const PAGE_CATALOG: Record<AcademyLocale, AcademyPageMessages> = { fr, en, es };

export function getAcademyPageMessages(locale: AcademyLocale): AcademyPageMessages {
  return PAGE_CATALOG[locale] ?? PAGE_CATALOG.fr;
}
