"use client";

import { useAuth, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { AurosBrandLockup } from "../_components/AurosBrandLockup";
import { useLocale } from "../_components/i18n/LocaleProvider";
import { Nav } from "../_components/Nav";
import { getDossierMessages } from "@/lib/dossier-i18n";
import { wizardOptionLabel } from "@/lib/wizard-options-i18n";
import { AiDisclaimer } from "@/app/_components/AiDisclaimer";
import { ProfessionalTrustBar } from "@/app/_components/ProfessionalTrustBar";
import { GuestDossierSync } from "@/app/_components/GuestDossierSync";
import { ConciergeSection } from "./_components/ConciergeSection";
import { DossierActions } from "./_components/DossierActions";
import { DossierCollapsible } from "./_components/DossierCollapsible";
import { DossierNextSteps } from "./_components/DossierNextSteps";
import { DossierStarterKitCrossSell } from "./_components/DossierStarterKitCrossSell";
import { DossierQualityScore } from "./_components/DossierQualityScore";
import { DossierShareSection } from "./_components/DossierShareSection";
import { AdmissionReadinessPanel } from "./_components/AdmissionReadinessPanel";
import { TokenizationStudio } from "./_components/TokenizationStudio";
import { DossierBankProof } from "./_components/DossierBankProof";
import { DossierMonitorCta } from "./_components/DossierMonitorCta";
import { DataRoomChecklist } from "./_components/DataRoomChecklist";
import { ExportLegalPackButton } from "./_components/ExportLegalPackButton";
import { GreenDossierExtras } from "./_components/GreenDossierExtras";
import { GreenCompliancePanel } from "@/app/wizard/_components/GreenCompliancePanel";
import { normalizeDossierStatus, type DossierStatus } from "@/lib/dossier-status";
import { getPartnerCode } from "@/lib/partner-attribution";
import { track } from "@/lib/analytics";
import {
  getDossierByIdAction,
  submitDossierAction,
  syncGuestDossierAction,
  updateDossierGeneratedAction,
} from "@/lib/actions/dossiers";
import { isUuid } from "@/lib/validation";
import { generateDossierPDF, suggestedFilename } from "@/lib/pdf";
import {
  generateGreenDossierPDF,
  suggestedGreenFilename,
} from "@/lib/green/green-pdf";
import { computeGreenRtmsScore, isGreenWizardAsset } from "@/lib/green/rtms-scoring";
import {
  computeGreenComplianceScore,
  isGreenWizardContext,
  type GreenComplianceScore,
} from "@/lib/green/scoring/green-compliance";
import { mergeDossierDataBlob } from "@/lib/dossier-data";
import { getComplianceStatus } from "@/lib/compliance-status";
import { tierFromScore } from "@/lib/score";
import { scorePresentation } from "@/lib/score-presentation";
import type { Currency, DossierContent, WizardData } from "@/lib/wizard-types";

const DOSSIER_STORAGE_KEY = "auros_dossier";
const DOC_NONE = "None yet";

type StoredDossier = {
  generatedAt?: string;
  score?: number;
  tier?: "low" | "mid" | "high";
  tierLabel?: string;
  data?: WizardData;
  aiContent?: DossierContent;
  aiMeta?: { provider: string; generatedAt: string };
  id?: string;
  status?: DossierStatus;
  greenRtms?: ReturnType<typeof computeGreenRtmsScore>;
  greenCompliance?: GreenComplianceScore;
  wizardMode?: "explore" | "pro";
  paidTier?: string;
};

type AiState = "idle" | "loading" | "done" | "error";
type PdfState = "idle" | "generating" | "error";

const AI_SECTION_KEYS: Array<keyof DossierContent> = [
  "legalDescription",
  "valuation",
  "dueDiligence",
  "kycPreFilled",
  "micaCompliance",
  "smartContract",
];

function formatWithSpaces(n: number): string {
  if (!Number.isFinite(n)) return "0";
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function formatCurrencyDisplay(value: number, currency: Currency): string {
  const n = formatWithSpaces(value);
  switch (currency) {
    case "USD":
      return `$${n}`;
    case "GBP":
      return `£${n}`;
    case "CHF":
      return `CHF ${n}`;
    case "EUR":
    default:
      return `${n} €`;
  }
}

export default function DossierPage() {
  return (
    <Suspense fallback={<DossierShell loading />}>
      <DossierPageInner />
    </Suspense>
  );
}

function TokenRedirect({ token }: { token: string }) {
  const router = useRouter();
  useEffect(() => {
    router.replace(`/dossier/shared/${encodeURIComponent(token)}`);
  }, [token, router]);
  return <DossierShell loading />;
}

function DossierPageInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  if (token) return <TokenRedirect token={token} />;
  return <DossierMain />;
}

function DossierMain() {
  const { isSignedIn } = useAuth();
  const { locale } = useLocale();
  const dm = getDossierMessages(locale);
  const searchParams = useSearchParams();
  const dossierIdParam = searchParams.get("id");

  const [dossier, setDossier] = useState<StoredDossier | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [aiState, setAiState] = useState<AiState>("idle");
  const [aiError, setAiError] = useState<string | null>(null);
  const [pdfState, setPdfState] = useState<PdfState>("idle");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [submitState, setSubmitState] = useState<
    "idle" | "loading" | "done" | "error"
  >("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [dossierStatus, setDossierStatus] = useState<DossierStatus>("generated");
  const aiStarted = useRef(false);

  const persistDossier = useCallback((next: StoredDossier) => {
    setDossier(next);
    try {
      localStorage.setItem(DOSSIER_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // storage full
    }
  }, []);

  const handleGuestSynced = useCallback(
    (id: string) => {
      setDossier((prev) => (prev ? { ...prev, id } : prev));
      try {
        const raw = localStorage.getItem(DOSSIER_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as StoredDossier;
          localStorage.setItem(
            DOSSIER_STORAGE_KEY,
            JSON.stringify({ ...parsed, id })
          );
        }
      } catch {
        // ignore
      }
    },
    []
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoadError(null);

      if (dossierIdParam && isUuid(dossierIdParam) && isSignedIn) {
        const result = await getDossierByIdAction(dossierIdParam);
        if (cancelled) return;
        if (result.ok) {
          const d = result.dossier;
          const stored: StoredDossier = {
            id: d.id,
            generatedAt: d.generatedAt,
            score: d.score,
            tier: d.tier,
            tierLabel: d.tierLabel,
            data: d.data,
            aiContent: d.aiContent,
            aiMeta: d.aiMeta,
            status: normalizeDossierStatus(d.status),
          };
          setDossier(stored);
          setDossierStatus(normalizeDossierStatus(d.status));
          try {
            localStorage.setItem(DOSSIER_STORAGE_KEY, JSON.stringify(stored));
          } catch {
            // ignore
          }
          track("dossier_viewed", { source: "server", id: d.id });
          setHydrated(true);
          return;
        }
        if (result.error === "not_found" || result.error === "invalid_id") {
          setLoadError(dm.errors.loadNotFound);
        } else if (result.error === "unauthenticated") {
          setLoadError(null);
        } else {
          setLoadError(dm.errors.loadFailed);
        }
        setHydrated(true);
        return;
      }

      let loaded: StoredDossier | null = null;
      try {
        const raw = localStorage.getItem(DOSSIER_STORAGE_KEY);
        if (raw) loaded = JSON.parse(raw) as StoredDossier;
      } catch {
        // ignore
      }
      if (!cancelled) {
        if (loaded) setDossier(loaded);
        setHydrated(true);
        if (loaded) track("dossier_viewed", { source: "local" });
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [dossierIdParam, isSignedIn, dm.errors.loadFailed, dm.errors.loadNotFound]);

  const runAiGeneration = useCallback(
    async (current: StoredDossier) => {
      if (!current.data || current.aiContent) return;
      setAiState("loading");
      setAiError(null);
      try {
        const dataBlob = current.data as Record<string, unknown> | undefined;
        const wizardMode =
          current.wizardMode ??
          (typeof dataBlob?.wizardMode === "string"
            ? dataBlob.wizardMode
            : undefined);
        const paidTier =
          current.paidTier ??
          (typeof dataBlob?.paidTier === "string" ? dataBlob.paidTier : undefined);

        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data: current.data,
            locale,
            wizardMode,
            paidTier,
          }),
        });
        const json = (await res.json()) as Record<string, unknown>;
        if (res.status === 429) {
          setAiState("error");
          setAiError(dm.ai.rateLimit);
          return;
        }
        if (!res.ok || json.ok === false) {
          throw new Error(
            typeof json.error === "string" ? json.error : "AI generation failed"
          );
        }
        const aiContent: DossierContent = {
          legalDescription: String(json.legalDescription ?? ""),
          valuation: String(json.valuation ?? ""),
          dueDiligence: String(json.dueDiligence ?? ""),
          kycPreFilled: String(json.kycPreFilled ?? ""),
          micaCompliance: String(json.micaCompliance ?? ""),
          smartContract: String(json.smartContract ?? ""),
        };
        const next: StoredDossier = {
          ...current,
          aiContent,
          aiMeta: {
            provider: String(json.provider ?? "unknown"),
            generatedAt: String(json.generatedAt ?? new Date().toISOString()),
          },
        };
        persistDossier(next);
        setAiState("done");
        track("dossier_ai_generated", {
          provider: String(json.provider ?? ""),
        });

        if (isSignedIn && current.id && next.data) {
          void updateDossierGeneratedAction({
            id: current.id,
            data: next.data as Record<string, unknown>,
            aiContent,
            aiMeta: next.aiMeta!,
          });
        }
      } catch (err) {
        setAiState("error");
        setAiError(err instanceof Error ? err.message : "Generation failed");
      }
    },
    [persistDossier, locale, isSignedIn, dm.ai.rateLimit]
  );

  useEffect(() => {
    if (!hydrated || !dossier?.data || dossier.aiContent || aiStarted.current) {
      return;
    }
    aiStarted.current = true;
    void runAiGeneration(dossier);
  }, [hydrated, dossier, runAiGeneration]);

  const handleSubmitPlatform = useCallback(async () => {
    if (!isSignedIn) {
      setShowAuthModal(true);
      return;
    }
    if (!dossier?.data) return;

    setSubmitState("loading");
    setSubmitError(null);

    let dossierId = dossier.id;
    if (!dossierId) {
      const payload =
        dossier.aiContent && dossier.aiMeta
          ? mergeDossierDataBlob(
              dossier.data as Record<string, unknown>,
              dossier.aiContent,
              dossier.aiMeta
            )
          : (dossier.data as Record<string, unknown>);
      const sync = await syncGuestDossierAction({
        assetType: dossier.data.assetType ?? null,
        data: payload,
        score: dossier.score ?? 0,
        referredBy: getPartnerCode(),
      });
      if (!sync.ok) {
        setSubmitState("error");
        setSubmitError(dm.submitNoId);
        return;
      }
      dossierId = sync.id;
      persistDossier({ ...dossier, id: sync.id });
    }

    const result = await submitDossierAction(dossierId, locale);
    if (!result.ok) {
      setSubmitState("error");
      setSubmitError(
        result.error === "unauthenticated"
          ? dm.authModal.title
          : "message" in result
            ? result.message
            : dm.submitError
      );
      return;
    }
    setSubmitState("done");
    setDossierStatus("submitted");
    persistDossier({ ...dossier, id: dossierId, status: "submitted" });
    track("dossier_platform_submitted", { dossierId });
  }, [isSignedIn, dossier, dm, persistDossier, locale]);

  const handleDownloadPDF = useCallback(async () => {
    if (!dossier) return;
    setPdfState("generating");
    try {
      const isGreen = isGreenWizardAsset(dossier.data?.assetType);
      const greenRtms =
        dossier.greenRtms ??
        (isGreen && dossier.data ? computeGreenRtmsScore(dossier.data) : undefined);
      const greenCompliance =
        dossier.greenCompliance ??
        (dossier.data && isGreenWizardContext(dossier.data)
          ? computeGreenComplianceScore(dossier.data)
          : undefined);
      const blob = isGreen
        ? await generateGreenDossierPDF({ ...dossier, locale, greenRtms, greenCompliance })
        : await generateDossierPDF({ ...dossier, locale });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = isGreen
        ? suggestedGreenFilename({ ...dossier, greenRtms })
        : suggestedFilename(dossier);
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 0);
      setPdfState("idle");
      track("dossier_pdf_downloaded", {
        locale,
        green: isGreen,
      });
    } catch (err) {
      console.error("PDF failed", err);
      setPdfState("error");
    }
  }, [dossier, locale]);

  const data = dossier?.data;
  const currency: Currency = (data?.currency ?? "EUR") as Currency;
  const score = dossier?.score ?? 0;
  const tierInfo = useMemo(
    () => scorePresentation(score, locale),
    [score, locale]
  );
  const tierAccent = useMemo(() => tierFromScore(score).color, [score]);

  const valuation = useMemo(() => {
    const v = typeof data?.estimatedValue === "number" ? data.estimatedValue : 0;
    return formatCurrencyDisplay(v, currency);
  }, [data?.estimatedValue, currency]);

  const compliance = useMemo(
    () => (data ? getComplianceStatus(data) : []),
    [data]
  );

  const greenRtms = useMemo(() => {
    if (!data || !isGreenWizardAsset(data.assetType)) return null;
    return (
      dossier?.greenRtms ??
      computeGreenRtmsScore(data as WizardData)
    );
  }, [data, dossier?.greenRtms]);

  const greenCompliance = useMemo(() => {
    if (!data) return null;
    return (
      dossier?.greenCompliance ??
      (isGreenWizardContext(data) ? computeGreenComplianceScore(data) : null)
    );
  }, [data, dossier?.greenCompliance]);

  const complianceLabel = (id: string, ok: boolean) => {
    if (id === "mica") return ok ? dm.compliance.aligned : dm.compliance.reviewRequired;
    if (id === "kyc") return ok ? dm.compliance.policyReady : dm.compliance.pending;
    return ok ? dm.compliance.erc : dm.compliance.blueprintOnly;
  };

  if (!hydrated) {
    return <DossierShell loading />;
  }

  if (loadError) {
    return (
      <main className="page-main page-main--nav min-h-dvh text-white">
        <div className="page-inner page-inner--3xl mx-auto">
          <p className="text-sm text-red-400">{loadError}</p>
          <Link href="/dashboard" className="mt-6 inline-block underline">
            Dashboard
          </Link>
        </div>
      </main>
    );
  }

  if (!dossier || !data) {
    return <EmptyState />;
  }

  const documents = (data.documents ?? []).filter((d) => d !== DOC_NONE);
  const goals = data.goals ?? [];
  const location = [data.city, data.country].filter(Boolean).join(", ") || "—";

  const qualityInput = {
    description: data.description,
    value: data.estimatedValue ?? 0,
    country: data.country,
    city: data.city,
    documents: data.documents,
    email: data.email,
    firstName: data.firstName,
  };

  return (
    <>
      <GuestDossierSync dossier={dossier} onSynced={handleGuestSynced} />
      <Nav />
      <main className="page-main page-main--nav min-h-dvh">
        <div className="page-inner page-inner--3xl mx-auto">
        <div className="mb-8">
          <AurosBrandLockup product="Dossier" />
          <div className="auros-accent-rule mt-5" aria-hidden />
        </div>
        <div className="mb-10 flex items-center justify-end border-b border-white/[0.06] pb-6">
          <span className="mr-auto font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            {dm.eyebrow}
          </span>
          <UserButton />
        </div>

        {!isSignedIn && (
          <div className="mb-8 rounded-2xl border border-amber-500/25 bg-amber-500/10 px-5 py-4 text-sm text-white/85">
            <p className="font-medium text-white">{dm.saveBanner.title}</p>
            <p className="mt-2 text-white/70">{dm.saveBanner.body}</p>
            <Link
              href="/sign-up?redirect_url=/dossier"
              className="mt-3 inline-block font-medium underline"
            >
              {dm.saveBanner.cta}
            </Link>
          </div>
        )}

        <section className="mb-8 flex flex-wrap items-end justify-between gap-6">
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-white md:text-4xl">
              {data.assetType
                ? wizardOptionLabel(locale, "assetTypes", data.assetType)
                : dm.yourAsset}
            </h1>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
              {location}
            </p>
          </div>
          {typeof dossier.score === "number" && (
            <div className="text-right">
              <p
                className="text-5xl font-semibold tabular-nums text-white"
                style={{ color: tierAccent }}
              >
                {dossier.score}
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted">
                {dossier.tierLabel ?? tierInfo.tierLabel}
              </p>
            </div>
          )}
        </section>

        <DossierStarterKitCrossSell paidTier={dossier.paidTier} />

        <DossierNextSteps
          isSignedIn={!!isSignedIn}
          aiReady={aiState === "done" && !!dossier.aiContent}
          submitDone={submitState === "done"}
          dossierStatus={dossierStatus}
        />

        <AdmissionReadinessPanel data={data} />

        {greenRtms ? <GreenDossierExtras rtms={greenRtms} /> : null}
        {greenCompliance ? (
          <GreenCompliancePanel compliance={greenCompliance} email={data.email} />
        ) : null}

        <DossierActions
          pdfLabel={dm.pdf.download}
          pdfGeneratingLabel={dm.pdf.generating}
          pdfRetryLabel={dm.pdf.retry}
          pdfLoading={pdfState === "generating"}
          pdfError={pdfState === "error"}
          submitLabel={
            submitState === "loading"
              ? dm.submitSubmitting
              : submitState === "done"
                ? dm.submitDone
                : submitState === "error"
                  ? dm.submitError
                  : dm.submit
          }
          submitLoading={submitState === "loading"}
          submitDone={submitState === "done"}
          submitError={submitError}
          pdfNote={dm.pdfNote}
          onDownloadPdf={() => {
            const isGreen = isGreenWizardAsset(data.assetType);
            if (!isSignedIn && !isGreen) {
              setShowAuthModal(true);
              return;
            }
            void handleDownloadPDF();
          }}
          onSubmit={() => {
            void handleSubmitPlatform();
          }}
        >
          <ExportLegalPackButton data={data} />
        </DossierActions>

        <DossierBankProof
          dossierId={dossier.id}
          assetLabel={data.assetType ?? data.description ?? null}
        />

        <DossierMonitorCta
          assetType={data.assetType}
          country={data.country}
          score={typeof dossier.score === "number" ? dossier.score : score}
          email={data.email}
        />

        {aiState === "loading" && (
          <div
            className="mb-8 rounded-xl border border-white/[0.08] bg-white/[0.02] p-6"
            role="status"
            aria-live="polite"
          >
            <p className="text-center text-sm text-muted">{dm.ai.generating}</p>
            <div className="mx-auto mt-4 h-1 max-w-xs overflow-hidden rounded-full bg-white/[0.08]">
              <div className="h-full w-1/3 animate-[shimmer_1.2s_ease-in-out_infinite] rounded-full bg-white/40" />
            </div>
            <p className="mt-3 text-center font-mono text-[10px] text-white/35">
              {dm.ai.generatingHint}
            </p>
          </div>
        )}

        {aiState === "error" && (
          <div className="mb-8 rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-center">
            <p className="text-sm text-red-400">{aiError}</p>
            <button
              type="button"
              className="mt-4 rounded-full border border-white/20 px-5 py-2 text-sm hover:border-white/30"
              onClick={() => {
                aiStarted.current = false;
                void runAiGeneration(dossier);
              }}
            >
              {dm.ai.retry}
            </button>
          </div>
        )}

        <DossierCollapsible
          title={dm.collapsible.detailsTitle}
          subtitle={dm.collapsible.detailsSubtitle}
        >
        <Section title={dm.sections.description}>
          <p className="whitespace-pre-wrap text-base leading-relaxed text-white/90">
            {data.description?.trim() || dm.noDescription}
          </p>
        </Section>

        <Section title={dm.sections.valuation}>
          <p className="text-4xl font-semibold tracking-tight text-white">
            {valuation}
          </p>
        </Section>

        <Section title={dm.sections.documentation}>
          {documents.length === 0 ? (
            <p className="text-sm text-muted">—</p>
          ) : (
            <ul className="space-y-2">
              {documents.map((doc) => (
                <li key={doc} className="text-sm text-white/80">
                  {wizardOptionLabel(locale, "documents", doc)}
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title={dm.sections.timeline}>
          <p className="text-sm text-white/80">
            {data.timeline
              ? wizardOptionLabel(locale, "timelines", data.timeline)
              : "—"}
          </p>
        </Section>

        <Section title={dm.sections.objectives}>
          {goals.length === 0 ? (
            <p className="text-sm text-muted">—</p>
          ) : (
            <ul className="space-y-2">
              {goals.map((id) => (
                <li key={id} className="text-sm text-white/80">
                  {wizardOptionLabel(locale, "goals", id)}
                </li>
              ))}
            </ul>
          )}
        </Section>

        </DossierCollapsible>

        <DossierCollapsible
          title={dm.collapsible.analysisTitle}
          subtitle={dm.collapsible.analysisSubtitle}
          defaultOpen={!!dossier.aiContent}
        >
        {dossier.aiContent &&
          AI_SECTION_KEYS.map((key) => {
            const text = dossier.aiContent?.[key]?.trim();
            if (!text) return null;
            const title = dm.ai.sections[key] ?? key;
            return (
              <Section key={key} title={title}>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/85">
                  {text}
                </p>
                {dossier.aiMeta && (
                  <p className="mt-3 text-[10px] uppercase tracking-wider text-white/30">
                    {dossier.aiMeta.provider === "template"
                      ? dm.ai.fallbackNotice
                      : `AI · ${dossier.aiMeta.provider}`}
                  </p>
                )}
              </Section>
            );
          })}
        </DossierCollapsible>

        <DossierCollapsible
          title={dm.collapsible.studioTitle}
          subtitle={dm.collapsible.studioSubtitle}
        >
        <ProfessionalTrustBar variant="panel" />
        <TokenizationStudio data={data} />
        <DossierQualityScore data={qualityInput} />
        </DossierCollapsible>

        <DossierCollapsible
          title={dm.collapsible.extrasTitle}
          subtitle={dm.collapsible.extrasSubtitle}
        >
        <DataRoomChecklist
          documents={data.documents ?? []}
          dossierId={dossier.id}
          canUpload={!!isSignedIn && !!dossier.id}
        />

        <Section title={dm.sections.compliance}>
          <ul className="space-y-3 text-sm">
            {compliance.map((row) => (
              <ComplianceRow
                key={row.id}
                label={
                  row.id === "mica"
                    ? dm.compliance.mica
                    : row.id === "kyc"
                      ? dm.compliance.kyc
                      : dm.compliance.smartContract
                }
                status={complianceLabel(row.id, row.ok)}
                ok={row.ok}
              />
            ))}
          </ul>
        </Section>

        <ConciergeSection
          score={dossier.score}
          estimatedValue={data.estimatedValue ?? 0}
          currency={currency}
          assetType={data.assetType ?? ""}
          city={data.city ?? ""}
          country={data.country ?? ""}
          defaultName={data.firstName ?? ""}
          defaultEmail={data.email ?? ""}
        />

        <DossierShareSection
          dossier={dossier as Record<string, unknown>}
          score={score}
          assetType={data.assetType ?? "asset"}
        />

        {dossierStatus !== "draft" && dossierStatus !== "generated" ? (
          <p className="mt-6 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-center text-sm text-emerald-200/90">
            {dm.status[dossierStatus]}
          </p>
        ) : null}
        </DossierCollapsible>

        <p className="mt-8 text-center">
          <Link href="/wizard" className="text-sm text-white hover:underline">
            {dm.editWizard}
          </Link>
        </p>
        <AiDisclaimer className="mt-10 text-center" />
      </div>

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </main>
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-white/[0.06] py-8">
      <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-muted">
        {title}
      </h2>
      {children}
    </section>
  );
}

function ComplianceRow({
  label,
  status,
  ok,
}: {
  label: string;
  status: string;
  ok: boolean;
}) {
  return (
    <li className="flex items-center justify-between gap-4">
      <span className="text-white/80">{label}</span>
      <span className="flex items-center gap-2">
        <span
          className={`h-2 w-2 rounded-full ${ok ? "bg-emerald-500" : "bg-amber-500"}`}
        />
        <span className={ok ? "text-emerald-400" : "text-amber-400"}>
          {status}
        </span>
      </span>
    </li>
  );
}

function DossierShell({ loading }: { loading?: boolean }) {
  const { locale } = useLocale();
  const dm = getDossierMessages(locale);
  return (
    <main className="page-main page-main--nav min-h-dvh bg-void">
      {loading ? (
        <p className="text-center text-sm text-muted">{dm.loading}</p>
      ) : null}
    </main>
  );
}

function EmptyState() {
  const { locale } = useLocale();
  const dm = getDossierMessages(locale);

  return (
    <main className="page-main page-main--nav min-h-dvh bg-void text-white">
      <div className="page-inner page-inner--lg mx-auto text-center">
        <AurosBrandLockup product="Dossier" size="md" className="mb-8 justify-center" />
        <div className="auros-accent-rule mx-auto mb-8" aria-hidden />
        <p className="text-sm uppercase tracking-wider text-muted">
          {dm.empty.title}
        </p>
        <p className="mt-4 text-muted">{dm.empty.body}</p>
        <Link
          href="/wizard"
          className="mt-8 inline-block rounded-full bg-accent px-8 py-3 text-sm font-semibold text-void"
        >
          {dm.empty.cta}
        </Link>
      </div>
    </main>
  );
}

function AuthModal({ onClose }: { onClose: () => void }) {
  const { locale } = useLocale();
  const dm = getDossierMessages(locale);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div className="modal-sheet" role="dialog" aria-modal>
      <div className="modal-sheet-panel">
        <h3 className="text-lg font-semibold text-white">{dm.authModal.title}</h3>
        <p className="mt-2 text-sm text-muted">{dm.authModal.body}</p>
        <div className="mt-6 flex flex-col gap-3">
          <Link
            href="/sign-up?redirect_url=/dossier"
            className="rounded-full bg-accent py-3 text-center text-sm font-semibold text-void"
          >
            {dm.authModal.signUp}
          </Link>
          <Link
            href="/sign-in?redirect_url=/dossier"
            className="rounded-full border border-white/20 py-3 text-center text-sm text-white"
          >
            {dm.authModal.signIn}
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-muted hover:text-white"
          >
            {dm.authModal.continue}
          </button>
        </div>
      </div>
    </div>
  );
}
