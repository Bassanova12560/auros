"use client";

import { useCallback, useState, type FormEvent } from "react";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { saveGreenPraticienAction } from "@/lib/actions/green-praticien";
import { getGreenMessages } from "@/lib/green/i18n";

const inputClass =
  "w-full rounded-lg border border-emerald-500 bg-black px-4 py-3 text-sm text-emerald-400 placeholder:text-neutral-600 outline-none focus:border-emerald-400";

export function GreenPraticienWaitlistForm() {
  const { locale } = useLocale();
  const f = getGreenMessages(locale).praticien.form;

  const [submitted, setSubmitted] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [certId, setCertId] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setSubmitting(true);
      const result = await saveGreenPraticienAction({
        fullName: fullName.trim(),
        email: email.trim(),
        organization: organization.trim() || undefined,
        fundamentalsCertId: certId.trim() || undefined,
        message: message.trim() || undefined,
        locale,
      });
      setSubmitting(false);
      if (result.ok) setSubmitted(true);
    },
    [fullName, email, organization, certId, message, locale]
  );

  if (submitted) {
    return (
      <div
        className="rounded-xl border border-emerald-500 bg-black p-8 text-center"
        role="status"
      >
        <p className="text-lg text-emerald-400">{f.success}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-emerald-500 bg-black p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-500">{f.fullName}</span>
          <input
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={`${inputClass} mt-2`}
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-500">{f.email}</span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`${inputClass} mt-2`}
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-500">{f.organization}</span>
          <input
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            className={`${inputClass} mt-2`}
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-500">{f.certId}</span>
          <input
            value={certId}
            onChange={(e) => setCertId(e.target.value)}
            className={`${inputClass} mt-2`}
          />
          <p className="mt-2 text-xs text-neutral-500">{f.certIdHint}</p>
        </label>
        <label className="block sm:col-span-2">
          <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-500">{f.message}</span>
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`${inputClass} mt-2 resize-y`}
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="mt-6 inline-flex items-center rounded-lg border border-emerald-500 bg-emerald-500 px-6 py-3 text-sm font-medium text-black hover:bg-emerald-400 disabled:opacity-50"
      >
        {submitting ? f.submitting : f.submit}
      </button>
    </form>
  );
}
