"use client";

import { useState, type FormEvent } from "react";

import { useComparatorPage } from "./useComparatorPage";
import { track } from "@/lib/analytics";

type CompareAlertsFormProps = {
  productIds: string[];
};

export function CompareAlertsForm({ productIds }: CompareAlertsFormProps) {
  const { messages, locale } = useComparatorPage();
  const copy = messages.compareHub.alerts;
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle"
  );
  const [errorKey, setErrorKey] = useState<string | null>(null);

  if (productIds.length < 2) return null;

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("loading");
    setErrorKey(null);
    try {
      const res = await fetch("/api/compare-alerts-waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          productIds,
          locale,
        }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setStatus("error");
        setErrorKey(json.error ?? "error");
        return;
      }
      track("comparator_alerts_waitlist", {
        source: "compare_panel",
        count: productIds.length,
      });
      setStatus("ok");
      setEmail("");
    } catch {
      setStatus("error");
      setErrorKey("network");
    }
  }

  return (
    <form
      onSubmit={(e) => void onSubmit(e)}
      className="mt-4 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4"
    >
      <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
        {copy.eyebrow}
      </p>
      <p className="mt-1 text-sm text-white/70">{copy.title}</p>
      <p className="mt-1 font-mono text-[10px] leading-relaxed text-white/35">
        {copy.subtitle}
      </p>
      {status === "ok" ? (
        <p className="mt-3 font-mono text-[11px] text-emerald-300/80">
          {copy.success}
        </p>
      ) : (
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sr-only" htmlFor="compare-alerts-email">
            {copy.emailLabel}
          </label>
          <input
            id="compare-alerts-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={copy.emailPlaceholder}
            className="min-w-0 flex-1 rounded-lg border border-white/10 bg-black/30 px-3 py-2 font-mono text-xs text-white placeholder:text-white/30 focus:border-white/25 focus:outline-none"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-full border border-white/15 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-white/70 transition hover:border-white/30 hover:text-white disabled:opacity-50"
          >
            {status === "loading" ? copy.submitting : copy.submit}
          </button>
        </div>
      )}
      {status === "error" ? (
        <p className="mt-2 font-mono text-[10px] text-amber-200/80">
          {errorKey === "rate_limit"
            ? copy.errorRateLimit
            : errorKey === "invalid_email"
              ? copy.errorEmail
              : copy.errorGeneric}
        </p>
      ) : null}
    </form>
  );
}
