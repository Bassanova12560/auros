import type { Locale } from "@/lib/i18n";

export type DossierMessages = {
  eyebrow: string;
  authBanner: string;
  authLink: string;
  authRest: string;
  yourAsset: string;
  noDescription: string;
  sections: {
    description: string;
    valuation: string;
    documentation: string;
    timeline: string;
    objectives: string;
    compliance: string;
  };
  quality: {
    title: string;
    complete: string;
    improve: string;
    badges: Record<string, string>;
    items: Record<string, { label: string; tip: string }>;
  };
  admission: {
    title: string;
    subtitle: string;
    dataRoom: string;
    compliance: string;
    profile: string;
    nextActions: string;
    admissionLabel: string;
    requirements: string;
    missing: string;
  };
  dataRoom: {
    title: string;
    subtitle: string;
    upload: {
      hint: string;
      addFile: string;
      uploading: string;
      remove: string;
      signIn: string;
      errorType: string;
      errorSize: string;
      errorStorage: string;
      errorGeneric: string;
    };
  };
  status: {
    draft: string;
    generated: string;
    submitted: string;
    in_review: string;
    needs_info: string;
    approved: string;
  };
  exportPack: {
    button: string;
    generating: string;
    filename: string;
  };
  ai: {
    generating: string;
    generatingHint: string;
    disclaimer: string;
    retry: string;
    rateLimit: string;
    fallbackNotice: string;
    sections: Record<string, string>;
  };
  errors: {
    loadNotFound: string;
    loadFailed: string;
  };
  pdf: {
    generating: string;
    retry: string;
    download: string;
  };
  submit: string;
  submitSubmitting: string;
  submitDone: string;
  submitError: string;
  submitNoId: string;
  loading: string;
  pdfNote: string;
  nextSteps: {
    title: string;
    subtitle: string;
    stepRead: string;
    stepPdf: string;
    stepAccount: string;
    stepSubmit: string;
    waitAi: string;
    accountCta: string;
    pdfCta: string;
    submitCta: string;
    footer: string;
  };
  collapsible: {
    detailsTitle: string;
    detailsSubtitle: string;
    analysisTitle: string;
    analysisSubtitle: string;
    studioTitle: string;
    studioSubtitle: string;
    extrasTitle: string;
    extrasSubtitle: string;
  };
  editWizard: string;
  empty: { title: string; body: string; cta: string };
  authModal: {
    title: string;
    body: string;
    signUp: string;
    signIn: string;
    continue: string;
  };
  saveBanner: {
    title: string;
    body: string;
    cta: string;
  };
  compliance: {
    mica: string;
    kyc: string;
    smartContract: string;
    eligible: string;
    pending: string;
    erc: string;
    reviewRequired: string;
    policyReady: string;
    blueprintOnly: string;
    aligned: string;
  };
  learnMore: string;
  shared: {
    expiredTitle: string;
    expiredBody: string;
    expiredCta: string;
    incomplete: string;
    incompleteCta: string;
    banner: string;
    bannerCta: string;
    badge: string;
    evaluateCta: string;
  };
  share: {
    title: string;
    scoreTitle: string;
    scoreDesc: string;
    scoreCta: string;
    dossierTitle: string;
    dossierDesc: string;
    dossierCta: string;
    copied: string;
    error: string;
  };
};

const FR: DossierMessages = {
  eyebrow: "Dossier RWA",
  authBanner:
    "pour enregistrer ce dossier, télécharger le PDF et envoyer votre demande à l'équipe AUROS.",
  authLink: "Créer un compte gratuit",
  authRest: "",
  yourAsset: "Votre actif",
  noDescription: "Aucune description fournie.",
  sections: {
    description: "Description de l'actif",
    valuation: "Valorisation estimée",
    documentation: "Documentation",
    timeline: "Calendrier",
    objectives: "Objectifs",
    compliance: "Statut de conformité",
  },
  quality: {
    title: "Complétude du rapport",
    complete: "Votre dossier est complet.",
    improve: "Améliorer dans le wizard",
    badges: {
      strong: "Documentation solide",
      good: "Bon niveau de préparation",
      needs: "À compléter",
    },
    items: {
      description: {
        label: "Description de l'actif",
        tip: "Ajoutez plus de détails à la description",
      },
      valuation: { label: "Valeur estimée", tip: "La valeur est requise" },
      location: { label: "Localisation", tip: "Ajoutez ville et pays" },
      documents_basic: {
        label: "Documentation de base",
        tip: "Indiquez au moins un document",
      },
      documents_strong: {
        label: "Documentation renforcée",
        tip: "Ajoutez davantage de pièces justificatives",
      },
      expert_valuation: {
        label: "Expertise / évaluation",
        tip: "Ajoutez un rapport d'évaluation professionnel",
      },
      insurance: {
        label: "Assurance",
        tip: "Ajoutez une attestation d'assurance",
      },
      contact: { label: "Coordonnées", tip: "Ajoutez prénom et e-mail" },
    },
  },
  admission: {
    title: "Maturité du dossier",
    subtitle:
      "Indicateur indicatif de préparation (data room, conformité, structure) — sans recommandation de place tierce.",
    dataRoom: "Data room (15 docs)",
    compliance: "Conformité & structure",
    profile: "Profil dossier",
    nextActions: "Actions prioritaires",
    admissionLabel: "préparation",
    requirements: "Exigences",
    missing: "Manquants",
  },
  dataRoom: {
    title: "Data room — 5 phases",
    subtitle:
      "Package de due diligence standard pour la tokenisation (preuve, juridique, jeton, investisseurs, opérations).",
    upload: {
      hint: "Pièces pour : {doc}",
      addFile: "+ Fichier",
      uploading: "Envoi…",
      remove: "Suppr.",
      signIn: "Connectez-vous et sauvegardez le dossier pour déposer des fichiers.",
      errorType: "Format non accepté (PDF, images, DOCX).",
      errorSize: "Fichier trop volumineux (max 10 Mo).",
      errorStorage:
        "Stockage indisponible — créez le bucket « dossier-files » dans Supabase.",
      errorGeneric: "Échec de l'envoi.",
    },
  },
  status: {
    draft: "Brouillon",
    generated: "Généré",
    submitted: "Demande envoyée",
    in_review: "En revue AUROS",
    needs_info: "Compléments demandés",
    approved: "Validé pour plateforme",
  },
  exportPack: {
    button: "Exporter le pack juridique (.md)",
    generating: "Export…",
    filename: "auros-pack-juridique.md",
  },
  ai: {
    generating: "Génération des sections IA…",
    generatingHint: "Environ 20 à 40 secondes — ne fermez pas l'onglet.",
    disclaimer:
      "Ce rapport est généré par l'IA à titre informatif uniquement. AUROS ne fournit pas de conseil juridique, financier ou en investissement.",
    retry: "Réessayer",
    rateLimit:
      "Limite atteinte pour aujourd'hui. Réessayez demain ou connectez-vous pour plus de générations.",
    fallbackNotice:
      "Synthèse indicative (secours) — régénérez plus tard pour une analyse IA complète.",
    sections: {
      legalDescription: "Description juridique",
      valuation: "Analyse de valorisation",
      dueDiligence: "Due diligence",
      kycPreFilled: "Synthèse KYC",
      micaCompliance: "Conformité MiCA",
      smartContract: "Paramètres smart contract",
    },
  },
  pdf: {
    generating: "Génération du PDF…",
    retry: "Réessayer · Télécharger le PDF",
    download: "Télécharger le PDF",
  },
  submit: "Envoyer ma demande à l'équipe AUROS",
  submitSubmitting: "Envoi de la demande…",
  submitDone: "Demande enregistrée — notre équipe vous recontacte sous 48h.",
  submitError: "Échec de la soumission. Réessayez.",
  submitNoId: "Créez un compte gratuit pour envoyer votre demande.",
  loading: "Chargement…",
  pdfNote:
    "PDF et demande de revue : compte gratuit recommandé (sauvegarde cloud + suivi).",
  nextSteps: {
    title: "Votre parcours",
    subtitle:
      "Quatre étapes simples — vous gardez la main. Le détail du rapport reste disponible plus bas.",
    stepRead: "Lire le résumé (score et admission)",
    stepPdf: "Télécharger le PDF de votre dossier",
    stepAccount: "Créer un compte (sauvegarde + suivi)",
    stepSubmit: "Envoyer la demande à l'équipe AUROS",
    waitAi: "Génération du contenu en cours…",
    accountCta: "Créer un compte gratuit →",
    pdfCta: "Aller au téléchargement →",
    submitCta: "Envoyer ma demande →",
    footer:
      "AUROS structure votre dossier — notre équipe vous répond sous 48 h pour la suite (sans place tierce imposée).",
  },
  collapsible: {
    detailsTitle: "Détail de votre dossier",
    detailsSubtitle: "Description, valorisation, objectifs, calendrier",
    analysisTitle: "Analyse IA",
    analysisSubtitle: "Textes indicatifs — à valider avec un professionnel",
    studioTitle: "Studio tokenisation",
    studioSubtitle: "Feuille de route et documents types",
    extrasTitle: "Compléter & partager",
    extrasSubtitle: "Data room, conformité, concierge, lien de partage",
  },
  editWizard: "← Modifier dans le wizard",
  empty: {
    title: "Aucun dossier trouvé",
    body: "Complétez le wizard pour générer votre rapport de tokenisation.",
    cta: "Lancer le wizard →",
  },
  authModal: {
    title: "Connexion requise",
    body: "Créez un compte gratuit pour télécharger le PDF ou envoyer votre demande à AUROS.",
    signUp: "Créer un compte",
    signIn: "Se connecter",
    continue: "Continuer sans compte",
  },
  saveBanner: {
    title: "Sauvegardez votre dossier",
    body: "Sans compte, vos données restent sur cet appareil uniquement. Créez un compte gratuit pour PDF, partage et demande de revue.",
    cta: "Créer un compte gratuit →",
  },
  compliance: {
    mica: "MiCA Europe",
    kyc: "KYC requis",
    smartContract: "Smart contract",
    eligible: "Éligible",
    pending: "En attente",
    erc: "Compatible ERC-3643",
    aligned: "Aligné (indicatif)",
    reviewRequired: "Revue juridique requise",
    policyReady: "Politique KYC prête",
    blueprintOnly: "Blueprint seulement",
  },
  errors: {
    loadNotFound: "Dossier introuvable ou accès refusé.",
    loadFailed: "Impossible de charger le dossier. Réessayez.",
  },
  learnMore: "En savoir plus →",
  shared: {
    expiredTitle: "Ce lien de partage a expiré.",
    expiredBody: "Les liens sont valides 30 jours.",
    expiredCta: "Créer un nouveau dossier →",
    incomplete: "Dossier introuvable ou incomplet.",
    incompleteCta: "Créer le vôtre →",
    banner: "Dossier partagé via AUROS — lecture seule.",
    bannerCta: "Créer le vôtre →",
    badge: "partagé",
    evaluateCta: "Évaluer mon actif avec AUROS",
  },
  share: {
    title: "Partager vos résultats",
    scoreTitle: "Partager le score",
    scoreDesc:
      "Lien public avec score et type d'actif uniquement — aucune donnée personnelle.",
    scoreCta: "Copier le lien score",
    dossierTitle: "Partager le dossier",
    dossierDesc: "Le destinataire verra votre rapport complet.",
    dossierCta: "Copier le lien dossier",
    copied: "Copié",
    error: "Impossible de créer le lien. Réessayez.",
  },
};

const EN: DossierMessages = {
  eyebrow: "RWA dossier",
  authBanner: "to save this dossier, download the PDF, and send your request to AUROS.",
  authLink: "Create a free account",
  authRest: "",
  yourAsset: "Your asset",
  noDescription: "No description provided.",
  sections: {
    description: "Asset description",
    valuation: "Estimated valuation",
    documentation: "Documentation",
    timeline: "Timeline",
    objectives: "Objectives",
    compliance: "Compliance status",
  },
  quality: {
    title: "Report completeness",
    complete: "Your dossier is complete.",
    improve: "Improve in wizard",
    badges: {
      strong: "Strong documentation",
      good: "Good preparation level",
      needs: "Needs completion",
    },
    items: {
      description: {
        label: "Asset description",
        tip: "Add more detail to your description",
      },
      valuation: { label: "Estimated value", tip: "Value is required" },
      location: { label: "Location", tip: "Add city and country" },
      documents_basic: {
        label: "Basic documentation",
        tip: "Upload at least one document",
      },
      documents_strong: {
        label: "Strong documentation",
        tip: "Add more supporting documents",
      },
      expert_valuation: {
        label: "Expert valuation",
        tip: "Add a professional valuation report",
      },
      insurance: { label: "Insurance", tip: "Add an insurance certificate" },
      contact: { label: "Contact details", tip: "Add first name and email" },
    },
  },
  admission: {
    title: "Dossier readiness",
    subtitle:
      "Indicative preparation score (data room, compliance, structure) — not a third-party listing recommendation.",
    dataRoom: "Data room (15 docs)",
    compliance: "Compliance & structure",
    profile: "Dossier profile",
    nextActions: "Priority actions",
    admissionLabel: "readiness",
    requirements: "Requirements",
    missing: "Missing",
  },
  dataRoom: {
    title: "Data room — 5 phases",
    subtitle:
      "Standard due diligence package for tokenization (proof, legal, token, investors, operations).",
    upload: {
      hint: "Files for: {doc}",
      addFile: "+ File",
      uploading: "Uploading…",
      remove: "Remove",
      signIn: "Sign in and save your dossier to upload files.",
      errorType: "File type not allowed (PDF, images, DOCX).",
      errorSize: "File too large (max 10 MB).",
      errorStorage:
        "Storage unavailable — create the « dossier-files » bucket in Supabase.",
      errorGeneric: "Upload failed.",
    },
  },
  status: {
    draft: "Draft",
    generated: "Generated",
    submitted: "Request sent",
    in_review: "Under AUROS review",
    needs_info: "More info needed",
    approved: "Cleared for platform",
  },
  exportPack: {
    button: "Export legal pack (.md)",
    generating: "Exporting…",
    filename: "auros-legal-pack.md",
  },
  ai: {
    generating: "Generating AI sections…",
    generatingHint: "About 20–40 seconds — please keep this tab open.",
    disclaimer:
      "This report is generated by AI for informational purposes only. AUROS does not provide legal, financial, or investment advice.",
    retry: "Retry",
    rateLimit:
      "Daily generation limit reached. Try again tomorrow or sign in for more.",
    fallbackNotice:
      "Indicative summary (fallback) — regenerate later for a full AI analysis.",
    sections: {
      legalDescription: "Legal description",
      valuation: "Valuation analysis",
      dueDiligence: "Due diligence",
      kycPreFilled: "KYC summary",
      micaCompliance: "MiCA compliance",
      smartContract: "Smart contract parameters",
    },
  },
  pdf: {
    generating: "Generating PDF…",
    retry: "Retry · Download PDF",
    download: "Download PDF",
  },
  submit: "Send my request to the AUROS team",
  submitSubmitting: "Sending request…",
  submitDone: "Request saved — our team will follow up within 48h.",
  submitError: "Submission failed. Try again.",
  submitNoId: "Create a free account to send your request.",
  loading: "Loading…",
  pdfNote:
    "PDF and review request: free account recommended (cloud save + follow-up).",
  nextSteps: {
    title: "Your journey",
    subtitle:
      "Four simple steps — you stay in control. Full report details remain below.",
    stepRead: "Read the summary (score & admission)",
    stepPdf: "Download your dossier PDF",
    stepAccount: "Create an account (save & track)",
    stepSubmit: "Send your request to the AUROS team",
    waitAi: "Generating content…",
    accountCta: "Create free account →",
    pdfCta: "Go to download →",
    submitCta: "Send my request →",
    footer:
      "AUROS structures your dossier — our team replies within 48h on next steps (no third-party venue pushed).",
  },
  collapsible: {
    detailsTitle: "Dossier details",
    detailsSubtitle: "Description, valuation, goals, timeline",
    analysisTitle: "AI analysis",
    analysisSubtitle: "Indicative copy — validate with professionals",
    studioTitle: "Tokenization studio",
    studioSubtitle: "Roadmap and document templates",
    extrasTitle: "Complete & share",
    extrasSubtitle: "Data room, compliance, concierge, share link",
  },
  editWizard: "← Edit in wizard",
  empty: {
    title: "No dossier found",
    body: "Complete the wizard to generate your tokenization report.",
    cta: "Start wizard →",
  },
  authModal: {
    title: "Sign in required",
    body: "Create a free account to download your PDF or send your request to AUROS.",
    signUp: "Sign up",
    signIn: "Sign in",
    continue: "Continue without account",
  },
  saveBanner: {
    title: "Save your dossier",
    body: "Without an account, data stays on this device only. Create a free account for PDF, sharing, and AUROS review requests.",
    cta: "Create free account →",
  },
  compliance: {
    mica: "MiCA Europe",
    kyc: "KYC required",
    smartContract: "Smart contract",
    eligible: "Eligible",
    pending: "Pending",
    erc: "ERC-3643 compatible",
    aligned: "Aligned (indicative)",
    reviewRequired: "Legal review required",
    policyReady: "KYC policy ready",
    blueprintOnly: "Blueprint only",
  },
  errors: {
    loadNotFound: "Dossier not found or access denied.",
    loadFailed: "Could not load dossier. Please try again.",
  },
  learnMore: "Learn more →",
  shared: {
    expiredTitle: "This share link has expired.",
    expiredBody: "Links are valid for 30 days.",
    expiredCta: "Create a new dossier →",
    incomplete: "Dossier not found or incomplete.",
    incompleteCta: "Create yours →",
    banner: "Dossier shared via AUROS — read only.",
    bannerCta: "Create yours →",
    badge: "shared",
    evaluateCta: "Evaluate my asset with AUROS",
  },
  share: {
    title: "Share your results",
    scoreTitle: "Share score",
    scoreDesc: "Public link with score and asset type only — no personal data.",
    scoreCta: "Copy score link",
    dossierTitle: "Share dossier link",
    dossierDesc: "Recipients will see your full report.",
    dossierCta: "Copy dossier link",
    copied: "Copied",
    error: "Could not create link. Try again.",
  },
};

const ES: DossierMessages = {
  ...EN,
  submit: "Enviar mi solicitud al equipo AUROS",
  submitSubmitting: "Enviando solicitud…",
  submitDone: "Solicitud registrada — contacto en 48 h.",
  submitError: "Error al enviar. Inténtelo de nuevo.",
  submitNoId: "Cree una cuenta gratuita para enviar su solicitud.",
  loading: "Cargando…",
  nextSteps: {
    title: "Su recorrido",
    subtitle:
      "Cuatro pasos sencillos. El detalle del informe sigue disponible más abajo.",
    stepRead: "Leer el resumen (puntuación y admisión)",
    stepPdf: "Descargar el PDF del dossier",
    stepAccount: "Crear una cuenta (guardar y seguimiento)",
    stepSubmit: "Enviar la solicitud al equipo AUROS",
    waitAi: "Generando contenido…",
    accountCta: "Crear cuenta gratuita →",
    pdfCta: "Ir a la descarga →",
    submitCta: "Enviar mi solicitud →",
    footer:
      "AUROS estructura su dossier — nuestro equipo responde en 48 h (sin imponer una plataforma externa).",
  },
  collapsible: {
    detailsTitle: "Detalle del dossier",
    detailsSubtitle: "Descripción, valoración, objetivos, calendario",
    analysisTitle: "Análisis IA",
    analysisSubtitle: "Texto indicativo — validar con profesionales",
    studioTitle: "Estudio de tokenización",
    studioSubtitle: "Hoja de ruta y documentos tipo",
    extrasTitle: "Completar y compartir",
    extrasSubtitle: "Data room, conformidad, concierge, enlace",
  },
  eyebrow: "Dossier RWA",
  authLink: "Crear cuenta gratuita",
  yourAsset: "Su activo",
  sections: {
    description: "Descripción del activo",
    valuation: "Valoración estimada",
    documentation: "Documentación",
    timeline: "Calendario",
    objectives: "Objetivos",
    compliance: "Estado de conformidad",
  },
  quality: {
    title: "Completitud del informe",
    complete: "Su dossier está completo.",
    improve: "Mejorar en el wizard",
    badges: {
      strong: "Documentación sólida",
      good: "Buen nivel de preparación",
      needs: "Por completar",
    },
    items: EN.quality.items,
  },
  learnMore: "Más información →",
  shared: {
    ...EN.shared,
    expiredTitle: "Este enlace de compartición ha caducado.",
    expiredBody: "Los enlaces son válidos 30 días.",
    expiredCta: "Crear un nuevo dossier →",
    evaluateCta: "Evaluar mi activo con AUROS",
  },
  share: {
    ...EN.share,
    title: "Compartir resultados",
    scoreCta: "Copiar enlace del score",
    dossierCta: "Copiar enlace del dossier",
    copied: "Copiado",
    error: "No se pudo crear el enlace. Inténtelo de nuevo.",
  },
  ai: {
    ...EN.ai,
    generating: "Generando secciones IA…",
    generatingHint: "Unos 20–40 segundos — no cierre esta pestaña.",
    disclaimer:
      "Este informe es generado por IA solo con fines informativos. AUROS no ofrece asesoramiento jurídico, financiero ni de inversión.",
  },
};

const CATALOG: Record<Locale, DossierMessages> = { fr: FR, en: EN, es: ES };

export function getDossierMessages(locale: Locale): DossierMessages {
  return CATALOG[locale] ?? FR;
}
