"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { EasePanel } from "@/app/_components/EasePanel";
import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { track } from "@/lib/analytics";
import { getEaseMessages } from "@/lib/ease-i18n";
import { VALUE_BUCKETS } from "@/lib/wizard-modes";
import { computeUnifiedWizardScore } from "@/lib/wizard-scoring-unified";
import { wizardOptionLabel } from "@/lib/wizard-options-i18n";
import type { WizardData } from "@/lib/wizard-types";

import { WizardStepHeader } from "./WizardStepHeader";

type Props = {
  data: WizardData;
};

export function ExploreSummary({ data }: Props) {
  const { locale } = useLocale();
  const easeM = getEaseMessages(locale);
  const [pdfLoading, setPdfLoading] = useState(false);

  const unified = useMemo(
    () => computeUnifiedWizardScore("explore", data, locale),
    [data, locale]
  );
  const result = unified.mode === "explore" ? unified.score : null;
  const ease = unified.ease;

  const bucketLabel =
    VALUE_BUCKETS.find((b) => b.id === data.valueBucket)?.[
      locale === "fr" ? "labelFr" : "labelEn"
    ] ?? "—";

  const goalLabel =
    data.goals[0]
      ? wizardOptionLabel(locale, "goals", data.goals[0])
      : "—";

  const exploreTracked = useRef(false);
  useEffect(() => {
    if (exploreTracked.current) return;
    exploreTracked.current = true;
    track("wizard_explore_complete", { score: result?.score ?? 0 });
  }, [result?.score]);

  const handlePdf = async () => {
    setPdfLoading(true);
    track("wizard_explore_pdf", { score: result?.score ?? 0 });
    try {
      const res = await fetch("/api/wizard/explore-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data,
          score: result?.score,
          tierLabel: result?.label,
        }),
      });
      if (!res.ok) throw new Error("pdf_failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "auros-explore-apercu.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // silent — explore PDF is optional
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div>
      <WizardStepHeader
        step={15}
        tag={locale === "fr" ? "Aperçu" : "Preview"}
        title={
          locale === "fr"
            ? "Votre score indicatif"
            : "Your indicative score"
        }
        subtitle={
          locale === "fr"
            ? "Trois priorités pour avancer — le détail complet est dans le parcours Pro."
            : "Three priorities to move forward — full detail is in the Pro path."
        }
      />

      <div className="mt-8">
        <EasePanel summary={ease} locale={locale} />
      </div>

      <div className="my-8 flex flex-col items-center">
        <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
          {locale === "fr" ? "Score indicatif" : "Indicative score"}
        </p>
        <p className="wizard-score-display mt-2" aria-live="polite">
          {result?.score ?? "—"}
        </p>
        <p
          className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em]"
          style={{ color: result?.color }}
        >
          {result?.label}
        </p>
      </div>

      <div className="mb-6 rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 text-sm text-white/60">
        <p>
          <span className="text-white/40">
            {locale === "fr" ? "Fourchette · " : "Range · "}
          </span>
          {bucketLabel}
        </p>
        <p className="mt-2">
          <span className="text-white/40">
            {locale === "fr" ? "Objectif · " : "Goal · "}
          </span>
          {goalLabel}
        </p>
      </div>

      <button
        type="button"
        onClick={() => void handlePdf()}
        disabled={pdfLoading}
        className="mb-4 w-full rounded-xl border border-white/15 px-4 py-3 font-mono text-xs uppercase tracking-wider text-white/70 hover:border-white/30 hover:text-white"
      >
        {pdfLoading
          ? locale === "fr"
            ? "Génération…"
            : "Generating…"
          : locale === "fr"
            ? "Télécharger l'aperçu PDF (filigrane)"
            : "Download preview PDF (watermarked)"}
      </button>

      <Link
        href="/wizard/pro?tier=starter"
        onClick={() => track("wizard_explore_upgrade_cta")}
        className="wizard-btn-primary block text-center"
        data-cta=""
      >
        {locale === "fr"
          ? "Obtenir mon analyse complète → 490 €"
          : "Get my full analysis → €490"}
      </Link>
      <p className="mt-4 text-center text-xs leading-relaxed text-white/45">
        {easeM.generateNote}
      </p>
    </div>
  );
}
