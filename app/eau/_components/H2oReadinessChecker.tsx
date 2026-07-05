"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { BezelCard } from "@/app/_components/ui/BezelCard";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { getEauHubCopy } from "@/lib/eau/i18n";
import { buildHydrologicalPassportUrl } from "@/lib/eau/embed";
import {
  emitAurosH2oEmbedEvent,
  h2oScoreToEmbedPayload,
} from "@/lib/eau/embed-events";
import { eauPassportUnlockPath } from "@/lib/eau/passport";
import { computeH2oScoreFromText, type H2oScoreResult } from "@/lib/green/scoring/h2o-score";
import { prefillFromCommentTokeniser } from "@/lib/comment-tokeniser/prefill";
import { capturePartnerFromSearchParams, getPartnerCode } from "@/lib/partner-attribution";
import { saveWizardPrefill } from "@/lib/wizard-prefill";
import { track } from "@/lib/analytics";

type Props = {
  mode?: "hub" | "embed";
  partnerCode?: string | null;
};

export function H2oReadinessChecker({ mode = "hub", partnerCode }: Props) {
  const { locale } = useLocale();
  const copy = getEauHubCopy(locale);
  const router = useRouter();
  const [text, setText] = useState("");
  const [result, setResult] = useState<H2oScoreResult | null>(null);
  const [verifyPath, setVerifyPath] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEmbed = mode === "embed";

  useEffect(() => {
    if (typeof window === "undefined") return;
    capturePartnerFromSearchParams(new URLSearchParams(window.location.search));
  }, []);

  useEffect(() => {
    if (!isEmbed) return;
    emitAurosH2oEmbedEvent({
      type: "auros:h2o:ready",
      partner: partnerCode ?? getPartnerCode() ?? undefined,
    });
  }, [isEmbed, partnerCode]);

  async function recordEmbedActivity(
    event: "h2o_score" | "h2o_passport_cta",
    scored?: H2oScoreResult,
  ) {
    const partner = partnerCode ?? getPartnerCode();
    if (!partner) return;
    try {
      await fetch("/api/eau/embed-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partner,
          event,
          rating: scored?.rating,
          tier: scored?.tier,
          preview_id: scored?.preview_id,
          locale,
        }),
      });
    } catch {
      // non-blocking
    }
  }

  async function handleCheck(e: FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (trimmed.length < 10) {
      setError("Min 10 caractères / characters");
      setResult(null);
      setVerifyPath(null);
      return;
    }
    setChecking(true);
    let scored: H2oScoreResult | null = null;
    let nextVerifyPath: string | null = null;

    try {
      const res = await fetch("/api/eau/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        h2o_score?: H2oScoreResult;
        verify_preview_path?: string;
        error?: string;
      };
      if (data.ok && data.h2o_score) {
        scored = data.h2o_score;
        nextVerifyPath = data.verify_preview_path ?? null;
      }
    } catch {
      scored = computeH2oScoreFromText(trimmed);
    }

    if (!scored) {
      scored = computeH2oScoreFromText(trimmed);
    }

    setChecking(false);

    if (!scored) {
      setError(
        locale === "en"
          ? "Not recognized as hydrological — mention m³, concession, water rights or blue bond."
          : locale === "es"
            ? "No reconocido como hídrico — mencione m³, concesión, derechos de agua o blue bond."
            : "Non reconnu comme hydrique — mentionnez m³, concession, droits d'eau ou blue bond."
      );
      setResult(null);
      setVerifyPath(null);
      return;
    }
    setError(null);
    setResult(scored);
    setVerifyPath(nextVerifyPath);
    if (isEmbed) {
      emitAurosH2oEmbedEvent({
        type: "auros:h2o:score",
        payload: h2oScoreToEmbedPayload(scored),
      });
      void recordEmbedActivity("h2o_score", scored);
    }
    track("h2o_score_preview", {
      locale,
      rating: scored.rating,
      tier: scored.tier,
      asset_class: scored.asset_class,
      surface: isEmbed ? "embed" : "hub",
      partner: partnerCode ?? getPartnerCode() ?? undefined,
    });
  }

  function startPassport() {
    const partner = partnerCode ?? getPartnerCode();
    saveWizardPrefill({
      ...prefillFromCommentTokeniser("eau", locale),
      description: text.trim() || prefillFromCommentTokeniser("eau", locale).description,
    });
    track("h2o_passport_cta", {
      locale,
      from: isEmbed ? "eau_embed" : "eau_checker",
      partner: partner ?? undefined,
    });
    if (isEmbed) {
      emitAurosH2oEmbedEvent({
        type: "auros:h2o:passport",
        payload: { partner: partner ?? undefined },
      });
      void recordEmbedActivity("h2o_passport_cta", result ?? undefined);
    }

    const target = buildHydrologicalPassportUrl({ partner });
    if (isEmbed && typeof window !== "undefined") {
      const top = window.top ?? window;
      top.location.href = target;
      return;
    }
    router.push("/wizard?type=green&asset=renewable");
  }

  const inner = (
    <>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-300/70">
        H₂O Score
      </p>
      {!isEmbed ? (
        <h2 className="mt-3 font-display text-2xl font-semibold text-white">
          {copy.checkerTitle}
        </h2>
      ) : (
        <p className="mt-2 text-sm font-medium text-white/80">{copy.checkerTitle}</p>
      )}
      <form onSubmit={handleCheck} className="mt-4 space-y-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={copy.checkerPlaceholder}
          rows={isEmbed ? 3 : 4}
          className="w-full resize-y rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white/80 placeholder:text-white/30 focus:border-cyan-500/30 focus:outline-none"
        />
        {error ? <p className="text-sm text-red-400/90">{error}</p> : null}
        <PrimaryButton type="submit" disabled={checking}>
          {checking ? "…" : copy.checkerCta}
        </PrimaryButton>
      </form>

      {result ? (
        <div className="mt-6 rounded-xl border border-white/[0.06] bg-black/30 p-4 md:p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/40">
            {copy.previewBadge}
          </p>
          <p className="mt-2 font-display text-4xl font-semibold text-white md:text-5xl">
            {result.rating}
            <span className="text-lg text-white/40 md:text-xl">/100</span>
          </p>
          <p className="mt-2 text-sm text-cyan-200/70">{copy.tierLabels[result.tier]}</p>
          {!isEmbed ? (
            <p className="mt-1 font-mono text-[10px] text-white/35">{result.preview_id}</p>
          ) : null}
          {verifyPath ? (
            <Link
              href={verifyPath}
              target={isEmbed ? "_blank" : undefined}
              rel={isEmbed ? "noopener noreferrer" : undefined}
              className="mt-2 inline-block text-xs text-cyan-300/80 underline hover:text-cyan-200"
            >
              {locale === "en" ? "Verify preview link" : locale === "es" ? "Enlace verificación" : "Lien de vérification preview"}
            </Link>
          ) : null}

          <ul className="mt-4 space-y-2">
            {result.priority_keys.map((key) => (
              <li key={key} className="flex items-start gap-2 text-sm text-white/55">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-cyan-400/50" />
                {copy.priorityLabels[key]}
              </li>
            ))}
          </ul>

          <p className="mt-4 text-xs leading-relaxed text-white/45">{copy.passportRequired}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <PrimaryButton type="button" onClick={startPassport}>
              {copy.checkerPassportCta}
            </PrimaryButton>
            {!isEmbed ? (
              <Link
                href={eauPassportUnlockPath()}
                className="inline-flex items-center rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/60 hover:border-white/30 hover:text-white"
              >
                {copy.links.guide}
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}

      {isEmbed ? (
        <p className="mt-4 text-center font-mono text-[9px] text-white/25">
          <a
            href="https://getauros.com/eau"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/45"
          >
            AUROS · Passeport Hydrique
          </a>
        </p>
      ) : (
        <p className="mt-6 font-mono text-[10px] text-white/30">{copy.checkerApiNote}</p>
      )}
    </>
  );

  if (isEmbed) {
    return (
      <div className="min-h-dvh bg-[#030303] p-4 text-white">{inner}</div>
    );
  }

  return (
    <BezelCard
      id="passport"
      className="border-cyan-500/15"
      innerClassName="p-6 md:p-8"
      animate
    >
      {inner}
    </BezelCard>
  );
}
