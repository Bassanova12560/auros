"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { buildCompareHubShareUrl } from "@/lib/comparators/compare-selection";
import {
  COPILOT_RTMS_STORAGE_KEY,
  parseCopilotSearchParams,
  suggestionsForContext,
  type CopilotPageContext,
} from "@/lib/copilot/types";

type ChatTurn = { role: "user" | "assistant"; content: string };
type Citation = { title: string; url: string };

function contextBannerLabel(ctx: CopilotPageContext): string | null {
  if (ctx.surface === "chargeflow") return "Contexte : ChargeFlow";
  if (ctx.surface === "green") return "Contexte : AUROS Green";
  if (ctx.surface === "rtms") return "Contexte : RTMS";
  if (ctx.surface === "jurisdiction" && ctx.jurisdiction_id) {
    return `Contexte : juridiction · ${ctx.jurisdiction_id}`;
  }
  if (ctx.surface === "jurisdiction") return "Contexte : juridictions";
  if (ctx.surface === "compare" && ctx.product_ids?.length) {
    return `Contexte : compare · ${ctx.product_ids.join(", ")}`;
  }
  if (ctx.surface === "compare") return "Contexte : comparateur RWA";
  return null;
}

function readRtmsBriefFromStorage(): string | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = sessionStorage.getItem(COPILOT_RTMS_STORAGE_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as {
      summary?: string;
      score?: number;
      tier?: string;
      priorities?: string[];
    };
    const parts = [
      parsed.summary ? `Summary: ${parsed.summary}` : null,
      parsed.score != null ? `Indicative score: ${parsed.score}/100` : null,
      parsed.tier ? `Tier: ${parsed.tier}` : null,
      parsed.priorities?.length
        ? `Priorities: ${parsed.priorities.join(" · ")}`
        : null,
    ].filter(Boolean);
    return parts.length ? parts.join("\n") : undefined;
  } catch {
    return undefined;
  }
}

export function CopilotChatView() {
  const searchParams = useSearchParams();
  const pageContextBase = useMemo(
    () =>
      parseCopilotSearchParams({
        context: searchParams.get("context"),
        ids: searchParams.get("ids"),
        jid: searchParams.get("jid"),
      }),
    [searchParams]
  );
  const [rtmsBrief, setRtmsBrief] = useState<string | undefined>();
  useEffect(() => {
    if (pageContextBase.surface === "rtms") {
      setRtmsBrief(readRtmsBriefFromStorage());
    }
  }, [pageContextBase.surface]);

  const pageContext: CopilotPageContext = useMemo(
    () => ({
      ...pageContextBase,
      rtms_brief: rtmsBrief,
    }),
    [pageContextBase, rtmsBrief]
  );

  const suggestions = useMemo(
    () => suggestionsForContext(pageContext),
    [pageContext]
  );
  const banner = contextBannerLabel(pageContext);

  const [input, setInput] = useState("");
  const [history, setHistory] = useState<ChatTurn[]>([]);
  const [citations, setCitations] = useState<Citation[]>([]);
  const [suggestedIds, setSuggestedIds] = useState<string[]>([]);
  const [provider, setProvider] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendMessage(raw: string) {
    const message = raw.trim();
    if (!message || loading) return;
    setLoading(true);
    setError(null);
    const nextHistory = [...history, { role: "user" as const, content: message }];
    setHistory(nextHistory);
    setInput("");
    try {
      const res = await fetch("/api/v1/copilot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          locale: "fr",
          history: history.slice(-6),
          context: pageContext,
        }),
      });
      const json = (await res.json()) as {
        reply?: string;
        citations?: Citation[];
        provider?: string;
        suggested_product_ids?: string[];
        error?: { message?: string };
      };
      if (!res.ok) {
        setError(json.error?.message ?? `Erreur ${res.status}`);
        return;
      }
      setHistory([
        ...nextHistory,
        { role: "assistant", content: json.reply ?? "" },
      ]);
      setCitations(json.citations ?? []);
      setSuggestedIds(json.suggested_product_ids ?? []);
      setProvider(json.provider ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  function send() {
    void sendMessage(input);
  }

  const compareHref =
    suggestedIds.length > 0
      ? buildCompareHubShareUrl([
          ...(pageContext.product_ids ?? []),
          ...suggestedIds,
        ])
      : null;

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-emerald-400/80">
          Copilot
        </p>
        <h1 className="font-display text-3xl font-medium text-white md:text-4xl">
          Assistant AUROS
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-white/55">
          Posez une question sur le comparateur RWA, Green, les juridictions, le
          Protocol ou ChargeFlow. Réponses sourcées — indicatif uniquement, pas
          de conseil juridique.
        </p>
        {banner ? (
          <p className="font-mono text-[11px] tracking-wide text-emerald-300/70">
            {banner}
          </p>
        ) : null}
      </header>

      <div className="space-y-4 border border-white/[0.08] bg-black/40 p-5 md:p-6">
        {history.length === 0 ? (
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                disabled={loading}
                onClick={() => void sendMessage(s)}
                className="rounded-full border border-white/10 px-3 py-1.5 text-left font-mono text-[10px] uppercase tracking-wider text-white/45 transition hover:border-white/25 hover:text-white/75 disabled:opacity-50"
              >
                {s}
              </button>
            ))}
          </div>
        ) : null}

        <div className="max-h-[420px] space-y-4 overflow-y-auto">
          {history.length === 0 ? (
            <p className="text-sm text-white/40">
              Choisissez une suggestion ou tapez votre question.
            </p>
          ) : (
            history.map((turn, i) => (
              <div
                key={`${turn.role}-${i}`}
                className={
                  turn.role === "user"
                    ? "ml-8 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/85"
                    : "mr-4 rounded-lg border border-emerald-500/15 bg-emerald-500/[0.04] px-4 py-3 text-sm whitespace-pre-wrap text-white/80"
                }
              >
                {turn.content}
              </div>
            ))
          )}
        </div>

        {suggestedIds.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2 border-t border-white/[0.06] pt-3">
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/35">
              RWA proposés
            </span>
            {suggestedIds.map((id) => (
              <span
                key={id}
                className="rounded-full border border-emerald-500/25 px-2.5 py-1 font-mono text-[10px] text-emerald-300/90"
              >
                {id}
              </span>
            ))}
            {compareHref ? (
              <a
                href={compareHref}
                className="font-mono text-[10px] uppercase tracking-wider text-emerald-400/80 underline-offset-2 hover:underline"
              >
                Ajouter au comparateur →
              </a>
            ) : null}
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="block flex-1 space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
              Message
            </span>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={3}
              placeholder="Votre question…"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
            />
          </label>
          <PrimaryButton
            type="button"
            onClick={send}
            disabled={loading || !input.trim()}
          >
            {loading ? "…" : "Envoyer"}
          </PrimaryButton>
        </div>

        {error ? (
          <p className="text-sm text-red-400/90" role="alert">
            {error}
          </p>
        ) : null}
        {provider ? (
          <p className="font-mono text-[10px] uppercase tracking-wider text-white/30">
            provider · {provider}
          </p>
        ) : null}
        {citations.length > 0 ? (
          <ul className="space-y-1 text-xs text-white/45">
            {citations.map((c) => (
              <li key={c.url}>
                <a
                  href={c.url}
                  className="underline-offset-2 hover:text-white hover:underline"
                >
                  {c.title}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
