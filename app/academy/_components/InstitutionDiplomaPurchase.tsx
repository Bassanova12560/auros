"use client";

import { useState } from "react";

import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { startDiplomaCheckout } from "@/lib/academy/diploma-checkout-client";
import { DIPLOMA_PRODUCTS } from "@/lib/academy/diploma-pricing";
import { diplomaCheckoutErrorMessage, getAcademyMessages } from "@/lib/academy/i18n";

export function InstitutionDiplomaPurchase() {
  const { locale } = useLocale();
  const m = getAcademyMessages(locale);
  const [organizationName, setOrganizationName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const product = DIPLOMA_PRODUCTS.institution;

  async function checkout() {
    setLoading(true);
    setError(null);
    const result = await startDiplomaCheckout({
      diplomaType: "institution",
      organizationName: organizationName.trim(),
      contactName: contactName.trim(),
      contactEmail: contactEmail.trim(),
    });
    if (result.ok) {
      window.location.href = result.url;
      return;
    }
    setError(
      result.error === "network"
        ? m.errors.network
        : diplomaCheckoutErrorMessage(locale, result.error)
    );
    setLoading(false);
  }

  const ready =
    organizationName.trim().length >= 2 &&
    contactName.trim().length >= 2 &&
    contactEmail.trim().length >= 5;

  return (
    <div className="mt-10 rounded-xl border border-white/[0.08] bg-white/[0.02] p-6 md:p-8">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
        {m.institution.eyebrow(product.priceLabel)}
      </p>
      <h2 className="mt-4 font-display text-xl font-semibold text-white">{m.institution.title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/55">{m.institution.body}</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="block md:col-span-2">
          <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
            {m.institution.orgLabel}
          </span>
          <input
            type="text"
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
            className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none focus:border-white/25"
            placeholder={m.institution.orgPlaceholder}
          />
        </label>
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
            {m.institution.contactLabel}
          </span>
          <input
            type="text"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none focus:border-white/25"
            placeholder={m.institution.contactPlaceholder}
          />
        </label>
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
            {m.institution.emailLabel}
          </span>
          <input
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none focus:border-white/25"
            placeholder={m.institution.emailPlaceholder}
          />
        </label>
      </div>
      {error && (
        <p className="mt-4 text-sm text-white/70" role="alert">
          {error}
        </p>
      )}
      <div className="mt-6">
        <PrimaryButton type="button" disabled={loading || !ready} onClick={() => void checkout()}>
          {loading ? m.institution.redirecting : m.institution.checkout(product.priceLabel)}
        </PrimaryButton>
      </div>
    </div>
  );
}
