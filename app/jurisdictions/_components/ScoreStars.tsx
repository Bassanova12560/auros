"use client";

export function ScoreStars({
  score,
  hint,
}: {
  score: number;
  hint?: string;
}) {
  return (
    <div className="flex items-center gap-2" title={hint}>
      <div className="flex items-center gap-0.5" aria-hidden>
        {Array.from({ length: 5 }, (_, index) => {
          const starIndex = index + 1;
          const fill = Math.min(1, Math.max(0, score - index));

          return (
            <span key={starIndex} className="relative inline-block h-3.5 w-3.5">
              <svg
                viewBox="0 0 20 20"
                className="absolute inset-0 text-white/15"
                fill="currentColor"
              >
                <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.77l-4.94 2.94.94-5.5-4-3.9 5.53-.8L10 1.5z" />
              </svg>
              <span
                className="absolute inset-0 overflow-hidden text-emerald-300/90"
                style={{ width: `${fill * 100}%` }}
              >
                <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor">
                  <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.77l-4.94 2.94.94-5.5-4-3.9 5.53-.8L10 1.5z" />
                </svg>
              </span>
            </span>
          );
        })}
      </div>
      <span className="font-mono text-xs tabular-nums text-white/80">
        {score.toFixed(1)}/5
      </span>
    </div>
  );
}
