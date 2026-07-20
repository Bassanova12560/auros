import type { CatalogMap, Locale } from "@/lib/i18n";

export type JurisdictionProductTier = "starter" | "launch";

export type JurisdictionProduct = {
  id: JurisdictionProductTier;
  amountCents: number;
  currency: "eur";
  name: CatalogMap< string>;
  description: CatalogMap< string>;
};

export const JURISDICTION_PRODUCTS: Record<
  JurisdictionProductTier,
  JurisdictionProduct
> = {
  starter: {
    id: "starter",
    amountCents: 500_000,
    currency: "eur",
    name: {
      fr: "AUROS Starter Kit — Tokenisation RWA",
      en: "AUROS Starter Kit — RWA Tokenization",
      es: "AUROS Starter Kit — Tokenización RWA",
    },
    description: {
      fr: "Structure juridique + prestataire tech recommandé",
      en: "Legal structure + recommended tech provider",
      es: "Estructura jurídica + proveedor tech recomendado",
    },
  },
  launch: {
    id: "launch",
    amountCents: 15_000_00,
    currency: "eur",
    name: {
      fr: "AUROS Accompagnement Launch",
      en: "AUROS Launch Support",
      es: "AUROS Acompañamiento Launch",
    },
    description: {
      fr: "Suivi complet jusqu'à l'émission du token",
      en: "Full support through token issuance",
      es: "Seguimiento completo hasta la emisión del token",
    },
  },
};

export function jurisdictionProduct(
  tier: JurisdictionProductTier
): JurisdictionProduct {
  return JURISDICTION_PRODUCTS[tier];
}
