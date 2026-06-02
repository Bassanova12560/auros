import type { Locale } from "@/lib/i18n";

export type StudioMessages = {
  title: string;
  subtitle: string;
  retained: string;
  later: string;
  regulatory: string;
  instrument: string;
  structure: string;
  exemptions: string;
  tokenTech: string;
  standard: string;
  chain: string;
  tokenomics: string;
  supply: string;
  nominal: string;
  transferRules: string;
  revenue: string;
  complianceHooks: string;
  roadmap: string;
  legalPack: string;
  docBlueprints: string;
  outline: string;
  prefilled: string;
  providers: string;
  providersSoon: string;
  partnersLink: string;
  targetProfile: string;
  comingSoon: string;
  lifecycle: string;
  ownerIssuer: string;
  ownerLegal: string;
  ownerTech: string;
  ownerCompliance: string;
  ownerAuros: string;
  maturity: Record<string, string>;
};

const FR: StudioMessages = {
  title: "Studio de tokenisation",
  subtitle:
    "De l'idée au smart contract — parcours, cadre réglementaire, tokenomics et prestataires. Les modules on-chain et KYC arrivent en phase 2.",
  retained: "Inclus aujourd'hui",
  later: "Phase 2 (partenariats)",
  regulatory: "Arbre réglementaire (indicatif)",
  instrument: "Instrument suggéré",
  structure: "Structure recommandée",
  exemptions: "Pistes d'exemption / régime",
  tokenTech: "Blueprint technique",
  standard: "Standard",
  chain: "Chaîne cible",
  tokenomics: "Tokenomics paramétrables",
  supply: "Offre indicative",
  nominal: "Valeur nominale",
  transferRules: "Règles de transfert",
  revenue: "Mécaniques de revenus",
  complianceHooks: "Hooks conformité (à déployer)",
  roadmap: "Rétroplanning tokenisation",
  legalPack: "Modules juridiques (plans)",
  docBlueprints: "Générateur de documents — structure",
  outline: "Sections à rédiger",
  prefilled: "Pré-rempli AUROS",
  providers: "Prestataires & intégrations",
  providersSoon:
    "Aucun partenaire commercial actif pour l'instant — nous ne promouvons pas de marques tierces sans accord. L'équipe AUROS vous oriente après revue du dossier.",
  partnersLink: "Vous êtes une plateforme ? Programme partenaires →",
  targetProfile: "Profil cible",
  comingSoon: "Intégration à venir",
  lifecycle: "Cycle de vie post-émission",
  ownerIssuer: "Émetteur",
  ownerLegal: "Juridique",
  ownerTech: "Tech",
  ownerCompliance: "Conformité",
  ownerAuros: "AUROS",
  maturity: {
    idea: "Phase idée",
    structuring: "Structuration en cours",
    ready_for_counsel: "Prêt pour cabinet juridique",
    ready_for_tech: "Prêt pour audit & déploiement test",
  },
};

const EN: StudioMessages = {
  title: "Tokenization studio",
  subtitle:
    "From idea to smart contract — path, regulatory frame, tokenomics, and providers. On-chain deploy & KYC integrations are phase 2.",
  retained: "Included today",
  later: "Phase 2 (partnerships)",
  regulatory: "Regulatory path (indicative)",
  instrument: "Suggested instrument",
  structure: "Recommended structure",
  exemptions: "Exemption / regime notes",
  tokenTech: "Technical blueprint",
  standard: "Standard",
  chain: "Target chain",
  tokenomics: "Configurable tokenomics",
  supply: "Indicative supply",
  nominal: "Nominal value",
  transferRules: "Transfer rules",
  revenue: "Revenue mechanics",
  complianceHooks: "Compliance hooks (to deploy)",
  roadmap: "Tokenization roadmap",
  legalPack: "Legal modules (outlines)",
  docBlueprints: "Document generator — structure",
  outline: "Sections to draft",
  prefilled: "AUROS pre-filled",
  providers: "Providers & integrations",
  providersSoon:
    "No active commercial partners yet — we do not promote third-party brands without an agreement. The AUROS team guides you after dossier review.",
  partnersLink: "Are you a platform? Partner program →",
  targetProfile: "Target profile",
  comingSoon: "Integration coming",
  lifecycle: "Post-issuance lifecycle",
  ownerIssuer: "Issuer",
  ownerLegal: "Legal",
  ownerTech: "Tech",
  ownerCompliance: "Compliance",
  ownerAuros: "AUROS",
  maturity: {
    idea: "Idea stage",
    structuring: "Structuring in progress",
    ready_for_counsel: "Ready for legal counsel",
    ready_for_tech: "Ready for audit & testnet deploy",
  },
};

const ES: StudioMessages = {
  title: "Estudio de tokenización",
  subtitle:
    "De la idea al marco regulatorio, tokenomics y proveedores. Despliegue on-chain y KYC en fase 2.",
  retained: "Incluido hoy",
  later: "Fase 2 (alianzas)",
  regulatory: "Marco regulatorio (indicativo)",
  instrument: "Instrumento sugerido",
  structure: "Estructura recomendada",
  exemptions: "Notas de régimen / exención",
  tokenTech: "Blueprint técnico",
  standard: "Estándar",
  chain: "Cadena objetivo",
  tokenomics: "Tokenomics configurables",
  supply: "Oferta indicativa",
  nominal: "Valor nominal",
  transferRules: "Reglas de transferencia",
  revenue: "Mecánica de ingresos",
  complianceHooks: "Hooks de cumplimiento (por desplegar)",
  roadmap: "Hoja de ruta de tokenización",
  legalPack: "Módulos jurídicos (esquemas)",
  docBlueprints: "Generador de documentos — estructura",
  outline: "Secciones a redactar",
  prefilled: "Pre-relleno AUROS",
  providers: "Proveedores e integraciones",
  providersSoon:
    "Sin socios comerciales activos por ahora — no promovemos marcas externas sin acuerdo. El equipo AUROS le orienta tras revisar el dossier.",
  partnersLink: "¿Es una plataforma? Programa de socios →",
  targetProfile: "Perfil objetivo",
  comingSoon: "Integración próximamente",
  lifecycle: "Ciclo de vida post-emisión",
  ownerIssuer: "Emisor",
  ownerLegal: "Legal",
  ownerTech: "Tech",
  ownerCompliance: "Cumplimiento",
  ownerAuros: "AUROS",
  maturity: {
    idea: "Fase idea",
    structuring: "Estructuración en curso",
    ready_for_counsel: "Listo para asesoría legal",
    ready_for_tech: "Listo para auditoría y testnet",
  },
};

export function getStudioMessages(locale: Locale): StudioMessages {
  if (locale === "fr") return FR;
  if (locale === "es") return ES;
  return EN;
}
