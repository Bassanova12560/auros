"use client";

import { useState } from "react";

import { useComparatorPage } from "./useComparatorPage";
import { buildCompareHubShareUrl } from "@/lib/comparators/compare-selection";
import { buildCopilotHref } from "@/lib/copilot/types";

type CompareAiAssistProps = {
  selectedIds: string[];
  onAddIds: (ids: string[]) => void;
};

/**
 * Inline Copilot assist on /compare — explain selection + propose RWAs to add.
 */
export function CompareAiAssist({
  selectedIds,
  onAddIds,
}: CompareAiAssistProps) {
  const { locale, messages } = useComparatorPage();
  const copy = messages.compareHub.aiAssist;
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState<string | null>(null);
  const [suggested, setSuggested] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function run(mode: "explain" | "suggest") {
    setLoading(true);
    setError(null);
    const message =
      mode === "suggest"
        ? selectedIds.length
          ? copy.promptSuggestWithSelection
          : copy.promptSuggestEmpty
        : selectedIds.length >= 2
          ? copy.promptExplainSelection(selectedIds.join(", "))
          : copy.promptExplainEmpty;
    try {
      const res = await fetch("/api/v1/copilot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          locale,
          context: {
            surface: "compare",
            product_ids: selectedIds.slice(0, 4),
          },
        }),
      });
      const json = (await res.json()) as {
        reply?: string;
        suggested_product_ids?: string[];
        error?: { message?: string };
      };
      if (!res.ok) {
        setError(json.error?.message ?? copy.errorStatus(res.status));
        return;
      }
      setReply(json.reply ?? "");
      setSuggested(json.suggested_product_ids ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : copy.networkError);
    } finally {
      setLoading(false);
    }
  }

  const mergeHref = buildCompareHubShareUrl(
    [...selectedIds, ...suggested].slice(0, 4)
  );

  return (
    <section
      className="mb-8 border border-white/[0.08] bg-black/30 px-4 py-4 md:px-5"
      aria-label={copy.ariaLabel}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
          {copy.eyebrow}
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={() => void run("explain")}
            className="rounded-full border border-white/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-white/55 transition hover:border-white/30 hover:text-white disabled:opacity-50"
          >
            {loading ? "…" : copy.explain}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => void run("suggest")}
            className="rounded-full border border-emerald-500/30 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-emerald-300/80 transition hover:border-emerald-400/50 hover:text-emerald-200 disabled:opacity-50"
          >
            {loading ? "…" : copy.suggest}
          </button>
          <a
            href={buildCopilotHref({
              surface: "compare",
              product_ids: selectedIds.slice(0, 4),
            })}
            className="rounded-full border border-white/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-white/40 transition hover:text-white/70"
          >
            {copy.openCopilot}
          </a>
        </div>
      </div>

      {error ? (
        <p className="mt-3 text-sm text-red-400/90" role="alert">
          {error}
        </p>
      ) : null}
      {reply ? (
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-white/70">
          {reply}
        </p>
      ) : (
        <p className="mt-3 text-sm text-white/35">{copy.hint}</p>
      )}
      {suggested.length > 0 ? (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-wider text-white/35">
            {copy.add}
          </span>
          {suggested.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => onAddIds([id])}
              className="rounded-full border border-emerald-500/25 px-3 py-1 font-mono text-[10px] text-emerald-300/90 transition hover:border-emerald-400/40"
            >
              + {id}
            </button>
          ))}
          <a
            href={mergeHref}
            className="font-mono text-[10px] uppercase tracking-wider text-white/40 underline-offset-2 hover:text-white/70 hover:underline"
          >
            {copy.applyViaUrl}
          </a>
        </div>
      ) : null}
    </section>
  );
}
