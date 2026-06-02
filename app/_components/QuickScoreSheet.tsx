"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { WIZARD_ASSET_OPTIONS } from "@/app/wizard/_components/Step1Asset";
import { wizardOptionLabel } from "@/lib/wizard-options-i18n";
import { useLocale, useTranslations } from "./i18n/LocaleProvider";
import { ScoreReveal } from "./ScoreReveal";
import { TokenizationProgress } from "./TokenizationProgress";
import { PrimaryButton } from "./ui/PrimaryButton";
import { track } from "@/lib/analytics";
import { quickScoreFromWizardFields } from "@/lib/quick-score";
import { saveWizardPrefill } from "@/lib/wizard-prefill";
import {
  readinessFromQuickInput,
  saveReadinessSnapshot,
} from "@/lib/tokenization-readiness";
import { COUNTRIES_EUROPE, COUNTRIES_REST } from "@/lib/wizard-countries";
import type { Currency } from "@/lib/wizard-types";

const ALL_COUNTRIES = [...COUNTRIES_EUROPE, ...COUNTRIES_REST];
const VALUE_MIN = 50_000;
const VALUE_MAX = 10_000_000;
const VALUE_DEFAULT = 500_000;

type Props = {
  open: boolean;
  onClose: () => void;
};

export function QuickScoreSheet({ open, onClose }: Props) {
  const t = useTranslations();
  const { locale } = useLocale();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [assetType, setAssetType] = useState("");
  const [estimatedValue, setEstimatedValue] = useState(VALUE_DEFAULT);
  const [country, setCountry] = useState("France");
  const [result, setResult] = useState<ReturnType<
    typeof quickScoreFromWizardFields
  > | null>(null);
  const [showResult, setShowResult] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const reset = useCallback(() => {
    setStep(1);
    setAssetType("");
    setEstimatedValue(VALUE_DEFAULT);
    setCountry("France");
    setResult(null);
    setShowResult(false);
  }, []);

  const handleClose = () => {
    onClose();
    window.setTimeout(reset, 300);
  };

  const runScore = () => {
    const r = quickScoreFromWizardFields(
      { assetType, estimatedValue, country },
      locale
    );
    setResult(r);
    setStep(4);
    setShowResult(false);
    const snapshot = readinessFromQuickInput(
      { assetType, estimatedValue, country, score: r.score },
      {
        asset: t.progress.itemAsset,
        value: t.progress.itemValue,
        location: t.progress.itemLocation,
        description: t.progress.itemDescription,
        documents: t.progress.itemDocuments,
        dossier: t.progress.itemDossier,
      }
    );
    saveReadinessSnapshot(snapshot);
    track("score_calculated", {
      score: r.score,
      source: "quick_score_sheet",
    });
  };

  const goWizard = () => {
    saveWizardPrefill({
      assetType,
      estimatedValue,
      currency: "EUR" as Currency,
      country,
      quickScore: result?.score,
    });
    track("quick_score_to_wizard", { score: result?.score ?? 0 });
    onClose();
    router.push("/wizard");
    window.setTimeout(reset, 400);
  };

  useEffect(() => {
    if (step !== 4 || !result) return;
    dialogRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    resultRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
    const t = window.setTimeout(() => setShowResult(true), 80);
    return () => window.clearTimeout(t);
  }, [step, result]);

  const readiness =
    result &&
    readinessFromQuickInput(
      { assetType, estimatedValue, country, score: result.score },
      {
        asset: t.progress.itemAsset,
        value: t.progress.itemValue,
        location: t.progress.itemLocation,
        description: t.progress.itemDescription,
        documents: t.progress.itemDocuments,
        dossier: t.progress.itemDossier,
      }
    );

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label={t.quickScore.close}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="quick-score-title"
            className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[min(90dvh,720px)] w-full max-w-lg flex-col overflow-y-auto overscroll-contain rounded-t-2xl border border-white/10 bg-void px-6 pb-8 pt-6 shadow-2xl md:inset-auto md:left-1/2 md:top-1/2 md:max-h-[min(85vh,720px)] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-2xl"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 36 }}
          >
            <div className="mb-6 flex items-center justify-between">
              <p
                id="quick-score-title"
                className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/45"
              >
                {t.quickScore.title} ·{" "}
                {step < 4 ? `${step}/3` : t.quickScore.resultStep}
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="font-mono text-xs text-white/40 hover:text-white"
              >
                {t.quickScore.close}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {step < 4 ? (
                <motion.div
                  key={`step-${step}`}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                >
                  {step === 1 && (
                    <div>
                      <h2 className="font-display text-2xl font-semibold text-white">
                        {t.quickScore.stepAsset}
                      </h2>
                      <div className="mt-4 grid max-h-[40vh] gap-2 overflow-y-auto sm:grid-cols-2">
                        {WIZARD_ASSET_OPTIONS.map((value) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setAssetType(value)}
                            className={
                              assetType === value
                                ? "wizard-asset-chip wizard-asset-chip-active"
                                : "wizard-asset-chip"
                            }
                          >
                            {wizardOptionLabel(locale, "assetTypes", value)}
                          </button>
                        ))}
                      </div>
                      <button
                        type="button"
                        disabled={!assetType}
                        onClick={() => setStep(2)}
                        className="mt-6 w-full rounded-xl border border-white bg-white py-3 font-mono text-xs uppercase tracking-wider text-void disabled:opacity-40"
                      >
                        {t.quickScore.next}
                      </button>
                    </div>
                  )}

                  {step === 2 && (
                    <div>
                      <h2 className="font-display text-2xl font-semibold text-white">
                        {t.quickScore.stepValue}
                      </h2>
                      <p className="mt-2 font-mono text-2xl tabular-nums text-white">
                        {estimatedValue.toLocaleString(locale === "en" ? "en-US" : locale === "es" ? "es-ES" : "fr-FR")} EUR
                      </p>
                      <input
                        type="range"
                        min={VALUE_MIN}
                        max={VALUE_MAX}
                        step={10_000}
                        value={estimatedValue}
                        onChange={(e) =>
                          setEstimatedValue(Number.parseInt(e.target.value, 10))
                        }
                        className="mt-6 w-full accent-white"
                      />
                      <div className="mt-6 flex gap-3">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="flex-1 rounded-xl border border-white/15 py-3 font-mono text-xs uppercase text-white/60"
                        >
                          {t.quickScore.back}
                        </button>
                        <button
                          type="button"
                          onClick={() => setStep(3)}
                          className="flex-1 rounded-xl border border-white bg-white py-3 font-mono text-xs uppercase text-void"
                        >
                          {t.quickScore.next}
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div>
                      <h2 className="font-display text-2xl font-semibold text-white">
                        {t.quickScore.stepCountry}
                      </h2>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="wizard-select mt-4"
                      >
                        {ALL_COUNTRIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <div className="mt-6 flex gap-3">
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="flex-1 rounded-xl border border-white/15 py-3 font-mono text-xs uppercase text-white/60"
                        >
                          {t.quickScore.back}
                        </button>
                        <button
                          type="button"
                          onClick={runScore}
                          className="flex-1 rounded-xl border border-white bg-white py-3 font-mono text-xs uppercase text-void"
                        >
                          {t.quickScore.seeScore}
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                result && (
                  <motion.div
                    ref={resultRef}
                    key="result"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col gap-6"
                  >
                    <ScoreReveal
                      score={result.score}
                      show={showResult}
                      compact
                      instant
                    />
                    {readiness ? (
                      <TokenizationProgress snapshot={readiness} />
                    ) : null}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: showResult ? 1 : 0 }}
                      transition={{ delay: 0.35 }}
                      className="sticky bottom-0 border-t border-white/[0.06] bg-void/95 pb-1 pt-4 backdrop-blur-sm"
                    >
                      <PrimaryButton onClick={goWizard}>
                        {t.quickScore.ctaFull}
                      </PrimaryButton>
                      <p className="mt-4 text-center text-xs text-white/40">
                        {t.quickScore.prefillNote}
                      </p>
                    </motion.div>
                  </motion.div>
                )
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
