"use client";

import { useRef, useState } from "react";

import { MarketingConsentCheckbox } from "@/app/_components/MarketingConsentCheckbox";
import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { saveLeadAction } from "@/lib/actions/leads";
import { EMAIL_REGEX } from "@/lib/wizard-constants";
import { getWizardStepsMessages } from "@/lib/wizard-steps-i18n";
import type { WizardData } from "@/lib/wizard-types";

import { WizardStepHeader } from "../WizardStepHeader";

type Props = {
  data: WizardData;
  update: <K extends keyof WizardData>(k: K, v: WizardData[K]) => void;
  showValidationHints?: boolean;
};

export function Step9Contact({
  data,
  update,
  showValidationHints = false,
}: Props) {
  const { locale } = useLocale();
  const ws = getWizardStepsMessages(locale);
  const email = data.email ?? "";
  const consent = data.marketingConsent === true;
  const emailTouched = email.length > 0;
  const emailInvalid = emailTouched && !EMAIL_REGEX.test(email.trim());
  const savedEmailRef = useRef<string | null>(null);
  const [consentTouched, setConsentTouched] = useState(false);
  const showConsentHint = (showValidationHints || consentTouched) && !consent;

  const persistLead = () => {
    const trimmed = email.trim();
    if (
      !consent ||
      !EMAIL_REGEX.test(trimmed) ||
      savedEmailRef.current === trimmed
    ) {
      return;
    }
    savedEmailRef.current = trimmed;
    void saveLeadAction({
      email: trimmed,
      source: "wizard_step_9",
      assetType: data.assetType || null,
      consent: true,
    });
  };

  return (
    <div>
      <WizardStepHeader
        step={9}
        tag={ws.s9.tag}
        title={ws.s9.title}
        subtitle={ws.s9.subtitle}
      />
      <div className="mt-8 space-y-7">
        <input
          data-wizard-step="9"
          type="text"
          value={data.firstName}
          onChange={(e) => update("firstName", e.target.value)}
          placeholder={ws.common.firstName}
          autoComplete="given-name"
          required
          aria-label={ws.common.firstName}
          className="wizard-input"
        />
        <div>
          <input
            data-wizard-step="9"
            type="email"
            value={email}
            onChange={(e) => update("email", e.target.value)}
            onBlur={persistLead}
            placeholder={ws.common.email}
            autoComplete="email"
            required
            inputMode="email"
            aria-label={ws.common.email}
            aria-invalid={emailInvalid || undefined}
            className={`wizard-input ${emailInvalid ? "border-accent/80" : ""}`}
          />
          {emailInvalid ? (
            <span
              className="mt-2 block font-mono text-xs text-accent"
              role="alert"
            >
              {ws.common.emailInvalid}
            </span>
          ) : null}
        </div>
        <MarketingConsentCheckbox
          id="wizard-marketing-consent"
          checked={consent}
          onChange={(v) => {
            setConsentTouched(true);
            update("marketingConsent", v);
          }}
        />
        {showConsentHint ? (
          <p className="font-mono text-[10px] text-accent" role="alert">
            {ws.common.consentRequired}
          </p>
        ) : null}
      </div>
      <p className="mt-8 font-mono text-[10px] leading-relaxed tracking-wide text-white/40">
        {ws.common.footerDelivery}
        <br />
        {ws.common.footerNoSpam}
      </p>
    </div>
  );
}
