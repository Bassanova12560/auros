"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";

import { ContentFaqList } from "@/app/_components/ContentPageLayout";
import { ScoreReveal } from "@/app/_components/ScoreReveal";
import { StaticSectionHeader } from "@/app/_components/StaticSectionHeader";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { track } from "@/lib/analytics";
import { CSRD_CHECKER_FAQ } from "@/lib/green/csrd-check/faq";
import { computeCsrdScope } from "@/lib/green/csrd-check/scoring";
import type { CsrdAnswers, CsrdQuestionId } from "@/lib/green/csrd-check/types";
import { GREEN_CSRD_CHECK_ROUTE } from "@/lib/green/constants";
import { prefillFromCsrdChecker, saveWizardPrefill } from "@/lib/wizard-prefill";

import { GreenImpactReportCta } from "@/app/green/_components/GreenImpactReportCta";

const EMPTY: CsrdAnswers = {
  employees250: null,
  revenue40m: null,
  balance20m: null,
  listedEu: null,
  greenAssets: null,
  hasSustainabilityReport: null,
};

const QUESTIONS: { id: CsrdQuestionId; label: string }[] = [
  { id: "employees250", label: "Votre entreprise compte-t-elle plus de 250 employés ?" },
  { id: "revenue40m", label: "Votre chiffre d'affaires dépasse-t-il 40 M€ ?" },
  { id: "balance20m", label: "Votre total bilan dépasse-t-il 20 M€ ?" },
  { id: "listedEu", label: "Êtes-vous coté sur un marché réglementé de l'UE ?" },
  {
    id: "greenAssets",
    label: "Détenez-vous des actifs verts (immobilier, énergie, infrastructure) ?",
  },
  { id: "hasSustainabilityReport", label: "Publiez-vous déjà un rapport de durabilité ?" },
];

export function CsrdCheckView() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<CsrdAnswers>(EMPTY);
  const [showScore, setShowScore] = useState(false);

  const total = QUESTIONS.length;
  const onResult = step >= total;
  const current = !onResult ? QUESTIONS[step] : null;
  const currentVal = current ? answers[current.id] : null;

  const result = useMemo(
    () => (onResult ? computeCsrdScope(answers) : null),
    [answers, onResult]
  );

  const select = useCallback((id: CsrdQuestionId, value: boolean) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }, []);

  const goNext = () => {
    if (!current || currentVal === null) return;
    if (step + 1 >= total) {
      setShowScore(true);
      track("csrd_checker_complete");
    }
    setStep((s) => s + 1);
  };

  const goBack = () => {
    if (onResult) {
      setShowScore(false);
      setStep(total - 1);
      return;
    }
    setStep((s) => Math.max(0, s - 1));
  };

  const restart = () => {
    setAnswers(EMPTY);
    setStep(0);
    setShowScore(false);
  };

  const startGreenWizard = () => {
    saveWizardPrefill(prefillFromCsrdChecker());
    track("csrd_checker_wizard_cta");
  };

  return (
    <div className="space-y-16 md:space-y-20">
      <StaticSectionHeader
        eyebrow="AUROS Green · CSRD"
        title="CSRD Checker"
        subtitle="Six questions pour estimer si vous entrez en scope CSRD et votre niveau de préparation — gratuit, indicatif, ~2 min."
      />

      {!onResult ? (
        <div className="card-flat px-5 py-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
            Question {step + 1} / {total}
          </p>
          <p className="mt-4 text-lg font-light text-white/90">{current?.label}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => current && select(current.id, true)}
              className={`rounded-full border px-5 py-2.5 text-sm transition-colors ${
                currentVal === true
                  ? "border-emerald-500/60 bg-emerald-500/15 text-emerald-300"
                  : "border-white/15 text-white/70 hover:border-white/30"
              }`}
            >
              Oui
            </button>
            <button
              type="button"
              onClick={() => current && select(current.id, false)}
              className={`rounded-full border px-5 py-2.5 text-sm transition-colors ${
                currentVal === false
                  ? "border-emerald-500/60 bg-emerald-500/15 text-emerald-300"
                  : "border-white/15 text-white/70 hover:border-white/30"
              }`}
            >
              Non
            </button>
          </div>
          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={goBack}
              disabled={step === 0}
              className="text-sm text-white/45 disabled:opacity-30"
            >
              Retour
            </button>
            <PrimaryButton onClick={goNext} disabled={currentVal === null}>
              Continuer
            </PrimaryButton>
          </div>
        </div>
      ) : result ? (
        <div className="space-y-8">
          <ScoreReveal show={showScore} score={result.preparation_score} />
          <div className="card-flat px-5 py-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-500/70">
              Résultat CSRD
            </p>
            <p className="mt-3 text-xl font-light text-white">{result.scope_label}</p>
            {result.scope_from_year ? (
              <p className="mt-2 text-sm text-white/55">
                Entrée en scope estimée : exercice {result.scope_from_year}
              </p>
            ) : null}
            <p className="mt-4 text-sm text-white/60">
              Score de préparation :{" "}
              <span className="font-mono text-emerald-400">{result.preparation_score}/100</span>
            </p>
            {result.priorities.length > 0 ? (
              <ul className="mt-6 space-y-2 text-sm text-white/65">
                {result.priorities.map((p) => (
                  <li key={p}>· {p}</li>
                ))}
              </ul>
            ) : null}
            <p className="mt-6 text-xs text-white/40">{result.disclaimer}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/wizard?type=green&asset=renewable" onClick={startGreenWizard}>
                <PrimaryButton>Évaluer mes actifs verts →</PrimaryButton>
              </Link>
              <button type="button" onClick={restart} className="text-sm text-white/45">
                Recommencer
              </button>
            </div>
            <div className="mt-8">
              <GreenImpactReportCta csrdResult={result} />
            </div>
          </div>
        </div>
      ) : null}

      <ContentFaqList items={[...CSRD_CHECKER_FAQ]} />
      <p className="font-mono text-[10px] text-white/30">{GREEN_CSRD_CHECK_ROUTE}</p>
    </div>
  );
}
