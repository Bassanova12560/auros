export default function RootLoading() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-void px-6">
      <div className="w-full max-w-sm space-y-4" aria-busy aria-label="Loading">
        <div className="h-3 w-24 animate-pulse rounded bg-white/10" />
        <div className="h-8 w-3/4 animate-pulse rounded bg-white/[0.08]" />
        <div className="h-4 w-full animate-pulse rounded bg-white/[0.06]" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-white/[0.06]" />
      </div>
    </main>
  );
}
