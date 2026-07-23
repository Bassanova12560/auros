export default function LabLoading() {
  return (
    <main className="mx-auto flex min-h-[50vh] max-w-3xl flex-col justify-center px-6 py-16">
      <div className="h-3 w-28 animate-pulse rounded bg-white/10" />
      <div className="mt-4 h-10 w-2/3 animate-pulse rounded bg-white/[0.08]" />
      <div className="mt-8 h-40 animate-pulse rounded-xl border border-white/[0.06] bg-white/[0.03]" />
    </main>
  );
}
