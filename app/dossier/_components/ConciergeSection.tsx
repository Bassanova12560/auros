"use client";

import { useCallback, useState, type FormEvent } from "react";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { saveConciergeAction } from "@/lib/actions/concierge";
import { getConciergeMessages } from "@/lib/concierge-i18n";
import { isValidCaptureEmail } from "@/lib/email-capture";
import { shouldShowConcierge } from "@/lib/concierge-request";
import { valueInEur } from "@/lib/platform-match";
import type { Currency } from "@/lib/wizard-types";

const inputClass =
  "auros-input bg-black/40";

type ConciergeSectionProps = {
  score: number | undefined;
  estimatedValue: number;
  currency: Currency;
  assetType?: string;
  city?: string;
  country?: string;
  defaultName: string;
  defaultEmail: string;
  defaultPhone?: string;
};

export function ConciergeSection({
  score,
  estimatedValue,
  currency,
  assetType = "",
  city = "",
  country = "",
  defaultName,
  defaultEmail,
  defaultPhone = "",
}: ConciergeSectionProps) {
  const { locale } = useLocale();
  const cm = getConciergeMessages(locale);
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [phone, setPhone] = useState(defaultPhone);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const visible = shouldShowConcierge(score, estimatedValue, currency);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      const trimmedName = name.trim();
      const trimmedEmail = email.trim();
      if (!trimmedName || !isValidCaptureEmail(trimmedEmail)) return;

      setSubmitting(true);
      const result = await saveConciergeAction({
        name: trimmedName,
        email: trimmedEmail,
        phone: phone.trim() || undefined,
        message: message.trim() || undefined,
        assetType: assetType || undefined,
        city: city || undefined,
        country: country || undefined,
        value: valueInEur(estimatedValue, currency),
        score,
        locale,
      });
      setSubmitting(false);

      if (result.ok) setSubmitted(true);
    },
    [name, email, phone, message, score, estimatedValue, currency, assetType, city, country, locale]
  );

  if (!visible) return null;

  return (
    <section className="mt-8 card-flat">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <p className="font-mono text-[10px] text-white/50">{cm.eyebrow}</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
            {cm.title}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-secondary">
            {cm.subtitle}
          </p>
          <ul className="mt-6 space-y-3 text-sm text-white/80">
            {cm.benefits.map((benefit) => (
              <li key={benefit} className="flex gap-2">
                <span className="text-white">→</span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        <div>
          {submitted ? (
            <p className="text-sm text-white" role="status">
              {cm.success}
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={cm.name}
                className={inputClass}
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={cm.email}
                className={inputClass}
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={cm.phone}
                className={inputClass}
              />
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={cm.message}
                className={`${inputClass} min-h-[84px] resize-y`}
              />
              <button
                type="submit"
                disabled={submitting}
                className="mt-2 w-full rounded-full bg-accent px-6 py-3 text-sm text-void transition hover:bg-accent/90 disabled:opacity-60"
              >
                {submitting ? cm.submitting : cm.submit}
              </button>
            </form>
          )}
          <p className="mt-4 text-xs text-secondary">{cm.footer}</p>
        </div>
      </div>
    </section>
  );
}
