"use client";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { getWizardModesMessages } from "@/lib/wizard-modes-i18n";

type Props = {
  onExplore: () => void;
  onPro: () => void;
};

export function WizardPathChoice({ onExplore, onPro }: Props) {
  const { locale } = useLocale();
  const m = getWizardModesMessages(locale);

  return (
    <div className="mb-8 grid gap-3 sm:grid-cols-2">
      <button
        type="button"
        onClick={onExplore}
        className="rounded-xl border border-white/20 bg-white/[0.06] px-4 py-4 text-left transition hover:border-white/35 hover:bg-white/[0.09]"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
          {m.exploreLabel} · {m.explorePrice}
        </p>
        <p className="mt-2 text-sm font-medium text-white">{m.exploreTitle}</p>
        <p className="mt-1 text-xs leading-relaxed text-white/50">
          {m.exploreSubtitle}
        </p>
      </button>
      <button
        type="button"
        onClick={onPro}
        className="rounded-xl border border-[color-mix(in_srgb,var(--auros-green-warm)_35%,white)] bg-[color-mix(in_srgb,var(--auros-green-warm)_8%,transparent)] px-4 py-4 text-left transition hover:border-[color-mix(in_srgb,var(--auros-green-warm)_55%,white)] hover:bg-[color-mix(in_srgb,var(--auros-green-warm)_12%,transparent)]"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/55">
          {m.proLabel} · {m.proPrice}
        </p>
        <p className="mt-2 text-sm font-medium text-white">{m.proTitle}</p>
        <p className="mt-1 text-xs leading-relaxed text-white/55">
          {m.proSubtitle}
        </p>
      </button>
    </div>
  );
}
