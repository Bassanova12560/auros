"use client";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import {
  INCOME_OPTIONS,
  INVESTOR_PROFILES,
  LEGAL_STATUS_OPTIONS,
  LEGAL_STRUCTURES,
  type IncomeType,
} from "@/lib/wizard-extended";
import { getWizardStepsMessages } from "@/lib/wizard-steps-i18n";
import { wizardOptionLabel } from "@/lib/wizard-options-i18n";

type UpdateFn = <K extends string>(key: K, value: unknown) => void;

type ExtendedData = {
  legalStructure: string;
  incomeType: string;
  incomeAmountYear: number;
  incomeDescription: string;
  legalStatus: string[];
  investorProfile: string;
  additionalNotes: string;
};

function OptionGrid({
  options,
  value,
  onSelect,
  labelFor,
}: {
  options: readonly string[] | Array<{ id: string; label: string }>;
  value: string;
  onSelect: (v: string) => void;
  labelFor?: (id: string) => string;
}) {
  const items =
    typeof options[0] === "string"
      ? (options as readonly string[]).map((o) => ({
          id: o,
          label: labelFor ? labelFor(o) : o,
        }))
      : (options as Array<{ id: string; label: string }>).map((o) => ({
          id: o.id,
          label: labelFor ? labelFor(o.id) : o.label,
        }));

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {items.map((o) => {
        const active = value === o.id;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onSelect(o.id)}
            className={
              active
                ? "wizard-asset-chip wizard-asset-chip-active"
                : "wizard-asset-chip"
            }
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function Step10LegalStructure({
  data,
  update,
}: {
  data: ExtendedData;
  update: UpdateFn;
}) {
  const { locale } = useLocale();
  const ws = getWizardStepsMessages(locale);

  return (
    <div>
      <p className="wizard-step-label">{ws.stepLabel(10, ws.s10.tag)}</p>
      <h2 className="wizard-title">{ws.s10.title}</h2>
      <p className="wizard-subtitle">{ws.s10.subtitle}</p>
      <div className="mt-8">
        <OptionGrid
          options={LEGAL_STRUCTURES}
          value={data.legalStructure}
          onSelect={(v) => update("legalStructure", v)}
          labelFor={(v) => wizardOptionLabel(locale, "legalStructures", v)}
        />
      </div>
    </div>
  );
}

export function Step11Revenue({
  data,
  update,
}: {
  data: ExtendedData;
  update: UpdateFn;
}) {
  const { locale } = useLocale();
  const ws = getWizardStepsMessages(locale);
  const selected = INCOME_OPTIONS.find((o) => o.id === data.incomeType);

  return (
    <div>
      <p className="wizard-step-label">{ws.stepLabel(11, ws.s11.tag)}</p>
      <h2 className="wizard-title">{ws.s11.title}</h2>
      <p className="wizard-subtitle">{ws.s11.subtitle}</p>
      <div className="mt-8 space-y-2">
        {INCOME_OPTIONS.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => update("incomeType", o.id as IncomeType)}
            className={
              data.incomeType === o.id
                ? "wizard-asset-chip wizard-asset-chip-active w-full"
                : "wizard-asset-chip w-full"
            }
          >
            {wizardOptionLabel(locale, "incomeTypes", o.id)}
          </button>
        ))}
      </div>

      {selected && "needsAmount" in selected && selected.needsAmount && (
        <div className="mt-6">
          <label className="wizard-field-label" htmlFor="income-amount">
            {ws.common.annualIncomeEur}
          </label>
          <input
            id="income-amount"
            type="number"
            min={0}
            step={1000}
            value={data.incomeAmountYear || ""}
            onChange={(e) =>
              update(
                "incomeAmountYear",
                Number.parseInt(e.target.value, 10) || 0
              )
            }
            className="wizard-select"
          />
        </div>
      )}

      {selected && "needsDescription" in selected && selected.needsDescription && (
        <div className="mt-6">
          <label className="wizard-field-label" htmlFor="income-desc">
            {ws.common.incomeDescription}
          </label>
          <input
            id="income-desc"
            type="text"
            value={data.incomeDescription}
            onChange={(e) => update("incomeDescription", e.target.value)}
            className="wizard-select"
            placeholder={ws.common.incomePlaceholder}
          />
        </div>
      )}
    </div>
  );
}

export function Step12LegalStatus({
  data,
  toggle,
}: {
  data: ExtendedData;
  toggle: (value: string) => void;
}) {
  const { locale } = useLocale();
  const ws = getWizardStepsMessages(locale);

  return (
    <div>
      <p className="wizard-step-label">{ws.stepLabel(12, ws.s12.tag)}</p>
      <h2 className="wizard-title">{ws.s12.title}</h2>
      <p className="wizard-subtitle">{ws.s12.subtitle}</p>
      <div className="mt-8 space-y-2">
        {LEGAL_STATUS_OPTIONS.map((opt) => {
          const active = data.legalStatus.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              className={
                active
                  ? "wizard-asset-chip wizard-asset-chip-active w-full text-left"
                  : "wizard-asset-chip w-full text-left"
              }
            >
              <span
                className={`mr-2 inline-block h-2 w-2 rounded-full border ${
                  active ? "border-white bg-white" : "border-white/30"
                }`}
                aria-hidden
              />
              {wizardOptionLabel(locale, "legalStatus", opt)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Step13InvestorProfile({
  data,
  update,
}: {
  data: ExtendedData;
  update: UpdateFn;
}) {
  const { locale } = useLocale();
  const ws = getWizardStepsMessages(locale);

  return (
    <div>
      <p className="wizard-step-label">{ws.stepLabel(13, ws.s13.tag)}</p>
      <h2 className="wizard-title">{ws.s13.title}</h2>
      <p className="wizard-subtitle">{ws.s13.subtitle}</p>
      <div className="mt-8">
        <OptionGrid
          options={INVESTOR_PROFILES}
          value={data.investorProfile}
          onSelect={(v) => update("investorProfile", v)}
          labelFor={(v) => wizardOptionLabel(locale, "investorProfiles", v)}
        />
      </div>
    </div>
  );
}

export function Step14Additional({
  data,
  update,
}: {
  data: ExtendedData;
  update: UpdateFn;
}) {
  const { locale } = useLocale();
  const ws = getWizardStepsMessages(locale);

  return (
    <div>
      <p className="wizard-step-label">{ws.stepLabel(14, ws.s14.tag)}</p>
      <h2 className="wizard-title">{ws.s14.title}</h2>
      <p className="wizard-subtitle">{ws.s14.subtitle}</p>
      <textarea
        className="wizard-textarea mt-8"
        value={data.additionalNotes}
        onChange={(e) => update("additionalNotes", e.target.value)}
        placeholder={ws.s14.placeholder}
        rows={8}
      />
    </div>
  );
}
