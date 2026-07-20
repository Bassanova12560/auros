"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";

const STORAGE_KEY = "auros_protocol_premium_key";

type Props = {
  /** Compact embed for console / power */
  compact?: boolean;
  className?: string;
};

/**
 * Self-serve Evidence Pack — Premium Bearer → HTML annex (print → PDF).
 * Pack is built from CFU taps scoped to the API key (not a free-text CFU list).
 */
export function ShieldEvidencePackPanel({
  compact = false,
  className = "",
}: Props) {
  const [apiKey, setApiKey] = useState("");
  const [label, setLabel] = useState("bank-credit-file");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [packId, setPackId] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored =
        sessionStorage.getItem(STORAGE_KEY) ??
        sessionStorage.getItem("auros_chargeflow_console_key");
      if (stored) setApiKey(stored);
    } catch {
      /* ignore */
    }
  }, []);

  async function generate(format: "json" | "html") {
    const key = apiKey.trim();
    if (!key) {
      setError("Collez une clé Protocol Premium (Bearer).");
      return;
    }
    setBusy(true);
    setError(null);
    setPackId(null);
    setHint(null);
    try {
      sessionStorage.setItem(STORAGE_KEY, key);
      const res = await fetch(`/api/v1/shield/pack?format=${format}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          label: label.trim() || undefined,
          cfu_limit: 50,
          tap_limit: 50,
        }),
      });

      if (format === "html") {
        if (!res.ok) {
          const json = (await res.json().catch(() => null)) as {
            error?: { message?: string };
          } | null;
          setError(
            json?.error?.message ??
              (res.status === 403
                ? "Evidence Pack réservé Premium — activez Monitor."
                : `HTTP ${res.status}`)
          );
          return;
        }
        const html = await res.text();
        const blob = new Blob([html], { type: "text/html;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank", "noopener,noreferrer");
        setHint("Annex HTML ouverte — Ctrl/Cmd+P pour PDF.");
        setPackId("html");
        return;
      }

      const json = (await res.json()) as {
        pack_id?: string;
        print_hint?: string;
        error?: { message?: string };
      };
      if (!res.ok) {
        setError(
          json.error?.message ??
            (res.status === 403
              ? "Evidence Pack réservé Premium — activez Monitor."
              : `HTTP ${res.status}`)
        );
        return;
      }
      setPackId(json.pack_id ?? "ok");
      setHint(json.print_hint ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur réseau");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className={`space-y-4 border border-white/[0.08] bg-black/40 p-5 md:p-6 ${className}`}
    >
      {!compact ? (
        <div className="space-y-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
            Evidence Pack · self-serve
          </p>
          <p className="text-sm leading-relaxed text-white/55">
            Générez un annex hash-only à partir des CFU / taps liés à votre clé
            Premium. Indicatif — pas un conseil crédit.
          </p>
        </div>
      ) : (
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
          Evidence Pack
        </p>
      )}

      <label className="block space-y-1.5">
        <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
          Clé Premium
        </span>
        <input
          type="password"
          autoComplete="off"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="auros_…"
          className="w-full rounded-lg border border-white/10 bg-black px-3 py-2.5 font-mono text-sm text-white placeholder:text-white/25"
        />
      </label>

      <label className="block max-w-sm space-y-1.5">
        <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
          Label dossier
        </span>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-black px-3 py-2.5 text-sm text-white"
        />
      </label>

      <div className="flex flex-wrap gap-2">
        <PrimaryButton
          type="button"
          disabled={busy}
          onClick={() => void generate("html")}
        >
          {busy ? "Génération…" : "Ouvrir annex HTML"}
        </PrimaryButton>
        <button
          type="button"
          disabled={busy}
          onClick={() => void generate("json")}
          className="min-h-[44px] rounded-full border border-white/20 px-4 font-mono text-[11px] uppercase tracking-wider text-white/60 transition hover:border-white/40 hover:text-white disabled:opacity-40"
        >
          JSON
        </button>
        <Link
          href="/green/api#premium"
          className="inline-flex min-h-[44px] items-center font-mono text-[11px] uppercase tracking-wider text-white/35 hover:text-white/60"
        >
          Premium →
        </Link>
      </div>

      {error ? (
        <p className="text-sm text-red-400/90" role="alert">
          {error}
        </p>
      ) : null}
      {packId && !error ? (
        <p className="text-sm text-emerald-400/85">
          Pack prêt{packId !== "html" ? ` · ${packId}` : ""}.
          {hint ? ` ${hint}` : ""}
        </p>
      ) : null}
    </div>
  );
}
