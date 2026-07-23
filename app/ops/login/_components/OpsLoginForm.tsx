"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { COPILOT_OPS_ROUTE } from "@/lib/copilot/types";

export function OpsLoginForm() {
  const router = useRouter();
  const [secret, setSecret] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function unlock(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ops/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ secret: secret.trim() }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string; message?: string };
      if (!res.ok) {
        setError(json.message ?? json.error ?? `Erreur ${res.status}`);
        return;
      }
      setSecret("");
      router.replace(COPILOT_OPS_ROUTE);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={unlock} className="mx-auto max-w-md space-y-6 px-4 py-16">
      <header className="space-y-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-amber-400/80">
          Ops
        </p>
        <h1 className="font-display text-2xl text-white">Session tools</h1>
        <p className="text-sm text-white/50">
          Unlock with the ops session secret. Exchanged for an HttpOnly cookie —
          not stored in localStorage.
        </p>
      </header>
      <label className="block space-y-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
          Session secret
        </span>
        <input
          type="password"
          autoComplete="current-password"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 font-mono text-sm text-white"
          required
          minLength={8}
        />
      </label>
      {error ? (
        <p className="text-sm text-red-400/90" role="alert">
          {error}
        </p>
      ) : null}
      <PrimaryButton type="submit" disabled={loading || secret.trim().length < 8}>
        {loading ? "…" : "Unlock"}
      </PrimaryButton>
    </form>
  );
}
