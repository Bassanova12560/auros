"use client";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { getWizardExpertMessages } from "@/lib/wizard-expert-i18n";

type Props = {
  onExpress: () => void;
  onStandard: () => void;
};

export function WizardPathChoice({ onExpress, onStandard }: Props) {
  const { locale } = useLocale();
  const m = getWizardExpertMessages(locale);

  return (
    <div className="mb-8 grid gap-3 sm:grid-cols-2">
      <button
        type="button"
        onClick={onExpress}
        className="rounded-xl border border-white/20 bg-white/[0.06] px-4 py-4 text-left transition hover:border-white/35 hover:bg-white/[0.09]"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
          {m.expressLabel}
        </p>
        <p className="mt-2 text-sm font-medium text-white">{m.expressTitle}</p>
        <p className="mt-1 text-xs leading-relaxed text-white/50">
          {m.expressSubtitle}
        </p>
      </button>
      <button
        type="button"
        onClick={onStandard}
        className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-4 text-left transition hover:border-white/20 hover:bg-white/[0.04]"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
          {m.standardLabel}
        </p>
        <p className="mt-2 text-sm font-medium text-white/90">{m.standardTitle}</p>
        <p className="mt-1 text-xs leading-relaxed text-white/45">
          {m.standardSubtitle}
        </p>
      </button>
    </div>
  );
}
