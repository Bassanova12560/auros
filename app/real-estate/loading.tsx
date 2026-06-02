import { getComparatorMessages } from "@/lib/comparators/i18n";
import { DEFAULT_LOCALE } from "@/lib/i18n";

export default function RealEstateLoading() {
  const m = getComparatorMessages(DEFAULT_LOCALE);

  return (
    <main className="px-6 pb-4 pt-24 md:pt-28">
      <div className="mx-auto max-w-5xl animate-pulse">
        <div className="mb-10 h-4 w-40 rounded bg-white/[0.06]" />
        <div className="mb-3 h-10 w-72 max-w-full rounded bg-white/[0.06]" />
        <div className="mb-8 h-4 w-96 max-w-full rounded bg-white/[0.04]" />
        <div className="mb-10 grid gap-px rounded-xl border border-white/[0.08] sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-24 bg-white/[0.03]" />
          ))}
        </div>
        <p className="font-mono text-[10px] text-white/30">{m.loading}</p>
        <div className="mt-8 space-y-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="h-14 rounded-lg bg-white/[0.03]" />
          ))}
        </div>
      </div>
    </main>
  );
}
