import { getDashboardMessages } from "@/lib/dashboard-i18n";
import type { Locale } from "@/lib/i18n";

type Props = {
  locale?: Locale;
};

/** Static dossier preview — SSR-friendly, no client hooks. */
export function DashboardDossierPreview({ locale = "fr" }: Props) {
  const m = getDashboardMessages(locale).guest.teaser;
  const badges = [m.badgeLegal, m.badgeKyc];

  return (
    <aside
      className="mx-auto w-full min-w-0 max-w-md text-left sm:max-w-md"
      aria-label={m.previewLabel}
      data-dashboard-teaser=""
    >
      <div className="bezel-outer min-w-0">
        <div className="bezel-inner min-w-0 p-4 sm:p-5 md:p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-white/45">
              {m.previewLabel}
            </p>
            <span className="shrink-0 rounded-full border border-white/15 px-2 py-0.5 font-mono text-[8px] uppercase tracking-wider text-white/50">
              {m.previewTag}
            </span>
          </div>

          <div className="mt-6 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
            <div className="flex items-baseline justify-between gap-4 text-sm">
              <span className="text-white/70">{m.scoreLabel}</span>
              <span className="font-display text-2xl font-semibold tabular-nums text-white">
                78
                <span className="text-base font-normal text-white/40"> / 100</span>
              </span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full w-[78%] rounded-full bg-[color-mix(in_srgb,var(--auros-green-warm)_75%,white)]"
                aria-hidden
              />
            </div>
          </div>

          <p className="mt-4 text-sm text-white/55">{m.readiness}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {badges.map((badge) => (
              <span
                key={badge}
                className="rounded border border-white/[0.12] px-2 py-1 text-xs text-white/55"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
