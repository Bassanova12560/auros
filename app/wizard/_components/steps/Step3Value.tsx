"use client";

import type { ChangeEvent, CSSProperties } from "react";

import {
  CURRENCIES,
  VALUE_MAX,
  VALUE_MIN,
  VALUE_STEP,
  VALUE_DEFAULT,
} from "@/lib/wizard-constants";
import { formatCurrencyDisplay, formatWithSpaces } from "@/lib/wizard-format";
import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { getWizardStepsMessages } from "@/lib/wizard-steps-i18n";
import type { Currency, WizardData } from "@/lib/wizard-types";

import { WizardStepHeader } from "../WizardStepHeader";
type Props = {
  data: WizardData;
  update: <K extends keyof WizardData>(k: K, v: WizardData[K]) => void;
};

export function Step3Value({ data, update }: Props) {
  const { locale } = useLocale();
  const ws = getWizardStepsMessages(locale);
  const clamp = (n: number) => Math.min(Math.max(n, VALUE_MIN), VALUE_MAX);
  const effectiveValue =
    data.estimatedValue >= VALUE_MIN
      ? data.estimatedValue
      : data.estimatedValue > 0
        ? VALUE_MIN
        : VALUE_DEFAULT;
  const sliderValue = clamp(effectiveValue);
  const fillPct = ((sliderValue - VALUE_MIN) / (VALUE_MAX - VALUE_MIN)) * 100;

  const onNumberInput = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d]/g, "");
    if (raw === "") {
      update("estimatedValue", 0);
      return;
    }
    const n = Number.parseInt(raw, 10);
    update("estimatedValue", Math.min(n, VALUE_MAX));
  };

  const onNumberBlur = () => {
    if (data.estimatedValue < VALUE_MIN) update("estimatedValue", VALUE_MIN);
  };

  return (
    <div>
      <WizardStepHeader
        step={3}
        tag={ws.s3.tag}
        title={ws.s3.title}
        subtitle={ws.s3.subtitle}
      />      <p className="wizard-hero-value" aria-live="polite">
        {formatCurrencyDisplay(sliderValue, data.currency)}
      </p>
      <div className="mb-7">
        <input
          data-wizard-step="3"
          type="range"
          min={VALUE_MIN}
          max={VALUE_MAX}
          step={VALUE_STEP}
          value={sliderValue}
          onChange={(e) => update("estimatedValue", Number(e.target.value))}
          className="wizard-value-range"
          style={{ ["--fill" as never]: `${fillPct}%` } as CSSProperties}
          aria-label={ws.common.estimatedValueAria}        />
        <div className="mt-2 flex justify-between font-mono text-[11px] tracking-wide text-white/35">
          <span>{formatCurrencyDisplay(VALUE_MIN, data.currency)}</span>
          <span>{formatCurrencyDisplay(VALUE_MAX, data.currency)}</span>
        </div>
      </div>
      <div className="mb-8">
        <p className="wizard-field-label">{ws.common.exactAmount}</p>        <input
          data-wizard-step="3"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          className="wizard-input"
          value={formatWithSpaces(Math.max(0, data.estimatedValue || 0))}
          onChange={onNumberInput}
          onBlur={onNumberBlur}
          aria-label="Valeur estimée (numérique)"
        />
      </div>
      <div>
        <p className="wizard-field-label">{ws.common.currency}</p>
        <div
          role="radiogroup"
          aria-label={ws.common.currency}          className="flex flex-wrap gap-2"
        >
          {CURRENCIES.map((c) => {
            const active = data.currency === c;
            return (
              <button
                key={c}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => update("currency", c as Currency)}
                className={
                  active
                    ? "wizard-currency-pill wizard-currency-pill-active"
                    : "wizard-currency-pill"
                }
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
