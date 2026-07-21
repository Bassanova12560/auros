"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import type { WelhrResult } from "@/lib/eau/water-legal-risk";
import { buildResilienceBrief, type ResilienceBrief } from "@/lib/resilience/resilience-brief";

const ROLES = [
  { id: "pm", label: "Chef de projet" },
  { id: "risk", label: "Risk desk" },
  { id: "rse", label: "RSE / finance" },
] as const;

type RoleId = (typeof ROLES)[number]["id"];

const STORAGE_KEY = "auros_compass_role";

export function ResilienceBriefPanel() {
  const [role, setRole] = useState<RoleId>("pm");
  const [brief, setBrief] = useState<ResilienceBrief | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "risk" || stored === "rse" || stored === "pm") setRole(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, role);
  }, [role]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void fetch("/api/green/eau/legal-risk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: "AI data center 100MW cooling towers Michigan community hearings water contract",
        region: "Michigan",
        asset_hint: "data_center",
      }),
    })
      .then((r) => r.json())
      .then((json: { welhr?: WelhrResult }) => {
        if (cancelled || !json.welhr) return;
        setBrief(buildResilienceBrief(json.welhr));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const roleHint =
    role === "risk"
      ? "Focus preuves WETS + verify."
      : role === "rse"
        ? "Focus eau, démo ROI, impact report."
        : "Focus playbook + capacity avant COD.";

  return (
    <section
      aria-label="Resilience brief"
      className="mt-10 rounded-xl border border-white/10 bg-white/[0.02] px-5 py-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-300/60">
          Resilience brief · indicatif
        </p>
        <div className="flex flex-wrap gap-2">
          {ROLES.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRole(r.id)}
              className={
                role === r.id
                  ? "rounded-full border border-white/25 px-3 py-1 font-mono text-[10px] uppercase text-white"
                  : "rounded-full border border-white/10 px-3 py-1 font-mono text-[10px] uppercase text-white/40 hover:text-white/65"
              }
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="mt-4 text-sm text-white/45">Calcul WELHR proxy…</p>
      ) : brief ? (
        <>
          <div className="mt-4 flex flex-wrap items-baseline gap-4">
            <p className="font-display text-4xl text-white">{brief.resilience_score}</p>
            <p className="font-mono text-sm text-white/55">
              Grade {brief.grade} · WELHR {brief.welhr_grade} · stress {brief.stress_band}
            </p>
          </div>
          <p className="mt-3 text-sm text-white/60">{brief.headline}</p>
          <p className="mt-2 text-xs text-white/40">{roleHint}</p>
          <ul className="mt-5 space-y-2">
            {brief.priorities.map((p, i) => (
              <li key={p.href}>
                <Link
                  href={p.href}
                  className="font-mono text-[11px] text-sky-300/80 hover:underline"
                >
                  {String(i + 1).padStart(2, "0")} · {p.label} →
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="mt-4 text-sm text-red-300/80">Brief indisponible — réessayer plus tard.</p>
      )}
    </section>
  );
}
