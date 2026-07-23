"use client";

import Link from "next/link";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { AUROS_ORG } from "@/lib/ai-first/org";
import { getAboutMessages } from "@/lib/about-i18n";

export function AboutPageContent() {
  const { locale } = useLocale();
  const m = getAboutMessages(locale);

  return (
    <>
      <p className="page-eyebrow">{m.eyebrow}</p>
      <h1 className="page-title">{m.title}</h1>
      <p className="page-intro text-sm">{m.intro}</p>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/45">
        {m.disclaimer}
      </p>

      <section className="mt-10 border border-white/[0.08] bg-white/[0.02] px-5 py-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
          {locale === "fr" ? "Lettre du fondateur" : "Founder note"}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-white/70">
          {locale === "fr"
            ? "Nous construisons le moteur de liquidité des ressources critiques — actifs numériques aujourd’hui, énergie et eau tokenisées demain. Pas de badges inventés, pas de volume théâtral : des démos labellées, du HITL sur le settlement, et un lab wallet que tu peux exercer sans MetaMask. Si tu es producteur, institution ou builder, écris-nous — on répond humainement."
            : "We’re building the liquidity engine for critical resources — digital assets today, tokenized energy and water next. No invented badges, no theatrical volume: labeled demos, HITL on settlement, and a lab wallet you can exercise without MetaMask. If you’re a producer, institution, or builder, write us — a human answers."}
        </p>
        <p className="mt-3 font-mono text-[11px] text-white/40">— Adrien Balitrand</p>
      </section>

      <dl className="mt-12 grid gap-4 sm:grid-cols-2">
        {m.credentials.map((row) => (
          <div key={row.label} className="card-flat p-5">
            <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
              {row.label}
            </dt>
            <dd className="mt-2 text-sm leading-relaxed text-white/70">
              {row.value === AUROS_ORG.contactEmail ? (
                <a
                  href={`mailto:${AUROS_ORG.contactEmail}`}
                  className="text-white hover:underline"
                >
                  {row.value}
                </a>
              ) : (
                row.value
              )}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-12">
        <Link href="/wizard" className="auros-btn auros-btn--primary">
          {m.ctaWizard}
        </Link>
        <nav className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
          <Link href="/jurisdictions" className="auros-btn auros-btn--link">
            {m.ctaJurisdictions}
          </Link>
          <Link
            href="/humans.txt"
            className="font-mono text-[11px] tracking-wide text-white/35 transition hover:text-white/55"
          >
            humans.txt
          </Link>
        </nav>
      </div>

      <Link
        href="/"
        className="mt-10 block font-mono text-[11px] uppercase tracking-wider text-white hover:underline"
      >
        {m.home}
      </Link>
    </>
  );
}
