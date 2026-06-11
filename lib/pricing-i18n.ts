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
      name: "Explore",
      price: "0 €",
      description: "Parcours Explore — score indicatif et aperçu PDF filigrané.",
      features: [
        "Wizard 4 parties (~5 min)",
        "Score indicatif & 3 priorités",
        "Aperçu PDF filigrané",
        "Passerelle vers l'analyse Pro",
      ],
      cta: "Commencer Explore",
      href: "/wizard?mode=explore",
    },
    {
      id: "wizard-starter",
      name: "Wizard Starter",
      price: "490 €",
      description: "Analyse Pro complète — score institutionnel et dossier IA.",
      features: [
        "Wizard Pro (19 questions + MiCA)",
        "Score 5 dimensions",
        "Dossier PDF complet",
        "Support e-mail 48 h",
      ],
      cta: "Débloquer Starter",
      href: "/wizard/pro?tier=starter",
    },
    {
      id: "wizard-pro",
      name: "Wizard Pro",
      price: "1 990 €",
      description: "MiCA détaillé, juridictions recommandées, appel conseil.",
      features: [
        "Tout Starter",
        "Revue MiCA approfondie",
        "3 juridictions classées",
        "Appel conseil 30 min",
      ],
      cta: "Débloquer Pro",
      href: "/wizard/pro?tier=pro",
      featured: true,
    },
    {
      id: "wizard-institutional",
      name: "Wizard Institutional",
      price: "4 990 €",
      description: "Data room prioritaire et rapport counsel-ready.",
      features: [
        "Tout Pro",
        "Data room prioritaire",
        "Rapport counsel-ready",
        "Concierge dédié",
      ],
      cta: "Débloquer Institutional",
      href: "/wizard/pro?tier=institutional",
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
      name: "Explore",
      price: "€0",
      description: "Explore path — indicative score and watermarked PDF preview.",
      features: [
        "4-part wizard (~5 min)",
        "Indicative score & 3 priorities",
        "Watermarked PDF preview",
        "Gateway to Pro analysis",
      ],
      cta: "Start Explore",
      href: "/wizard?mode=explore",
    },
    {
      id: "wizard-starter",
      name: "Wizard Starter",
      price: "€490",
      description: "Full Pro analysis — institutional score and AI dossier.",
      features: [
        "Pro wizard (19 questions + MiCA)",
        "5-dimension score",
        "Full PDF dossier",
        "48h email support",
      ],
      cta: "Unlock Starter",
      href: "/wizard/pro?tier=starter",
    },
    {
      id: "wizard-pro",
      name: "Wizard Pro",
      price: "€1,990",
      description: "Detailed MiCA, ranked jurisdictions, advisory call.",
      features: [
        "Everything in Starter",
        "In-depth MiCA review",
        "3 ranked jurisdictions",
        "30-min advisory call",
      ],
      cta: "Unlock Pro",
      href: "/wizard/pro?tier=pro",
      featured: true,
    },
    {
      id: "wizard-institutional",
      name: "Wizard Institutional",
      price: "€4,990",
      description: "Priority data room and counsel-ready report.",
      features: [
        "Everything in Pro",
        "Priority data room",
        "Counsel-ready report",
        "Dedicated concierge",
      ],
      cta: "Unlock Institutional",
      href: "/wizard/pro?tier=institutional",
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
      name: "Explore",
      price: "0 €",
      description: "Recorrido Explore — puntuación indicativa y PDF con marca de agua.",
      features: [
        "Wizard 4 partes (~5 min)",
        "Puntuación indicativa y 3 prioridades",
        "Vista previa PDF con marca de agua",
        "Puerta al análisis Pro",
      ],
      cta: "Empezar Explore",
      href: "/wizard?mode=explore",
    },
    {
      id: "wizard-starter",
      name: "Wizard Starter",
      price: "490 €",
      description: "Análisis Pro completo — puntuación institucional y dossier IA.",
      features: [
        "Wizard Pro (19 preguntas + MiCA)",
        "Puntuación 5 dimensiones",
        "Dossier PDF completo",
        "Soporte e-mail 48 h",
      ],
      cta: "Desbloquear Starter",
      href: "/wizard/pro?tier=starter",
    },
    {
      id: "wizard-pro",
      name: "Wizard Pro",
      price: "1 990 €",
      description: "MiCA detallado, jurisdicciones recomendadas, llamada asesoría.",
      features: [
        "Todo Starter",
        "Revisión MiCA profunda",
        "3 jurisdicciones clasificadas",
        "Llamada asesoría 30 min",
      ],
      cta: "Desbloquear Pro",
      href: "/wizard/pro?tier=pro",
      featured: true,
    },
    {
      id: "wizard-institutional",
      name: "Wizard Institutional",
      price: "4 990 €",
      description: "Data room prioritaria e informe counsel-ready.",
      features: [
        "Todo Pro",
        "Data room prioritaria",
        "Informe counsel-ready",
        "Conserje dedicado",
      ],
      cta: "Desbloquear Institutional",
      href: "/wizard/pro?tier=institutional",
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
