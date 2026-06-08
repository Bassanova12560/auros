"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
} from "react";

import { BezelCard } from "./ui/BezelCard";
import { PrimaryButton } from "./ui/PrimaryButton";
import { track } from "@/lib/analytics";
import {
  AUROS_EMAIL_CAPTURE_KEY,
  isValidCaptureEmail,
} from "@/lib/email-capture";
import {
  buildScoreShareUrl,
  copyToClipboard,
} from "@/lib/referral";
import { useLocale, useTranslations } from "./i18n/LocaleProvider";
import { getEaseMessages } from "@/lib/ease-i18n";
import { buildJurisdictionsUrl } from "@/lib/jurisdictions";
import { computeEaseSummary } from "@/lib/readiness-ease";
import { normalizeWizardData } from "@/lib/wizard-types";
import { MarketingConsentCheckbox } from "./MarketingConsentCheckbox";
import { EasePanel } from "./EasePanel";
import { ScoreReveal } from "./ScoreReveal";
import {
  readinessFromQuickInput,
  saveReadinessSnapshot,
} from "@/lib/tokenization-readiness";
import { calculateScoreFromText } from "@/lib/score";
import { saveLeadAction } from "@/lib/actions/leads";
import { saveWizardPrefill } from "@/lib/wizard-prefill";
import { getWizardStepsMessages } from "@/lib/wizard-steps-i18n";

/** Interactive score form — static shell lives in app/estimate/page.tsx for SSR. */
export function ScoreWidgetForm() {
  const t = useTranslations();
  const { locale } = useLocale();
  const easeM = getEaseMessages(locale);
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [email, setEmail] = useState("");
  const [phase, setPhase] = useState<"idle" | "result">("idle");
  const [score, setScore] = useState<number | null>(null);
  const [evaluatedText, setEvaluatedText] = useState("");
  const [shareMsg, setShareMsg] = useState<string | null>(null);
  const [showReveal, setShowReveal] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [emailSaved, setEmailSaved] = useState(false);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(AUROS_EMAIL_CAPTURE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { email?: string };
        if (parsed.email) setEmail(parsed.email);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      setQueryError(t.score.emptyQuery);
      return;
    }
    setQueryError(null);
    const s = calculateScoreFromText(trimmed);
    setScore(s);
    setEvaluatedText(trimmed);
    setPhase("result");
    setShowReveal(false);
    window.setTimeout(() => setShowReveal(true), 280);
    const snapshot = readinessFromQuickInput(
      { assetType: trimmed, country: "", score: s },
      {
        asset: t.progress.itemAsset,
        value: t.progress.itemValue,
        location: t.progress.itemLocation,
        description: t.progress.itemDescription,
        documents: t.progress.itemDocuments,
        dossier: t.progress.itemDossier,
      }
    );
    snapshot.items[0].done = true;
    snapshot.items[3].done = trimmed.split(/\s+/).length >= 5;
    const done = snapshot.items.filter((i) => i.done).length;
    snapshot.percent = Math.max(
      snapshot.percent,
      Math.round((done / snapshot.items.length) * 100)
    );
    saveReadinessSnapshot(snapshot);
    track("score_calculated", { score: s, source: "landing_widget" });
  };

  const handleEmailSave = async () => {
    const trimmed = email.trim();
    if (!isValidCaptureEmail(trimmed) || !marketingConsent) {
      setSaveFeedback(
        !marketingConsent
          ? getWizardStepsMessages(locale).common.consentRequired
          : t.score.emailPlaceholder
      );
      return;
    }
    setSaveFeedback(null);
    try {
      localStorage.setItem(
        AUROS_EMAIL_CAPTURE_KEY,
        JSON.stringify({
          email: trimmed,
          savedAt: new Date().toISOString(),
        })
      );
    } catch {
      // ignore
    }
    const result = await saveLeadAction({
      email: trimmed,
      source: "score_widget",
      assetType: evaluatedText || null,
      score: score ?? undefined,
      consent: true,
      locale,
    });
    if (result.ok) {
      setEmailSaved(true);
      track("email_captured", { source: "score_widget" });
    }
  };

  const shareScore = useCallback(async () => {
    if (score === null || !evaluatedText) return;
    const url = buildScoreShareUrl({
      assetDescription: evaluatedText,
      score,
    });
    const ok = await copyToClipboard(url);
    setShareMsg(ok ? t.score.linkCopied : t.score.linkFailed);
    track("score_shared", { score });
    setTimeout(() => setShareMsg(null), 2500);
  }, [score, evaluatedText, t.score.linkCopied, t.score.linkFailed]);

  const reset = () => {
    setPhase("idle");
    setScore(null);
    setShareMsg(null);
    setShowReveal(false);
  };

  const goFullDossier = useCallback(() => {
    if (!evaluatedText.trim()) return;
    saveWizardPrefill({
      assetType: "",
      estimatedValue: 250_000,
      currency: "EUR",
      country: "",
      quickScore: score ?? undefined,
    });
    track("score_widget_to_wizard", { score: score ?? 0 });
    router.push("/wizard");
  }, [evaluatedText, score, router]);

  if (phase === "result") {
    return (
      <div className="mt-6">
        <BezelCard innerClassName="flex flex-col items-center px-6 py-10">
          {score !== null ? (
            <>
              <ScoreReveal score={score} show={showReveal} />
              <p className="mt-3 max-w-sm text-center font-sans text-[0.65rem] italic leading-relaxed text-muted">
                {t.score.indicativeNote}
              </p>
            </>
          ) : null}
          {evaluatedText ? (
            <p className="mt-4 max-w-md text-center text-sm text-muted">
              {evaluatedText.length > 100
                ? `${evaluatedText.slice(0, 100)}…`
                : evaluatedText}
            </p>
          ) : null}
          {score !== null && evaluatedText ? (
            <EasePanel
              variant="compact"
              locale={locale}
              showEssentials={false}
              summary={computeEaseSummary(
                normalizeWizardData({
                  assetType: "Real estate",
                  description: evaluatedText,
                  estimatedValue: 250_000,
                  currency: "EUR",
                  country: "",
                  city: "",
                  documents: [],
                  goals: [],
                  timeline: "",
                  platform: "",
                  legalStructure: "",
                  incomeType: "",
                  incomeAmountYear: 0,
                  incomeDescription: "",
                  legalStatus: [],
                  investorProfile: "",
                  additionalNotes: "",
                }),
                locale,
                score
              )}
            />
          ) : null}
          <p className="mt-4 max-w-sm text-center text-xs leading-relaxed text-white/45">
            {easeM.score.reassurance}
          </p>
          <div className="mt-6 w-full max-w-sm space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailSaved(false);
              }}
              placeholder={t.score.emailPlaceholder}
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3 text-sm outline-none focus:border-white/30"
            />
            <MarketingConsentCheckbox
              id="score-marketing-consent"
              checked={marketingConsent}
              onChange={(v) => {
                setMarketingConsent(v);
                setEmailSaved(false);
              }}
            />
            <button
              type="button"
              onClick={() => void handleEmailSave()}
              disabled={emailSaved}
              className="w-full rounded-full border border-white/15 px-5 py-2 text-sm text-white/80 transition hover:border-white/40 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {emailSaved ? t.score.emailSaved : t.score.saveEmail}
            </button>
            {saveFeedback ? (
              <p className="text-center text-xs text-accent" role="alert">
                {saveFeedback}
              </p>
            ) : null}
            <div className="flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={shareScore}
                className="rounded-full border border-white/15 px-5 py-2 text-sm text-white/80 hover:border-white/40"
              >
                {t.score.shareBtn}
              </button>
              <PrimaryButton onClick={goFullDossier}>
                {easeM.score.wizardCta}
              </PrimaryButton>
            </div>
            <Link
              href={buildJurisdictionsUrl({ from: "score", hash: "guide" })}
              className="mt-2 block text-center text-sm text-white/40 underline-offset-4 transition hover:text-white/65 hover:underline"
            >
              {easeM.score.jurisdictionsCta}
            </Link>
            {shareMsg ? (
              <p className="text-center text-xs text-white/50">{shareMsg}</p>
            ) : null}
            <button
              type="button"
              onClick={reset}
              className="mx-auto block text-xs text-muted hover:text-white"
            >
              {t.score.otherAsset}
            </button>
          </div>
        </BezelCard>
        <p className="mt-4 text-center font-mono text-[10px] text-white/25">
          {t.score.disclaimer}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <p className="font-mono text-[10px] uppercase tracking-wider text-white/35">
        {t.score.quickExamplesLabel}
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {t.score.quickExamples.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => {
              setQuery(example);
              setQueryError(null);
            }}
            className="rounded-full border border-white/10 px-4 py-2.5 text-left font-mono text-[11px] text-white/55 transition hover:border-white/25 hover:bg-white/[0.04] hover:text-white/80 sm:min-w-[200px] sm:flex-1"
          >
            {example}
          </button>
        ))}
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          if (queryError) setQueryError(null);
        }}
        aria-invalid={queryError ? true : undefined}
        placeholder={t.score.placeholder}
        className="mt-6 w-full rounded-xl border border-white/[0.1] bg-white/[0.03] px-5 py-4 text-white placeholder:text-white/30 outline-none transition focus:border-white/40 focus-visible:ring-2 focus-visible:ring-white/20"
      />
      {queryError ? (
        <p className="mt-3 text-xs text-accent sm:text-left" role="alert">
          {queryError}
        </p>
      ) : null}
      <div className="mt-5 flex justify-center sm:justify-start">
        <PrimaryButton type="submit">{t.score.calculate}</PrimaryButton>
      </div>
    </form>
  );
}
