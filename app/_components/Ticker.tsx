const ITEMS = [
  "IMMOBILIER",
  "ŒUVRES D'ART",
  "VÉHICULES",
  "MÉTAUX PRÉCIEUX",
  "CRÉDIT PRIVÉ",
  "VINS & SPIRITUEUX",
  "MONTRES & JOAILLERIE",
  "ÉNERGIE",
] as const;

const TICKER_TEXT = ITEMS.join("  ·  ") + "  ·  ";

export function Ticker() {
  return (
    <div
      className="relative overflow-hidden border-y border-white/[0.06] py-5"
      aria-label="Classes d'actifs RWA"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-void to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-void to-transparent" />
      <div className="flex w-max animate-auros-ticker gap-12 whitespace-nowrap px-8">
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/30">
          {TICKER_TEXT}
        </span>
        <span aria-hidden className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/30">
          {TICKER_TEXT}
        </span>
      </div>
    </div>
  );
}
