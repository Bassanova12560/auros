"use client";

import Link from "next/link";

import type { PackGrade } from "@/lib/trust-packs/score";

const GRADE_STYLE: Record<PackGrade, string> = {
  A: "border-emerald-500/40 bg-emerald-500/15 text-emerald-300",
  B: "border-sky-500/40 bg-sky-500/15 text-sky-300",
  C: "border-amber-500/40 bg-amber-500/15 text-amber-300",
  D: "border-red-500/40 bg-red-500/15 text-red-300",
};

export function PackGradeBadge({
  grade,
  score,
}: {
  grade: PackGrade;
  score?: number;
}) {
  return (
    <span
      className={`inline-flex items-baseline gap-2 rounded-lg border px-3 py-1.5 font-mono text-sm font-semibold ${GRADE_STYLE[grade]}`}
    >
      <span>{grade}</span>
      {typeof score === "number" ? (
        <span className="text-[0.85em] opacity-80">{score}/10</span>
      ) : null}
    </span>
  );
}

export function TrustPacksNav() {
  return (
    <nav className="mb-8 flex flex-wrap gap-4 font-mono text-[11px] uppercase tracking-wider text-white/45">
      <Link href="/trust/packs" className="hover:text-white/80">
        Packs
      </Link>
      <Link href="/trust/packs/new" className="hover:text-white/80">
        Nouveau
      </Link>
      <Link href="/trust/capacity" className="hover:text-white/80">
        Capacity
      </Link>
      <Link href="/trust/passport" className="hover:text-white/80">
        Passport
      </Link>
      <Link href="/trust/institutions" className="hover:text-white/80">
        Institutions
      </Link>
      <Link href="/eau/trust" className="hover:text-white/80">
        WETS
      </Link>
      <Link href="/trust/quantum" className="hover:text-white/80">
        Quantum
      </Link>
    </nav>
  );
}
