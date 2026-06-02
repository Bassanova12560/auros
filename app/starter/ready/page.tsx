import { Suspense } from "react";
import type { Metadata } from "next";

import { StarterReadyClient } from "./_components/StarterReadyClient";

export const metadata: Metadata = {
  title: "Starter Kit | AUROS",
  robots: { index: false, follow: false },
};

export default function StarterReadyPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center px-4 py-24">
          <p className="text-white/60">Chargement…</p>
        </main>
      }
    >
      <StarterReadyClient />
    </Suspense>
  );
}
