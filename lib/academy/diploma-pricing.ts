export type DiplomaProductType = "individual" | "institution";

export type DiplomaProduct = {
  id: DiplomaProductType;
  amountCents: number;
  currency: "eur";
  name: string;
  description: string;
  priceLabel: string;
};

export const DIPLOMA_PRODUCTS: Record<DiplomaProductType, DiplomaProduct> = {
  individual: {
    id: "individual",
    amountCents: 3_900,
    currency: "eur",
    name: "Diplôme PDF AUROS Academy — Fondamentaux RWA",
    description:
      "Certificat nominatif à conserver (CV, LinkedIn). Vérification en ligne incluse. Paiement unique — le PDF reste à vie.",
    priceLabel: "39 €",
  },
  institution: {
    id: "institution",
    amountCents: 24_900,
    currency: "eur",
    name: "Certificat Établissement AUROS Academy",
    description:
      "Document officiel pour votre organisation (bureaux, site, RH). Engagement formation RWA — paiement unique, certificat permanent.",
    priceLabel: "249 €",
  },
};

export function diplomaProduct(type: DiplomaProductType): DiplomaProduct {
  return DIPLOMA_PRODUCTS[type];
}
