"use client";

import { useCallback, useState, type FormEvent } from "react";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { savePartnerAction } from "@/lib/actions/partners";
import { isValidPartnerRequest } from "@/lib/partner-request";
import { getPartnersMessages } from "@/lib/partners-i18n";

const PLATFORM_TYPES = [
  "Real estate",
  "Vehicles",
  "Art",
  "Metals",
  "Private credit",
  "Other",
] as const;

const MONTHLY_VOLUMES = [
  "Under 10",
  "10-50",
  "50-200",
  "200+ dossiers",
] as const;

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/40";

export function PartnerContactForm() {
  const { locale } = useLocale();
  const m = getPartnersMessages(locale);
  const f = m.form;

  const [submitted, setSubmitted] = useState<{
    companyName: string;
    contactName: string;
  } | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [platformType, setPlatformType] = useState("");
  const [monthlyVolume, setMonthlyVolume] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      const payload = {
        companyName: companyName.trim(),
        contactName: contactName.trim(),
        email: email.trim(),
        platformType,
        monthlyVolume,
        message: message.trim() || undefined,
      };

      if (!isValidPartnerRequest(payload)) {
        return;
      }

      setSubmitting(true);
      const result = await savePartnerAction({
        company: payload.companyName,
        contactName: payload.contactName,
        email: payload.email,
        platformType: payload.platformType,
        volume: payload.monthlyVolume,
        message: payload.message,
      });
      setSubmitting(false);

      if (result.ok) {
        setSubmitted({
          companyName: payload.companyName,
          contactName: payload.contactName,
        });
      }
    },
    [companyName, contactName, email, platformType, monthlyVolume, message]
  );

  if (submitted) {
    return (
      <div
        className="rounded-3xl border border-white/20/30 bg-accent/10 p-8 text-center backdrop-blur-xl"
        role="status"
      >
        <p className="text-lg text-white">{f.success}</p>
        <p className="mt-2 text-sm text-secondary">
          {submitted.companyName} · {submitted.contactName}
        </p>
      </div>
    );
  }

  return (
    <form
      id="contact"
      onSubmit={handleSubmit}
      className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="text-xs uppercase tracking-wider text-secondary">
            {f.company}
          </span>
          <input
            required
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className={`${inputClass} mt-2`}
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-secondary">
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
          <span className="text-xs uppercase tracking-wider text-secondary">
            {f.email}
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`${inputClass} mt-2`}
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-secondary">
            {f.platformType}
          </span>
          <select
            required
            value={platformType}
            onChange={(e) => setPlatformType(e.target.value)}
            className={`${inputClass} mt-2`}
          >
            <option value="">{f.select}</option>
            {PLATFORM_TYPES.map((t) => (
              <option key={t} value={t}>
                {f.platformTypes[t] ?? t}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-secondary">
            {f.monthlyVolume}
          </span>
          <select
            required
            value={monthlyVolume}
            onChange={(e) => setMonthlyVolume(e.target.value)}
            className={`${inputClass} mt-2`}
          >
            <option value="">{f.select}</option>
            {MONTHLY_VOLUMES.map((v) => (
              <option key={v} value={v}>
                {f.volumes[v] ?? v}
              </option>
            ))}
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className="text-xs uppercase tracking-wider text-secondary">
            {f.messageOptional}
          </span>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`${inputClass} mt-2 resize-y`}
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="mt-6 w-full rounded-full bg-accent px-8 py-4 text-sm text-void transition hover:bg-accent/90 disabled:opacity-60 sm:w-auto"
      >
        {submitting ? f.submitting : f.submit}
      </button>
    </form>
  );
}
