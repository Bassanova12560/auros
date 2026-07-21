"use client";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { getCopilotUi } from "@/lib/copilot/ui-i18n";

export function CopilotLoadingFallback() {
  const { locale } = useLocale();
  return (
    <p className="font-mono text-sm text-white/40">
      {getCopilotUi(locale).loading}
    </p>
  );
}
