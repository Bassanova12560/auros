"use client";

import { useState, type ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  children: ReactNode;
};

export function DossierCollapsible({
  title,
  subtitle,
  defaultOpen = false,
  children,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="mb-8 border-b border-white/[0.06] pb-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start justify-between gap-4 py-2 text-left"
        aria-expanded={open}
      >
        <div>
          <h2 className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-muted">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-1 text-sm text-white/50">{subtitle}</p>
          ) : null}
        </div>
        <span className="shrink-0 font-mono text-lg leading-none text-white/40">
          {open ? "−" : "+"}
        </span>
      </button>
      {open ? <div className="pb-6 pt-2">{children}</div> : null}
    </section>
  );
}
