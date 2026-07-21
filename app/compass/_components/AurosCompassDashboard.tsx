"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { FocusPageShell } from "@/app/_components/FocusPageShell";
import {
  COMPASS_DASHBOARD_ROUTE,
  COMPASS_MODE_ORDER,
  COMPASS_MODES,
  COMPASS_WELCOME_ROUTE,
  compassModeFromParam,
  type CompassMode,
} from "@/lib/resilience/compass";

export function AurosCompassDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const mode = compassModeFromParam(searchParams.get("mode"));
  const cfg = COMPASS_MODES[mode];

  function setMode(next: CompassMode) {
    router.replace(`${COMPASS_DASHBOARD_ROUTE}?mode=${next}`, { scroll: false });
  }

  return (
    <FocusPageShell path={COMPASS_DASHBOARD_ROUTE} width="3xl">
      <div className="auros-page-article">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-cyan-300/50">
          {cfg.kicker}
        </p>
        <h1 className="mt-3 font-display text-3xl text-white md:text-4xl">{cfg.label}</h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/55">{cfg.summary}</p>

        <div
          className="mt-8 flex flex-wrap gap-2"
          role="tablist"
          aria-label="Mode Compass"
        >
          {COMPASS_MODE_ORDER.map((id) => {
            const m = COMPASS_MODES[id];
            const active = id === mode;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setMode(id)}
                className={
                  active
                    ? "rounded-full border border-cyan-400/40 bg-cyan-400/10 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-cyan-100"
                    : "rounded-full border border-white/10 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-white/45 hover:text-white/70"
                }
              >
                {m.label}
              </button>
            );
          })}
        </div>

        <ul className="mt-10 space-y-0">
          {cfg.tiles.map((tile, i) => (
            <li
              key={tile.id}
              className="border-t border-white/[0.08] py-6 first:border-t-0 first:pt-0"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/35">
                Priorité {String(i + 1).padStart(2, "0")}
                {tile.metric ? ` · ${tile.metric}` : ""}
              </p>
              <h2 className="mt-2 font-display text-xl text-white">{tile.title}</h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/55">{tile.body}</p>
              <Link
                href={tile.href}
                className="mt-4 inline-block font-mono text-[11px] text-sky-300/80 hover:underline"
              >
                Ouvrir →
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-12 text-xs text-white/35">
          Indicatif — max 3 priorités par mode (UX AUROS). Pas un ERP ni une exécution automatique.
        </p>
        <Link
          href={COMPASS_WELCOME_ROUTE}
          className="mt-4 inline-block font-mono text-[11px] text-white/45 hover:text-white/70"
        >
          ← Accueil Compass
        </Link>
      </div>
    </FocusPageShell>
  );
}
