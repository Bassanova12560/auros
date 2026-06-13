"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";

import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { DOSSIER_STORAGE_KEY } from "@/lib/wizard-constants";
import type { CsrdResult } from "@/lib/green/csrd-check/types";
import { GREEN_ROUTE } from "@/lib/green/constants";

type PdfState = "idle" | "generating" | "error" | "done";

function ReadyInner() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id")?.trim() ?? "";
  const [pdfState, setPdfState] = useState<PdfState>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) setError("Session de paiement introuvable.");
  }, [sessionId]);

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
        body: JSON.stringify({ sessionId, data, csrdResult }),
      });
      if (!res.ok) {
        setPdfState("error");
        setError(
          res.status === 402
            ? "Paiement non confirmé — contactez support@getauros.com."
            : "Génération du PDF impossible."
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
    } catch {
      setPdfState("error");
      setError("Erreur réseau — réessayez.");
    }
  }, [sessionId]);

  return (
    <div className="page-inner mx-auto max-w-lg px-4 py-16 md:py-24">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-500/70">
        AUROS Green · Impact Report
      </p>
      <h1 className="mt-4 text-2xl font-light text-white">Paiement confirmé</h1>
      <p className="mt-3 text-sm leading-relaxed text-white/60">
        Votre rapport d&apos;impact est prêt. Téléchargez le PDF EU Taxonomy + RTMS — indicatif,
        à valider avec votre conseil ESG.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <PrimaryButton
          disabled={!sessionId || pdfState === "generating"}
          onClick={downloadPdf}
        >
          {pdfState === "generating"
            ? "Génération…"
            : pdfState === "done"
              ? "Retélécharger le PDF"
              : "Télécharger le PDF"}
        </PrimaryButton>
        <Link
          href={GREEN_ROUTE}
          className="inline-flex min-h-[44px] items-center text-sm text-white/45 hover:text-white/70"
        >
          Retour AUROS Green
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

export default function GreenImpactReportReadyPage() {
  return (
    <Suspense fallback={<div className="page-inner px-4 py-16 text-white/50">Chargement…</div>}>
      <ReadyInner />
    </Suspense>
  );
}
