import { resolveCatalogLocale, type Locale } from "@/lib/i18n";

export type LegalMessages = {
  tag: string;
  title: string;
  body: string;
  privacyLink: string;
  home: string;
};

const FR: LegalMessages = {
  tag: "Légal",
  title: "Mentions légales",
  body:
    "AUROS — Studio de préparation à la tokenisation d'actifs réels. Informations éditeur et immatriculation publiées avant lancement public. Ce service ne déploie pas de smart contracts ni n'émet de jetons pour votre compte.",
  privacyLink: "Politique de confidentialité →",
  home: "← Accueil",
};

const EN: LegalMessages = {
  tag: "Legal",
  title: "Legal notice",
  body:
    "AUROS — Regulated preparation studio for real-world asset tokenization. Publisher details published before public launch. We do not deploy smart contracts or issue tokens on your behalf.",
  privacyLink: "Privacy policy →",
  home: "← Home",
};

const ES: LegalMessages = {
  tag: "Legal",
  title: "Aviso legal",
  body:
    "AUROS — Estudio de preparación para tokenización de activos reales. Datos del editor antes del lanzamiento público. No desplegamos contratos inteligentes ni emitimos tokens en su nombre.",
  privacyLink: "Política de privacidad →",
  home: "← Inicio",
};

export function getLegalMessages(locale: Locale): LegalMessages {
  const map = { fr: FR, en: EN, es: ES };
  return map[resolveCatalogLocale(locale)] ?? FR;
}
