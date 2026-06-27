"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useCallback, useMemo, useState } from "react";

import { EasePanel } from "@/app/_components/EasePanel";
import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { saveDossierAction } from "@/lib/actions/dossiers";
import { getPartnerCode } from "@/lib/partner-attribution";
import { markWizardCompletedAction } from "@/lib/actions/wizard-complete";
import { track } from "@/lib/analytics";
import { getEaseMessages } from "@/lib/ease-i18n";
import { scorePresentation } from "@/lib/score-presentation";
import { tierFromScore } from "@/lib/score";
import { computeUnifiedWizardScore } from "@/lib/wizard-scoring-unified";
import {
  DOC_NONE,
  DOSSIER_STORAGE_KEY,
  STEP_STORAGE_KEYS,
  STORAGE_KEY,
} from "@/lib/wizard-constants";
import { formatCurrencyDisplay } from "@/lib/wizard-format";
import { getWizardStepsMessages } from "@/lib/wizard-steps-i18n";
import { wizardOptionLabel } from "@/lib/wizard-options-i18n";
import type { WizardData } from "@/lib/wizard-types";
import {
  computeGreenRtmsScore,
  isGreenWizardAsset,
} from "@/lib/green/rtms-scoring";
import {
  computeGreenComplianceScore,
  isGreenWizardContext,
} from "@/lib/green/scoring/green-compliance";
import { computeWizardGreenScores } from "@/lib/green/scoring/wizard-green-scores";

import { WizardSummaryRow } from "../WizardPrimitives";
import { WizardStepHeader } from "../WizardStepHeader";
import { GreenRtmsPanel } from "../GreenRtmsPanel";
import { GreenCompliancePanel } from "../GreenCompliancePanel";
import { GreenScoringPanel } from "../GreenScoringPanel";
import { ProScoreBreakdown } from "../ProScoreBreakdown";

type GenerateState = "idle" | "saving" | "error";

type Props = {
  data: WizardData;
};

export function Step15Summary({ data }: Props) {
  const router = useRouter();
  const { isSignedIn } = useUser();
  const { locale } = useLocale();
  const ws = getWizardStepsMessages(locale);
  const easeM = getEaseMessages(locale);
  const [genState, setGenState] = useState<GenerateState>("idle");
  const [genError, setGenError] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const unified = useMemo(
    () => computeUnifiedWizardScore("pro", data, locale),
    [data, locale]
  );
  const result = useMemo(() => {
    if (unified.mode !== "pro") return null;
    const score = unified.protocol.score;
    const tierInfo = tierFromScore(score);
    const presentation = scorePresentation(score, locale);
    return {
      score,
      tier: tierInfo.tier,
      label: presentation.tierLabel,
      color: tierInfo.color,
      admissionPercent: unified.ease.admissionPercent,
      admissionLabel: unified.ease.subline,
    };
  }, [unified, locale]);
  const rtms = useMemo(
    () => (isGreenWizardAsset(data.assetType) ? computeGreenRtmsScore(data) : null),
    [data]
  );
  const greenCompliance = useMemo(
    () => (isGreenWizardContext(data) ? computeGreenComplianceScore(data) : null),
    [data]
  );
  const greenScoring = useMemo(
    () => (isGreenWizardContext(data) ? computeWizardGreenScores(data) : null),
    [data]
  );
  const ease = unified.ease;

  const truncatedDescription = data.description
    ? data.description.length > 100
      ? data.description.slice(0, 100).trimEnd() + "…"
      : data.description
    : "—";

  const realDocs = data.documents.filter((d) => d !== DOC_NONE);
  const docDisplay =
    realDocs.length > 0
      ? ws.s15.docCount(realDocs.length)
      : data.documents.includes(DOC_NONE)
        ? wizardOptionLabel(locale, "documents", DOC_NONE)
        : "—";

  const goalLabels =
    data.goals.length > 0
      ? data.goals
          .map((id) => wizardOptionLabel(locale, "goals", id))
          .join(" · ")
      : "—";

  const incomeLabel =
    data.incomeType === "rental"
      ? `${wizardOptionLabel(locale, "incomeTypes", "rental")} · ${formatCurrencyDisplay(data.incomeAmountYear, data.currency)}/an`
      : data.incomeType === "other"
        ? `${wizardOptionLabel(locale, "incomeTypes", "other")} · ${data.incomeDescription || "—"}`
        : data.incomeType
          ? wizardOptionLabel(locale, "incomeTypes", data.incomeType)
          : "—";

  const rows: Array<[string, string]> = [
    [
      ws.s15.rows.asset,
      data.assetType
        ? wizardOptionLabel(locale, "assetTypes", data.assetType)
        : "—",
    ],
    [ws.s15.rows.description, truncatedDescription],
    [
      ws.s15.rows.value,
      formatCurrencyDisplay(data.estimatedValue || 0, data.currency),
    ],
    [
      ws.s15.rows.location,
      [data.city, data.country].filter(Boolean).join(", ") || "—",
    ],
    [ws.s15.rows.documents, docDisplay],
    [ws.s15.rows.objectives, goalLabels],
    [
      ws.s15.rows.timeline,
      data.timeline
        ? wizardOptionLabel(locale, "timelines", data.timeline)
        : "—",
    ],
    [
      ws.s15.rows.platform,
      data.platform
        ? wizardOptionLabel(locale, "platforms", data.platform)
        : "—",
    ],
    [
      ws.s15.rows.contact,
      [data.firstName, data.email].filter(Boolean).join(" · ") || "—",
    ],
    [
      ws.s15.rows.legalStructure,
      data.legalStructure
        ? wizardOptionLabel(locale, "legalStructures", data.legalStructure)
        : "—",
    ],
    [ws.s15.rows.income, incomeLabel],
    [
      ws.s15.rows.legalStatus,
      data.legalStatus.length
        ? data.legalStatus
            .map((s) => wizardOptionLabel(locale, "legalStatus", s))
            .join(" · ")
        : "—",
    ],
    [
      ws.s15.rows.investorProfile,
      data.investorProfile
        ? wizardOptionLabel(locale, "investorProfiles", data.investorProfile)
        : "—",
    ],
    [
      ws.s15.rows.notes,
      data.additionalNotes
        ? data.additionalNotes.length > 80
          ? data.additionalNotes.slice(0, 80).trimEnd() + "…"
          : data.additionalNotes
        : "—",
    ],
  ];

  const buildDossier = useCallback(() => {
    const merged: Record<string, unknown> = { ...data };
    try {
      const combinedRaw = localStorage.getItem(STORAGE_KEY);
      if (combinedRaw) {
        const parsed = JSON.parse(combinedRaw) as {
          data?: Record<string, unknown>;
        };
        if (parsed.data) {
          for (const [k, v] of Object.entries(parsed.data)) {
            if (merged[k] === undefined) merged[k] = v;
          }
        }
      }
      for (const key of Object.values(STEP_STORAGE_KEYS)) {
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        const parsed = JSON.parse(raw) as Record<string, unknown>;
        for (const [k, v] of Object.entries(parsed)) {
          if (k === "ts") continue;
          if (merged[k] === undefined) merged[k] = v;
        }
      }
    } catch {
      // best-effort merge
    }

    let paidTier: string | undefined;
    try {
      paidTier = sessionStorage.getItem("auros_wizard_paid_tier") ?? undefined;
    } catch {
      // ignore
    }

    return {
      generatedAt: new Date().toISOString(),
      score: result?.score,
      tier: result?.tier,
      tierLabel: result?.label,
      wizardMode: "pro" as const,
      paidTier,
      data: { ...merged, wizardMode: "pro", paidTier },
      ...(rtms ? { greenRtms: rtms } : {}),
      ...(greenCompliance ? { greenCompliance } : {}),
      ...(greenScoring ? { greenScoring } : {}),
    };
  }, [data, result, rtms, greenCompliance, greenScoring]);

  const handleGenerate = useCallback(async () => {
    setGenState("saving");
    setGenError(null);

    const dossier = buildDossier();

    try {
      localStorage.setItem(DOSSIER_STORAGE_KEY, JSON.stringify(dossier));
    } catch {
      // storage may be full
    }

    if (isSignedIn) {
      const saveResult = await saveDossierAction({
        assetType: data.assetType || null,
        data: dossier.data as Record<string, unknown>,
        score: dossier.score ?? 0,
        referredBy: getPartnerCode(),
      });
      if (!saveResult.ok) {
        setGenState("error");
        setGenError(
          saveResult.error === "unauthenticated"
            ? ws.s15.saveErrorAuth
            : `${ws.s15.saveErrorPrefix} ${saveResult.message}`
        );
        return;
      }
      try {
        localStorage.setItem(
          DOSSIER_STORAGE_KEY,
          JSON.stringify({ ...dossier, id: saveResult.id })
        );
      } catch {
        // ignore
      }
    }

    track("wizard_completed", { score: dossier.score ?? 0 });
    if (data.email) {
      void markWizardCompletedAction(data.email);
    }
    router.push("/dossier");
  }, [buildDossier, data.assetType, data.email, isSignedIn, router, ws.s15]);

  const ctaLabel =
    genState === "saving"
      ? ws.s15.ctaSaving
      : genState === "error"
        ? ws.s15.ctaRetry
        : easeM.generateAnyway;

  const ctaDisabled = genState === "saving";

  return (
    <div>
      <WizardStepHeader
        step={15}
        tag={ws.s15.tag}
        title={ws.s15.title}
        subtitle={ws.s15.subtitle}
      />

      <div className="mt-8">
        <EasePanel summary={ease} locale={locale} />
      </div>

      <ProScoreBreakdown data={data} />

      {rtms ? <GreenRtmsPanel rtms={rtms} /> : null}
      {greenCompliance ? (
        <GreenCompliancePanel compliance={greenCompliance} email={data.email} />
      ) : null}
      {greenScoring ? <GreenScoringPanel scores={greenScoring} /> : null}

      <div className="my-8 flex flex-col items-center">
        <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
          {ws.s15.admissionHint ?? "Admission"}
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
        <p className="mt-1 font-mono text-[10px] tabular-nums text-white/45">
          {result?.admissionPercent}% · {result?.admissionLabel}
        </p>
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        disabled={ctaDisabled}
        data-wizard-step="15"
        data-cta=""
        className="wizard-btn-primary"
      >
        {ctaLabel}
      </button>
      {genState === "saving" ? (
        <div className="mt-4" role="status" aria-live="polite">
          <div className="mx-auto h-1 max-w-xs overflow-hidden rounded-full bg-white/[0.08]">
            <div className="h-full w-1/3 animate-[shimmer_1.2s_ease-in-out_infinite] rounded-full bg-white/40" />
          </div>
        </div>
      ) : null}
      <p className="mt-4 text-center text-xs leading-relaxed text-white/45">
        {easeM.generateNote}
      </p>

      {genState === "error" && genError ? (
        <p className="mt-4 text-center font-mono text-xs text-accent" role="alert">
          {genError}
        </p>
      ) : null}

      <div className="mt-10 border-t border-white/[0.06] pt-6">
        <button
          type="button"
          onClick={() => setDetailsOpen((v) => !v)}
          className="font-mono text-[10px] uppercase tracking-wider text-white/50 hover:text-white/80"
          aria-expanded={detailsOpen}
        >
          {detailsOpen ? easeM.detailsHide : easeM.detailsToggle}
        </button>
        {detailsOpen ? (
          <div className="mt-4 flex flex-col">
            {rows.map(([k, v]) => (
              <WizardSummaryRow key={k} label={k} value={v} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
