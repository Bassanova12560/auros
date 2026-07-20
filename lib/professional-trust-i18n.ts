import { resolveCatalogLocale, type Locale } from "@/lib/i18n";

export type ProfessionalTrustMessages = {
  eyebrow: string;
  body: string;
  badges: readonly string[];
};

const FR: ProfessionalTrustMessages = {
  eyebrow: "Sérieux & transparent",
  body:
    "AUROS est un studio de préparation réglementée : score indicatif, data room structurée, dossier IA. Pas de conseil juridique, pas d'émission de jetons à votre place.",
  badges: ["MiCA-ready framing", "RGPD", "Données chiffrées en transit", "Revue humaine possible"],
};

const EN: ProfessionalTrustMessages = {
  eyebrow: "Serious & transparent",
  body:
    "AUROS is a regulated preparation studio: indicative score, structured data room, AI dossier. Not legal advice, not token issuance on your behalf.",
  badges: ["MiCA-ready framing", "GDPR", "Encrypted in transit", "Human review available"],
};

const ES: ProfessionalTrustMessages = {
  eyebrow: "Serio y transparente",
  body:
    "AUROS es un estudio de preparación regulada: puntuación indicativa, data room, dossier IA. No es asesoramiento legal ni emisión de tokens por usted.",
  badges: ["Marco MiCA", "RGPD", "Datos cifrados en tránsito", "Revisión humana"],
};

export function getProfessionalTrustMessages(locale: Locale): ProfessionalTrustMessages {
  const map = { fr: FR, en: EN, es: ES };
  return map[resolveCatalogLocale(locale)] ?? FR;
}
