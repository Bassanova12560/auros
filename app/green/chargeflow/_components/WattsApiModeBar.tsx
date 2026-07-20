"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "auros_protocol_premium_key";

export type WattsApiMode = "demo" | "premium";

export function useWattsApiMode() {
  const [mode, setMode] = useState<WattsApiMode>("demo");
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    try {
      const stored =
        sessionStorage.getItem(STORAGE_KEY) ??
        sessionStorage.getItem("auros_chargeflow_console_key");
      if (stored) {
        setApiKey(stored);
        setMode("premium");
      }
    } catch {
      /* ignore */
    }
  }, []);

  const persistKey = useCallback((key: string) => {
    setApiKey(key);
    try {
      if (key.trim()) sessionStorage.setItem(STORAGE_KEY, key.trim());
    } catch {
      /* ignore */
    }
  }, []);

  const authHeaders = useCallback((): HeadersInit => {
    if (mode !== "premium" || !apiKey.trim()) return {};
    return { Authorization: `Bearer ${apiKey.trim()}` };
  }, [mode, apiKey]);

  /** Map demo path → production twin when Premium + key. */
  const endpoint = useCallback(
    (demoPath: string): string => {
      if (mode !== "premium" || !apiKey.trim()) return demoPath;
      return demoPath
        .replace("/demo/match", "/match")
        .replace("/demo/confirm", "/confirm")
        .replace("/demo/settle", "/settle")
        .replace(/\/demo$/, "")
        .replace(/\/demo\//, "/");
    },
    [mode, apiKey]
  );

  return {
    mode,
    setMode,
    apiKey,
    setApiKey: persistKey,
    authHeaders,
    endpoint,
    isPremiumReady: mode === "premium" && Boolean(apiKey.trim()),
  };
}

type BarProps = {
  mode: WattsApiMode;
  apiKey: string;
  onModeChange: (m: WattsApiMode) => void;
  onKeyChange: (k: string) => void;
  /** Optional Power funnel note */
  powerHint?: boolean;
};

export function WattsApiModeBar({
  mode,
  apiKey,
  onModeChange,
  onKeyChange,
  powerHint = false,
}: BarProps) {
  return (
    <div className="space-y-3 border border-white/[0.08] bg-black/40 px-4 py-3.5 text-left">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
          Mode API
        </p>
        <div className="flex gap-1.5">
          {(["demo", "premium"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => onModeChange(m)}
              className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition ${
                mode === m
                  ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/35"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              {m === "demo" ? "Demo" : "Premium"}
            </button>
          ))}
        </div>
      </div>
      <p className="text-xs leading-relaxed text-white/45">
        {mode === "demo"
          ? "Sandbox rate-limitée — aucune clé requise. Indicatif uniquement."
          : "Endpoints production — clé Protocol Premium (Bearer)."}{" "}
        <Link
          href="/green/api#premium"
          className="text-white/55 underline-offset-2 hover:underline"
        >
          Premium
        </Link>
      </p>
      {mode === "premium" ? (
        <input
          type="password"
          autoComplete="off"
          value={apiKey}
          onChange={(e) => onKeyChange(e.target.value)}
          placeholder="auros_… (Bearer)"
          className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 font-mono text-sm text-white placeholder:text-white/25"
        />
      ) : null}
      {powerHint ? (
        <p className="text-[11px] leading-relaxed text-amber-200/50">
          Funnel Power — generation_source prérempli (hors Green Verified).
        </p>
      ) : null}
    </div>
  );
}
