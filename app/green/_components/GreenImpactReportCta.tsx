"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { DOSSIER_STORAGE_KEY } from "@/lib/wizard-constants";
import type { GreenComplianceScore } from "@/lib/green/scoring/green-compliance";
import type { GreenImpactReportTier } from "@/lib/green/impact-report-pricing";
import type { CsrdResult } from "@/lib/green/csrd-check/types";
import { track } from "@/lib/analytics";

type Props = {
  email?: string;
  firstName?: string;
  locale?: string;
  csrdResult?: CsrdResult;
  /** Compact layout for wizard summary panel */
  compact?: boolean;
};

type CheckoutState = "idle" | "loading" | "error";

export function GreenImpactReportCta({
  email = "",
  firstName,
  locale = "fr",
  csrdResult,
  compact = false,
}: Props) {
  const [checkoutState, setCheckoutState] = useState<CheckoutState>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (csrdResult) {
      try {
        sessionStorage.setItem("auros_csrd_result", JSON.stringify(csrdResult));
      } catch {
        // ignore
      }
    }
  }, [csrdResult]);

  const startCheckout = useCallback(
    async (tier: GreenImpactReportTier) => {
      setCheckoutState("loading");
      setError(null);

      let contactEmail = email.trim();
      if (!contactEmail) {
        try {
          const raw = localStorage.getItem(DOSSIER_STORAGE_KEY);
          if (raw) {
            const parsed = JSON.parse(raw) as { data?: { email?: string } };
            contactEmail = parsed.data?.email?.trim() ?? "";
          }
        } catch {
          // ignore
        }
      }

      if (!contactEmail.includes("@")) {
        setCheckoutState("error");
        setError("Indiquez votre e-mail dans le wizard pour commander le rapport.");
        return;
      }

      track("green_impact_report_checkout", { tier });

      try {
        const res = await fetch("/api/green/impact-report/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tier, email: contactEmail, firstName, locale }),
        });
        const json = (await res.json()) as { ok?: boolean; url?: string; error?: string };
        if (!res.ok || !json.url) {
          setCheckoutState("error");
          setError(
            json.error === "stripe_unconfigured"
              ? "Paiement temporairement indisponible — réessayez plus tard."
              : "Impossible de lancer le paiement."
          );
          return;
        }
        window.location.href = json.url;
      } catch {
        setCheckoutState("error");
        setError("Erreur réseau — réessayez.");
      }
    },
    [email, firstName, locale]
  );

  const loading = checkoutState === "loading";

  if (compact) {
    return (
      <div className="mt-4 border-t border-teal-500/20 pt-4">
        <p className="text-xs text-neutral-400">
          Rapport PDF institutionnel — EU Taxonomy + RTMS, prêt à partager.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={() => startCheckout("standard")}
            className="rounded-full border border-teal-500/40 px-4 py-2 text-xs uppercase tracking-wider text-teal-400 transition hover:border-teal-400 disabled:opacity-50"
          >
            {loading ? "Redirection…" : "PDF · 49 €"}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => startCheckout("institutional")}
            className="text-xs text-neutral-500 hover:text-teal-400/80 disabled:opacity-50"
          >
            Version institutionnelle · 199 €
          </button>
        </div>
        {error ? (
          <p className="mt-2 text-xs text-amber-400/90" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-500/70">
        Rapport d&apos;impact Green
      </p>
      <p className="mt-2 text-sm text-white/65">
        Synthèse PDF EU Taxonomy + RTMS depuis votre dossier — indicatif, prêt à partager en interne.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <PrimaryButton disabled={loading} onClick={() => startCheckout("standard")}>
          {loading ? "Redirection…" : "Commander · 49 €"}
        </PrimaryButton>
        <button
          type="button"
          disabled={loading}
          onClick={() => startCheckout("institutional")}
          className="text-sm text-white/45 hover:text-white/70 disabled:opacity-50"
        >
          Institutionnel · 199 €
        </button>
      </div>
      <p className="mt-3 text-[11px] text-white/35">
        Paiement sécurisé Stripe · téléchargement immédiat après validation.
      </p>
      {error ? (
        <p className="mt-2 text-xs text-amber-400/90" role="alert">
          {error}
        </p>
      ) : null}
      {!email.includes("@") ? (
        <p className="mt-2 text-xs text-white/40">
          <Link href="/wizard?type=green" className="text-emerald-500/70 hover:text-emerald-400">
            Complétez le wizard Green
          </Link>{" "}
          pour enrichir le rapport.
        </p>
      ) : null}
    </div>
  );
}
