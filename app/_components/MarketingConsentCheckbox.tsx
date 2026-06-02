"use client";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { getWizardStepsMessages } from "@/lib/wizard-steps-i18n";

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
};

export function MarketingConsentCheckbox({
  checked,
  onChange,
  id = "marketing-consent",
}: Props) {
  const { locale } = useLocale();
  const ws = getWizardStepsMessages(locale);

  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-start gap-3 text-left text-sm leading-relaxed text-white/70"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/25 bg-white/5 accent-white"
      />
      <span>{ws.common.marketingConsent}</span>
    </label>
  );
}
