import { getMessages, type Locale } from "@/lib/i18n";

type Props = {
  locale?: Locale;
};

/** Static score preview card — SSR-friendly, matches home ProductPreview bezel style. */
export function ScorePreviewCard({ locale = "fr" }: Props) {
  const card = getMessages(locale).score.exampleCard;
  const badges = [card.badgeLegal, card.badgeKyc, card.badgeMica, card.badgeDataRoom];

  return (
    <aside className="w-full lg:max-w-md" aria-label={card.title}>
      <div className="bezel-outer">
        <div className="bezel-inner p-5 md:p-6">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-white/45">
              {card.title}
            </p>
            <span className="rounded-full border border-white/15 px-2 py-0.5 font-mono text-[8px] uppercase tracking-wider text-white/50">
              Preview
            </span>
          </div>

          <div className="mt-6 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">
              Score tokenisation
            </p>
            <p className="mt-2 font-display text-4xl font-semibold tabular-nums text-white">
              78
            </p>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/[0.06]">
              <div className="h-full w-[78%] rounded-full bg-white/70" aria-hidden />
            </div>
          </div>

          <p className="mt-4 text-sm text-white/55">{card.maturity}</p>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {badges.map((badge) => (
              <div
                key={badge}
                className={`rounded-lg border px-2.5 py-2 font-mono text-[9px] uppercase tracking-wider ${
                  badge.includes("MiCA")
                    ? "border-amber-400/30 text-amber-300/90"
                    : "border-white/[0.06] text-white/45"
                }`}
              >
                {badge}
              </div>
            ))}
          </div>

          <p className="mt-5 text-xs leading-relaxed text-white/35">{card.disclaimer}</p>
        </div>
      </div>
    </aside>
  );
}
