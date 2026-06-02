"use client";

import { useCallback, useState, type FormEvent } from "react";

import { submitJurisdictionGuideAction } from "@/lib/actions/jurisdiction-leads";
import { isValidCaptureEmail } from "@/lib/email-capture";
import { JURISDICTIONS, jurisdictionLabel } from "@/lib/jurisdictions";

import { JurisdictionCheckoutButton } from "./JurisdictionCheckoutButton";
import { useJurisdictionPrefill } from "./JurisdictionPrefillProvider";
import { useJurisdictionPage } from "./useJurisdictionPage";

const PROJECT_TYPES = [
  "real_estate",
  "bonds",
  "private_credit",
  "funds",
  "other",
] as const;

const inputClass = "jurisdiction-field mt-2";

type SuccessState = {
  brief: string;
  leadId: string;
  checkoutUrl?: string;
};

export function JurisdictionGuideForm() {
  const { locale, messages } = useJurisdictionPage();
  const f = messages.forms;
  const {
    compareA,
    compareB,
    setCompareA,
    setCompareB,
  } = useJurisdictionPrefill();

  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [projectType, setProjectType] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<SuccessState | null>(null);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setError(null);

      const jurisdictionIds = [compareA, compareB].filter(Boolean);

      if (
        !firstName.trim() ||
        !isValidCaptureEmail(email) ||
        !projectType ||
        jurisdictionIds.length < 2 ||
        compareA === compareB
      ) {
        setError(f.errorInvalid);
        return;
      }

      setSubmitting(true);
      const result = await submitJurisdictionGuideAction({
        firstName: firstName.trim(),
        email: email.trim(),
        projectType,
        jurisdictionIds,
        locale,
      });
      setSubmitting(false);

      if (!result.ok) {
        setError(
          result.error === "rate_limit"
            ? f.errorRateLimit
            : result.error === "invalid"
              ? f.errorInvalid
              : f.errorGeneric
        );
        return;
      }

      setSuccess({
        brief: result.aiBrief ?? "",
        leadId: result.id,
        checkoutUrl: result.checkoutUrl,
      });
    },
    [compareA, compareB, email, firstName, f, locale, projectType]
  );

  if (success) {
    return (
      <div className="bezel-outer" role="status">
        <div className="bezel-inner p-6 md:p-8">
        <p className="font-display text-lg text-white">{f.successGuide}</p>
        {success.brief ? (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              {f.aiBriefTitle}
            </p>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-white/70">
              {success.brief}
            </p>
          </div>
        ) : null}
        <p className="mt-4 text-xs text-white/45">{f.aiBriefEmailNote}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          {success.checkoutUrl ? (
            <a
              href={success.checkoutUrl}
              className="inline-flex rounded-full bg-accent px-8 py-4 text-sm font-medium text-void transition hover:bg-white active:scale-[0.98]"
            >
              {f.checkoutStarter}
            </a>
          ) : (
            <JurisdictionCheckoutButton leadId={success.leadId} />
          )}
        </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bezel-outer">
      <div className="bezel-inner p-6 md:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="jurisdiction-field-label">{f.firstName}</span>
          <input
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="jurisdiction-field-label">{f.email}</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="jurisdiction-field-label">{f.projectType}</span>
          <select
            required
            value={projectType}
            onChange={(e) => setProjectType(e.target.value)}
            className={inputClass}
          >
            <option value="" disabled>
              {f.select}
            </option>
            {PROJECT_TYPES.map((t) => (
              <option key={t} value={t}>
                {f.projectTypes[t] ?? t}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="jurisdiction-field-label">{f.compareA}</span>
          <select
            required
            value={compareA}
            onChange={(e) => setCompareA(e.target.value)}
            className={inputClass}
          >
            <option value="" disabled>
              {f.select}
            </option>
            {JURISDICTIONS.map((j) => (
              <option key={j.id} value={j.id}>
                {jurisdictionLabel(messages, j.id)}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="jurisdiction-field-label">{f.compareB}</span>
          <select
            required
            value={compareB}
            onChange={(e) => setCompareB(e.target.value)}
            className={inputClass}
          >
            <option value="" disabled>
              {f.select}
            </option>
            {JURISDICTIONS.map((j) => (
              <option key={j.id} value={j.id} disabled={j.id === compareA}>
                {jurisdictionLabel(messages, j.id)}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error ? (
        <p className="mt-4 text-sm text-red-300/90" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 w-full rounded-full bg-accent px-8 py-4 text-sm font-medium text-void transition hover:bg-white disabled:opacity-60 active:scale-[0.98] sm:w-auto"
      >
        {submitting ? f.submitting : f.submitCompare}
      </button>
      </div>
    </form>
  );
}
