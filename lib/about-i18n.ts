import { resolveCatalogLocale, type CatalogMap, type Locale } from "@/lib/i18n";
import { AUROS_ORG } from "@/lib/ai-first/org";

export type AboutMessages = {
  eyebrow: string;
  title: string;
  intro: string;
  disclaimer: string;
  credentials: readonly { label: string; value: string }[];
  ctaWizard: string;
  ctaJurisdictions: string;
  home: string;
};

const FR: AboutMessages = {
  eyebrow: "À propos",
  title: "AUROS — tokenisation RWA, juridiction d'abord",
  intro:
    "AUROS est une plateforme B2B pour les émetteurs qui structurent la tokenisation d'actifs réels. Comparez huit juridictions sur les frais, délais de licence, fiscalité investisseur et KYC — puis préparez votre dossier actif avec un wizard gratuit. Memo juridiction phase 0 via Starter Kit.",
  disclaimer:
    "Toutes les analyses sont indicatives. Une validation par votre conseil juridique est requise avant toute émission.",
  credentials: [
    { label: "Produit", value: "AUROS — plateforme B2B tokenisation d'actifs réels" },
    {
      label: "Offre gratuite",
      value: "Wizard + dossier actif — score d'admission & data room",
    },
    {
      label: "Offre payante",
      value: "Starter Kit 5 000 € — memo juridiction, SPV, checklist régulateur",
    },
    {
      label: "Juridictions",
      value:
        "8 comparées — Luxembourg, Dubai DIFC, Singapour, Suisse, France, Irlande, Bahreïn, Gibraltar",
    },
    { label: "Fondateur", value: "Adrien Balitrand" },
    { label: "Contact", value: AUROS_ORG.contactEmail },
    { label: "Langues", value: "Français, anglais, espagnol (interface)" },
    {
      label: "Machine-readable",
      value: "/llms.txt · /ai-first/index.json · /ai-first/rag · /humans.txt",
    },
  ],
  ctaWizard: "Wizard gratuit →",
  ctaJurisdictions: "Comparateur juridictions →",
  home: "← Accueil",
};

const EN: AboutMessages = {
  eyebrow: "About",
  title: "AUROS — RWA tokenization, jurisdiction-first",
  intro:
    "AUROS is a B2B platform for issuers structuring real-world asset tokenization. Compare eight jurisdictions on fees, licence timelines, investor tax and KYC — then prepare your asset dossier with a free wizard. Phase 0 jurisdiction memo via Starter Kit.",
  disclaimer:
    "All analyses are indicative. Legal counsel validation is required before any issuance.",
  credentials: [
    {
      label: "Product",
      value: "AUROS — B2B real-world asset tokenization platform",
    },
    {
      label: "Free tier",
      value: "Wizard + active dossier — asset admission score & data room",
    },
    {
      label: "Paid tier",
      value: "Starter Kit €5,000 — jurisdiction memo, SPV, regulator checklist",
    },
    {
      label: "Jurisdictions",
      value:
        "8 compared — Luxembourg, Dubai DIFC, Singapore, Switzerland, France, Ireland, Bahrain, Gibraltar",
    },
    { label: "Founder", value: "Adrien Balitrand" },
    { label: "Contact", value: AUROS_ORG.contactEmail },
    { label: "Languages", value: "French, English, Spanish (UI)" },
    {
      label: "Machine-readable",
      value: "/llms.txt · /ai-first/index.json · /ai-first/rag · /humans.txt",
    },
  ],
  ctaWizard: "Free wizard →",
  ctaJurisdictions: "Jurisdiction comparator →",
  home: "← Home",
};

const ES: AboutMessages = {
  ...EN,
  eyebrow: "Acerca de",
  title: "AUROS — tokenización RWA, jurisdicción primero",
  intro:
    "AUROS es una plataforma B2B para emisores que estructuran la tokenización de activos reales. Compare ocho jurisdicciones en tasas, plazos de licencia, fiscalidad del inversor y KYC — luego prepare su dossier con un wizard gratuito. Memo jurisdicción fase 0 vía Starter Kit.",
  disclaimer:
    "Todos los análisis son indicativos. Se requiere validación de su asesor legal antes de cualquier emisión.",
  credentials: [
    { label: "Producto", value: "AUROS — plataforma B2B tokenización RWA" },
    {
      label: "Gratis",
      value: "Wizard + dossier activo — puntuación de admisión y data room",
    },
    {
      label: "De pago",
      value: "Starter Kit 5 000 € — memo jurisdicción, SPV, checklist regulador",
    },
    {
      label: "Jurisdicciones",
      value:
        "8 comparadas — Luxemburgo, Dubai DIFC, Singapur, Suiza, Francia, Irlanda, Baréin, Gibraltar",
    },
    { label: "Fundador", value: "Adrien Balitrand" },
    { label: "Contacto", value: AUROS_ORG.contactEmail },
    { label: "Idiomas", value: "Francés, inglés, español (interfaz)" },
    {
      label: "Machine-readable",
      value: "/llms.txt · /ai-first/index.json · /ai-first/rag · /humans.txt",
    },
  ],
  ctaWizard: "Wizard gratuito →",
  ctaJurisdictions: "Comparador jurisdicciones →",
  home: "← Inicio",
};

const CATALOG: CatalogMap< AboutMessages> = { fr: FR, en: EN, es: ES };

export function getAboutMessages(locale: Locale): AboutMessages {
  return CATALOG[resolveCatalogLocale(locale)] ?? FR;
}
