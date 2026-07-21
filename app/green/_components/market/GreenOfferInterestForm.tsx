"use client";

import { useState } from "react";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { submitGreenOfferInterestAction } from "@/lib/actions/green-offer-interest";
import { GREEN_MARKET_INTRO_EUR } from "@/lib/green/market-cash-pricing";
import { getGreenMarketMessages } from "@/lib/green/market-i18n";

import { GreenPanel, GreenSectionTitle } from "../green-ui";

type Props = {
  offerId: string;
  offerTitle: string;
  actorName: string;
  actorEmail?: string | null;
};

export function GreenOfferInterestForm({
  offerId,
  offerTitle,
  actorName,
  actorEmail,
}: Props) {
  const { locale } = useLocale();
  const oi = getGreenMarketMessages(locale).offerInterest;
  const od = getGreenMarketMessages(locale).offerDetail;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "checkout" | "success" | "error"
  >("idle");
  const [errorKind, setErrorKind] = useState<
    "invalid" | "rate_limit" | "stripe" | null
  >(null);

  const mailto = actorEmail?.trim()
    ? `mailto:${encodeURIComponent(actorEmail.trim())}?subject=${encodeURIComponent(`AUROS Green — ${offerTitle}`)}`
    : null;

  const paidCta =
    locale === "en"
      ? `Qualified intro — ${GREEN_MARKET_INTRO_EUR} €`
      : locale === "es"
        ? `Intro cualificada — ${GREEN_MARKET_INTRO_EUR} €`
        : `Mise en relation — ${GREEN_MARKET_INTRO_EUR} €`;

  const paidHint =
    locale === "en"
      ? "Paid data matching (not brokerage). Ops reviews then connects. Indicative only."
      : locale === "es"
        ? "Matching de datos de pago (no corretaje). Ops revisa y conecta. Solo indicativo."
        : "Matching data payant (pas de courtage). Revue ops puis connexion. Indicatif uniquement.";

  async function handlePaidCheckout(e: React.FormEvent) {
    e.preventDefault();
    setStatus("checkout");
    setErrorKind(null);
    try {
      const res = await fetch("/api/green/market/intro-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          visitorName: name,
          message,
          offerId,
          offerTitle,
          actorName,
          locale,
        }),
      });
      const json = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !json.url) {
        setStatus("error");
        setErrorKind(json.error === "rate_limit" ? "rate_limit" : "stripe");
        return;
      }
      window.location.href = json.url;
    } catch {
      setStatus("error");
      setErrorKind("stripe");
    }
  }

  async function handleFreeSubmit() {
    setStatus("submitting");
    setErrorKind(null);
    const result = await submitGreenOfferInterestAction({
      offerId,
      offerTitle,
      actorName,
      actorEmail: actorEmail?.trim() || undefined,
      visitorName: name,
      visitorEmail: email,
      message,
      locale,
    });
    if (result.ok) {
      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
      return;
    }
    setStatus("error");
    setErrorKind(result.error);
  }

  return (
    <section className="mt-10" id="intro">
      <GreenSectionTitle>{od.contactTitle}</GreenSectionTitle>
      <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-start">
        {mailto ? (
          <a
            href={mailto}
            className="inline-flex shrink-0 items-center justify-center rounded-lg border border-green-royal/40 bg-green-royal/10 px-5 py-3 font-mono text-[11px] tracking-wide text-green-royal-bright transition hover:border-green-royal hover:text-white"
          >
            {od.contactEmailCta} →
          </a>
        ) : null}
        <GreenPanel className="w-full max-w-xl flex-1 p-6">
          <h3 className="font-display text-base font-semibold text-white">
            {paidCta}
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-white/45">{paidHint}</p>
          {status === "success" ? (
            <p className="mt-4 text-sm text-emerald-400/90" role="status">
              {oi.success}
            </p>
          ) : (
            <form
              onSubmit={(e) => void handlePaidCheckout(e)}
              className="mt-5 space-y-4"
            >
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                  {oi.name}
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full border border-white/[0.12] bg-white/[0.03] px-3 py-2.5 text-sm text-white outline-none focus:border-white/25"
                  autoComplete="name"
                />
              </label>
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                  {oi.email}
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full border border-white/[0.12] bg-white/[0.03] px-3 py-2.5 text-sm text-white outline-none focus:border-white/25"
                  autoComplete="email"
                />
              </label>
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                  {oi.message}
                </span>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={oi.messagePlaceholder}
                  rows={3}
                  maxLength={500}
                  className="mt-1 w-full resize-y border border-white/[0.12] bg-white/[0.03] px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
                />
              </label>
              {status === "error" ? (
                <p className="text-xs text-red-400/90" role="alert">
                  {errorKind === "rate_limit"
                    ? oi.errorRateLimit
                    : errorKind === "stripe"
                      ? locale === "en"
                        ? "Checkout unavailable — try again or use free interest."
                        : "Checkout indisponible — réessayez ou intérêt gratuit."
                      : oi.errorInvalid}
                </p>
              ) : null}
              <PrimaryButton
                type="submit"
                disabled={status === "checkout" || !email.includes("@")}
                className="!w-full"
              >
                {status === "checkout" ? "…" : paidCta}
              </PrimaryButton>
              <button
                type="button"
                disabled={status === "submitting" || status === "checkout"}
                onClick={() => void handleFreeSubmit()}
                className="w-full rounded-lg border border-white/[0.12] px-5 py-2.5 font-mono text-[11px] tracking-wide text-white/55 transition hover:border-white/25 hover:text-white disabled:opacity-50"
              >
                {status === "submitting" ? oi.submitting : oi.submit}
              </button>
            </form>
          )}
        </GreenPanel>
      </div>
    </section>
  );
}
