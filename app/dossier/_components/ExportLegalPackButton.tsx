"use client";

import { useCallback, useState } from "react";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { buildLegalPackMarkdown } from "@/lib/export-legal-pack";
import { getDossierMessages } from "@/lib/dossier-i18n";
import type { WizardData } from "@/lib/wizard-types";

export function ExportLegalPackButton({ data }: { data: WizardData }) {
  const { locale } = useLocale();
  const dm = getDossierMessages(locale);
  const [busy, setBusy] = useState(false);

  const onExport = useCallback(() => {
    setBusy(true);
    try {
      const md = buildLegalPackMarkdown(data, locale);
      const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = dm.exportPack.filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setBusy(false);
    }
  }, [data, locale, dm.exportPack.filename]);

  return (
    <button
      type="button"
      onClick={onExport}
      disabled={busy}
      className="w-full rounded-full border border-white/15 py-3 text-sm text-white/80 transition hover:border-white/30 hover:text-white disabled:opacity-50"
    >
      {busy ? dm.exportPack.generating : dm.exportPack.button}
    </button>
  );
}
