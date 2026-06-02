"use client";

import type { EaseSummary } from "@/lib/readiness-ease";
import { getEaseMessages } from "@/lib/ease-i18n";
import type { Locale } from "@/lib/i18n";

type Props = {
  summary: EaseSummary;
  locale: Locale;
  variant?: "default" | "compact";
  showEssentials?: boolean;
};

export function EasePanel({
  summary,
  locale,
  variant = "default",
  showEssentials = true,
}: Props) {
  const m = getEaseMessages(locale);
  const pct = Math.round(
    (summary.essentialsDone / summary.essentialsTotal) * 100
  );

  return (
    <div
      className={
        variant === "compact"
          ? "mt-6 w-full max-w-md text-left"
          : "rounded-xl border border-white/[0.08] bg-white/[0.03] p-5"
      }
    >
      <p
        className={
          variant === "compact"
            ? "text-sm font-medium text-white"
            : "font-display text-lg font-semibold text-white"
        }
      >
        {summary.headline}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-white/55">
        {summary.subline}
      </p>

      {showEssentials ? (
        <div className="mt-4">
          <div className="flex items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-wider text-white/40">
            <span>{m.essentialsLabel}</span>
            <span className="tabular-nums text-white/60">
              {summary.essentialsDone}/{summary.essentialsTotal}
            </span>
          </div>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full bg-white/50 transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      ) : null}

      {summary.priorities.length > 0 ? (
        <div className="mt-4">
          <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
            {m.prioritiesTitle}
          </p>
          <ul className="mt-2 space-y-2">
            {summary.priorities.map((p) => (
              <li
                key={p.id}
                className="flex gap-2 text-sm text-white/70 before:shrink-0 before:content-['·']"
              >
                {p.label}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
