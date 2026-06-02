"use client";

import type { ReactNode } from "react";

type Props = {
  pdfLabel: string;
  pdfGeneratingLabel: string;
  pdfRetryLabel: string;
  pdfLoading: boolean;
  pdfError: boolean;
  submitLabel: string;
  submitLoading: boolean;
  submitDone: boolean;
  submitError: string | null;
  pdfNote: string;
  onDownloadPdf: () => void;
  onSubmit: () => void;
  children?: ReactNode;
};

export function DossierActions({
  pdfLabel,
  pdfGeneratingLabel,
  pdfRetryLabel,
  pdfLoading,
  pdfError,
  submitLabel,
  submitLoading,
  submitDone,
  submitError,
  pdfNote,
  onDownloadPdf,
  onSubmit,
  children,
}: Props) {
  const pdfText = pdfLoading
    ? pdfGeneratingLabel
    : pdfError
      ? pdfRetryLabel
      : pdfLabel;

  return (
    <section
      id="dossier-actions"
      className="mb-10 scroll-mt-28 space-y-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5"
    >
      {children}
      <button
        type="button"
        onClick={onDownloadPdf}
        disabled={pdfLoading}
        className="w-full rounded-full bg-accent py-4 text-sm font-semibold text-void transition hover:bg-accent/90 disabled:opacity-60"
      >
        {pdfText}
      </button>
      <button
        type="button"
        onClick={onSubmit}
        disabled={submitLoading || submitDone}
        className="w-full rounded-full border border-white/20 py-4 text-sm font-medium text-white transition hover:border-white/40 disabled:opacity-50"
      >
        {submitLabel}
      </button>
      {submitError ? (
        <p className="text-center text-xs text-red-400" role="alert">
          {submitError}
        </p>
      ) : null}
      <p className="text-center text-xs leading-relaxed text-muted">{pdfNote}</p>
    </section>
  );
}
