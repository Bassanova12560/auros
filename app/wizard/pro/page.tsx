"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { track } from "@/lib/analytics";
import { getWizardProTierMessages } from "@/lib/wizard-pro-i18n";
import {
  computeWizardChargeCents,
  isUpgradeTier,
} from "@/lib/stripe/wizard-checkout";
import {
  isWizardTier,
  WIZARD_TIER_AMOUNTS,
  WIZARD_TIER_LABELS,
  type WizardTier,
} from "@/lib/wizard-modes";

const TIERS: WizardTier[] = ["starter", "pro", "institutional"];

const PRO_UNLOCK_KEY = "auros_wizard_pro_session";

function WizardProContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locale } = useLocale();
  const m = getWizardProTierMessages(locale);
  const preselected = searchParams.get("tier");
  const upgradeFromParam = searchParams.get("upgrade_from");
  const sessionFromUrl = searchParams.get("session_id");
  const [previousSessionId, setPreviousSessionId] = useState<string | null>(
    sessionFromUrl
  );
  const upgradeFrom =
    upgradeFromParam && isWizardTier(upgradeFromParam)
      ? upgradeFromParam
      : undefined;
  useEffect(() => {
    if (sessionFromUrl) {
      setPreviousSessionId(sessionFromUrl);
      return;
    }
    try {
      setPreviousSessionId(sessionStorage.getItem(PRO_UNLOCK_KEY));
    } catch {
      setPreviousSessionId(null);
    }
  }, [sessionFromUrl]);
  const [selected, setSelected] = useState<WizardTier>(
    preselected && isWizardTier(preselected) ? preselected : "starter"
  );
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cancelled = searchParams.get("cancelled") === "1";

  const displayPrice = useCallback(
    (tier: WizardTier) => {
      const cents = computeWizardChargeCents(
        tier,
        upgradeFrom && isUpgradeTier(upgradeFrom, tier) ? upgradeFrom : undefined
      );
      const eur = cents / 100;
      return locale === "en"
        ? `€${eur.toLocaleString("en-GB")}`
        : `${eur.toLocaleString("fr-FR")} €`;
    },
    [locale, upgradeFrom]
  );

  const formatPrice = useCallback(
    (tier: WizardTier) => {
      const cents = WIZARD_TIER_AMOUNTS[tier];
      const eur = cents / 100;
      return locale === "en"
        ? `€${eur.toLocaleString("en-GB")}`
        : `${eur.toLocaleString("fr-FR")} €`;
    },
    [locale]
  );

  const rows = useMemo(
    () => [
      {
        label: m.rows.questions,
        starter: "19",
        pro: "19",
        institutional: "19",
      },
      {
        label: m.rows.score,
        starter: "✓",
        pro: "✓",
        institutional: "✓",
      },
      {
        label: m.rows.mica,
        starter: "—",
        pro: "✓",
        institutional: "✓",
      },
      {
        label: m.rows.pdf,
        starter: "✓",
        pro: "✓",
        institutional: "✓",
      },
      {
        label: m.rows.support,
        starter: "48 h",
        pro: "30 min call",
        institutional: "Concierge",
      },
    ],
    [m]
  );

  const checkout = async () => {
    setLoading(true);
    setError(null);
    const isUpgrade =
      !!upgradeFrom &&
      isUpgradeTier(upgradeFrom, selected) &&
      !!previousSessionId;
    track(isUpgrade ? "wizard_upgrade" : "wizard_pro_checkout", {
      tier: selected,
      upgradeFrom: upgradeFrom ?? "",
    });
    try {
      const res = await fetch("/api/wizard/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier: selected,
          email,
          locale,
          upgradeFrom: isUpgrade ? upgradeFrom : undefined,
          previousSessionId: isUpgrade ? previousSessionId : undefined,
        }),
      });
      const json = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !json.url) {
        setError(json.error ?? "checkout_failed");
        setLoading(false);
        return;
      }
      window.location.href = json.url;
    } catch {
      setError("checkout_failed");
      setLoading(false);
    }
  };

  return (
    <main className="page-main page-main--nav mx-auto min-h-dvh max-w-4xl px-4 py-10 md:px-6 md:py-14">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
        Wizard Pro
      </p>
      <h1 className="mt-3 font-display text-2xl text-white md:text-3xl">
        {m.title}
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/55">
        {m.subtitle}
      </p>
      {cancelled ? (
        <p className="mt-4 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/60">
          {m.cancelled}
        </p>
      ) : null}

      <div className="mt-10 grid gap-3 md:grid-cols-3">
        {TIERS.map((tier) => {
          const active = selected === tier;
          const label = WIZARD_TIER_LABELS[tier][locale] ?? WIZARD_TIER_LABELS[tier].fr;
          return (
            <button
              key={tier}
              type="button"
              onClick={() => setSelected(tier)}
              className={`rounded-xl border px-4 py-5 text-left transition ${
                active
                  ? "border-[color-mix(in_srgb,var(--auros-green-warm)_45%,white)] bg-[color-mix(in_srgb,var(--auros-green-warm)_10%,transparent)]"
                  : "border-white/10 bg-white/[0.03] hover:border-white/20"
              }`}
            >
              <p className="font-mono text-[10px] uppercase tracking-wider text-white/45">
                {upgradeFrom && isUpgradeTier(upgradeFrom, tier)
                  ? displayPrice(tier)
                  : formatPrice(tier)}
              </p>
              <p className="mt-2 text-sm font-medium text-white">{label}</p>
              <ul className="mt-3 space-y-1.5 text-xs text-white/50">
                {m.features[tier].map((f) => (
                  <li key={f}>· {f}</li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>

      <div className="mt-10 overflow-x-auto rounded-xl border border-white/[0.08]">
        <table className="w-full min-w-[520px] text-left text-xs text-white/60">
          <thead>
            <tr className="border-b border-white/[0.08] font-mono uppercase tracking-wider text-white/40">
              <th className="px-4 py-3">{m.compareTitle}</th>
              {TIERS.map((t) => (
                <th key={t} className="px-4 py-3">
                  {t}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-white/[0.05]">
                <td className="px-4 py-3 text-white/70">{row.label}</td>
                <td className="px-4 py-3">{row.starter}</td>
                <td className="px-4 py-3">{row.pro}</td>
                <td className="px-4 py-3">{row.institutional}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {upgradeFrom && isUpgradeTier(upgradeFrom, selected) ? (
        <p className="mt-4 max-w-md text-xs text-white/50">
          {locale === "fr"
            ? `Upgrade depuis ${upgradeFrom} — vous payez uniquement la différence (${displayPrice(selected)}).`
            : locale === "es"
              ? `Upgrade desde ${upgradeFrom} — paga solo la diferencia (${displayPrice(selected)}).`
              : `Upgrade from ${upgradeFrom} — pay the difference only (${displayPrice(selected)}).`}
        </p>
      ) : null}

      <div className="mt-10 max-w-md">
        <label className="wizard-field-label" htmlFor="wizard-pro-email">
          {m.emailLabel}
        </label>
        <input
          id="wizard-pro-email"
          type="email"
          autoComplete="email"
          className="wizard-input mt-2"
          placeholder={m.emailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={loading || !email.includes("@")}
          onClick={() => void checkout()}
          className="wizard-btn-primary min-w-[200px]"
        >
          {loading ? m.ctaLoading : m.cta}
        </button>
        <button
          type="button"
          onClick={() => router.push("/wizard?mode=explore")}
          className="font-mono text-[10px] uppercase tracking-wider text-white/45 hover:text-white/70"
        >
          {locale === "fr" ? "Retour à Explore" : "Back to Explore"}
        </button>
      </div>
      {error ? (
        <p className="mt-4 font-mono text-xs text-accent" role="alert">
          {error}
        </p>
      ) : null}
    </main>
  );
}

export default function WizardProPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center">
          <p className="text-white/60">Chargement…</p>
        </main>
      }
    >
      <WizardProContent />
    </Suspense>
  );
}
