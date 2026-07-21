"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { GREEN_ASSISTANT_ROUTE } from "@/lib/green";

/** Soft entry to free Green AI — hidden on the assistant page itself. */
export function GreenAssistantFab() {
  const pathname = usePathname();
  if (!pathname || pathname.startsWith(GREEN_ASSISTANT_ROUTE)) {
    return null;
  }

  return (
    <Link
      href={GREEN_ASSISTANT_ROUTE}
      className="fixed bottom-5 right-4 z-40 max-w-[11rem] rounded-lg border border-emerald-400/30 bg-black/90 px-3 py-2.5 text-left shadow-lg backdrop-blur-md transition hover:border-emerald-400/55 md:bottom-8 md:right-6"
      aria-label="Ouvrir l’assistant Green IA"
    >
      <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-emerald-400/75">
        Aide IA
      </span>
      <span className="mt-0.5 block text-xs leading-snug text-white/80">
        Prochain pas Green
      </span>
    </Link>
  );
}
