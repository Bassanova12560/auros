"use client";

import Link from "next/link";

import { useJurisdictionPage } from "./useJurisdictionPage";
import { COMPARATOR_ROUTES } from "@/lib/comparators";

export function JurisdictionFooter() {
  const { messages } = useJurisdictionPage();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/[0.06] px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <Link
            href={COMPARATOR_ROUTES.compare}
            className="font-mono text-[10px] text-white/40 transition hover:text-white"
          >
            {messages.nav.compareInvest}
          </Link>
          <Link
            href="/wizard"
            className="font-mono text-[10px] text-white/40 transition hover:text-white"
          >
            {messages.nav.dossierShort}
          </Link>
          <Link
            href="/partners"
            className="font-mono text-[10px] text-white/40 transition hover:text-white"
          >
            {messages.footer.contact}
          </Link>
          <Link
            href="/legal"
            className="font-mono text-[10px] text-white/40 transition hover:text-white"
          >
            {messages.footer.legal}
          </Link>
          <Link
            href="/privacy"
            className="font-mono text-[10px] text-white/40 transition hover:text-white"
          >
            {messages.footer.privacy}
          </Link>
        </div>

        <p className="mt-6 max-w-2xl text-xs leading-relaxed text-white/30">
          {messages.footer.disclaimer}
        </p>

        <p className="mt-4 font-mono text-[10px] text-white/20">
          © {year} AUROS
        </p>
      </div>
    </footer>
  );
}
