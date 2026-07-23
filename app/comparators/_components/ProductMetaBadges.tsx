"use client";

import type { ResolvedProductMeta } from "@/lib/comparators/product-meta";
import { getSponsoredSlot } from "@/lib/comparators/sponsored";
import { SponsoredBadge } from "./SponsoredBadge";
import { useComparatorPage } from "./useComparatorPage";

export function ProductMetaBadges({
  meta,
  productId,
}: {
  meta: ResolvedProductMeta;
  productId?: string;
}) {
  const { messages } = useComparatorPage();
  const badges = messages.productBadges;
  const sponsored = productId ? getSponsoredSlot(productId) : undefined;

  return (
    <>
      {sponsored ? <SponsoredBadge label={sponsored.label} /> : null}
      {meta.accreditedOnly ? (
        <span
          className="inline-flex shrink-0 items-center gap-0.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-amber-200/90"
          title={badges.accreditedHint}
        >
          <span aria-hidden>⚠</span>
          {badges.accredited}
        </span>
      ) : null}
      {meta.highlight === "new" ? (
        <span className="inline-flex shrink-0 rounded-full border border-violet-500/25 bg-violet-500/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-violet-200/90">
          {badges.new}
        </span>
      ) : null}
      {meta.highlight === "popular" ? (
        <span className="inline-flex shrink-0 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-emerald-200/90">
          {badges.popular}
        </span>
      ) : null}
    </>
  );
}
