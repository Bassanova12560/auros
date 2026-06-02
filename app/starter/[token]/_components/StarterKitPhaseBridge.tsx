"use client";

import type { Locale } from "@/lib/i18n";
import { getStarterKitUiMessages } from "@/lib/jurisdictions/starter-kit-i18n";

export function StarterKitPhaseBridge({
  locale,
  onOpenWizard,
}: {
  locale: Locale;
  onOpenWizard: () => void;
}) {
  const ui = getStarterKitUiMessages(locale);

  return (
    <aside className="mt-12 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 md:p-8">
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-emerald-300/90">
          {ui.phase0Done}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-white/35">
          → {ui.phase1Title}
        </span>
      </div>

      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/60">
        {ui.phase1Body}
      </p>
      <p className="mt-3 text-xs text-white/40">{ui.notSameAsDossier}</p>

      <button
        type="button"
        onClick={onOpenWizard}
        className="mt-6 inline-flex rounded-full border border-white/20 px-6 py-3 text-sm text-white transition hover:border-white/40"
      >
        {ui.phase1Cta}
      </button>
    </aside>
  );
}
