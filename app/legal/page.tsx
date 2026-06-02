"use client";

import Link from "next/link";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { AmbientShell } from "../_components/ui/AmbientShell";
import { Footer } from "../_components/Footer";
import { Nav } from "../_components/Nav";
import { getLegalMessages } from "@/lib/legal-i18n";

export default function LegalPage() {
  const { locale } = useLocale();
  const lm = getLegalMessages(locale);

  return (
    <AmbientShell>
      <Nav />
      <main className="page-main page-main--nav text-white">
        <div className="page-inner page-inner--2xl mx-auto">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white">
          {lm.tag}
        </p>
        <h1 className="mt-4 font-display text-3xl font-semibold">{lm.title}</h1>
        <p className="mt-8 text-sm leading-relaxed text-muted">{lm.body}</p>
        <p className="mt-6 text-sm text-muted">
          <a
            href="mailto:legal@auros.app"
            className="text-white hover:underline"
          >
            legal@auros.app
          </a>
        </p>
        <Link
          href="/privacy"
          className="mt-6 inline-block text-sm text-white/70 hover:text-white hover:underline"
        >
          {lm.privacyLink}
        </Link>
        <Link
          href="/"
          className="mt-10 block font-mono text-[11px] uppercase tracking-wider text-white hover:underline"
        >
          {lm.home}
        </Link>
        </div>
      </main>
      <Footer />
    </AmbientShell>
  );
}
