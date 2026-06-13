"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";

import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { DOSSIER_STORAGE_KEY } from "@/lib/wizard-constants";
import type { CsrdResult } from "@/lib/green/csrd-check/types";
import { GREEN_ROUTE } from "@/lib/green/constants";
import { getGreenImpactReportCopy } from "@/lib/green/impact-report-i18n";
import { track } from "@/lib/analytics";

type PdfState = "idle" | "generating" | "error" | "done";

function ReadyInner() {
  const { locale } = useLocale();
  const copy = getGreenImpactReportCopy(locale).ready;
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id")?.trim() ?? "";
  const [pdfState, setPdfState] = useState<PdfState>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) setError(copy.errors.sessionMissing);
  }, [copy.errors.sessionMissing, sessionId]);

  const downloadPdf = useCallback(async () => {
    if (!sessionId) return;
    setPdfState("generating");
    setError(null);

    let data: Record<string, unknown> = {};
    let csrdResult: CsrdResult | undefined;
    try {
      const raw = localStorage.getItem(DOSSIER_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as {
          data?: Record<string, unknown>;
          greenCompliance?: unknown;
          greenRtms?: unknown;
        };
        data = parsed.data ?? {};
      }
      const csrdRaw = sessionStorage.getItem("auros_csrd_result");
      if (csrdRaw) csrdResult = JSON.parse(csrdRaw) as CsrdResult;
    } catch {
      // best-effort
    }

    try {
      const res = await fetch("/api/green/impact-report/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, data, csrdResult, locale }),
      });
      if (!res.ok) {
        setPdfState("error");
        setError(
          res.status === 402
            ? copy.errors.paymentUnconfirmed
            : copy.errors.generationFailed
        );
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download =
        res.headers.get("Content-Disposition")?.match(/filename="([^"]+)"/)?.[1] ??
        "AUROS_Green_Impact_Report.pdf";
      anchor.click();
      URL.revokeObjectURL(url);
      setPdfState("done");
      track("impact_report_download", { locale });
    } catch {
      setPdfState("error");
      setError(copy.errors.network);
    }
  }, [copy.errors, locale, sessionId]);

  const downloadLabel =
    pdfState === "generating"
      ? copy.generating
      : pdfState === "done"
        ? copy.redownload
        : copy.download;

  return (
    <div className="page-inner mx-auto max-w-lg px-4 py-16 md:py-24">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-500/70">
        {copy.eyebrow}
      </p>
      <h1 className="mt-4 text-2xl font-light text-white">{copy.title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-white/60">{copy.description}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <PrimaryButton
          disabled={!sessionId || pdfState === "generating"}
          onClick={downloadPdf}
        >
          {downloadLabel}
        </PrimaryButton>
        <Link
          href={GREEN_ROUTE}
          className="inline-flex min-h-[44px] items-center text-sm text-white/45 hover:text-white/70"
        >
          {copy.backLink}
        </Link>
      </div>
      {error ? (
        <p className="mt-4 text-sm text-amber-400/90" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function ReadyLoading() {
  const { locale } = useLocale();
  const copy = getGreenImpactReportCopy(locale).ready;
  return <div className="page-inner px-4 py-16 text-white/50">{copy.loading}</div>;
}

export default function GreenImpactReportReadyPage() {
  return (
    <Suspense fallback={<ReadyLoading />}>
      <ReadyInner />
    </Suspense>
  );
}
