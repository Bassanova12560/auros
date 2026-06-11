"use client";

import { useState } from "react";

import { ContentFaqList } from "@/app/_components/ContentPageLayout";
import { StaticSectionHeader } from "@/app/_components/StaticSectionHeader";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { track } from "@/lib/analytics";
import {
  CURRENT_EDITION,
  STATE_OF_RWA_ISSUERS_FAQ,
  formatCostEur,
  formatEditionQuarter,
  getStateOfRwaIssuersCopy,
  type StateOfRwaIssuersPayload,
} from "@/lib/state-of-rwa-issuers";

type StateOfRwaIssuersViewProps = {
  payload: StateOfRwaIssuersPayload;
};

export function StateOfRwaIssuersView({ payload }: StateOfRwaIssuersViewProps) {
  const { locale } = useLocale();
  const copy = getStateOfRwaIssuersCopy(locale);
  const editionLabel = formatEditionQuarter(payload.edition, locale);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [downloadToken, setDownloadToken] = useState<string | null>(null);

  async function handleGateSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (status === "loading") return;

    setStatus("loading");
    setErrorCode(null);

    try {
      const res = await fetch("/api/report-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          edition: payload.edition,
          locale,
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        token?: string;
      };

      if (!res.ok || !data.ok || !data.token) {
        setErrorCode(data.error ?? "unknown");
        setStatus("error");
        return;
      }

      setDownloadToken(data.token);
      setStatus("success");
      track("state_of_rwa_issuers_gate_unlock", { edition: payload.edition });
    } catch {
      setErrorCode("network");
      setStatus("error");
    }
  }

  const errorMessage =
    errorCode === "rate_limit"
      ? copy.gateErrors.rateLimit
      : errorCode === "invalid_email"
        ? copy.gateErrors.invalidEmail
        : errorCode === "invalid_name"
          ? copy.gateErrors.invalidName
          : errorCode
            ? copy.gateErrors.generic
            : null;

  const pdfUrl =
    downloadToken &&
    `/api/state-of-rwa-issuers/pdf?token=${encodeURIComponent(downloadToken)}&edition=${encodeURIComponent(payload.edition)}&locale=${locale}`;

  return (
    <div className="space-y-16 md:space-y-20">
      <StaticSectionHeader
        eyebrow={copy.eyebrow}
        title={copy.title}
        subtitle={copy.intro}
      />
      <p className="mx-auto -mt-10 max-w-2xl text-center font-mono text-[11px] tracking-wide text-white/50">
        {copy.editionLabel(editionLabel)}
      </p>
      <p className="mx-auto -mt-8 max-w-2xl text-center font-mono text-[11px] leading-relaxed text-white/40">
        {copy.disclaimer}
      </p>

      <section aria-labelledby="sor-preview">
        <h2
          id="sor-preview"
          className="font-mono text-[11px] tracking-wide text-white/45"
        >
          {copy.previewTitle}
        </h2>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div className="card-flat px-5 py-4">
            <p className="font-mono text-[10px] uppercase tracking-wide text-white/35">
              {copy.assetMixProducts}
            </p>
            <p className="mt-2 font-display text-3xl font-medium text-white">
              {payload.totalProducts}
            </p>
          </div>
          <div className="card-flat px-5 py-4">
            <p className="font-mono text-[10px] uppercase tracking-wide text-white/35">
              {copy.micaAvg}
            </p>
            <p className="mt-2 font-display text-3xl font-medium text-white">
              {copy.micaAvgValue(payload.micaReadiness.avgScorePct)}
            </p>
          </div>
          <div className="card-flat px-5 py-4">
            <p className="font-mono text-[10px] uppercase tracking-wide text-white/35">
              {copy.trendsTitle}
            </p>
            <p className="mt-2 font-display text-lg font-medium leading-snug text-white">
              {copy.trendsValue(
                payload.dossierTrends.wizardStartsEstimate,
                payload.dossierTrends.monthOverMonthPct
              )}
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="sor-asset-mix">
        <h2
          id="sor-asset-mix"
          className="font-mono text-[11px] tracking-wide text-white/45"
        >
          {copy.assetMixTitle}
        </h2>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 font-mono text-[10px] uppercase tracking-wide text-white/35">
                <th className="pb-3 pr-4">{copy.assetMixCategory}</th>
                <th className="pb-3 pr-4">{copy.assetMixProducts}</th>
                <th className="pb-3">{copy.assetMixShare}</th>
              </tr>
            </thead>
            <tbody>
              {payload.assetMix.map((row) => (
                <tr key={row.categoryId} className="border-b border-white/5">
                  <td className="py-3 pr-4 text-white/80">
                    {copy.categories[row.categoryId]}
                  </td>
                  <td className="py-3 pr-4 font-mono text-white/60">
                    {row.productCount}
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 flex-1 max-w-[120px] rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-[#9F2F2D]/80"
                          style={{ width: `${Math.min(100, row.sharePct)}%` }}
                        />
                      </div>
                      <span className="font-mono text-[11px] text-white/50">
                        {row.sharePct} %
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="sor-mica">
        <h2
          id="sor-mica"
          className="font-mono text-[11px] tracking-wide text-white/45"
        >
          {copy.micaTitle}
        </h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {payload.micaReadiness.signals.map((s) => (
            <li key={s.id} className="card-flat px-4 py-3">
              <p className="text-sm text-white/75">
                {copy.micaSignals[s.id] ?? s.id}
              </p>
              <p className="mt-1 font-mono text-lg text-white">{s.scorePct} / 100</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 max-w-2xl text-sm font-light text-white/45">
          {copy.micaNote}
        </p>
      </section>

      <section aria-labelledby="sor-blockers">
        <h2
          id="sor-blockers"
          className="font-mono text-[11px] tracking-wide text-white/45"
        >
          {copy.blockersTitle}
        </h2>
        <ul className="mt-5 space-y-3">
          {payload.blockers.map((b) => (
            <li key={b.id} className="flex items-center gap-4">
              <span className="w-48 shrink-0 text-sm text-white/70">
                {copy.blockers[b.id] ?? b.id}
              </span>
              <div className="h-1.5 flex-1 max-w-md rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-white/30"
                  style={{ width: `${b.sharePct}%` }}
                />
              </div>
              <span className="font-mono text-[11px] text-white/45">
                {b.sharePct} %
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="sor-jurisdictions">
        <h2
          id="sor-jurisdictions"
          className="font-mono text-[11px] tracking-wide text-white/45"
        >
          {copy.jurisdictionTitle}
        </h2>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 font-mono text-[10px] uppercase tracking-wide text-white/35">
                <th className="pb-3 pr-4">Juridiction</th>
                <th className="pb-3 pr-4">{copy.jurisdictionShare}</th>
                <th className="pb-3 pr-4">{copy.jurisdictionCost}</th>
                <th className="pb-3">{copy.jurisdictionLicense}</th>
              </tr>
            </thead>
            <tbody>
              {payload.jurisdictionBreakdown.map((j) => (
                <tr key={j.jurisdictionId} className="border-b border-white/5">
                  <td className="py-3 pr-4 text-white/80">
                    {copy.jurisdictions[j.jurisdictionId] ?? j.jurisdictionId}
                  </td>
                  <td className="py-3 pr-4 font-mono text-white/55">
                    {j.sharePct} %
                  </td>
                  <td className="py-3 pr-4 font-mono text-white/55">
                    {formatCostEur(j.totalCostMid, locale)}
                  </td>
                  <td className="py-3 font-mono text-white/55">
                    {j.licenseMaxMonths} mo
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section
        aria-labelledby="sor-gate"
        className="card-flat mx-auto max-w-xl px-6 py-8"
      >
        <h2
          id="sor-gate"
          className="font-display text-xl font-medium text-white"
        >
          {copy.gateTitle}
        </h2>
        <p className="mt-2 text-sm font-light leading-relaxed text-white/50">
          {copy.gateIntro}
        </p>

        {status === "success" && pdfUrl ? (
          <div className="mt-6 space-y-4">
            <p className="font-mono text-[11px] text-emerald-400/90">
              {copy.gateSuccess}
            </p>
            <PrimaryButton
              href={pdfUrl}
              onClick={() =>
                track("state_of_rwa_issuers_pdf_download", {
                  edition: payload.edition,
                })
              }
            >
              {copy.gateDownload.replace("Q2 2026", editionLabel)}
            </PrimaryButton>
          </div>
        ) : (
          <form onSubmit={handleGateSubmit} className="mt-6 space-y-4" noValidate>
            <div>
              <label htmlFor="sor-name" className="sr-only">
                {copy.gateNameLabel}
              </label>
              <input
                id="sor-name"
                type="text"
                name="name"
                autoComplete="name"
                required
                minLength={2}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={copy.gateNamePlaceholder}
                className="w-full min-h-[44px] rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-white/25 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="sor-email" className="sr-only">
                {copy.gateEmailLabel}
              </label>
              <input
                id="sor-email"
                type="email"
                name="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={copy.gateEmailPlaceholder}
                className="w-full min-h-[44px] rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-white/25 focus:outline-none"
              />
            </div>
            <PrimaryButton type="submit" disabled={status === "loading"}>
              {status === "loading" ? copy.gateSubmitting : copy.gateSubmit}
            </PrimaryButton>
            {errorMessage ? (
              <p className="font-mono text-[10px] text-red-400/90">{errorMessage}</p>
            ) : null}
          </form>
        )}

        <p className="mt-5 font-mono text-[10px] text-white/30">{copy.gatePrivacy}</p>
      </section>

      <section aria-labelledby="sor-methodology">
        <h2
          id="sor-methodology"
          className="font-mono text-[11px] tracking-wide text-white/45"
        >
          {copy.methodologyTitle}
        </h2>
        <ul className="mt-5 max-w-2xl space-y-3 text-sm font-light leading-relaxed text-white/55">
          {copy.methodologyBody.map((paragraph) => (
            <li key={paragraph.slice(0, 40)}>{paragraph}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="sor-related">
        <h2
          id="sor-related"
          className="font-mono text-[11px] tracking-wide text-white/45"
        >
          {copy.relatedTitle}
        </h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {copy.relatedLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="card-flat interactive-subtle block px-4 py-3 text-sm text-white/70 hover:text-white"
              >
                {link.label} →
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="sor-faq">
        <h2
          id="sor-faq"
          className="font-mono text-[11px] tracking-wide text-white/45"
        >
          {copy.faqTitle}
        </h2>
        <div className="mt-5">
          <ContentFaqList items={STATE_OF_RWA_ISSUERS_FAQ} />
        </div>
      </section>
    </div>
  );
}
