"use client";

import Link from "next/link";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { AmbientShell } from "../_components/ui/AmbientShell";
import { Footer } from "../_components/Footer";
import { Nav } from "../_components/Nav";
import { getTermsMessages } from "@/lib/terms-i18n";

export default function TermsPage() {
  const { locale } = useLocale();
  const tm = getTermsMessages(locale);

  return (
    <AmbientShell>
      <Nav />
      <main className="page-main page-main--nav text-white">
        <div className="page-inner page-inner--2xl mx-auto">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white">
          {tm.tag}
        </p>
        <h1 className="mt-4 font-display text-3xl font-semibold">{tm.title}</h1>
        <p className="mt-8 text-sm leading-relaxed text-muted">{tm.body}</p>
        <Link
          href="/"
          className="mt-10 inline-block font-mono text-[11px] uppercase tracking-wider text-white hover:underline"
        >
          {tm.home}
        </Link>
        </div>
      </main>
      <Footer />
    </AmbientShell>
  );
}
