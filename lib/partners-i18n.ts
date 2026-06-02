import type { Locale } from "@/lib/i18n";

export type PartnersMessages = {
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: string;
  howTitle: string;
  steps: Array<{ number: string; title: string; description: string }>;
  receiveTitle: string;
  receiveItems: Array<{ title: string; description: string }>;
  integrationsTitle: string;
  integrationsBody: string;
  integrationsNote: string;
  pricingTitle: string;
  tiers: Array<{
    name: string;
    price: string;
    features: string[];
    cta: string;
    highlight: boolean;
  }>;
  contactTitle: string;
  form: {
    company: string;
    contactName: string;
    email: string;
    platformType: string;
    monthlyVolume: string;
    messageOptional: string;
    select: string;
    submit: string;
    submitting: string;
    success: string;
    platformTypes: Record<string, string>;
    volumes: Record<string, string>;
  };
};

const FR: PartnersMessages = {
  eyebrow: "Pour les plateformes",
  title: "Intégrez AUROS à votre onboarding",
  subtitle:
    "Recevez des dossiers pré-formatés de propriétaires qualifiés. Zéro développement côté plateforme.",
  cta: "Demander l'intégration",
  howTitle: "Comment ça fonctionne",
  steps: [
    {
      number: "01",
      title: "Vous définissez vos critères",
      description:
        "Types d'actifs, juridictions et standards documentaires acceptés.",
    },
    {
      number: "02",
      title: "AUROS formate pour vos specs",
      description:
        "L'IA génère des dossiers alignés sur votre processus d'onboarding.",
    },
    {
      number: "03",
      title: "Vous recevez des candidatures qualifiées",
      description:
        "Les propriétaires soumettent via AUROS avec une documentation complète.",
    },
  ],
  receiveTitle: "Ce que vous recevez",
  receiveItems: [
    {
      title: "Dossiers standardisés",
      description: "Chaque soumission suit votre format — pas de dossiers incomplets.",
    },
    {
      title: "Actifs pré-qualifiés",
      description: "Seuls les actifs au-dessus de votre seuil de valeur vous parviennent.",
    },
    {
      title: "KYC pré-rempli",
      description: "Vérifications identité et actif déjà amorcées par le demandeur.",
    },
    {
      title: "Contrôle MiCA",
      description: "Éligibilité juridictionnelle vérifiée avant soumission.",
    },
  ],
  integrationsTitle: "Partenariats",
  integrationsBody:
    "Aucune intégration commerciale annoncée pour l'instant — le programme ouvre sur candidature.",
  integrationsNote: "Pas de promotion de marques tierces sans accord signé.",
  pricingTitle: "Tarifs plateformes",
  tiers: [
    {
      name: "Starter",
      price: "Gratuit",
      features: [
        "Jusqu'à 10 dossiers / mois",
        "Format standard",
        "Livraison par e-mail",
      ],
      cta: "Démarrer gratuitement",
      highlight: false,
    },
    {
      name: "Growth",
      price: "500 € / mois",
      features: [
        "Dossiers illimités",
        "Format sur mesure",
        "Intégration API",
        "Account manager dédié",
      ],
      cta: "Nous contacter",
      highlight: true,
    },
    {
      name: "Enterprise",
      price: "Sur mesure",
      features: [
        "Option white-label",
        "API complète + webhooks",
        "SLA garanti",
        "Co-marketing",
      ],
      cta: "Nous contacter",
      highlight: false,
    },
  ],
  contactTitle: "Contact",
  form: {
    company: "Société",
    contactName: "Nom du contact",
    email: "Email",
    platformType: "Type de plateforme",
    monthlyVolume: "Volume mensuel",
    messageOptional: "Message (optionnel)",
    select: "Choisir…",
    submit: "Envoyer la demande de partenariat",
    submitting: "Envoi…",
    success: "Merci — nous vous répondrons sous 24 h.",
    platformTypes: {
      "Real estate": "Immobilier",
      Vehicles: "Véhicules",
      Art: "Art",
      Metals: "Métaux",
      "Private credit": "Crédit privé",
      Other: "Autre",
    },
    volumes: {
      "Under 10": "Moins de 10",
      "10-50": "10–50",
      "50-200": "50–200",
      "200+ dossiers": "200+ dossiers",
    },
  },
};

const EN: PartnersMessages = {
  eyebrow: "For platforms",
  title: "Integrate AUROS into your onboarding",
  subtitle:
    "Receive pre-formatted dossiers from qualified asset owners. Zero platform-side development.",
  cta: "Request integration",
  howTitle: "How it works for platforms",
  steps: [
    {
      number: "01",
      title: "You set your requirements",
      description:
        "Asset types, jurisdictions, and documentation standards you accept.",
    },
    {
      number: "02",
      title: "AUROS formats to your specs",
      description:
        "Our AI generates dossiers that match your exact onboarding requirements.",
    },
    {
      number: "03",
      title: "Receive qualified applicants",
      description:
        "Asset owners submit directly through AUROS with complete documentation.",
    },
  ],
  receiveTitle: "What you receive",
  receiveItems: [
    {
      title: "Standardized dossiers",
      description: "Every submission follows your format. No incomplete applications.",
    },
    {
      title: "Pre-screened assets",
      description: "Only assets above your minimum value threshold reach your team.",
    },
    {
      title: "KYC pre-filled",
      description: "Basic identity and asset verification already completed.",
    },
    {
      title: "MiCA compliance check",
      description: "Jurisdiction eligibility verified before submission.",
    },
  ],
  integrationsTitle: "Partnerships",
  integrationsBody:
    "No commercial integrations announced yet — the program opens on application.",
  integrationsNote: "No third-party brands promoted without a signed agreement.",
  pricingTitle: "Pricing for platforms",
  tiers: [
    {
      name: "Starter",
      price: "Free",
      features: [
        "Up to 10 dossiers/month",
        "Standard formatting",
        "Email delivery",
      ],
      cta: "Start free",
      highlight: false,
    },
    {
      name: "Growth",
      price: "€500/month",
      features: [
        "Unlimited dossiers",
        "Custom formatting to your specs",
        "API integration",
        "Dedicated account manager",
      ],
      cta: "Contact us",
      highlight: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      features: [
        "White-label option",
        "Full API with webhooks",
        "SLA guarantee",
        "Co-marketing opportunities",
      ],
      cta: "Contact us",
      highlight: false,
    },
  ],
  contactTitle: "Contact",
  form: {
    company: "Company",
    contactName: "Contact name",
    email: "Email",
    platformType: "Platform type",
    monthlyVolume: "Monthly volume",
    messageOptional: "Message (optional)",
    select: "Select…",
    submit: "Submit partnership inquiry",
    submitting: "Sending…",
    success: "Thank you — we'll respond within 24 hours.",
    platformTypes: {
      "Real estate": "Real estate",
      Vehicles: "Vehicles",
      Art: "Art",
      Metals: "Metals",
      "Private credit": "Private credit",
      Other: "Other",
    },
    volumes: {
      "Under 10": "Under 10",
      "10-50": "10–50",
      "50-200": "50–200",
      "200+ dossiers": "200+ dossiers",
    },
  },
};

const ES: PartnersMessages = {
  ...EN,
  eyebrow: "Para plataformas",
  title: "Integre AUROS en su onboarding",
  subtitle:
    "Reciba expedientes preformateados de propietarios cualificados. Sin desarrollo en su plataforma.",
  cta: "Solicitar integración",
  howTitle: "Cómo funciona para plataformas",
  receiveTitle: "Lo que recibe",
  integrationsTitle: "Alianzas",
  integrationsBody:
    "Sin integraciones comerciales anunciadas por ahora — el programa abre por solicitud.",
  integrationsNote: "Sin promoción de marcas externas sin acuerdo firmado.",
  pricingTitle: "Precios para plataformas",
  contactTitle: "Contacto",
  form: {
    company: "Empresa",
    contactName: "Nombre de contacto",
    email: "Correo",
    platformType: "Tipo de plataforma",
    monthlyVolume: "Volumen mensual",
    messageOptional: "Mensaje (opcional)",
    select: "Elegir…",
    submit: "Enviar solicitud de asociación",
    submitting: "Enviando…",
    success: "Gracias — responderemos en 24 h.",
    platformTypes: {
      "Real estate": "Inmobiliario",
      Vehicles: "Vehículos",
      Art: "Arte",
      Metals: "Metales",
      "Private credit": "Crédito privado",
      Other: "Otro",
    },
    volumes: {
      "Under 10": "Menos de 10",
      "10-50": "10–50",
      "50-200": "50–200",
      "200+ dossiers": "200+ expedientes",
    },
  },
};

const CATALOG: Record<Locale, PartnersMessages> = { fr: FR, en: EN, es: ES };

export function getPartnersMessages(locale: Locale): PartnersMessages {
  return CATALOG[locale] ?? FR;
}
