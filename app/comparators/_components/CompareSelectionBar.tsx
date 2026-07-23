"use client";

import { useCallback, useState } from "react";

import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { buildCompareShareUrl } from "@/lib/comparators";
import { buildCopilotHref } from "@/lib/copilot/types";
import { useComparatorPage } from "./useComparatorPage";

type CompareSelectionBarProps = {
  count: number;
  canCompare: boolean;
  maxReached: boolean;
  selectedIds: string[];
  sharePath?: string;
  onCompare: () => void;
  onClear: () => void;
};

export function CompareSelectionBar({
  count,
  canCompare,
  maxReached,
  selectedIds,
  sharePath = "/compare",
  onCompare,
  onClear,
}: CompareSelectionBarProps) {
  const { messages } = useComparatorPage();
  const copy = messages.compareHub.selection;
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  const handleShareLink = useCallback(async () => {
    const url = buildCompareShareUrl(
      sharePath,
      selectedIds,
      typeof window !== "undefined" ? window.location.origin : ""
    );
    try {
      await navigator.clipboard.writeText(url);
      setShareFeedback(copy.linkCopied);
      window.setTimeout(() => setShareFeedback(null), 2500);
    } catch {
      setShareFeedback(url);
    }
  }, [copy.linkCopied, selectedIds, sharePath]);

  if (count === 0) return null;

  return (
    <div
      className="compare-selection-bar"
      role="region"
      aria-label={copy.barLabel}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[11px] text-white/80">
            {copy.count(count)}
          </p>
          {shareFeedback ? (
            <p className="mt-0.5 font-mono text-[10px] text-white/50">
              {shareFeedback}
            </p>
          ) : maxReached ? (
            <p className="mt-0.5 font-mono text-[10px] text-white/40">
              {copy.maxReached}
            </p>
          ) : !canCompare ? (
            <p className="mt-0.5 font-mono text-[10px] text-white/40">
              {copy.compareHint}
            </p>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {canCompare ? (
            <button
              type="button"
              onClick={() => void handleShareLink()}
              className="rounded-full border border-white/10 px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-white/45 transition hover:border-white/20 hover:text-white/70"
            >
              {copy.copyLink}
            </button>
          ) : null}
          {selectedIds.length > 0 ? (
            <a
              href={buildCopilotHref({
                surface: "compare",
                product_ids: selectedIds.slice(0, 4),
              })}
              className="rounded-full border border-emerald-500/25 px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-emerald-300/80 transition hover:border-emerald-400/40 hover:text-emerald-200"
            >
              {copy.copilot}
            </a>
          ) : null}
          <button
            type="button"
            onClick={onClear}
            className="rounded-full border border-white/10 px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-white/45 transition hover:border-white/20 hover:text-white/70"
          >
            {copy.clear}
          </button>
          <PrimaryButton
            type="button"
            disabled={!canCompare}
            showArrow={false}
            className="!px-4 !py-2.5 !text-[11px]"
            onClick={onCompare}
          >
            {copy.compare}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
