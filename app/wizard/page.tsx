"use client";

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
import {
  Step10LegalStructure,
  Step11Revenue,
  Step12LegalStatus,
  Step13InvestorProfile,
  Step14Additional,
} from "./_components/WizardStepsExtended";
import { WizardPathChoice } from "./_components/WizardPathChoice";
import { WizardShell } from "./_components/WizardShell";
import { StarterPhaseBanner } from "./_components/StarterPhaseBanner";
import {
  applyExpertDefaults,
  expertStepCount,
  expertStepIndex,
  isExpertStep,
  nextExpertStep,
  prevExpertStep,
  WIZARD_EXPERT_STEPS,
} from "@/lib/wizard-expert-path";
import { firstStepOfPhase } from "@/lib/wizard-phases";

export default function WizardPage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>(initialWizardData);
  const [hydrated, setHydrated] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [expertMode, setExpertMode] = useState(false);
  const [pathChosen, setPathChosen] = useState(false);
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
      if (raw) {
        const parsed = JSON.parse(raw) as {
          step?: number;
          data?: Partial<WizardData>;
          expertMode?: boolean;
          pathChosen?: boolean;
        };
        if (parsed.data) restored = parsed.data;
        if (parsed.expertMode) {
          setExpertMode(true);
          setPathChosen(true);
        } else if (expertUrl) {
          setExpertMode(true);
          setPathChosen(true);
        }
        if (parsed.pathChosen) setPathChosen(true);
        if (
          typeof parsed.step === "number" &&
          parsed.step >= 1 &&
          parsed.step <= TOTAL_STEPS
        ) {
          const s = parsed.step;
          if (parsed.expertMode || expertUrl) {
            if (isExpertStep(s)) setStep(s);
            else setStep(1);
          } else {
            setStep(s);
          }
        } else if (expertUrl) {
          setStep(1);
        }
      } else if (expertUrl) {
        setExpertMode(true);
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
        setData((prev) => ({
          ...prev,
          assetType: prefill.assetType || prev.assetType,
          estimatedValue: prefill.estimatedValue || prev.estimatedValue,
          currency: prefill.currency || prev.currency,
          country: prefill.country || prev.country,
          city: prefill.city || prev.city,
        }));
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
    } catch {
      // ignore malformed storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          step,
          data,
          expertMode,
          pathChosen,
          ts: Date.now(),
        })
      );
      setSavedAt(Date.now());
    } catch {
      // storage may be full / disabled
    }
  }, [data, step, hydrated, expertMode, pathChosen]);

  useEffect(() => {
    if (!hydrated || !expertMode) return;
    if (!isExpertStep(step)) {
      const fallback =
        [...WIZARD_EXPERT_STEPS].find((s) => s >= step) ??
        WIZARD_EXPERT_STEPS[0];
      setStep(fallback);
    }
  }, [hydrated, expertMode, step]);

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
    switch (step) {
      case 1:
        return data.assetType.trim().length > 0;
      case 2: {
        const trimmed = data.description.trim();
        return trimmed.length > 0 && trimmed.split(/\s+/).length >= STEP2_MIN_WORDS;
      }
      case 3:
        return (
          data.estimatedValue >= VALUE_MIN &&
          data.estimatedValue <= VALUE_MAX
        );
      case 4:
        return data.country.trim().length > 0 && data.city.trim().length > 0;
      case 5:
        return data.documents.length > 0;
      case 6:
        return data.goals.length > 0;
      case 7:
        return data.timeline.length > 0;
      case 8:
        return data.platform.length > 0;
      case 9:
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
  }, [step, data]);

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
    if (expertMode) {
      const next = nextExpertStep(step);
      if (next === 15) {
        setData((d) => applyExpertDefaults(d));
      }
      if (next) setStep(next);
      return;
    }
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
      setValidationHint(false);
    }
  }, [
    step,
    isStepValid,
    data.email,
    data.assetType,
    data.marketingConsent,
    expertMode,
  ]);

  const goBack = useCallback(() => {
    if (expertMode) {
      const prev = prevExpertStep(step);
      if (prev) setStep(prev);
      return;
    }
    if (step > 1) setStep(step - 1);
  }, [step, expertMode]);

  const goToPhase = useCallback(
    (phaseIndex: number) => {
      if (expertMode) return;
      setStep(firstStepOfPhase(phaseIndex));
      setValidationHint(false);
    },
    [expertMode]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !(e.target instanceof HTMLTextAreaElement)) {
        const canAdvance = expertMode
          ? nextExpertStep(step) !== null && isStepValid
          : step < TOTAL_STEPS && isStepValid;
        if (canAdvance) {
          e.preventDefault();
          goNext();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, isStepValid, step, expertMode]);

  const progressPct = expertMode
    ? (expertStepIndex(step) / expertStepCount()) * 100
    : (step / TOTAL_STEPS) * 100;

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
        return <Step3Value data={data} update={update} />;
      case 4:
        return <Step4Location data={data} update={update} />;
      case 5:
        return <Step5Documents data={data} toggle={toggleDocument} />;
      case 6:
        return (
          <Step6Objectives
            data={data}
            toggle={(v) => toggleInArray("goals", v)}
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
        return <Step15Summary data={data} />;
      default:
        return null;
    }
  }, [
    step,
    data,
    update,
    toggleDocument,
    toggleInArray,
    toggleLegalStatus,
  ]);

  const canGoBack = expertMode ? prevExpertStep(step) !== null : step > 1;
  const canGoNext = expertMode
    ? nextExpertStep(step) !== null
    : step < TOTAL_STEPS;

  return (
    <WizardShell
      step={step}
      totalSteps={TOTAL_STEPS}
      progressPct={progressPct}
      expertMode={expertMode}
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
            onExpress={() => {
              setExpertMode(true);
              setPathChosen(true);
            }}
            onStandard={() => {
              setExpertMode(false);
              setPathChosen(true);
            }}
          />
        ) : null}
        <div key={step}>{stepContent}</div>
      </div>
    </WizardShell>
  );
}
