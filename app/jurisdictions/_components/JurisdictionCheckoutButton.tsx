"use client";

import { useCallback, useState } from "react";

import { createJurisdictionCheckoutAction } from "@/lib/actions/jurisdiction-checkout";
import type { JurisdictionProductTier } from "@/lib/jurisdictions/pricing";

import { useJurisdictionPage } from "./useJurisdictionPage";

type Props = {
  tier?: JurisdictionProductTier;
  leadId?: string;
  email?: string;
  className?: string;
  variant?: "primary" | "secondary";
  label?: string;
};

export function JurisdictionCheckoutButton({
  tier = "starter",
  leadId,
  email,
  className = "",
  variant = "primary",
  label,
}: Props) {
  const { locale, messages } = useJurisdictionPage();
  const f = messages.forms;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await createJurisdictionCheckoutAction({
      tier,
      leadId,
      email,
      locale,
    });
    setLoading(false);

    if (!result.ok) {
      setError(
        result.error === "stripe_unconfigured"
          ? f.checkoutUnavailable
          : result.error === "already_paid"
            ? f.alreadyPaid
            : f.errorGeneric
      );
      return;
    }

    window.location.href = result.url;
  }, [email, f, leadId, locale, tier]);

  const base =
    variant === "primary"
      ? "rounded-full bg-white px-8 py-4 text-sm font-medium text-void transition hover:bg-white/90 disabled:opacity-60"
      : "rounded-full border border-white/20 px-6 py-3 text-sm text-white transition hover:border-white/40 disabled:opacity-60";

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={`${base} ${className}`}
      >
        {loading
          ? f.checkoutLoading
          : label ??
            (tier === "launch" ? f.checkoutLaunch : f.checkoutStarter)}
      </button>
      {error ? (
        <p className="mt-2 text-xs text-red-300/90" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
