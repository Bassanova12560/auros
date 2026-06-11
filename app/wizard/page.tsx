"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  CURRENCIES,
  DOC_NONE,
  EMAIL_REGEX,
  STEP2_MIN_WORDS,
  STEP_STORAGE_KEYS,
  STORAGE_KEY,
  TOTAL_STEPS,
  VALUE_MAX,
  VALUE_MIN,
  initialWizardData,
} from "@/lib/wizard-constants";
import { saveLeadAction } from "@/lib/actions/leads";
import { track } from "@/lib/analytics";
import {
  clearWizardPrefill,
  loadWizardPrefill,
} from "@/lib/wizard-prefill";
import {
  clearDemoContactStorage,
  sanitizeWizardContactPatch,
} from "@/lib/wizard-test-data";
import { getSimulationWizardData } from "@/lib/simulation/sample-wizard";
import type { Currency, WizardData } from "@/lib/wizard-types";
import { isLocale, type Locale } from "@/lib/i18n";
import { GREEN_WIZARD_ASSET_TYPE } from "@/lib/green/constants";

import { Step1Asset } from "./_components/Step1Asset";
import { Step2Description } from "./_components/steps/Step2Description";
import { Step3Value } from "./_components/steps/Step3Value";
import { Step4Location } from "./_components/steps/Step4Location";
import { Step5Documents } from "./_components/steps/Step5Documents";
import { Step6Objectives } from "./_components/steps/Step6Objectives";
import { Step7Timeline } from "./_components/steps/Step7Timeline";
import { Step8Platform } from "./_components/steps/Step8Platform";
import { Step9Contact } from "./_components/steps/Step9Contact";
import { Step15Summary } from "./_components/steps/Step15Summary";
import { StepMicaQuestion } from "./_components/steps/StepMicaQuestion";
import {
  Step10LegalStructure,
  Step11Revenue,
  Step12LegalStatus,
  Step13InvestorProfile,
  Step14Additional,
} from "./_components/WizardStepsExtended";
import { ExploreSummary } from "./_components/ExploreSummary";
import { WizardPathChoice } from "./_components/WizardPathChoice";
import { WizardShell } from "./_components/WizardShell";
import { StarterPhaseBanner } from "./_components/StarterPhaseBanner";
import {
  firstStepOfPhaseForMode,
  isMicaStep,
  isStepInMode,
  MICA_STEP_TO_QUESTION,
  nextStepForMode,
  parseWizardMode,
  modeFromLegacyExpert,
  phaseIndexForStep,
  prevStepForMode,
  stepCountForMode,
  stepIndexInMode,
  type WizardMode,
} from "@/lib/wizard-modes";
import { getWizardUnlockBySessionAction } from "@/lib/actions/wizard-purchase";
import {
  phaseIndexFromSlug,
  phaseSlugFromIndex,
} from "@/lib/wizard-phase-url";
import type { MicaAnswers } from "@/lib/mica-checker/types";

const PRO_UNLOCK_KEY = "auros_wizard_pro_session";

export default function WizardPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>(initialWizardData);
  const [hydrated, setHydrated] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [wizardMode, setWizardMode] = useState<WizardMode>("explore");
  const [pathChosen, setPathChosen] = useState(false);
  const [proUnlocked, setProUnlocked] = useState(false);
  const [proAccessChecked, setProAccessChecked] = useState(false);
  const [step9Hints, setStep9Hints] = useState(false);
  const [validationHint, setValidationHint] = useState(false);
  const [starterPhase, setStarterPhase] = useState<{
    country: string;
    locale: Locale;
  } | null>(null);

  useEffect(() => {
    clearDemoContactStorage();
    try {
      const params =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search)
          : null;
      const demo = params?.get("demo") === "1";
      const expertUrl = params?.get("expert") === "1";
      const modeParam = parseWizardMode(params?.get("mode"));
      const sessionId = params?.get("session_id");
      const assetRenewable = params?.get("asset") === "renewable";
      if (demo) {
        const sim = getSimulationWizardData();
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ step: TOTAL_STEPS, data: sim })
        );
        setData(sim);
        setStep(TOTAL_STEPS);
        setHydrated(true);
        return;
      }

      const raw = localStorage.getItem(STORAGE_KEY);
      let restored: Partial<WizardData> | null = null;
      let resolvedMode: WizardMode =
        modeParam ?? (expertUrl ? "explore" : "explore");
      if (raw) {
        const parsed = JSON.parse(raw) as {
          step?: number;
          data?: Partial<WizardData>;
          expertMode?: boolean;
          wizardMode?: WizardMode;
          pathChosen?: boolean;
        };
        if (parsed.data) restored = parsed.data;
        const storedMode =
          parsed.wizardMode ??
          (parsed.expertMode ? modeFromLegacyExpert(true) : null);
        if (storedMode) {
          setWizardMode(storedMode);
          setPathChosen(true);
        } else if (expertUrl || modeParam === "explore") {
          setWizardMode("explore");
          setPathChosen(true);
        } else if (modeParam === "pro") {
          setWizardMode("pro");
          setPathChosen(true);
        }
        if (parsed.pathChosen) setPathChosen(true);
        resolvedMode =
          storedMode ??
          (expertUrl || modeParam === "explore"
            ? "explore"
            : modeParam === "pro"
              ? "pro"
              : "explore");
        if (
          typeof parsed.step === "number" &&
          parsed.step >= 1 &&
          parsed.step <= TOTAL_STEPS
        ) {
          const s = parsed.step;
          if (isStepInMode(resolvedMode, s)) setStep(s);
          else setStep(1);
        } else if (expertUrl || modeParam) {
          setStep(1);
        }
      } else if (expertUrl || modeParam === "explore") {
        resolvedMode = "explore";
        setWizardMode("explore");
        setPathChosen(true);
        setStep(1);
      } else if (modeParam === "pro") {
        resolvedMode = "pro";
        setWizardMode("pro");
        setPathChosen(true);
        setStep(1);
      }
      const step2Raw = localStorage.getItem(STEP_STORAGE_KEYS[2]);
      if (step2Raw) {
        const step2 = JSON.parse(step2Raw) as { description?: string };
        if (step2.description && !restored?.description) {
          restored = { ...(restored ?? {}), description: step2.description };
        }
      }
      const step3Raw = localStorage.getItem(STEP_STORAGE_KEYS[3]);
      if (step3Raw) {
        const step3 = JSON.parse(step3Raw) as {
          estimatedValue?: number;
          currency?: Currency;
        };
        const patch: Partial<WizardData> = {};
        if (
          typeof step3.estimatedValue === "number" &&
          restored?.estimatedValue == null
        ) {
          patch.estimatedValue = step3.estimatedValue;
        }
        if (
          step3.currency &&
          CURRENCIES.includes(step3.currency) &&
          restored?.currency == null
        ) {
          patch.currency = step3.currency;
        }
        if (Object.keys(patch).length) {
          restored = { ...(restored ?? {}), ...patch };
        }
      }
      const step4Raw = localStorage.getItem(STEP_STORAGE_KEYS[4]);
      if (step4Raw) {
        const step4 = JSON.parse(step4Raw) as {
          country?: string;
          city?: string;
        };
        const patch: Partial<WizardData> = {};
        if (step4.country && !restored?.country) patch.country = step4.country;
        if (step4.city && !restored?.city) patch.city = step4.city;
        if (Object.keys(patch).length) {
          restored = { ...(restored ?? {}), ...patch };
        }
      }
      const step5Raw = localStorage.getItem(STEP_STORAGE_KEYS[5]);
      if (step5Raw) {
        const step5 = JSON.parse(step5Raw) as { documents?: string[] };
        if (
          Array.isArray(step5.documents) &&
          (restored?.documents?.length ?? 0) === 0
        ) {
          restored = { ...(restored ?? {}), documents: step5.documents };
        }
      }
      const step6Raw = localStorage.getItem(STEP_STORAGE_KEYS[6]);
      if (step6Raw) {
        const step6 = JSON.parse(step6Raw) as { goals?: string[] };
        if (
          Array.isArray(step6.goals) &&
          (restored?.goals?.length ?? 0) === 0
        ) {
          restored = { ...(restored ?? {}), goals: step6.goals };
        }
      }
      const step7Raw = localStorage.getItem(STEP_STORAGE_KEYS[7]);
      if (step7Raw) {
        const step7 = JSON.parse(step7Raw) as { timeline?: string };
        if (step7.timeline && !restored?.timeline) {
          restored = { ...(restored ?? {}), timeline: step7.timeline };
        }
      }
      const step8Raw = localStorage.getItem(STEP_STORAGE_KEYS[8]);
      if (step8Raw) {
        const step8 = JSON.parse(step8Raw) as { platform?: string };
        if (step8.platform && !restored?.platform) {
          restored = { ...(restored ?? {}), platform: step8.platform };
        }
      }
      const step9Raw = localStorage.getItem(STEP_STORAGE_KEYS[9]);
      if (step9Raw) {
        const step9 = JSON.parse(step9Raw) as {
          firstName?: string;
          email?: string;
        };
        const patch: Partial<WizardData> = {};
        if (step9.firstName && !restored?.firstName) {
          patch.firstName = step9.firstName;
        }
        if (step9.email && !restored?.email) {
          patch.email = step9.email;
        }
        if (Object.keys(patch).length) {
          restored = { ...(restored ?? {}), ...patch };
        }
      }
      if (restored) {
        setData({
          ...initialWizardData,
          ...restored,
          ...(assetRenewable ? { assetType: GREEN_WIZARD_ASSET_TYPE } : {}),
        });
      } else if (assetRenewable) {
        setData({ ...initialWizardData, assetType: GREEN_WIZARD_ASSET_TYPE });
      }
      const prefill = loadWizardPrefill();
      if (prefill) {
        if (prefill.mode) {
          setWizardMode(prefill.mode);
          setPathChosen(true);
          resolvedMode = prefill.mode;
        }
        setData((prev) => ({
          ...prev,
          assetType: prefill.assetType || prev.assetType,
          estimatedValue: prefill.estimatedValue || prev.estimatedValue,
          currency: prefill.currency || prev.currency,
          country: prefill.country || prev.country,
          city: prefill.city || prev.city,
          description: prefill.description || prev.description,
          valueBucket: prefill.valueBucket ?? prev.valueBucket,
          mica: prefill.mica
            ? { ...(prev.mica ?? {}), ...prefill.mica }
            : prev.mica,
        }));
        if (prefill.fromTool) {
          track("wizard_prefill_applied", { fromTool: prefill.fromTool });
        }
        clearWizardPrefill();
      }
      try {
        const starterRaw = sessionStorage.getItem("auros_wizard_starter_seed");
        if (starterRaw) {
          const seed = JSON.parse(starterRaw) as Partial<WizardData> & {
            fromStarterKit?: boolean;
            lockedJurisdictionIds?: string[];
          };
          setData((prev) => ({
            ...prev,
            ...seed,
            assetType: seed.assetType || prev.assetType,
            estimatedValue: seed.estimatedValue ?? prev.estimatedValue,
            currency: seed.currency || prev.currency,
            country: seed.country || prev.country,
            firstName: seed.firstName || prev.firstName,
            email: seed.email || prev.email,
            goals:
              Array.isArray(seed.goals) && seed.goals.length
                ? seed.goals
                : prev.goals,
            timeline: seed.timeline || prev.timeline,
          }));
          sessionStorage.removeItem("auros_wizard_starter_seed");
        }
        if (sessionStorage.getItem("auros_starter_phase1") === "1") {
          const metaRaw = sessionStorage.getItem("auros_starter_phase1_meta");
          if (metaRaw) {
            const meta = JSON.parse(metaRaw) as { country?: string; locale?: string };
            if (meta.country) {
              setStarterPhase({
                country: meta.country,
                locale: isLocale(meta.locale ?? "") ? (meta.locale as Locale) : "fr",
              });
            }
          }
          sessionStorage.removeItem("auros_starter_phase1");
          sessionStorage.removeItem("auros_starter_phase1_meta");
        }
      } catch {
        // ignore
      }

      const phaseParam = params?.get("phase");
      if (phaseParam && !demo) {
        const phaseIdx = phaseIndexFromSlug(phaseParam);
        if (phaseIdx !== null) {
          setStep(firstStepOfPhaseForMode(resolvedMode, phaseIdx));
        }
      }

      if (sessionId) {
        sessionStorage.setItem(PRO_UNLOCK_KEY, sessionId);
      }
      const unlockSession =
        sessionId ?? sessionStorage.getItem(PRO_UNLOCK_KEY) ?? undefined;
      if (unlockSession) {
        void getWizardUnlockBySessionAction(unlockSession).then((r) => {
          if (r.ok && r.unlocked) {
            setProUnlocked(true);
            try {
              sessionStorage.setItem("auros_wizard_paid_tier", r.tier);
            } catch {
              // ignore
            }
          }
          setProAccessChecked(true);
        });
      } else {
        setProAccessChecked(true);
      }
    } catch {
      // ignore malformed storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    const slug = phaseSlugFromIndex(phaseIndexForStep(wizardMode, step));
    if (!slug) return;
    const url = new URL(window.location.href);
    if (url.searchParams.get("phase") === slug) return;
    url.searchParams.set("phase", slug);
    const next = `${url.pathname}${url.search}${url.hash}`;
    window.history.replaceState(null, "", next);
  }, [hydrated, step, wizardMode]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          step,
          data,
          wizardMode,
          pathChosen,
          ts: Date.now(),
        })
      );
      setSavedAt(Date.now());
    } catch {
      // storage may be full / disabled
    }
  }, [data, step, hydrated, wizardMode, pathChosen]);

  useEffect(() => {
    if (!hydrated) return;
    if (!isStepInMode(wizardMode, step)) {
      const steps = wizardMode === "explore"
        ? [1, 2, 3, 6, 9, 15]
        : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 18, 19, 20, 15];
      const fallback = steps.find((s) => s >= step) ?? steps[0];
      setStep(fallback);
    }
  }, [hydrated, wizardMode, step]);

  useEffect(() => {
    if (!hydrated || !proAccessChecked || wizardMode !== "pro" || proUnlocked) {
      return;
    }
    const params = new URLSearchParams(window.location.search);
    if (params.get("demo") === "1") return;
    router.replace("/wizard/pro");
  }, [hydrated, proAccessChecked, wizardMode, proUnlocked, router]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        STEP_STORAGE_KEYS[2],
        JSON.stringify({ description: data.description, ts: Date.now() })
      );
    } catch {
      // ignore
    }
  }, [data.description, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        STEP_STORAGE_KEYS[3],
        JSON.stringify({
          estimatedValue: data.estimatedValue,
          currency: data.currency,
          ts: Date.now(),
        })
      );
    } catch {
      // ignore
    }
  }, [data.estimatedValue, data.currency, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        STEP_STORAGE_KEYS[4],
        JSON.stringify({
          country: data.country,
          city: data.city,
          ts: Date.now(),
        })
      );
    } catch {
      // ignore
    }
  }, [data.country, data.city, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        STEP_STORAGE_KEYS[5],
        JSON.stringify({ documents: data.documents, ts: Date.now() })
      );
    } catch {
      // ignore
    }
  }, [data.documents, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        STEP_STORAGE_KEYS[6],
        JSON.stringify({ goals: data.goals, ts: Date.now() })
      );
    } catch {
      // ignore
    }
  }, [data.goals, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        STEP_STORAGE_KEYS[7],
        JSON.stringify({ timeline: data.timeline, ts: Date.now() })
      );
    } catch {
      // ignore
    }
  }, [data.timeline, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        STEP_STORAGE_KEYS[8],
        JSON.stringify({ platform: data.platform, ts: Date.now() })
      );
    } catch {
      // ignore
    }
  }, [data.platform, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        STEP_STORAGE_KEYS[9],
        JSON.stringify({
          firstName: data.firstName,
          email: data.email,
          ts: Date.now(),
        })
      );
    } catch {
      // ignore
    }
  }, [data.firstName, data.email, hydrated]);

  const update = useCallback(<K extends keyof WizardData>(key: K, value: WizardData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const toggleInArray = useCallback(
    (key: "documents" | "goals", value: string) => {
      setData((prev) => {
        const current = prev[key];
        return {
          ...prev,
          [key]: current.includes(value)
            ? current.filter((v) => v !== value)
            : [...current, value],
        };
      });
    },
    []
  );

  const updateMica = useCallback((patch: Partial<MicaAnswers>) => {
    setData((prev) => ({
      ...prev,
      mica: { ...(prev.mica ?? {}), ...patch },
    }));
  }, []);

  const setSingleGoal = useCallback((value: string) => {
    setData((prev) => ({ ...prev, goals: [value] }));
  }, []);

  const toggleLegalStatus = useCallback((value: string) => {
    setData((prev) => {
      const current = prev.legalStatus;
      return {
        ...prev,
        legalStatus: current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value],
      };
    });
  }, []);

  const toggleDocument = useCallback((value: string) => {
    setData((prev) => {
      const current = prev.documents;
      if (value === DOC_NONE) {
        return {
          ...prev,
          documents: current.includes(DOC_NONE) ? [] : [DOC_NONE],
        };
      }
      const withoutNone = current.filter((d) => d !== DOC_NONE);
      const next = withoutNone.includes(value)
        ? withoutNone.filter((d) => d !== value)
        : [...withoutNone, value];
      return { ...prev, documents: next };
    });
  }, []);

  const isStepValid = useMemo(() => {
    if (isMicaStep(step)) {
      const q = MICA_STEP_TO_QUESTION[step];
      return !!data.mica?.[q];
    }
    switch (step) {
      case 1:
        return data.assetType.trim().length > 0;
      case 2: {
        const trimmed = data.description.trim();
        return trimmed.length > 0 && trimmed.split(/\s+/).length >= STEP2_MIN_WORDS;
      }
      case 3:
        if (wizardMode === "explore") {
          return !!data.valueBucket;
        }
        return (
          data.estimatedValue >= VALUE_MIN &&
          data.estimatedValue <= VALUE_MAX
        );
      case 4:
        return data.country.trim().length > 0 && data.city.trim().length > 0;
      case 5:
        return data.documents.length > 0;
      case 6:
        return wizardMode === "explore"
          ? data.goals.length === 1
          : data.goals.length > 0;
      case 7:
        return data.timeline.length > 0;
      case 8:
        return data.platform.length > 0;
      case 9:
        if (wizardMode === "explore") {
          return (
            EMAIL_REGEX.test((data.email ?? "").trim()) &&
            data.marketingConsent === true
          );
        }
        return (
          (data.firstName?.trim().length ?? 0) > 0 &&
          EMAIL_REGEX.test((data.email ?? "").trim()) &&
          data.marketingConsent === true
        );
      case 10:
        return data.legalStructure.trim().length > 0;
      case 11: {
        if (!data.incomeType) return false;
        if (data.incomeType === "rental") return data.incomeAmountYear > 0;
        if (data.incomeType === "other")
          return data.incomeDescription.trim().length > 0;
        return true;
      }
      case 12:
        return data.legalStatus.length > 0;
      case 13:
        return data.investorProfile.trim().length > 0;
      case 14:
      case 15:
        return true;
      default:
        return false;
    }
  }, [step, data, wizardMode]);

  const goNext = useCallback(() => {
    if (!isStepValid) {
      setValidationHint(true);
      if (step === 9) setStep9Hints(true);
      return;
    }
    setValidationHint(false);
    if (
      step === 9 &&
      EMAIL_REGEX.test((data.email ?? "").trim()) &&
      data.marketingConsent === true
    ) {
      void saveLeadAction({
        email: data.email!.trim(),
        source: "wizard_step_9",
        assetType: data.assetType || null,
        consent: true,
      });
    }
    const next = nextStepForMode(wizardMode, step);
    if (next) setStep(next);
  }, [
    step,
    isStepValid,
    data.email,
    data.assetType,
    data.marketingConsent,
    wizardMode,
  ]);

  const goBack = useCallback(() => {
    const prev = prevStepForMode(wizardMode, step);
    if (prev) setStep(prev);
  }, [step, wizardMode]);

  const goToPhase = useCallback(
    (phaseIndex: number) => {
      if (wizardMode !== "pro") return;
      setStep(firstStepOfPhaseForMode("pro", phaseIndex));
      setValidationHint(false);
    },
    [wizardMode]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !(e.target instanceof HTMLTextAreaElement)) {
        const canAdvance =
          nextStepForMode(wizardMode, step) !== null && isStepValid;
        if (canAdvance) {
          e.preventDefault();
          goNext();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, isStepValid, step, wizardMode]);

  const progressPct =
    (stepIndexInMode(wizardMode, step) / stepCountForMode(wizardMode)) * 100;

  const showPathChoice = step === 1 && hydrated && !pathChosen;

  const stepContent = useMemo(() => {
    switch (step) {
      case 1:
        return (
          <Step1Asset
            data={data}
            update={(v) => update("assetType", v)}
          />
        );
      case 2:
        return (
          <Step2Description
            data={data}
            update={(v) => update("description", v)}
          />
        );
      case 3:
        return (
          <Step3Value
            data={data}
            update={update}
            exploreMode={wizardMode === "explore"}
          />
        );
      case 4:
        return <Step4Location data={data} update={update} />;
      case 5:
        return <Step5Documents data={data} toggle={toggleDocument} />;
      case 6:
        return (
          <Step6Objectives
            data={data}
            toggle={(v) => toggleInArray("goals", v)}
            singleSelect={wizardMode === "explore"}
            onSingleSelect={setSingleGoal}
          />
        );
      case 7:
        return <Step7Timeline data={data} update={update} />;
      case 8:
        return <Step8Platform data={data} update={update} />;
      case 9:
        return (
          <Step9Contact
            data={data}
            update={update}
            showValidationHints={step9Hints}
          />
        );
      case 10:
        return (
          <Step10LegalStructure
            data={data}
            update={update as (key: string, value: unknown) => void}
          />
        );
      case 11:
        return (
          <Step11Revenue
            data={data}
            update={(key, value) =>
              update(key as keyof WizardData, value as WizardData[keyof WizardData])
            }
          />
        );
      case 12:
        return (
          <Step12LegalStatus
            data={data}
            toggle={toggleLegalStatus}
          />
        );
      case 13:
        return (
          <Step13InvestorProfile
            data={data}
            update={update as (key: string, value: unknown) => void}
          />
        );
      case 14:
        return (
          <Step14Additional
            data={data}
            update={update as (key: string, value: unknown) => void}
          />
        );
      case 15:
        return wizardMode === "explore" ? (
          <ExploreSummary data={data} />
        ) : (
          <Step15Summary data={data} />
        );
      case 16:
      case 17:
      case 18:
      case 19:
      case 20:
        return (
          <StepMicaQuestion step={step} data={data} updateMica={updateMica} />
        );
      default:
        return null;
    }
  }, [
    step,
    data,
    wizardMode,
    update,
    updateMica,
    setSingleGoal,
    toggleDocument,
    toggleInArray,
    toggleLegalStatus,
  ]);

  const canGoBack = prevStepForMode(wizardMode, step) !== null;
  const canGoNext = nextStepForMode(wizardMode, step) !== null;

  return (
    <WizardShell
      step={step}
      totalSteps={stepCountForMode(wizardMode)}
      progressPct={progressPct}
      wizardMode={wizardMode}
      savedAt={savedAt}
      hydrated={hydrated}
      isStepValid={isStepValid}
      disableBack={!canGoBack}
      showNext={canGoNext}
      onBack={goBack}
      onNext={goNext}
      onPhaseClick={goToPhase}
      onNextBlocked={() => setValidationHint(true)}
      showValidationHint={validationHint}
    >
      {starterPhase ? (
        <StarterPhaseBanner
          locale={starterPhase.locale}
          jurisdictionCountry={starterPhase.country}
        />
      ) : null}
      <div className="relative min-h-[min(52vh,480px)]">
        {showPathChoice ? (
          <WizardPathChoice
            onExplore={() => {
              setWizardMode("explore");
              setPathChosen(true);
              setStep(1);
              const url = new URL(window.location.href);
              url.searchParams.set("mode", "explore");
              url.searchParams.delete("expert");
              window.history.replaceState(null, "", url.toString());
            }}
            onPro={() => {
              router.push("/wizard/pro");
            }}
          />
        ) : null}
        <div key={step}>{stepContent}</div>
      </div>
    </WizardShell>
  );
}
