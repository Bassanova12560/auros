"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app/error]", error);
  }, [error]);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-void px-6 text-center text-white">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
        AUROS
      </p>
      <h1 className="mt-4 font-display text-2xl font-semibold">
        Something went wrong
      </h1>
      <p className="mt-3 max-w-md text-sm text-white/60">
        A temporary error occurred. You can retry or return to the homepage.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-void"
        >
          Retry
        </button>
        <Link
          href="/"
          className="rounded-full border border-white/20 px-6 py-3 text-sm text-white"
        >
          Home
        </Link>
      </div>
    </main>
  );
}
