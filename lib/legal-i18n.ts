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
    "AUROS (getauros.com) — studio de préparation à la tokenisation d'actifs réels et couche Resource Layer (démos labellisées). Posture juridictionnelle : opérations orientées UE. Immatriculation / entité juridique et pack due diligence fournis sur demande écrite (legal@auros.app, resources@getauros.com) — nous ne publions pas de SIRET inventé. Ce service ne déploie pas de smart contracts ni n'émet de jetons pour votre compte ; les parcours payants et de conformité restent sous revue humaine (HITL).",
  privacyLink: "Politique de confidentialité →",
  home: "← Accueil",
};

const EN: LegalMessages = {
  tag: "Legal",
  title: "Legal notice",
  body:
    "AUROS (getauros.com) — preparation studio for real-world asset tokenization and Resource Layer (demos clearly labeled). Jurisdiction posture: EU-facing operations. Imprint / legal entity and due-diligence packs on written request (legal@auros.app, resources@getauros.com) — we do not publish invented registration numbers. We do not deploy smart contracts or issue tokens on your behalf; paid and compliance paths remain human-in-the-loop.",
  privacyLink: "Privacy policy →",
  home: "← Home",
};

const ES: LegalMessages = {
  tag: "Legal",
  title: "Aviso legal",
  body:
    "AUROS (getauros.com) — estudio de preparación para tokenización de activos reales y Resource Layer (demos etiquetadas). Orientación UE. Datos del editor / imprint y packs de due diligence bajo solicitud escrita (legal@auros.app, resources@getauros.com). No desplegamos contratos inteligentes ni emitimos tokens en su nombre; los flujos de pago y compliance siguen HITL.",
  privacyLink: "Política de privacidad →",
  home: "← Inicio",
};

export function getLegalMessages(locale: Locale): LegalMessages {
  const map = { fr: FR, en: EN, es: ES };
  return map[resolveCatalogLocale(locale)] ?? FR;
}
