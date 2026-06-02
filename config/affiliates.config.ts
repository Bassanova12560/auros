/**
 * Liens de parrainage — comparateurs Auros.
 * Remplir au fur et à mesure des partenariats.
 */
export const AFFILIATE_LINKS = {
  ondo: "",
  mountain: "",
  openeden: "",
  maple: "",
  superstate: "",
  backed: "",
  centrifuge: "",
  goldfinch: "",
} as const;

export type AffiliateKey = keyof typeof AFFILIATE_LINKS;
