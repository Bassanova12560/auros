"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useComparatorPage } from "./useComparatorPage";
import { COMPARATOR_ROUTES, isCompareHubPath } from "@/lib/comparators";
import { pageCopyForId } from "@/lib/comparators/page-copy";

export function ComparatorBrand() {
  const pathname = usePathname();
  const { messages, entry } = useComparatorPage();
  const isCompareHub = isCompareHubPath(pathname);
  const pageCopy = pageCopyForId(messages, entry?.id);
  const tool = isCompareHub
    ? messages.compareHub.tool
    : (pageCopy?.tool ?? entry?.tool ?? "comparateur");
  const brandHref = isCompareHub
    ? COMPARATOR_ROUTES.compare
    : (entry?.href ?? COMPARATOR_ROUTES.stablecoins);

  return (
    <Link href={brandHref} className="group flex items-center gap-3">
      <span className="font-display text-xs font-semibold tracking-[0.35em] text-white">
        AUROS
      </span>
      <span className="h-3 w-px bg-white/15" aria-hidden />
      <span className="font-mono text-[10px] lowercase tracking-wide text-white/45 transition group-hover:text-white/70">
        {tool}
      </span>
    </Link>
  );
}
