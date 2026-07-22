"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";

import {
  GreenBackLink,
  GreenDisclaimer,
  GreenPageHeader,
  GreenPanel,
} from "@/app/green/_components/green-ui";
import type {
  TollExceptionKind,
  TollExceptionSeverity,
  TollExceptionStatus,
} from "@/lib/toll/exceptions";

type ExceptionRow = {
  id: string;
  kind: TollExceptionKind;
  severity: TollExceptionSeverity;
  status: TollExceptionStatus;
  title: string;
  summary: string;
  assetDnaId?: string;
  assignee?: string;
  dueAt?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  evidenceCount?: number;
  resolutionNote?: string;
};

const KINDS: Array<{ id: TollExceptionKind; label: string }> = [
  { id: "missing_docs", label: "Missing docs" },
  { id: "jurisdiction_conflict", label: "Jurisdiction conflict" },
  { id: "stale_data", label: "Stale data" },
  { id: "partial_availability", label: "Partial availability" },
  { id: "other", label: "Other" },
];

const SEVERITIES: TollExceptionSeverity[] = ["low", "medium", "high"];

const field =
  "mt-1.5 w-full border border-white/15 bg-black/50 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/50";

export default function TollExceptionsDeskPage() {
  const [rows, setRows] = useState<ExceptionRow[]>([]);
  const [loadErr, setLoadErr] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "err">("idle");
  const [msg, setMsg] = useState<string | null>(null);

  const [kind, setKind] = useState<TollExceptionKind>("missing_docs");
  const [severity, setSeverity] = useState<TollExceptionSeverity>("medium");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [assetDnaId, setAssetDnaId] = useState("");
  const [assignee, setAssignee] = useState("");
  const [autoSla, setAutoSla] = useState(true);
  const [apiKey, setApiKey] = useState("");

  const [resolveId, setResolveId] = useState("");
  const [resolveNote, setResolveNote] = useState("");

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/toll/exceptions?limit=40");
      const json = (await res.json()) as {
        ok?: boolean;
        exceptions?: ExceptionRow[];
        error?: string;
      };
      if (!res.ok || !json.ok) {
        setLoadErr(json.error ?? "load_failed");
        return;
      }
      setRows(json.exceptions ?? []);
      setLoadErr(null);
    } catch {
      setLoadErr("network");
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMsg(null);
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (apiKey.trim()) {
        headers.Authorization = `Bearer ${apiKey.trim()}`;
      }
      const res = await fetch("/api/v1/toll/exceptions", {
        method: "POST",
        headers,
        body: JSON.stringify({
          kind,
          severity,
          title,
          summary,
          assetDnaId: assetDnaId || undefined,
          assignee: assignee || undefined,
          autoSla,
          by: assignee || "desk",
        }),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        message?: string;
        error?: string;
        exception?: ExceptionRow;
      };
      if (!res.ok || !json.ok) {
        setStatus("err");
        setMsg(json.error ?? "create_failed");
        return;
      }
      setMsg(json.message ?? "Opened");
      setTitle("");
      setSummary("");
      setAssetDnaId("");
      setStatus("idle");
      await refresh();
    } catch {
      setStatus("err");
      setMsg("network");
    }
  }

  async function onResolve(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMsg(null);
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (apiKey.trim()) {
        headers.Authorization = `Bearer ${apiKey.trim()}`;
      }
      const res = await fetch(`/api/v1/toll/exceptions/${resolveId}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({
          action: "resolve",
          resolutionNote: resolveNote,
          by: assignee || "desk",
        }),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        message?: string;
        error?: string;
      };
      if (!res.ok || !json.ok) {
        setStatus("err");
        setMsg(json.error ?? "resolve_failed");
        return;
      }
      setMsg(json.message ?? "Resolved");
      setResolveNote("");
      setResolveId("");
      setStatus("idle");
      await refresh();
    } catch {
      setStatus("err");
      setMsg("network");
    }
  }

  async function escalate(id: string) {
    setStatus("loading");
    setMsg(null);
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (apiKey.trim()) {
        headers.Authorization = `Bearer ${apiKey.trim()}`;
      }
      const res = await fetch(`/api/v1/toll/exceptions/${id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({
          status: "escalated",
          note: "Escalated from desk UI",
          by: assignee || "desk",
        }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setStatus("err");
        setMsg(json.error ?? "escalate_failed");
        return;
      }
      setStatus("idle");
      setMsg("Escalated");
      await refresh();
    } catch {
      setStatus("err");
      setMsg("network");
    }
  }

  return (
    <div className="page-inner page-inner--3xl mx-auto px-4 pb-20 pt-12 md:px-6">
      <GreenPageHeader
        eyebrow="Exceptions · ops desk"
        title="Exception Management OS"
        intro="File HITL pour cas sales : docs manquants, conflit de juridiction, données périmées, dispo partielle. Escalate · assign · resolve avec piste d’évidence — jamais d’auto-résolution compliance."
        compact
      />

      <GreenPanel className="mt-8">
        <div className="p-5 md:p-6 space-y-3">
          <label className="block text-sm">
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              API key (Bearer — écritures)
            </span>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className={field}
              placeholder="auros_pk_…"
              autoComplete="off"
            />
          </label>
          {msg ? (
            <p
              className={`text-sm ${
                status === "err" ? "text-red-300/90" : "text-emerald-200/80"
              }`}
            >
              {msg}
            </p>
          ) : null}
        </div>
      </GreenPanel>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <GreenPanel>
          <form onSubmit={onCreate} className="p-5 md:p-6 space-y-4">
            <h2 className="font-display text-lg text-white">Ouvrir un cas</h2>
            <label className="block text-sm">
              <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                Kind
              </span>
              <select
                value={kind}
                onChange={(e) => setKind(e.target.value as TollExceptionKind)}
                className={field}
              >
                {KINDS.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                Severity
              </span>
              <select
                value={severity}
                onChange={(e) =>
                  setSeverity(e.target.value as TollExceptionSeverity)
                }
                className={field}
              >
                {SEVERITIES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                Titre
              </span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className={field}
                maxLength={160}
              />
            </label>
            <label className="block text-sm">
              <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                Résumé
              </span>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                required
                rows={3}
                className={field}
                maxLength={800}
              />
            </label>
            <label className="block text-sm">
              <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                Asset DNA (opt.)
              </span>
              <input
                value={assetDnaId}
                onChange={(e) => setAssetDnaId(e.target.value)}
                className={field}
                placeholder="auros:dna:v1:…"
              />
            </label>
            <label className="block text-sm">
              <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                Assignee
              </span>
              <input
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className={field}
                placeholder="ops@…"
              />
            </label>
            <label className="flex items-center gap-2 text-sm text-white/70">
              <input
                type="checkbox"
                checked={autoSla}
                onChange={(e) => setAutoSla(e.target.checked)}
              />
              SLA auto (H24 / 72h / 7j selon severity)
            </label>
            <button
              type="submit"
              disabled={status === "loading"}
              className="border border-emerald-500/40 bg-emerald-500/10 px-4 py-2.5 font-mono text-[11px] uppercase tracking-wider text-emerald-200/90 disabled:opacity-50"
            >
              Créer
            </button>
          </form>
        </GreenPanel>

        <GreenPanel>
          <form onSubmit={onResolve} className="p-5 md:p-6 space-y-4">
            <h2 className="font-display text-lg text-white">
              Resolve (note HITL)
            </h2>
            <label className="block text-sm">
              <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                Exception id
              </span>
              <input
                value={resolveId}
                onChange={(e) => setResolveId(e.target.value)}
                required
                className={field}
                placeholder="exc_…"
              />
            </label>
            <label className="block text-sm">
              <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                Note de résolution (évidence)
              </span>
              <textarea
                value={resolveNote}
                onChange={(e) => setResolveNote(e.target.value)}
                required
                rows={4}
                className={field}
                maxLength={1200}
                placeholder="Actions prises, preuves jointes, décision desk — pas une certification."
              />
            </label>
            <button
              type="submit"
              disabled={status === "loading"}
              className="border border-emerald-500/40 bg-emerald-500/10 px-4 py-2.5 font-mono text-[11px] uppercase tracking-wider text-emerald-200/90 disabled:opacity-50"
            >
              Resolve
            </button>
          </form>
        </GreenPanel>
      </div>

      <GreenPanel className="mt-8">
        <div className="p-5 md:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-lg text-white">Queue</h2>
            <button
              type="button"
              onClick={() => void refresh()}
              className="font-mono text-[10px] uppercase tracking-wider text-white/45 underline-offset-4 hover:underline"
            >
              Refresh
            </button>
          </div>
          {loadErr ? (
            <p className="mt-3 text-sm text-red-300/90">{loadErr}</p>
          ) : null}
          <ul className="mt-4 space-y-3">
            {rows.length === 0 ? (
              <li className="text-sm text-white/45">Aucun cas ouvert.</li>
            ) : (
              rows.map((r) => (
                <li
                  key={r.id}
                  className="border border-white/10 px-3 py-3 text-sm text-white/70"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="font-mono text-[11px] text-emerald-200/80">
                      {r.id}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                      {r.status} · {r.severity} · {r.kind}
                    </span>
                  </div>
                  <p className="mt-1 font-display text-base text-white">
                    {r.title}
                  </p>
                  <p className="mt-1 text-white/50">{r.summary}</p>
                  <p className="mt-2 font-mono text-[10px] text-white/35">
                    {r.assignee ? `→ ${r.assignee} · ` : ""}
                    {r.dueAt ? `SLA ${r.dueAt} · ` : ""}
                    evid {r.evidenceCount ?? 0}
                  </p>
                  {r.status === "open" || r.status === "escalated" ? (
                    <div className="mt-2 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setResolveId(r.id);
                        }}
                        className="font-mono text-[10px] uppercase tracking-wider text-emerald-200/80 underline-offset-4 hover:underline"
                      >
                        Préparer resolve
                      </button>
                      {r.status === "open" ? (
                        <button
                          type="button"
                          onClick={() => void escalate(r.id)}
                          className="font-mono text-[10px] uppercase tracking-wider text-white/45 underline-offset-4 hover:underline"
                        >
                          Escalate
                        </button>
                      ) : null}
                    </div>
                  ) : null}
                </li>
              ))
            )}
          </ul>
        </div>
      </GreenPanel>

      <GreenDisclaimer>
        Exception OS = file ops payante. AUROS n’auto-résout pas et ne certifie
        pas la conformité — piste d’évidence HITL uniquement.
      </GreenDisclaimer>
      <GreenBackLink href="/green/toll/tower">← Control Tower</GreenBackLink>
    </div>
  );
}
