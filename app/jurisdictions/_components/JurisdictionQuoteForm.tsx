"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";

import { submitJurisdictionQuoteAction } from "@/lib/actions/jurisdiction-leads";
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

const PROJECT_VALUES = ["under1m", "1to5m", "5to20m", "over20m"] as const;

const inputClass = "jurisdiction-field mt-2";

type SuccessState = {
  leadId: string;
  quote?: string;
  checkoutUrl?: string;
  leadTier?: string;
};

export function JurisdictionQuoteForm({ embedded = false }: { embedded?: boolean }) {
  const { locale, messages } = useJurisdictionPage();
  const f = messages.forms;
  const { quoteJurisdictionId, setQuoteJurisdictionId } = useJurisdictionPrefill();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [projectType, setProjectType] = useState("");
  const [projectValue, setProjectValue] = useState("");
  const [jurisdictionId, setJurisdictionId] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<SuccessState | null>(null);

  useEffect(() => {
    if (quoteJurisdictionId) {
      setJurisdictionId(quoteJurisdictionId);
    }
  }, [quoteJurisdictionId]);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setError(null);

      if (
        !name.trim() ||
        !isValidCaptureEmail(email) ||
        !projectType ||
        !projectValue ||
        !jurisdictionId
      ) {
        setError(f.errorInvalid);
        return;
      }

      setSubmitting(true);
      const result = await submitJurisdictionQuoteAction({
        name: name.trim(),
        email: email.trim(),
        projectType,
        projectValue,
        jurisdictionId,
        message: message.trim() || undefined,
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
        leadId: result.id,
        quote: result.aiQuote,
        checkoutUrl: result.checkoutUrl,
        leadTier: result.leadTier,
      });
    },
    [email, f, jurisdictionId, locale, message, name, projectType, projectValue]
  );

  const formShell = embedded ? "" : "bezel-outer";
  const formInner = embedded ? "" : "bezel-inner p-6 md:p-8";

  if (success) {
    return (
      <div
        className={embedded ? "" : "bezel-outer"}
        role="status"
      >
        <div className={embedded ? "" : "bezel-inner p-6 md:p-8"}>
        <div className="flex flex-wrap items-center gap-3">
          <p className="font-display text-lg text-white">{f.successQuote}</p>
          {success.leadTier === "hot" ? (
            <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-amber-200">
              {f.hotLeadLabel}
            </span>
          ) : null}
        </div>
        {success.quote ? (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left">
            <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              {f.aiQuoteTitle}
            </p>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-white/70">
              {success.quote}
            </p>
          </div>
        ) : null}
        <p className="mt-4 text-sm text-white/55">
          {name} · {email}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {success.checkoutUrl ? (
            <a
              href={success.checkoutUrl}
              className="inline-flex rounded-full bg-white px-8 py-4 text-sm font-medium text-void transition hover:bg-white/90"
            >
              {f.payNow} — 5 000 €
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
    <form onSubmit={handleSubmit} className={formShell}>
      <div className={formInner}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="jurisdiction-field-label">{f.name}</span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
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
          <label className="block">
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
            <span className="jurisdiction-field-label">{f.projectValue}</span>
            <select
              required
              value={projectValue}
              onChange={(e) => setProjectValue(e.target.value)}
              className={inputClass}
            >
              <option value="" disabled>
                {f.select}
              </option>
              {PROJECT_VALUES.map((v) => (
                <option key={v} value={v}>
                  {f.projectValues[v] ?? v}
                </option>
              ))}
            </select>
          </label>
          <label className="block sm:col-span-2">
            <span className="jurisdiction-field-label">{f.jurisdiction}</span>
            <select
              required
              value={jurisdictionId}
              onChange={(e) => {
                setJurisdictionId(e.target.value);
                setQuoteJurisdictionId(e.target.value);
              }}
              className={inputClass}
            >
              <option value="" disabled>
                {f.select}
              </option>
              <option value="unsure">{f.jurisdictionUnsure}</option>
              {JURISDICTIONS.map((j) => (
                <option key={j.id} value={j.id}>
                  {jurisdictionLabel(messages, j.id)}
                </option>
              ))}
            </select>
          </label>
          <label className="block sm:col-span-2">
            <span className="jurisdiction-field-label">{f.messageOptional}</span>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={`${inputClass} resize-y`}
            />
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
          {submitting ? f.submitting : f.submitQuote}
        </button>
      </div>
    </form>
  );
}
