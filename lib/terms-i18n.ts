import type { Locale } from "@/lib/i18n";

export type TermsMessages = {
  tag: string;
  title: string;
  body: string;
  home: string;
};

const FR: TermsMessages = {
  tag: "Légal",
  title: "Conditions d'utilisation",
  body:
    "AUROS fournit une intelligence éducative sur la tokenisation RWA, pas un conseil juridique, fiscal ou d'investissement. Scores et dossiers IA sont indicatifs. Vous restez responsable de la conformité et de la due diligence avant toute décision. Aucun déploiement on-chain n'est effectué par AUROS.",
  home: "← Accueil",
};

const EN: TermsMessages = {
  tag: "Legal",
  title: "Terms of use",
  body:
    "AUROS provides educational intelligence on RWA tokenization, not legal, tax, or investment advice. Scores and AI dossiers are indicative. You remain responsible for compliance and due diligence. AUROS does not deploy on-chain on your behalf.",
  home: "← Home",
};

const ES: TermsMessages = {
  tag: "Legal",
  title: "Términos de uso",
  body:
    "AUROS ofrece inteligencia educativa sobre tokenización RWA, no asesoramiento legal, fiscal ni de inversión. Las puntuaciones y dossiers IA son indicativos. Usted es responsable del cumplimiento y la due diligence. AUROS no despliega on-chain en su nombre.",
  home: "← Inicio",
};

export function getTermsMessages(locale: Locale): TermsMessages {
  const map = { fr: FR, en: EN, es: ES };
  return map[locale] ?? FR;
}
