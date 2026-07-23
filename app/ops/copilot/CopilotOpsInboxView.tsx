"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";

type Draft = {
  id: string;
  kind: string;
  status: string;
  title: string;
  rationale: string;
  confidence: number;
  product_id: string | null;
  apply_result: string | null;
  proposed_patch: Record<string, unknown>;
  created_at: string;
};

const jsonHeaders: HeadersInit = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

export function CopilotOpsInboxView() {
  const router = useRouter();
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contentTopic, setContentTopic] = useState("");
  const [note, setNote] = useState("");

  const handleAuthFailure = useCallback(
    (status: number) => {
      if (status === 401 || status === 403) {
        router.replace("/ops/login");
      }
    },
    [router],
  );

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ops/copilot/drafts?status=pending", {
        headers: jsonHeaders,
        credentials: "include",
      });
      const json = (await res.json()) as {
        ok?: boolean;
        drafts?: Draft[];
        error?: string;
      };
      if (!res.ok) {
        handleAuthFailure(res.status);
        setError(json.error ?? `Erreur ${res.status}`);
        return;
      }
      setDrafts(json.drafts ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  async function scanCatalog() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ops/copilot/drafts/scan", {
        method: "POST",
        headers: jsonHeaders,
        credentials: "include",
        body: JSON.stringify({ action: "catalog", limit: 8 }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) {
        handleAuthFailure(res.status);
        setError(json.error ?? `Scan failed ${res.status}`);
        return;
      }
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  async function scanCare() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ops/copilot/drafts/scan", {
        method: "POST",
        headers: jsonHeaders,
        credentials: "include",
        body: JSON.stringify({ action: "care", limit: 3 }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) {
        handleAuthFailure(res.status);
        setError(json.error ?? `Care drafts failed ${res.status}`);
        return;
      }
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  async function createContent() {
    if (!contentTopic.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ops/copilot/drafts/scan", {
        method: "POST",
        headers: jsonHeaders,
        credentials: "include",
        body: JSON.stringify({
          action: "content",
          topic: contentTopic.trim(),
          kind_hint: "faq",
        }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) {
        handleAuthFailure(res.status);
        setError(json.error ?? `Content draft failed ${res.status}`);
        return;
      }
      setContentTopic("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  async function review(id: string, status: "approved" | "rejected") {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/ops/copilot/drafts/${encodeURIComponent(id)}/review`, {
        method: "POST",
        headers: jsonHeaders,
        credentials: "include",
        body: JSON.stringify({
          status,
          review_note: note.trim() || undefined,
        }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) {
        handleAuthFailure(res.status);
        setError(json.error ?? `Review failed ${res.status}`);
        return;
      }
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  async function lock() {
    await fetch("/api/ops/session", { method: "DELETE", credentials: "include" });
    router.replace("/ops/login");
    router.refresh();
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount load once
  }, []);

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-amber-400/80">
          Ops · Copilot
        </p>
        <h1 className="font-display text-3xl font-medium text-white md:text-4xl">
          Inbox drafts
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-white/55">
          Les agents catalogue / contenu créent des drafts. Approve marque
          « queued_for_manual_merge » — aucun score ni CFU n’est modifié
          automatiquement.
        </p>
      </header>

      <section className="space-y-4 border border-white/[0.08] bg-black/40 p-5">
        <div className="flex flex-wrap gap-2">
          <PrimaryButton type="button" onClick={load} disabled={loading}>
            Charger pending
          </PrimaryButton>
          <button
            type="button"
            onClick={scanCatalog}
            disabled={loading}
            className="min-h-[44px] rounded-full border border-white/20 px-4 font-mono text-[11px] uppercase tracking-wider text-white/60 hover:text-white disabled:opacity-30"
          >
            Scan catalogue
          </button>
          <button
            type="button"
            onClick={() => void scanCare()}
            disabled={loading}
            className="min-h-[44px] rounded-full border border-emerald-400/30 px-4 font-mono text-[11px] uppercase tracking-wider text-emerald-200/70 hover:text-emerald-100 disabled:opacity-30"
          >
            Drafts care email
          </button>
          <button
            type="button"
            onClick={() => void lock()}
            className="min-h-[44px] rounded-full border border-white/10 px-4 font-mono text-[11px] uppercase tracking-wider text-white/40 hover:text-white/70"
          >
            Lock session
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            value={contentTopic}
            onChange={(e) => setContentTopic(e.target.value)}
            placeholder="Sujet FAQ / contenu…"
            className="min-w-[220px] flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
          />
          <button
            type="button"
            onClick={createContent}
            disabled={loading || !contentTopic.trim()}
            className="min-h-[44px] rounded-full border border-white/20 px-4 font-mono text-[11px] uppercase tracking-wider text-white/60 hover:text-white disabled:opacity-30"
          >
            Draft contenu
          </button>
        </div>
        <label className="block space-y-1">
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/35">
            Note review
          </span>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white"
          />
        </label>
        {error ? (
          <p className="text-sm text-red-400/90" role="alert">
            {error}
          </p>
        ) : null}
      </section>

      <div className="space-y-4">
        {drafts.length === 0 ? (
          <p className="text-sm text-white/40">Aucun draft pending.</p>
        ) : (
          drafts.map((d) => (
            <article
              key={d.id}
              className="space-y-3 border border-white/[0.08] bg-black/30 p-4"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-sm font-medium text-white">{d.title}</h2>
                <span className="font-mono text-[10px] uppercase tracking-wider text-white/35">
                  {d.kind} · conf {(d.confidence * 100).toFixed(0)}%
                </span>
              </div>
              <p className="text-xs text-white/50">{d.rationale}</p>
              <pre className="max-h-40 overflow-auto rounded border border-white/5 bg-white/[0.03] p-3 font-mono text-[10px] text-white/55">
                {JSON.stringify(d.proposed_patch, null, 2)}
              </pre>
              <div className="flex flex-wrap gap-2">
                <PrimaryButton
                  type="button"
                  onClick={() => review(d.id, "approved")}
                  disabled={loading}
                >
                  Approve
                </PrimaryButton>
                <button
                  type="button"
                  onClick={() => review(d.id, "rejected")}
                  disabled={loading}
                  className="min-h-[44px] rounded-full border border-red-400/30 px-4 font-mono text-[11px] uppercase tracking-wider text-red-200/70 hover:text-red-100 disabled:opacity-30"
                >
                  Reject
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
