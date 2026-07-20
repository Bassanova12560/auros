"use client";

import { useCallback, useEffect, useState } from "react";

import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";

export type VerifyKind = "shield" | "attest" | "auto";

type VerifyResult = {
  kind: "shield" | "attest";
  valid: boolean;
  id: string;
  content_hash?: string;
  detail?: string;
  score?: number;
  grade?: string;
};

function detectKind(raw: string): "shield" | "attest" {
  const id = raw.trim().toLowerCase();
  if (id.startsWith("att_")) return "attest";
  if (id.startsWith("shr_")) return "shield";
  // Prefer shield for opaque ids; attest page still works via att_ prefix.
  return "shield";
}

async function verifyId(raw: string, forced?: VerifyKind): Promise<VerifyResult> {
  const id = raw.trim();
  const kind =
    forced && forced !== "auto" ? forced : detectKind(id);

  if (kind === "attest") {
    const res = await fetch(
      `/api/v1/attest/verify?id=${encodeURIComponent(id)}`
    );
    const json = (await res.json()) as {
      valid?: boolean;
      id?: string;
      content_hash?: string;
      public?: { score?: number; grade?: string };
      score?: number;
      grade?: string;
      error?: { message?: string };
      reason?: string;
    };
    if (!res.ok) {
      throw new Error(json.error?.message ?? `HTTP ${res.status}`);
    }
    return {
      kind: "attest",
      valid: json.valid !== false && Boolean(json.id || json.content_hash),
      id: json.id ?? id,
      content_hash: json.content_hash,
      score: json.public?.score ?? json.score,
      grade: json.public?.grade ?? json.grade,
      detail: json.reason,
    };
  }

  const res = await fetch("/api/v1/shield/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  const json = (await res.json()) as {
    valid?: boolean;
    id?: string;
    content_hash?: string;
    kind?: string;
    error?: { message?: string };
    freemium?: string;
  };
  if (!res.ok) {
    throw new Error(json.error?.message ?? `HTTP ${res.status}`);
  }
  return {
    kind: "shield",
    valid: Boolean(json.valid),
    id: json.id ?? id,
    content_hash: json.content_hash,
    detail: json.kind ?? json.freemium,
  };
}

export function VerifyConsole({
  initialId = "",
  compact = false,
}: {
  initialId?: string;
  compact?: boolean;
}) {
  const [id, setId] = useState(initialId);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VerifyResult | null>(null);

  const run = useCallback(async (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      setError("Collez un receipt Shield (shr_…) ou une attestation (att_…).");
      return;
    }
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const out = await verifyId(trimmed);
      setResult(out);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur réseau");
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    if (initialId.trim()) void run(initialId);
  }, [initialId, run]);

  return (
    <div className={compact ? "space-y-3" : "space-y-4"}>
      {!compact ? (
        <label className="block space-y-1.5">
          <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
            ID preuve
          </span>
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") void run(id);
            }}
            placeholder="shr_… ou att_…"
            className="w-full rounded-lg border border-white/10 bg-black px-3 py-2.5 font-mono text-sm text-white placeholder:text-white/25"
            autoComplete="off"
            spellCheck={false}
          />
        </label>
      ) : null}

      {!compact ? (
        <PrimaryButton
          type="button"
          onClick={() => void run(id)}
          disabled={busy}
        >
          {busy ? "Vérification…" : "Vérifier — gratuit"}
        </PrimaryButton>
      ) : null}

      {error ? (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : null}

      {result ? (
        <div
          className={`rounded-xl border px-4 py-4 ${
            result.valid
              ? "border-emerald-500/35 bg-emerald-500/[0.07]"
              : "border-red-500/30 bg-red-500/[0.06]"
          }`}
        >
          <p
            className={`font-mono text-[11px] uppercase tracking-wider ${
              result.valid ? "text-emerald-400/90" : "text-red-400/90"
            }`}
          >
            {result.valid ? "Valid" : "Invalid"} · {result.kind}
          </p>
          <p className="mt-2 break-all font-mono text-xs text-white/70">
            {result.id}
          </p>
          {result.content_hash ? (
            <p className="mt-2 break-all font-mono text-[10px] text-white/35">
              {result.content_hash}
            </p>
          ) : null}
          {typeof result.score === "number" ? (
            <p className="mt-2 text-sm text-white/70">
              Score {result.score}
              {result.grade ? ` · ${result.grade}` : ""}
            </p>
          ) : null}
          {result.detail ? (
            <p className="mt-1 font-mono text-[10px] text-white/30">
              {result.detail}
            </p>
          ) : null}
        </div>
      ) : null}

      {compact && busy ? (
        <p className="font-mono text-[10px] text-white/40">AUROS verify…</p>
      ) : null}
    </div>
  );
}
