import type { Locale } from "@/lib/i18n";

export type DashboardMessages = {
  guest: {
    eyebrow: string;
    title: string;
    body: string;
    signUp: string;
    signIn: string;
    continueWizard: string;
  };
  auth: {
    label: string;
    title: string;
    emptySub: string;
    countOne: string;
    countMany: string;
    newDossier: string;
    emptyTitle: string;
    emptyLink: string;
    errorTitle: string;
  };
  list: {
    downloadPdf: string;
    downloadPdfGenerating: string;
    downloadPdfRetry: string;
    viewDossier: string;
    editWizard: string;
    untitled: string;
    scoreAria: (score: number) => string;
    status: {
      draft: string;
      generated: string;
      submitted: string;
      in_review: string;
      needs_info: string;
      approved: string;
    };
  };
  account: {
    deleteLink: string;
    modalTitle: string;
    modalBody: string;
    cancel: string;
    confirm: string;
    deleting: string;
    errorUnauth: string;
    errorGeneric: string;
  };
};

const FR: DashboardMessages = {
  guest: {
    eyebrow: "Dossiers",
    title: "Enregistrez vos dossiers de tokenisation",
    body: "Créez un compte gratuit pour sauvegarder vos profils, télécharger le PDF et accéder à l'historique depuis cet espace.",
    signUp: "Créer un compte",
    signIn: "Se connecter",
    continueWizard: "Continuer sans compte → wizard",
  },
  auth: {
    label: "Dashboard",
    title: "Vos dossiers",
    emptySub: "Les profils de tokenisation que vous générez apparaîtront ici.",
    countOne: "1 dossier enregistré",
    countMany: "dossiers enregistrés",
    newDossier: "+ Nouveau dossier",
    emptyTitle: "Aucun dossier pour l'instant.",
    emptyLink: "Créer le premier →",
    errorTitle: "Impossible de charger vos dossiers.",
  },
  list: {
    downloadPdf: "Télécharger le PDF",
    downloadPdfGenerating: "Génération du PDF…",
    downloadPdfRetry: "Réessayer · Télécharger le PDF",
    viewDossier: "Voir le dossier →",
    editWizard: "Modifier dans le wizard →",
    untitled: "Dossier sans titre",
    scoreAria: (score) => `Score ${score} sur 100`,
    status: {
      draft: "Brouillon",
      generated: "Généré",
      submitted: "Soumis",
      in_review: "En revue",
      needs_info: "Compléments",
      approved: "Validé",
    },
  },
  account: {
    deleteLink: "Supprimer mon compte et mes données",
    modalTitle: "Supprimer le compte ?",
    modalBody:
      "Cela supprimera définitivement votre compte, tous vos dossiers et vos données personnelles. Cette action est irréversible.",
    cancel: "Annuler",
    confirm: "Supprimer définitivement",
    deleting: "Suppression…",
    errorUnauth: "Vous devez être connecté.",
    errorGeneric: "Échec de la suppression.",
  },
};

const EN: DashboardMessages = {
  guest: {
    eyebrow: "Dossiers",
    title: "Save your tokenization dossiers",
    body: "Create a free account to save profiles, download PDFs, and access your history here.",
    signUp: "Create account",
    signIn: "Sign in",
    continueWizard: "Continue without account → wizard",
  },
  auth: {
    label: "Dashboard",
    title: "Your dossiers",
    emptySub: "Tokenization profiles you've generated will appear here.",
    countOne: "1 saved dossier",
    countMany: "saved dossiers",
    newDossier: "+ New dossier",
    emptyTitle: "No dossiers yet.",
    emptyLink: "Create your first one →",
    errorTitle: "Couldn't load your dossiers.",
  },
  list: {
    downloadPdf: "Download PDF",
    downloadPdfGenerating: "Generating PDF…",
    downloadPdfRetry: "Retry · Download PDF",
    viewDossier: "View dossier →",
    editWizard: "Edit in wizard →",
    untitled: "Untitled dossier",
    scoreAria: (score) => `Score ${score} out of 100`,
    status: {
      draft: "Draft",
      generated: "Generated",
      submitted: "Submitted",
      in_review: "In review",
      needs_info: "Needs info",
      approved: "Approved",
    },
  },
  account: {
    deleteLink: "Delete my account and data",
    modalTitle: "Delete account?",
    modalBody:
      "This will permanently delete your account, all dossiers, and personal data. This cannot be undone.",
    cancel: "Cancel",
    confirm: "Delete permanently",
    deleting: "Deleting…",
    errorUnauth: "You must be signed in.",
    errorGeneric: "Deletion failed.",
  },
};

const ES: DashboardMessages = {
  guest: {
    eyebrow: "Expedientes",
    title: "Guarde sus dossiers de tokenización",
    body: "Cree una cuenta gratuita para guardar perfiles, descargar el PDF y ver su historial.",
    signUp: "Crear cuenta",
    signIn: "Iniciar sesión",
    continueWizard: "Continuar sin cuenta → wizard",
  },
  auth: {
    label: "Dashboard",
    title: "Sus expedientes",
    emptySub: "Los perfiles generados aparecerán aquí.",
    countOne: "1 expediente guardado",
    countMany: "expedientes guardados",
    newDossier: "+ Nuevo expediente",
    emptyTitle: "Aún no hay expedientes.",
    emptyLink: "Crear el primero →",
    errorTitle: "No se pudieron cargar los expedientes.",
  },
  list: {
    ...EN.list,
    downloadPdf: "Descargar PDF",
    downloadPdfGenerating: "Generando PDF…",
    downloadPdfRetry: "Reintentar · Descargar PDF",
    viewDossier: "Ver dossier →",
    editWizard: "Editar en el wizard →",
    untitled: "Dossier sin título",
    scoreAria: (score) => `Puntuación ${score} de 100`,
    status: {
      draft: "Borrador",
      generated: "Generado",
      submitted: "Enviado",
      in_review: "En revisión",
      needs_info: "Falta información",
      approved: "Aprobado",
    },
  },
  account: {
    ...EN.account,
    deleteLink: "Eliminar mi cuenta y datos",
    modalTitle: "¿Eliminar cuenta?",
    modalBody:
      "Se eliminarán permanentemente su cuenta, todos los dossiers y datos personales. No se puede deshacer.",
    cancel: "Cancelar",
    confirm: "Eliminar permanentemente",
    deleting: "Eliminando…",
    errorUnauth: "Debe iniciar sesión.",
    errorGeneric: "Error al eliminar.",
  },
};

const CATALOG: Record<Locale, DashboardMessages> = { fr: FR, en: EN, es: ES };

export function getDashboardMessages(locale: Locale): DashboardMessages {
  return CATALOG[locale] ?? FR;
}
