"use client";

import Link from "next/link";

import type { WetsGrade } from "@/lib/wets/constants";

const GRADE_STYLE: Record<WetsGrade, string> = {
  A: "border-emerald-500/40 bg-emerald-500/15 text-emerald-300",
  B: "border-sky-500/40 bg-sky-500/15 text-sky-300",
  C: "border-amber-500/40 bg-amber-500/15 text-amber-300",
  D: "border-red-500/40 bg-red-500/15 text-red-300",
};

export function WetsGradeBadge({
  grade,
  score,
  size = "md",
}: {
  grade: WetsGrade;
  score?: number;
  size?: "sm" | "md" | "lg";
}) {
  const pad =
    size === "lg"
      ? "px-5 py-3 text-2xl"
      : size === "sm"
        ? "px-2 py-1 text-xs"
        : "px-3 py-1.5 text-sm";
  return (
    <span
      className={`inline-flex items-baseline gap-2 rounded-lg border font-mono font-semibold ${GRADE_STYLE[grade]} ${pad}`}
    >
      <span>{grade}</span>
      {typeof score === "number" ? (
        <span className="text-[0.85em] opacity-80">{score}/10</span>
      ) : null}
    </span>
  );
}

export function WetsNav() {
  return (
    <nav className="mb-8 flex flex-wrap gap-4 font-mono text-[11px] uppercase tracking-wider text-white/45">
      <Link href="/eau/trust" className="hover:text-white/80">
        Projets
      </Link>
      <Link href="/eau/trust/projects/new" className="hover:text-white/80">
        Nouveau
      </Link>
      <Link href="/eau/trust/reports" className="hover:text-white/80">
        Rapports publics
      </Link>
      <Link href="/eau/trust/risk-events" className="hover:text-white/80">
        Risk events
      </Link>
      <Link href="/trust/quantum" className="hover:text-white/80">
        Quantum index
      </Link>
      <Link href="/eau/risk" className="hover:text-white/80">
        WELHR rapide
      </Link>
    </nav>
  );
}
