"use client";

import Link from "next/link";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { AmbientShell } from "../_components/ui/AmbientShell";
import { Footer } from "../_components/Footer";
import { Nav } from "../_components/Nav";
import { getPrivacyMessages } from "@/lib/privacy-i18n";

export default function PrivacyPage() {
  const { locale } = useLocale();
  const pm = getPrivacyMessages(locale);

  return (
    <AmbientShell>
      <Nav />
      <main className="page-main page-main--nav text-white">
        <div className="page-inner page-inner--2xl mx-auto">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
          {pm.tag}
        </p>
        <h1 className="mt-4 font-display text-3xl font-semibold text-white">
          {pm.title}
        </h1>
        <p className="mt-6 text-sm leading-relaxed text-muted">{pm.intro}</p>

        {pm.sections.map((sec) => (
          <section key={sec.title} className="mt-10">
            <h2 className="font-display text-lg font-semibold text-white">
              {sec.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{sec.body}</p>
          </section>
        ))}

        <section className="mt-10">
          <h2 className="font-display text-lg font-semibold text-white">
            Contact
          </h2>
          <p className="mt-3 text-sm text-muted">
            <a
              href={`mailto:${pm.contact}`}
              className="text-white hover:underline"
            >
              {pm.contact}
            </a>
          </p>
        </section>

        <p className="mt-12 font-mono text-[10px] text-white/35">{pm.updated}</p>

        <Link
          href="/"
          className="mt-10 inline-block font-mono text-[11px] uppercase tracking-wider text-white hover:underline"
        >
          {pm.home}
        </Link>
        </div>
      </main>
      <Footer />
    </AmbientShell>
  );
}
