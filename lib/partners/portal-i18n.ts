import type { Locale } from "@/lib/i18n";

export type PartnerPortalMessages = {
  eyebrow: string;
  title: string;
  intro: string;
  codeLabel: string;
  codePlaceholder: string;
  submit: string;
  loading: string;
  invalidCode: string;
  unavailable: string;
  emptyTitle: string;
  emptyBody: string;
  statsLeads: string;
  statsDossiers: string;
  statsSubmitted: string;
  indicativeLabel: string;
  indicativeDisclaimer: string;
  wizardLink: string;
  copyWizard: string;
  copied: string;
  recentTitle: string;
  colType: string;
  colDate: string;
  colAsset: string;
  colScore: string;
  colContact: string;
  typeLead: string;
  typeDossier: string;
  backPartners: string;
};

const FR: PartnerPortalMessages = {
  eyebrow: "Partenaires apporteurs",
  title: "Votre tableau de bord",
  intro:
    "Consultez les leads et dossiers attribués à votre code partenaire. Chiffres indicatifs — la grille contractuelle fait foi.",
  codeLabel: "Code partenaire",
  codePlaceholder: "Ex. CAB-LUX",
  submit: "Afficher mon activité",
  loading: "Chargement…",
  invalidCode: "Code invalide — 2 caractères minimum (lettres, chiffres, tiret).",
  unavailable: "Service temporairement indisponible. Réessayez plus tard.",
  emptyTitle: "Aucune attribution pour l'instant",
  emptyBody:
    "Partagez votre lien wizard avec ?partner=VOTRE_CODE — les prochains leads et dossiers apparaîtront ici.",
  statsLeads: "Leads",
  statsDossiers: "Dossiers",
  statsSubmitted: "Soumis",
  indicativeLabel: "Commission indicative",
  indicativeDisclaimer:
    "Estimation non contractuelle — paliers selon accord partenaire signé.",
  wizardLink: "Lien wizard partenaire",
  copyWizard: "Copier le lien",
  copied: "Copié",
  recentTitle: "Activité récente",
  colType: "Type",
  colDate: "Date",
  colAsset: "Actif",
  colScore: "Score",
  colContact: "Contact",
  typeLead: "Lead",
  typeDossier: "Dossier",
  backPartners: "Programme partenaires",
};

const EN: PartnerPortalMessages = {
  ...FR,
  eyebrow: "Referral partners",
  title: "Your dashboard",
  intro:
    "View leads and dossiers attributed to your partner code. Indicative figures — signed agreement prevails.",
  codeLabel: "Partner code",
  codePlaceholder: "e.g. CAB-LUX",
  submit: "Show my activity",
  loading: "Loading…",
  invalidCode: "Invalid code — at least 2 alphanumeric characters.",
  unavailable: "Service temporarily unavailable. Please try again later.",
  emptyTitle: "No attributions yet",
  emptyBody:
    "Share your wizard link with ?partner=YOUR_CODE — upcoming leads and dossiers will appear here.",
  statsLeads: "Leads",
  statsDossiers: "Dossiers",
  statsSubmitted: "Submitted",
  indicativeLabel: "Indicative commission",
  indicativeDisclaimer: "Non-binding estimate — tiers per signed partner agreement.",
  wizardLink: "Partner wizard link",
  copyWizard: "Copy link",
  copied: "Copied",
  recentTitle: "Recent activity",
  colType: "Type",
  colDate: "Date",
  colAsset: "Asset",
  colScore: "Score",
  colContact: "Contact",
  typeLead: "Lead",
  typeDossier: "Dossier",
  backPartners: "Partner program",
};

const ES: PartnerPortalMessages = {
  ...FR,
  eyebrow: "Socios referidores",
  title: "Su panel",
  intro:
    "Consulte leads y dossiers atribuidos a su código. Cifras indicativas — prevalece el acuerdo firmado.",
  codeLabel: "Código socio",
  codePlaceholder: "Ej. CAB-LUX",
  submit: "Ver mi actividad",
  loading: "Cargando…",
  invalidCode: "Código inválido — mínimo 2 caracteres alfanuméricos.",
  unavailable: "Servicio no disponible temporalmente.",
  emptyTitle: "Sin atribuciones aún",
  emptyBody:
    "Comparta su enlace wizard con ?partner=SU_CODIGO — los próximos leads aparecerán aquí.",
  statsLeads: "Leads",
  statsDossiers: "Dossiers",
  statsSubmitted: "Enviados",
  indicativeLabel: "Comisión indicativa",
  indicativeDisclaimer: "Estimación no vinculante — según acuerdo firmado.",
  wizardLink: "Enlace wizard socio",
  copyWizard: "Copiar enlace",
  copied: "Copiado",
  recentTitle: "Actividad reciente",
  colType: "Tipo",
  colDate: "Fecha",
  colAsset: "Activo",
  colScore: "Puntuación",
  colContact: "Contacto",
  typeLead: "Lead",
  typeDossier: "Dossier",
  backPartners: "Programa socios",
};

const CATALOG: Record<Locale, PartnerPortalMessages> = { fr: FR, en: EN, es: ES };

export function getPartnerPortalMessages(locale: Locale): PartnerPortalMessages {
  return CATALOG[locale] ?? FR;
}
