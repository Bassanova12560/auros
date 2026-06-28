"use client";

import { useState } from "react";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { GREEN_API_PREMIUM_MONTHLY_EUR } from "@/lib/green/green-api-pricing";

type Props = {
  defaultEmail?: string;
};

export function GreenApiPremiumCheckout({ defaultEmail = "" }: Props) {
  const { locale } = useLocale();
  const [email, setEmail] = useState(defaultEmail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const copy =
    locale === "en"
      ? {
          title: "Green API Premium",
          hint: "Same email as your free API key (POST /api/v1/keys).",
          cta: `Subscribe — ${GREEN_API_PREMIUM_MONTHLY_EUR} €/mo`,
          perks: "25k req/mo · batch 50 · history · changelog webhooks · SLA",
        }
      : locale === "es"
        ? {
            title: "Green API Premium",
            hint: "Mismo email que su clave API free.",
            cta: `Suscribirse — ${GREEN_API_PREMIUM_MONTHLY_EUR} €/mes`,
            perks: "25k req/mes · batch 50 · historial · webhooks changelog · SLA",
          }
        : {
            title: "Green API Premium",
            hint: "Même e-mail que votre clé API free (POST /api/v1/keys).",
            cta: `S'abonner — ${GREEN_API_PREMIUM_MONTHLY_EUR} €/mois`,
            perks: "25k req/mois · batch 50 · historique · webhooks changelog · SLA",
          };

  async function handleCheckout() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/green/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale }),
      });
      const json = (await res.json()) as { url?: string; error?: string; message?: string };
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
    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.06] p-6">
      <p className="font-mono text-[10px] uppercase tracking-widest text-emerald-400/80">
        {copy.title}
      </p>
      <p className="mt-2 text-xs text-white/50">{copy.perks}</p>
      <label className="mt-4 block text-xs text-white/45">{copy.hint}</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@company.com"
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white"
      />
      {error ? <p className="mt-2 text-xs text-red-400">{error}</p> : null}
      <PrimaryButton
        type="button"
        className="mt-4 !w-full sm:!w-full"
        disabled={loading || !email.includes("@")}
        onClick={() => void handleCheckout()}
      >
        {loading ? "…" : copy.cta}
      </PrimaryButton>
    </div>
  );
}
