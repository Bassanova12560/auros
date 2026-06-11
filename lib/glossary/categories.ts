import type { GlossaryCategory, GlossaryCategoryId } from "./types";

export const GLOSSARY_CATEGORIES: GlossaryCategory[] = [
  {
    id: "mica",
    label: "MiCA & régulation UE",
    labelEn: "MiCA & EU regulation",
    labelEs: "MiCA y regulación UE",
    description:
      "Cadre européen des crypto-actifs, agréments et obligations documentaires pour les émetteurs RWA.",
  },
  {
    id: "token-standards",
    label: "Standards de jetons",
    labelEn: "Token standards",
    labelEs: "Estándares de tokens",
    description:
      "Normes techniques on-chain (ERC-3643, ERC-20…) et typologie security vs utility.",
  },
  {
    id: "structures",
    label: "Structures & documentation",
    labelEn: "Structures & documentation",
    labelEs: "Estructuras y documentación",
    description:
      "SPV, data room, prospectus et mécanismes de gouvernance pour une émission RWA.",
  },
  {
    id: "markets",
    label: "Marchés & investissement",
    labelEn: "Markets & investment",
    labelEs: "Mercados e inversión",
    description:
      "Liquidité, rendement, KYC et parcours investisseur sur les actifs tokenisés.",
  },
  {
    id: "green-esg",
    label: "Green & ESG",
    labelEn: "Green & ESG",
    labelEs: "Green y ESG",
    description:
      "Finance durable, taxonomie, crédits carbone et tokenisation énergétique.",
  },
];

export const GLOSSARY_CATEGORY_ORDER: GlossaryCategoryId[] = [
  "mica",
  "token-standards",
  "structures",
  "markets",
  "green-esg",
];

export function getGlossaryCategory(id: GlossaryCategoryId): GlossaryCategory {
  const cat = GLOSSARY_CATEGORIES.find((c) => c.id === id);
  if (!cat) throw new Error(`Unknown glossary category: ${id}`);
  return cat;
}
