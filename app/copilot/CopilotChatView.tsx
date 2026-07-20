"use client";

import { useState } from "react";

import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";

type ChatTurn = { role: "user" | "assistant"; content: string };
type Citation = { title: string; url: string };

export function CopilotChatView() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<ChatTurn[]>([]);
  const [citations, setCitations] = useState<Citation[]>([]);
  const [provider, setProvider] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send() {
    const message = input.trim();
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
        }),
      });
      const json = (await res.json()) as {
        reply?: string;
        citations?: Citation[];
        provider?: string;
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
      setProvider(json.provider ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

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
          Posez une question sur le comparateur RWA, les juridictions, le
          Protocol ou ChargeFlow. Réponses sourcées — indicatif uniquement, pas
          de conseil juridique.
        </p>
      </header>

      <div className="space-y-4 border border-white/[0.08] bg-black/40 p-5 md:p-6">
        <div className="max-h-[420px] space-y-4 overflow-y-auto">
          {history.length === 0 ? (
            <p className="text-sm text-white/40">
              Exemples : « Compare maple-usdc et realt-portfolio », « Explique
              ChargeFlow CFU-E », « Top stablecoins APY ».
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
                  void send();
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
