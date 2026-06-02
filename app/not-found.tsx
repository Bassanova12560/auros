import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-void px-6 text-center text-white">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
        404
      </p>
      <h1 className="mt-4 font-display text-2xl font-semibold">Page not found</h1>
      <Link
        href="/"
        className="mt-8 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-void"
      >
        Back to AUROS
      </Link>
    </main>
  );
}
