import { MARKER_COLORS } from "@/lib/green/market/markers";
import type { GreenMarketActor, GreenMarketActorType } from "@/lib/green/market/types";

type Props = {
  actors: GreenMarketActor[];
  actorTypeLabels?: Record<GreenMarketActorType, string>;
  mapAriaLabel?: string;
  className?: string;
};

const W = 800;
const H = 400;

function project(lat: number, lon: number): { x: number; y: number } {
  return {
    x: ((lon + 180) / 360) * W,
    y: ((90 - lat) / 180) * H,
  };
}

/** Static world map when Leaflet tiles or JS fail — no unicode symbols. */
export function GreenMarketMapStaticFallback({
  actors,
  actorTypeLabels,
  mapAriaLabel = "Green marketplace map",
  className = "",
}: Props) {
  return (
    <div
      role="img"
      aria-label={mapAriaLabel}
      className={`relative overflow-hidden border border-white/[0.08] bg-[#0c1210] ${className}`}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <defs>
          <linearGradient id="green-map-ocean" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0a1612" />
            <stop offset="100%" stopColor="#060a08" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill="url(#green-map-ocean)" />
        {[...Array(9)].map((_, i) => (
          <line
            key={`lat-${i}`}
            x1={0}
            y1={(i / 8) * H}
            x2={W}
            y2={(i / 8) * H}
            stroke="rgba(255,255,255,0.04)"
            strokeWidth={1}
          />
        ))}
        {[...Array(13)].map((_, i) => (
          <line
            key={`lon-${i}`}
            x1={(i / 12) * W}
            y1={0}
            x2={(i / 12) * W}
            y2={H}
            stroke="rgba(255,255,255,0.04)"
            strokeWidth={1}
          />
        ))}
        <ellipse
          cx={W * 0.48}
          cy={H * 0.42}
          rx={W * 0.22}
          ry={H * 0.28}
          fill="rgba(13, 82, 64, 0.12)"
          stroke="rgba(13, 82, 64, 0.25)"
          strokeWidth={1}
        />
        <ellipse
          cx={W * 0.22}
          cy={H * 0.38}
          rx={W * 0.12}
          ry={H * 0.22}
          fill="rgba(13, 82, 64, 0.08)"
          stroke="rgba(13, 82, 64, 0.18)"
          strokeWidth={1}
        />
        <ellipse
          cx={W * 0.78}
          cy={H * 0.35}
          rx={W * 0.14}
          ry={H * 0.2}
          fill="rgba(13, 82, 64, 0.08)"
          stroke="rgba(13, 82, 64, 0.18)"
          strokeWidth={1}
        />
        {actors.map((actor) => {
          const { x, y } = project(actor.lat, actor.lon);
          const color = MARKER_COLORS[actor.type];
          return (
            <circle
              key={actor.id}
              cx={x}
              cy={y}
              r={7}
              fill={color}
              stroke="rgba(255,255,255,0.85)"
              strokeWidth={2}
            />
          );
        })}
      </svg>
      {actors.length > 0 ? (
        <ul className="sr-only">
          {actors.map((a) => (
            <li key={a.id}>
              {a.name} — {actorTypeLabels?.[a.type] ?? a.type}
            </li>
          ))}
        </ul>
      ) : null}
      <p className="pointer-events-none absolute bottom-2 right-3 font-mono text-[9px] uppercase tracking-wider text-white/25">
        Carte indicative
      </p>
    </div>
  );
}
