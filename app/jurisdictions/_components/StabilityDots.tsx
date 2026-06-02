import type { StabilityTier } from "@/lib/jurisdictions";

type Props = {
  level: number;
  tier: StabilityTier;
  label: string;
};

export function StabilityDots({ level, tier, label }: Props) {
  const tone =
    tier === "high"
      ? "text-emerald-400/90"
      : tier === "medium"
        ? "text-amber-300/90"
        : "text-red-300/80";

  return (
    <div className="flex items-center gap-2">
      <span className={`font-mono text-xs tracking-tight ${tone}`} aria-hidden>
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} className={i < level ? "" : "text-white/15"}>
            {i < level ? "●" : "○"}
          </span>
        ))}
      </span>
      <span className="font-mono text-[10px] text-white/50">{label}</span>
    </div>
  );
}
