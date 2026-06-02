"use client";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { wizardOptionLabel } from "@/lib/wizard-options-i18n";
import { getWizardStepsMessages } from "@/lib/wizard-steps-i18n";

export const WIZARD_ASSET_OPTIONS = [
  "Renewable energy",
  "Real estate",
  "Fine art",
  "Collectibles",
  "Vehicles & classic cars",
  "Wine & spirits",
  "Watches & jewelry",
  "Music & royalties",
  "Film & IP rights",
  "Land & island",
  "Fashion & luxury goods",
  "Private equity / SME shares",
  "Commodities & precious metals",
  "Other",
] as const;

type WizardDataSlice = { assetType: string };

type Props = {
  data: WizardDataSlice;
  update: (value: string) => void;
};

export function Step1Asset({ data, update }: Props) {
  const { locale } = useLocale();
  const ws = getWizardStepsMessages(locale);

  return (
    <div>
      <p className="wizard-step-label">{ws.stepLabel(1, ws.s1.tag)}</p>
      <h2 className="wizard-title">{ws.s1.title}</h2>
      <p className="wizard-subtitle">{ws.s1.subtitle}</p>

      <div className="mt-8">
        <p className="wizard-field-label">{ws.s1.assetType}</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {WIZARD_ASSET_OPTIONS.map((value) => {
            const active = data.assetType === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => update(value)}
                className={
                  active
                    ? "wizard-asset-chip wizard-asset-chip-active"
                    : "wizard-asset-chip"
                }
              >
                {wizardOptionLabel(locale, "assetTypes", value)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
