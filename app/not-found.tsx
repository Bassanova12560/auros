import Link from "next/link";

/**
 * Intelligent 404 — guide back to the three audience paths + contact.
 */
export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-void px-6 text-center text-white">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">404</p>
      <h1 className="mt-4 font-display text-2xl font-semibold md:text-3xl">
        This page isn’t on the map
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-white/50">
        The link may be outdated. Pick a path — or tell us what you were looking for.
      </p>
      <nav className="mt-10 flex max-w-lg flex-wrap items-center justify-center gap-3">
        <Link href="/" className="auros-btn auros-btn--primary">
          Home
        </Link>
        <Link href="/lab" className="auros-btn auros-btn--ghost">
          Energy Lab
        </Link>
        <Link href="/builders" className="auros-btn auros-btn--ghost">
          Builders
        </Link>
        <Link href="/why" className="auros-btn auros-btn--ghost">
          Why Auros
        </Link>
      </nav>
      <p className="mt-8 font-mono text-[11px] text-white/40">
        <a
          href="mailto:resources@getauros.com?subject=404%20help"
          className="underline-offset-2 hover:text-white hover:underline"
        >
          resources@getauros.com
        </a>
      </p>
    </main>
  );
}
