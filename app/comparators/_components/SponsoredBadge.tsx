"use client";

import { useComparatorPage } from "./useComparatorPage";
import type { SponsoredLabel } from "@/lib/comparators/sponsored";

type SponsoredBadgeProps = {
  label?: SponsoredLabel;
};

/** Explicit partnership badge — never implies Verified or higher APY. */
export function SponsoredBadge({ label = "partenariat" }: SponsoredBadgeProps) {
  const { messages } = useComparatorPage();
  const copy = messages.compareHub.sponsored;
  const text = label === "sponsored" ? copy.badgeSponsored : copy.badgePartenariat;

  return (
    <span
      className="inline-flex shrink-0 rounded-full border border-sky-500/30 bg-sky-500/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-sky-100/90"
      title={copy.hint}
    >
      {text}
    </span>
  );
}
