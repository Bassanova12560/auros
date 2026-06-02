"use client";

import Link from "next/link";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { jurisdictionsUrlFromWizardCountry } from "@/lib/jurisdictions";
import { COUNTRIES_EUROPE, COUNTRIES_REST } from "@/lib/wizard-countries";
import { getWizardStepsMessages } from "@/lib/wizard-steps-i18n";
import type { WizardData } from "@/lib/wizard-types";

import { WizardStepHeader } from "../WizardStepHeader";

type Props = {
  data: WizardData;
  update: <K extends keyof WizardData>(k: K, v: WizardData[K]) => void;
};

export function Step4Location({ data, update }: Props) {
  const { locale } = useLocale();
  const ws = getWizardStepsMessages(locale);
  const jurisdictionsHref = jurisdictionsUrlFromWizardCountry(data.country);

  return (
    <div>
      <WizardStepHeader
        step={4}
        tag={ws.s4.tag}
        title={ws.s4.title}
        subtitle={ws.s4.subtitle}
      />
      <div className="mt-8 space-y-7">
        <div>
          <p className="wizard-field-label">{ws.common.country}</p>
          <select
            data-wizard-step="4"
            value={data.country}
            onChange={(e) => update("country", e.target.value)}
            className="wizard-select"
            aria-label={ws.common.country}
          >
            <option value="" disabled>
              {ws.common.selectCountry}
            </option>
            <optgroup label={ws.common.europe}>
              {COUNTRIES_EUROPE.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </optgroup>
            <optgroup label={ws.common.world}>
              {COUNTRIES_REST.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </optgroup>
          </select>
        </div>
        <div>
          <p className="wizard-field-label">{ws.common.city}</p>
          <input
            data-wizard-step="4"
            type="text"
            value={data.city}
            onChange={(e) => update("city", e.target.value)}
            placeholder={ws.common.cityPlaceholder}
            autoComplete="address-level2"
            className="wizard-input"
            aria-label={ws.common.city}
          />
        </div>

        {data.country ? (
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-4">
            <Link
              href={jurisdictionsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex text-sm text-white/60 underline-offset-4 transition hover:text-white hover:underline"
            >
              {ws.s4.jurisdictionsCta} →
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
