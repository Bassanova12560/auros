import type { Locale } from "@/lib/i18n";

export type PricingTier = {
  id: string;
  name: string;
  price: string;
  description: string;
  features: readonly string[];
  cta: string;
  href: string;
  featured?: boolean;
};

export type PricingMessages = {
  eyebrow: string;
  title: string;
  subtitle: string;
  featuredLabel: string;
  disclaimer: string;
  tiers: readonly PricingTier[];
  jurisdictionsLink: string;
};

const FR: PricingMessages = {
  eyebrow: "Tarifs",
  title: "Trois niveaux, un parcours clair",
  subtitle:
    "Commencez gratuitement avec le wizard et le score. Passez au Starter Kit quand la juridiction est validée. Launch pour l'accompagnement complet.",
  featuredLabel: "Recommandé",
  disclaimer:
    "Analyses indicatives — validation counsel requise avant émission.",
  tiers: [
    {
      id: "free",
      name: "Gratuit",
      price: "0 €",
      description: "Score d'admission et dossier actif structuré.",
      features: [
        "Wizard 4 parties (~15 min)",
        "Score indicatif instantané",
        "Data room & studio réglementaire IA",
        "Export PDF dossier",
      ],
      cta: "Créer mon dossier",
      href: "/wizard",
    },
    {
      id: "starter",
      name: "Starter Kit",
      price: "5 000 €",
      description: "Memo juridiction phase 0 — 8 juridictions comparées.",
      features: [
        "Portail + PDF livrés immédiatement",
        "Structure SPV recommandée",
        "Checklist réglementaire & calendrier",
        "Shortlist prestataires tech RWA",
      ],
      cta: "Voir le Starter Kit",
      href: "/jurisdictions/starter-kit",
      featured: true,
    },
    {
      id: "launch",
      name: "Launch",
      price: "Sur devis",
      description: "Accompagnement jusqu'à l'émission du token.",
      features: [
        "Pilotage juridique + tech",
        "Coordination émission",
        "Support investisseurs qualifiés",
      ],
      cta: "Nous contacter",
      href: "/jurisdictions#quote-form",
    },
  ],
  jurisdictionsLink: "Comparer les juridictions →",
};

const EN: PricingMessages = {
  eyebrow: "Pricing",
  title: "Three tiers, one clear path",
  subtitle:
    "Start free with wizard and score. Move to Starter Kit when jurisdiction is validated. Launch for full support.",
  featuredLabel: "Recommended",
  disclaimer:
    "Indicative analyses — counsel validation required before issuance.",
  tiers: [
    {
      id: "free",
      name: "Free",
      price: "€0",
      description: "Admission score and structured asset dossier.",
      features: [
        "4-part wizard (~15 min)",
        "Instant indicative score",
        "Data room & AI regulatory studio",
        "Dossier PDF export",
      ],
      cta: "Create my dossier",
      href: "/wizard",
    },
    {
      id: "starter",
      name: "Starter Kit",
      price: "€5,000",
      description: "Phase 0 jurisdiction memo — 8 jurisdictions compared.",
      features: [
        "Portal + PDF delivered immediately",
        "Recommended SPV structure",
        "Regulatory checklist & timeline",
        "Vetted RWA tech shortlist",
      ],
      cta: "View Starter Kit",
      href: "/jurisdictions/starter-kit",
      featured: true,
    },
    {
      id: "launch",
      name: "Launch",
      price: "Custom quote",
      description: "Support through token issuance.",
      features: [
        "Legal + tech coordination",
        "Issuance coordination",
        "Qualified investor support",
      ],
      cta: "Contact us",
      href: "/jurisdictions#quote-form",
    },
  ],
  jurisdictionsLink: "Compare jurisdictions →",
};

const ES: PricingMessages = {
  eyebrow: "Precios",
  title: "Tres niveles, un camino claro",
  subtitle:
    "Empiece gratis con wizard y puntuación. Pase al Starter Kit cuando valide la jurisdicción. Launch para acompañamiento completo.",
  featuredLabel: "Recomendado",
  disclaimer:
    "Análisis indicativos — validación legal requerida antes de emisión.",
  tiers: [
    {
      id: "free",
      name: "Gratuito",
      price: "0 €",
      description: "Puntuación de admisión y dossier activo estructurado.",
      features: [
        "Wizard 4 partes (~15 min)",
        "Puntuación indicativa instantánea",
        "Data room y estudio regulatorio IA",
        "Export PDF dossier",
      ],
      cta: "Crear mi dossier",
      href: "/wizard",
    },
    {
      id: "starter",
      name: "Starter Kit",
      price: "5 000 €",
      description: "Memo jurisdicción fase 0 — 8 jurisdicciones comparadas.",
      features: [
        "Portal + PDF entregados al instante",
        "Estructura SPV recomendada",
        "Checklist regulatorio y calendario",
        "Shortlist proveedores tech RWA",
      ],
      cta: "Ver Starter Kit",
      href: "/jurisdictions/starter-kit",
      featured: true,
    },
    {
      id: "launch",
      name: "Launch",
      price: "Presupuesto",
      description: "Acompañamiento hasta la emisión del token.",
      features: [
        "Coordinación jurídica + tech",
        "Coordinación de emisión",
        "Soporte inversores cualificados",
      ],
      cta: "Contactar",
      href: "/jurisdictions#quote-form",
    },
  ],
  jurisdictionsLink: "Comparar jurisdicciones →",
};

const CATALOG: Record<Locale, PricingMessages> = { fr: FR, en: EN, es: ES };

export function getPricingMessages(locale: Locale): PricingMessages {
  return CATALOG[locale] ?? FR;
}
