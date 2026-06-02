"use client";

import Link from "next/link";

import { LanguageSwitcher } from "@/app/_components/i18n/LanguageSwitcher";
import { ACADEMY_ROUTE } from "@/lib/academy";

export function AcademyHeader({ compact = false }: { compact?: boolean }) {
  return (
    <header
      className={
        compact
          ? "border-b border-white/[0.06] px-4 py-4 md:px-6"
          : "border-b border-white/[0.06] px-6 py-5"
      }
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <Link href={ACADEMY_ROUTE} className="group min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/40">
            AUROS
          </p>
          <p className="font-display text-lg font-semibold tracking-tight text-white group-hover:text-white/80">
            Academy
          </p>
        </Link>
        <div className="flex shrink-0 items-center gap-3">
          <LanguageSwitcher ariaLabel="Language" />
          <Link
            href="/"
            className="font-mono text-[10px] uppercase tracking-wider text-white/40 hover:text-white/70"
          >
            auros.app →
          </Link>
        </div>
      </div>
    </header>
  );
}
