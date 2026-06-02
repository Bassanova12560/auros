"use client";

import { useState } from "react";

import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { startDiplomaCheckout } from "@/lib/academy/diploma-checkout-client";
import { DIPLOMA_PRODUCTS } from "@/lib/academy/diploma-pricing";
import { diplomaCheckoutErrorMessage, getAcademyMessages } from "@/lib/academy/i18n";

type Props = {
  certToken: string;
  alreadyPurchased?: boolean;
};

export function AcademyDiplomaUpsell({ certToken, alreadyPurchased }: Props) {
  const { locale } = useLocale();
  const m = getAcademyMessages(locale);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const product = DIPLOMA_PRODUCTS.individual;
  const pdfUrl = `/api/academy/certificate/${encodeURIComponent(certToken)}/pdf`;

  if (alreadyPurchased) {
    return (
      <div className="mt-8 rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
        <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
          {m.diploma.purchasedEyebrow}
        </p>
        <p className="mt-2 text-sm text-white/60">{m.diploma.purchasedBody}</p>
        <div className="mt-4">
          <PrimaryButton href={pdfUrl}>{m.diploma.downloadPdf}</PrimaryButton>
        </div>
      </div>
    );
  }

  async function checkout() {
    setLoading(true);
    setError(null);
    const result = await startDiplomaCheckout({
      diplomaType: "individual",
      certToken,
      contactEmail: email.trim(),
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

  return (
    <div className="mt-8 rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
      <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
        {m.diploma.upsellEyebrow(product.priceLabel)}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-white/55">{m.diploma.upsellBody}</p>
      <label className="mt-4 block">
        <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
          {m.diploma.emailLabel}
        </span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full max-w-md rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none focus:border-white/25"
          placeholder={m.diploma.emailPlaceholder}
        />
      </label>
      {error && (
        <p className="mt-3 text-sm text-white/70" role="alert">
          {error}
        </p>
      )}
      <div className="mt-4">
        <PrimaryButton
          type="button"
          disabled={loading || email.trim().length < 5}
          onClick={() => void checkout()}
        >
          {loading ? m.diploma.redirecting : m.diploma.checkout(product.priceLabel)}
        </PrimaryButton>
      </div>
    </div>
  );
}
