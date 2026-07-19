"use client";

import { useState } from "react";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import {
  MONITOR_PRO_MONTHLY_EUR,
  MONITOR_STARTER_MONTHLY_EUR,
  type MonitorPlan,
} from "@/lib/protocol/monitor/pricing";

export function MonitorCheckoutForm() {
  const { locale } = useLocale();
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState<MonitorPlan>("starter");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/v1/monitor/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, plan, locale }),
      });
      const json = (await res.json()) as {
        url?: string;
        error?: string;
        message?: string;
      };
      if (!res.ok || !json.url) {
        setError(json.message ?? json.error ?? "Checkout unavailable");
        setLoading(false);
        return;
      }
      window.location.href = json.url;
    } catch {
      setError("Network error");
      setLoading(false);
    }
  }

  return (
    <div id="monitor" className="scroll-mt-28 space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setPlan("starter")}
          className={`rounded-full px-4 py-2 font-mono text-[10px] uppercase tracking-wider ${
            plan === "starter"
              ? "bg-amber-500/20 text-amber-200"
              : "border border-white/10 text-white/45"
          }`}
        >
          Starter — {MONITOR_STARTER_MONTHLY_EUR} €/mo
        </button>
        <button
          type="button"
          onClick={() => setPlan("pro")}
          className={`rounded-full px-4 py-2 font-mono text-[10px] uppercase tracking-wider ${
            plan === "pro"
              ? "bg-amber-500/20 text-amber-200"
              : "border border-white/10 text-white/45"
          }`}
        >
          Pro — {MONITOR_PRO_MONTHLY_EUR} €/mo
        </button>
      </div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@company.com"
        className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white"
      />
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
      <PrimaryButton
        type="button"
        className="!w-full sm:!w-auto"
        disabled={loading || !email.includes("@")}
        onClick={() => void handleCheckout()}
      >
        {loading
          ? "…"
          : `Souscrire Monitor ${plan === "pro" ? "Pro" : "Starter"}`}
      </PrimaryButton>
      <p className="text-xs text-white/40">
        Enterprise (100+ actifs, from €1 000/mo) —{" "}
        <a href="mailto:contact@getauros.com" className="underline hover:text-white/70">
          contact@getauros.com
        </a>
      </p>
    </div>
  );
}
