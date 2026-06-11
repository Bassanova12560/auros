import type { Locale } from "@/lib/i18n";
import type { WizardTier } from "@/lib/wizard-modes";

export type WizardProTierMessages = {
  title: string;
  subtitle: string;
  compareTitle: string;
  features: Record<WizardTier, string[]>;
  cta: string;
  ctaLoading: string;
  emailLabel: string;
  emailPlaceholder: string;
  cancelled: string;
  rows: {
    questions: string;
    score: string;
    mica: string;
    pdf: string;
    support: string;
  };
};

const FR: WizardProTierMessages = {
  title: "Choisissez votre niveau d'analyse",
  subtitle:
    "Comparez les offres — le wizard Pro se débloque immédiatement après paiement.",
  compareTitle: "Comparatif des offres",
  features: {
    starter: [
      "Wizard Pro (19 questions)",
      "Score institutionnel",
      "Dossier PDF complet",
      "Support e-mail 48 h",
    ],
    pro: [
      "Tout Starter",
      "Revue MiCA détaillée",
      "3 juridictions recommandées",
      "Appel conseil 30 min",
    ],
    institutional: [
      "Tout Pro",
      "Data room prioritaire",
      "Rapport counsel-ready",
      "Concierge dédié",
    ],
  },
  cta: "Payer et débloquer",
  ctaLoading: "Redirection Stripe…",
  emailLabel: "E-mail professionnel",
  emailPlaceholder: "vous@entreprise.com",
  cancelled: "Paiement annulé — vous pouvez réessayer quand vous voulez.",
  rows: {
    questions: "Questions wizard",
    score: "Score institutionnel",
    mica: "Analyse MiCA",
    pdf: "Dossier PDF",
    support: "Accompagnement",
  },
};

const EN: WizardProTierMessages = {
  title: "Choose your analysis level",
  subtitle:
    "Compare plans — Pro wizard unlocks immediately after payment.",
  compareTitle: "Plan comparison",
  features: {
    starter: [
      "Pro wizard (19 questions)",
      "Institutional score",
      "Full PDF dossier",
      "48h email support",
    ],
    pro: [
      "Everything in Starter",
      "Detailed MiCA review",
      "3 recommended jurisdictions",
      "30-min advisory call",
    ],
    institutional: [
      "Everything in Pro",
      "Priority data room",
      "Counsel-ready report",
      "Dedicated concierge",
    ],
  },
  cta: "Pay and unlock",
  ctaLoading: "Redirecting to Stripe…",
  emailLabel: "Work email",
  emailPlaceholder: "you@company.com",
  cancelled: "Payment cancelled — you can try again anytime.",
  rows: {
    questions: "Wizard questions",
    score: "Institutional score",
    mica: "MiCA analysis",
    pdf: "PDF dossier",
    support: "Support",
  },
};

const ES: WizardProTierMessages = { ...EN };

export function getWizardProTierMessages(locale: Locale): WizardProTierMessages {
  if (locale === "fr") return FR;
  if (locale === "es") return ES;
  return EN;
}
