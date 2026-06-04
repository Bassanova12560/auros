/** SSR skeleton for /green/market before client hydration (UX audit B1). */
export function GreenMarketSkeleton() {
  return (
    <div className="page-inner page-inner--6xl mx-auto px-4 pb-24 pt-12 md:px-6 md:pt-16">
      <div className="animate-pulse space-y-3">
        <div className="h-4 w-32 rounded bg-white/[0.08]" />
        <div className="h-8 w-2/3 max-w-md rounded bg-white/[0.08]" />
        <div className="mt-8 h-64 rounded-lg bg-white/[0.06]" />
        <div className="h-8 w-1/3 rounded bg-white/[0.06]" />
        <div className="h-8 w-2/3 rounded bg-white/[0.06]" />
        <div className="h-8 w-1/2 rounded bg-white/[0.06]" />
      </div>
      <div className="mt-14 animate-pulse space-y-2">
        <div className="h-5 w-40 rounded bg-white/[0.08]" />
        <div className="mt-4 h-10 rounded bg-white/[0.06]" />
        {[1, 2, 3].map((row) => (
          <div key={row} className="h-12 rounded bg-white/[0.04]" />
        ))}
      </div>
    </div>
  );
}
