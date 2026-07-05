"use client";

import Link from "next/link";
import { useCallback, useState } from "react";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { BezelCard } from "@/app/_components/ui/BezelCard";
import { MobilePageShell } from "@/app/_components/ui/MobilePageShell";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { lookupPartnerPortalAction } from "@/lib/actions/partner-portal";
import { getPartnerCode, savePartnerCode } from "@/lib/partner-attribution";
import type { PartnerPortalSnapshot } from "@/lib/partners/portal-data";
import { getPartnerPortalMessages } from "@/lib/partners/portal-i18n";

function formatDate(iso: string, locale: string): string {
  try {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso.slice(0, 10);
  }
}

function formatEur(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function PartnerPortalView() {
  const { locale } = useLocale();
  const m = getPartnerPortalMessages(locale);
  const [code, setCode] = useState(() => getPartnerCode() ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<PartnerPortalSnapshot | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [copiedIframe, setCopiedIframe] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await lookupPartnerPortalAction(code);
    setLoading(false);
    if (!result.ok) {
      setSnapshot(null);
      setError(
        result.error === "invalid_code"
          ? m.invalidCode
          : result.error === "not_registered"
            ? m.notRegistered
            : result.error === "inactive"
              ? m.inactiveCode
              : m.unavailable,
      );
      return;
    }
    if (result.snapshot) {
      savePartnerCode(result.snapshot.partnerCode);
      setSnapshot(result.snapshot);
    }
  }, [code, m.invalidCode, m.inactiveCode, m.notRegistered, m.unavailable]);

  async function copyWizardLink() {
    if (!snapshot?.wizardUrl) return;
    try {
      await navigator.clipboard.writeText(snapshot.wizardUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  async function copyEmbedLink() {
    if (!snapshot?.embedUrl) return;
    try {
      await navigator.clipboard.writeText(snapshot.embedUrl);
      setCopiedEmbed(true);
      setTimeout(() => setCopiedEmbed(false), 2000);
    } catch {
      // ignore
    }
  }

  async function copyIframeSnippet() {
    if (!snapshot?.embedIframeSnippet) return;
    try {
      await navigator.clipboard.writeText(snapshot.embedIframeSnippet);
      setCopiedIframe(true);
      setTimeout(() => setCopiedIframe(false), 2000);
    } catch {
      // ignore
    }
  }

  async function copyScriptSnippet() {
    if (!snapshot?.embedScriptSnippet) return;
    try {
      await navigator.clipboard.writeText(snapshot.embedScriptSnippet);
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
    } catch {
      // ignore
    }
  }

  return (
    <MobilePageShell width="3xl">
      <Link
        href="/partners"
        className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-white/60"
      >
        ← {m.backPartners}
      </Link>
      <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.28em] text-white/40">
        {m.eyebrow}
      </p>
      <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-white">
        {m.title}
      </h1>
      {snapshot?.partnerLabel ? (
        <p className="mt-2 font-mono text-sm text-cyan-300/70">{snapshot.partnerLabel}</p>
      ) : null}
      <p className="mt-4 text-lg text-white/55">{m.intro}</p>

      <BezelCard className="mt-10" innerClassName="p-6 md:p-8" animate>
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
            {m.codeLabel}
          </span>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder={m.codePlaceholder}
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 font-mono text-sm text-white outline-none focus:border-white/25"
            autoComplete="off"
            spellCheck={false}
          />
        </label>
        <PrimaryButton
          type="button"
          className="mt-4"
          disabled={loading || code.trim().length < 2}
          onClick={() => void load()}
        >
          {loading ? m.loading : m.submit}
        </PrimaryButton>
        {error ? <p className="mt-3 text-sm text-amber-300/90">{error}</p> : null}
      </BezelCard>

      {snapshot ? (
        <div className="mt-8 space-y-6">
          {snapshot.total === 0 ? (
            <BezelCard innerClassName="p-6 md:p-8" animate>
              <p className="font-display text-xl text-white">{m.emptyTitle}</p>
              <p className="mt-2 text-sm text-white/55">{m.emptyBody}</p>
            </BezelCard>
          ) : (
            <>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: m.statsLeads, value: snapshot.leads },
                  { label: m.statsDossiers, value: snapshot.dossiers },
                  { label: m.statsSubmitted, value: snapshot.submittedDossiers },
                  { label: m.statsEmbed, value: snapshot.embedEvents },
                ].map((stat) => (
                  <BezelCard key={stat.label} innerClassName="p-5" animate>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                      {stat.label}
                    </p>
                    <p className="mt-2 font-display text-3xl font-semibold text-white">
                      {stat.value}
                    </p>
                  </BezelCard>
                ))}
              </div>

              <BezelCard innerClassName="p-6 md:p-8" animate>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-300/70">
                  {m.indicativeLabel}
                </p>
                <p className="mt-2 font-display text-3xl font-semibold text-white">
                  {formatEur(snapshot.indicativeCommissionEur, locale)}
                </p>
                <p className="mt-2 text-xs text-white/40">{m.indicativeDisclaimer}</p>
              </BezelCard>
            </>
          )}

          <BezelCard innerClassName="p-6 md:p-8" animate>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
              {m.wizardLink}
            </p>
            <p className="mt-2 break-all font-mono text-xs text-white/60">
              {snapshot.wizardUrl}
            </p>
            <button
              type="button"
              onClick={() => void copyWizardLink()}
              className="mt-4 rounded-full border border-white/15 px-5 py-2 text-sm text-white/70 transition hover:border-white/30 hover:text-white"
            >
              {copied ? m.copied : m.copyWizard}
            </button>
          </BezelCard>

          <BezelCard innerClassName="p-6 md:p-8" animate>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-300/60">
              {m.embedLink}
            </p>
            <p className="mt-2 break-all font-mono text-xs text-white/60">
              {snapshot.embedUrl}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => void copyEmbedLink()}
                className="rounded-full border border-white/15 px-5 py-2 text-sm text-white/70 transition hover:border-white/30 hover:text-white"
              >
                {copiedEmbed ? m.copied : m.copyEmbed}
              </button>
              <button
                type="button"
                onClick={() => void copyIframeSnippet()}
                className="rounded-full border border-white/15 px-5 py-2 text-sm text-white/70 transition hover:border-white/30 hover:text-white"
              >
                {copiedIframe ? m.copied : m.copyIframe}
              </button>
              <button
                type="button"
                onClick={() => void copyScriptSnippet()}
                className="rounded-full border border-white/15 px-5 py-2 text-sm text-white/70 transition hover:border-white/30 hover:text-white"
              >
                {copiedScript ? m.copied : m.copyScript}
              </button>
              <Link
                href="/eau/embed/docs"
                className="inline-flex items-center rounded-full border border-white/10 px-5 py-2 text-sm text-white/50 hover:text-white/80"
              >
                {m.eauGuideLink} →
              </Link>
              <Link
                href={snapshot.eauGuideUrl}
                className="inline-flex items-center rounded-full border border-white/10 px-5 py-2 text-sm text-white/50 hover:text-white/80"
              >
                /comment-tokeniser/eau
              </Link>
            </div>
          </BezelCard>

          {snapshot.recent.length > 0 ? (
            <BezelCard innerClassName="p-6 md:p-8 overflow-x-auto" animate>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                {m.recentTitle}
              </p>
              <table className="mt-4 w-full min-w-[32rem] text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-white/40">
                    <th className="pb-2 pr-4 font-normal">{m.colType}</th>
                    <th className="pb-2 pr-4 font-normal">{m.colDate}</th>
                    <th className="pb-2 pr-4 font-normal">{m.colAsset}</th>
                    <th className="pb-2 pr-4 font-normal">{m.colScore}</th>
                    <th className="pb-2 font-normal">{m.colContact}</th>
                  </tr>
                </thead>
                <tbody>
                  {snapshot.recent.map((row) => (
                    <tr key={`${row.recordType}-${row.id}`} className="border-b border-white/[0.06]">
                      <td className="py-3 pr-4 text-white/80">
                        {row.recordType === "lead" ? m.typeLead : m.typeDossier}
                      </td>
                      <td className="py-3 pr-4 text-white/50">
                        {formatDate(row.createdAt, locale)}
                      </td>
                      <td className="py-3 pr-4 text-white/60">{row.assetType ?? "—"}</td>
                      <td className="py-3 pr-4 text-white/60">
                        {row.score != null ? row.score : "—"}
                      </td>
                      <td className="py-3 text-white/50">
                        {row.contactHint ?? row.status ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </BezelCard>
          ) : null}
        </div>
      ) : null}
    </MobilePageShell>
  );
}
