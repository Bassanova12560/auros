/** Indicative ESG / greenwashing screen — claims without proof ignored at score. */

export const ESG_CLAIM_QUESTION =
  "Claims RSE / CSRD / « green » (eau, carbone, fournisseur) sont-ils liés à une preuve vérifiable (URL, scope audit) — pas marketing seul ?";

export const ESG_CLAIM_DISCLAIMER =
  "AUROS ne certifie pas CSRD ni TNFD — les claims sans URL/preuve sont ignorés au score Trust Pack (anti-washing).";

export const ESG_CLAIM_LINKS = [
  { href: "/green/csrd-check", label: "Check CSRD Green" },
  { href: "/green/impact-report", label: "Impact report" },
  { href: "/verify", label: "Verify preuves" },
] as const;
