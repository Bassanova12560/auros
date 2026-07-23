"use client";

type PrintReportButtonProps = {
  label: string;
  pdfHref?: string;
  pdfLabel?: string;
};

export function PrintReportButton({
  label,
  pdfHref,
  pdfLabel,
}: PrintReportButtonProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {pdfHref && pdfLabel ? (
        <a
          href={pdfHref}
          className="rounded-full border border-white/15 px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider text-white/70 transition hover:border-white/30 hover:text-white"
        >
          {pdfLabel}
        </a>
      ) : null}
      <button
        type="button"
        onClick={() => window.print()}
        className="rounded-full border border-white/15 px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider text-white/70 transition hover:border-white/30 hover:text-white"
      >
        {label}
      </button>
    </div>
  );
}
