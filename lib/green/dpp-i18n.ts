import type { Locale } from "@/lib/i18n";

export type GreenDppCopy = {
  eyebrow: string;
  title: string;
  subtitle: string;
  lookupTitle: string;
  lookupHint: string;
  placeholder: string;
  cta: string;
  loading: string;
  demo: string;
  composite: string;
  cqs: string;
  watt: string;
  nature: string;
  taxonomy: string;
  jsonLd: string;
  apiDocs: string;
  disclaimer: string;
  errorGeneric: string;
  features: Array<{ title: string; body: string }>;
};

const FR: GreenDppCopy = {
  eyebrow: "DPP Bridge v0",
  title: "Passeport produit numérique EU — signaux AUROS Green",
  subtitle:
    "Export JSON-LD aligné EU DPP depuis le catalogue Green Index — CQS, Watt, Nature Score et EU Taxonomy indicatifs. Gratuit via l'API.",
  lookupTitle: "Générer un DPP Bridge",
  lookupHint: "Identifiant catalogue AUROS (ex. moss, toucan, klim)",
  placeholder: "moss",
  cta: "Générer le DPP",
  loading: "Génération…",
  demo: "Exemples catalogue",
  composite: "Score composite",
  cqs: "Carbon Quality",
  watt: "Watt Score",
  nature: "Nature Score",
  taxonomy: "EU Taxonomy",
  jsonLd: "Télécharger JSON-LD",
  apiDocs: "Documentation API",
  disclaimer:
    "Indicatif AUROS — alignez avec les actes délégués EU DPP avant toute soumission réglementaire.",
  errorGeneric: "Identifiant inconnu — essayez moss, toucan ou klim.",
  features: [
    {
      title: "Schema.org + circularity",
      body: "JSON-LD Product avec bloc sustainabilityInformation pour intégration ERP / marketplace.",
    },
    {
      title: "Scores AUROS unifiés",
      body: "CQS, Watt, Nature et Taxonomy depuis le même moteur que Green Index et compare.",
    },
    {
      title: "API gratuite",
      body: "GET /api/green/dpp/{id} — format JSON ou application/ld+json.",
    },
  ],
};

const EN: GreenDppCopy = {
  eyebrow: "DPP Bridge v0",
  title: "EU Digital Product Passport — AUROS Green signals",
  subtitle:
    "EU DPP-aligned JSON-LD export from the Green Index catalog — indicative CQS, Watt, Nature Score and EU Taxonomy. Free via API.",
  lookupTitle: "Generate a DPP Bridge",
  lookupHint: "AUROS catalog id (e.g. moss, toucan, klim)",
  placeholder: "moss",
  cta: "Generate DPP",
  loading: "Generating…",
  demo: "Catalog examples",
  composite: "Composite score",
  cqs: "Carbon Quality",
  watt: "Watt Score",
  nature: "Nature Score",
  taxonomy: "EU Taxonomy",
  jsonLd: "Download JSON-LD",
  apiDocs: "API documentation",
  disclaimer:
    "Indicative AUROS output — align with EU DPP delegated acts before regulatory submission.",
  errorGeneric: "Unknown id — try moss, toucan or klim.",
  features: [
    {
      title: "Schema.org + circularity",
      body: "JSON-LD Product with sustainabilityInformation block for ERP / marketplace integration.",
    },
    {
      title: "Unified AUROS scores",
      body: "CQS, Watt, Nature and Taxonomy from the same engine as Green Index and compare.",
    },
    {
      title: "Free API",
      body: "GET /api/green/dpp/{id} — JSON or application/ld+json format.",
    },
  ],
};

const ES: GreenDppCopy = {
  eyebrow: "DPP Bridge v0",
  title: "Pasaporte digital de producto UE — señales AUROS Green",
  subtitle:
    "Export JSON-LD alineado EU DPP desde el catálogo Green Index — CQS, Watt, Nature Score y EU Taxonomy indicativos. Gratis vía API.",
  lookupTitle: "Generar un DPP Bridge",
  lookupHint: "Id catálogo AUROS (ej. moss, toucan, klim)",
  placeholder: "moss",
  cta: "Generar DPP",
  loading: "Generando…",
  demo: "Ejemplos catálogo",
  composite: "Score compuesto",
  cqs: "Carbon Quality",
  watt: "Watt Score",
  nature: "Nature Score",
  taxonomy: "EU Taxonomy",
  jsonLd: "Descargar JSON-LD",
  apiDocs: "Documentación API",
  disclaimer:
    "Indicativo AUROS — alinee con los actos delegados EU DPP antes de cualquier envío regulatorio.",
  errorGeneric: "Id desconocido — pruebe moss, toucan o klim.",
  features: [
    {
      title: "Schema.org + circularity",
      body: "JSON-LD Product con bloque sustainabilityInformation para ERP / marketplace.",
    },
    {
      title: "Scores AUROS unificados",
      body: "CQS, Watt, Nature y Taxonomy desde el mismo motor que Green Index.",
    },
    {
      title: "API gratuita",
      body: "GET /api/green/dpp/{id} — formato JSON o application/ld+json.",
    },
  ],
};

const COPY: Record<Locale, GreenDppCopy> = { fr: FR, en: EN, es: ES };

export function getGreenDppCopy(locale: Locale): GreenDppCopy {
  return COPY[locale] ?? FR;
}
