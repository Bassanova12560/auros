"use client";

import { Eyebrow } from "@/app/_components/ui/Eyebrow";
import { ComparatorStats } from "./ComparatorStats";
import { useComparatorPage } from "./useComparatorPage";
import { getPageCopy } from "@/lib/comparators/page-copy";
import type { ComparatorPageId } from "@/lib/comparators/constants";
import type { ComparatorSummary } from "@/lib/comparators/stats";

type ComparatorPageHeaderProps = {
  pageId: ComparatorPageId;
  summary: ComparatorSummary;
  fetchedAt: string;
  source: "live" | "fallback";
};

export function ComparatorPageHeader({
  pageId,
  summary,
  fetchedAt,
  source,
}: ComparatorPageHeaderProps) {
  const { messages } = useComparatorPage();
  const copy = getPageCopy(messages, pageId);

  return (
    <header className="mb-6 md:mb-10">
      <Eyebrow>{copy.eyebrow}</Eyebrow>
      <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight text-white md:mt-4 md:text-4xl">
        {copy.title}
      </h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted md:mt-3 md:text-base">
        {copy.subtitle}
      </p>
      <p className="mt-2 hidden max-w-xl font-mono text-[11px] leading-relaxed text-white/35 sm:block">
        {copy.disclaimer}
      </p>
      <ComparatorStats
        pageId={pageId}
        summary={summary}
        fetchedAt={fetchedAt}
        source={source}
        className="mt-5 md:mt-8"
      />
    </header>
  );
}
