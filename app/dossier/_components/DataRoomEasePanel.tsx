"use client";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { getDataRoomEaseMessages } from "@/lib/data-room-ease-i18n";
import type { DataRoomEaseSummary } from "@/lib/data-room-ease";
import { wizardOptionLabel } from "@/lib/wizard-options-i18n";

export function DataRoomEasePanel({ summary }: { summary: DataRoomEaseSummary }) {
  const { locale } = useLocale();
  const m = getDataRoomEaseMessages(locale);

  return (
    <div className="mb-6 rounded-xl border border-white/[0.08] bg-white/[0.03] p-5">
      <p className="font-display text-lg font-semibold text-white">
        {summary.headline}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-white/55">
        {summary.subline}
      </p>

      <div className="mt-4">
        <div className="flex items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-wider text-white/40">
          <span>{m.progressLabel}</span>
          <span className="tabular-nums text-white/60">
            {summary.heldCount}/{summary.totalCount} · {summary.percent}%
          </span>
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-emerald-500/60 transition-all duration-500"
            style={{ width: `${summary.percent}%` }}
          />
        </div>
      </div>

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
                {wizardOptionLabel(locale, "documents", p.id)}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className="mt-4 text-xs leading-relaxed text-white/40">{m.reassurance}</p>
    </div>
  );
}
