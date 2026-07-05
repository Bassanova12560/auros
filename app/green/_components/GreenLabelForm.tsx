"use client";

import Link from "next/link";
import { useCallback, useState, type FormEvent } from "react";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { saveGreenLabelAction } from "@/lib/actions/green-label";
import { uploadGreenLabelDocumentAction } from "@/lib/actions/green-label-document";
import type { GreenProjectType } from "@/lib/green";
import {
  GREEN_MARKET_ROUTE,
  GREEN_REGISTRY_ROUTE,
  GREEN_STANDARDS_ROUTE,
} from "@/lib/green/constants";
import { getGreenMessages } from "@/lib/green/i18n";

import { GreenFormStepBar, GreenPanel, greenBtnClass } from "./green-ui";

const PROJECT_TYPES: GreenProjectType[] = [
  "solar",
  "wind",
  "rec",
  "carbon",
  "ppa",
  "other",
];

const TOTAL_STEPS = 2;

const inputClass =
  "green-form-input w-full rounded-lg px-4 py-3 text-sm text-white outline-none";

export function GreenLabelForm() {
  const { locale } = useLocale();
  const m = getGreenMessages(locale);
  const f = m.label.form;

  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState<{ projectName: string; id: string } | null>(
    null
  );
  const [projectName, setProjectName] = useState("");
  const [projectType, setProjectType] = useState<GreenProjectType | "">("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [country, setCountry] = useState("");
  const [description, setDescription] = useState("");
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState(false);
  const [error, setError] = useState<
    "invalid" | "rate_limit" | "document_type" | "document_size" | "document_upload" | null
  >(null);

  const stepLabel = f.stepOf(step, TOTAL_STEPS);
  const sectionTitle =
    locale === "fr"
      ? "Vos informations"
      : locale === "es"
        ? "Sus datos"
        : "Your details";

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!projectType) return;

      setSubmitting(true);
      setError(null);
      const result = await saveGreenLabelAction({
        projectName: projectName.trim(),
        projectType,
        contactName: contactName.trim(),
        email: email.trim(),
        website: website.trim(),
        country: country.trim(),
        description: description.trim(),
        preferredLocale: locale,
      });
      if (!result.ok) {
        setSubmitting(false);
        if (result.error === "rate_limit") setError("rate_limit");
        else setError("invalid");
        return;
      }

      if (documentFile) {
        const fd = new FormData();
        fd.set("applicationId", result.id);
        fd.set("file", documentFile);
        const upload = await uploadGreenLabelDocumentAction(fd);
        if (!upload.ok) {
          setSubmitting(false);
          if (upload.error === "file_type") setError("document_type");
          else if (upload.error === "file_size") setError("document_size");
          else setError("document_upload");
          return;
        }
      }

      setSubmitting(false);
      setSubmitted({ projectName: projectName.trim(), id: result.id });
    },
    [
      projectName,
      projectType,
      contactName,
      email,
      website,
      country,
      description,
      documentFile,
      locale,
    ]
  );

  function goToStep2(e: FormEvent) {
    e.preventDefault();
    if (
      !projectName.trim() ||
      !projectType ||
      !contactName.trim() ||
      !email.trim() ||
      !website.trim() ||
      !country.trim()
    ) {
      setError("invalid");
      return;
    }
    setError(null);
    setStep(2);
  }

  if (submitted) {
    const applicationId = submitted.id;
    const projectName = submitted.projectName;

    async function startCheckout() {
      setPaying(true);
      setPayError(false);
      try {
        const res = await fetch("/api/green/label/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            applicationId,
            email: email.trim().toLowerCase(),
            locale,
          }),
        });
        const json = (await res.json()) as { url?: string; error?: string };
        if (!res.ok || !json.url) {
          setPayError(true);
          setPaying(false);
          return;
        }
        window.location.href = json.url;
      } catch {
        setPayError(true);
        setPaying(false);
      }
    }

    return (
      <GreenPanel className="p-8 text-center" role="status">
        <p className="font-display text-xl font-semibold text-white">{f.success}</p>
        <p className="mt-2 text-sm text-white/55">{projectName}</p>
        <p className="mt-4 text-xs text-white/40">{f.successHint}</p>
        <p className="mt-2 font-mono text-[10px] text-green-royal-bright">
          {f.applicationId(applicationId)}
        </p>
        <div className="mt-6">
          <button
            type="button"
            onClick={() => void startCheckout()}
            disabled={paying}
            className={`green-btn-primary rounded-lg px-6 py-3.5 text-sm font-semibold disabled:opacity-50 ${greenBtnClass}`}
          >
            {paying ? f.payProcessing : f.payReview}
          </button>
          <p className="mt-2 text-xs text-white/40">{f.payNote}</p>
          {payError ? (
            <p className="mt-2 text-sm text-amber-400/90" role="alert">
              {f.payStripeError}
            </p>
          ) : null}
        </div>
        <p className="mt-4 text-xs text-white/40">{f.successStatus}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/green/my"
            className="rounded-lg border border-white/20 px-4 py-2 text-xs text-white/70 transition hover:border-green-royal/40 hover:text-white"
          >
            {f.successMy} →
          </Link>
          <Link
            href={GREEN_STANDARDS_ROUTE}
            className="rounded-lg border border-white/20 px-4 py-2 text-xs text-white/70 transition hover:border-green-royal/40 hover:text-white"
          >
            {f.successStandards} →
          </Link>
          <Link
            href={GREEN_REGISTRY_ROUTE}
            className="rounded-lg border border-white/20 px-4 py-2 text-xs text-white/70 transition hover:border-green-royal/40 hover:text-white"
          >
            {f.successRegistry} →
          </Link>
          <Link
            href={GREEN_MARKET_ROUTE}
            className="rounded-lg border border-white/20 px-4 py-2 text-xs text-white/70 transition hover:border-green-royal/40 hover:text-white"
          >
            {f.successMarket} →
          </Link>
        </div>
      </GreenPanel>
    );
  }

  return (
    <GreenPanel>
      <div className="p-6 md:p-8">
        <GreenFormStepBar current={step} total={TOTAL_STEPS} label={stepLabel} />
        <h2 className="font-display text-lg font-semibold tracking-[-0.02em] text-white">
          {sectionTitle}
        </h2>

        {step === 1 ? (
          <form onSubmit={goToStep2} className="mt-6 grid gap-4 sm:grid-cols-2">
            <p className="sm:col-span-2 font-mono text-[10px] uppercase tracking-wider text-white/45">
              {f.step1Title}
            </p>
            <label className="block sm:col-span-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-white/50">
                {f.projectName}
              </span>
              <input
                required
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className={`${inputClass} mt-2`}
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-white/50">
                {f.projectType}
              </span>
              <select
                required
                value={projectType}
                onChange={(e) => setProjectType(e.target.value as GreenProjectType)}
                className={`${inputClass} mt-2`}
              >
                <option value="" disabled>
                  —
                </option>
                {PROJECT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {f.projectTypes[t]}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="font-mono text-[10px] uppercase tracking-wider text-white/50">
                {f.contactName}
              </span>
              <input
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className={`${inputClass} mt-2`}
              />
            </label>
            <label className="block">
              <span className="font-mono text-[10px] uppercase tracking-wider text-white/50">
                {f.email}
              </span>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${inputClass} mt-2`}
              />
            </label>
            <label className="block">
              <span className="font-mono text-[10px] uppercase tracking-wider text-white/50">
                {f.website}
              </span>
              <input
                required
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className={`${inputClass} mt-2`}
                placeholder={f.websitePlaceholder}
              />
            </label>
            <label className="block">
              <span className="font-mono text-[10px] uppercase tracking-wider text-white/50">
                {f.country}
              </span>
              <input
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className={`${inputClass} mt-2`}
              />
            </label>
            {error ? (
              <p className="sm:col-span-2 text-sm text-red-400/90" role="alert">
                {f.errorInvalid}
              </p>
            ) : null}
            <div className="sm:col-span-2">
              <button
                type="submit"
                className={`green-btn-primary rounded-lg px-6 py-3.5 text-sm font-semibold ${greenBtnClass}`}
              >
                {f.next}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
            <p className="sm:col-span-2 font-mono text-[10px] uppercase tracking-wider text-white/45">
              {f.step2Title}
            </p>
            <label className="block sm:col-span-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-white/50">
                {f.description}
              </span>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`${inputClass} mt-2 resize-y`}
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-white/50">
                {f.document}
              </span>
              <input
                type="file"
                accept="application/pdf"
                className="mt-2 w-full text-sm text-white/70 file:mr-3 file:rounded-lg file:border file:border-white/20 file:bg-black file:px-3 file:py-2 file:text-xs file:uppercase file:tracking-wider file:text-white/80"
                onChange={(e) => setDocumentFile(e.target.files?.[0] ?? null)}
              />
              <p className="mt-1 text-[11px] text-white/40">{f.documentHint}</p>
            </label>
            {error ? (
              <p className="sm:col-span-2 text-sm text-red-400/90" role="alert">
                {error === "rate_limit"
                  ? f.errorRateLimit
                  : error === "document_type"
                    ? f.documentErrorType
                    : error === "document_size"
                      ? f.documentErrorSize
                      : error === "document_upload"
                        ? f.documentErrorUpload
                        : f.errorInvalid}
              </p>
            ) : null}
            <div className="flex flex-wrap gap-3 sm:col-span-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                disabled={submitting}
                className="green-btn-primary rounded-lg border border-white/20 px-5 py-2.5 text-sm text-white/70 transition hover:border-white/35 hover:text-white disabled:opacity-50"
              >
                {f.back}
              </button>
              <button
                type="submit"
                disabled={submitting}
                className={`green-btn-primary rounded-lg px-6 py-3.5 text-sm font-semibold disabled:opacity-50 ${greenBtnClass}`}
              >
                {submitting ? f.submitting : f.submit}
              </button>
            </div>
          </form>
        )}
      </div>
    </GreenPanel>
  );
}
