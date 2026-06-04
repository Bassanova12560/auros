import { greenMarketMarkerSvg } from "@/lib/green/market/marker-svg";
import { MARKER_COLORS } from "@/lib/green/market/markers";
import type { GreenMarketActorType } from "@/lib/green/market/types";

const TYPES: GreenMarketActorType[] = ["producer", "storer", "charger", "consumer"];

type Props = {
  labels: Record<GreenMarketActorType, string>;
};

export function GreenMarketMapLegend({ labels }: Props) {
  return (
    <ul className="mt-3 flex flex-wrap gap-3" aria-label="Légende carte">
      {TYPES.map((type) => (
        <li
          key={type}
          className="flex items-center gap-2 rounded border border-white/[0.1] px-2.5 py-1.5"
        >
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-white/80"
            style={{ background: MARKER_COLORS[type] }}
            aria-hidden
            dangerouslySetInnerHTML={{ __html: greenMarketMarkerSvg(type) }}
          />
          <span className="font-mono text-[10px] uppercase tracking-wider text-white/55">
            {labels[type]}
          </span>
        </li>
      ))}
    </ul>
  );
}
