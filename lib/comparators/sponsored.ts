/**
 * Config-driven sponsored / partnership slots for the compare hub.
 * Never alters live APY ranking — display-only, badge ≠ Verified.
 */

export type SponsoredLabel = "sponsored" | "partenariat";

export type SponsoredSlot = {
  /** Product row id from comparator catalogs (manual or live). */
  productId: string;
  /** Public badge key — i18n maps to Sponsored / Partenariat. */
  label?: SponsoredLabel;
};

/**
 * Fill only with real partnerships. Empty = no sponsored rows shown.
 * Payment never changes APY sort — slots are pinned in a distinct strip.
 */
export const SPONSORED_SLOTS: readonly SponsoredSlot[] = [
  // Example (keep commented until a real partnership is live):
  // { productId: "spiko-eutbl", label: "partenariat" },
];

export function getSponsoredSlot(
  productId: string
): SponsoredSlot | undefined {
  const id = productId.trim();
  if (!id) return undefined;
  return SPONSORED_SLOTS.find((slot) => slot.productId === id);
}

export function isSponsoredProductId(productId: string): boolean {
  return getSponsoredSlot(productId) !== undefined;
}

export function listSponsoredProductIds(): string[] {
  return SPONSORED_SLOTS.map((slot) => slot.productId);
}
