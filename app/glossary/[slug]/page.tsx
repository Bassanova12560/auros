import Link from "next/link";
import { notFound } from "next/navigation";

import { ContentFaqList, ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import {
  GLOSSARY_ROUTE,
  getAllGlossarySlugs,
  getDefaultTermFaq,
  getGlossaryCategory,
  getGlossaryTerm,
  getRelatedGlossaryTerms,
  glossaryTermPath,
} from "@/lib/glossary";
import { metadataFromPath } from "@/lib/seo/metadata";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllGlossarySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const term = getGlossaryTerm(slug);
  if (!term) return { title: "Terme | Glossaire AUROS" };
  return metadataFromPath(glossaryTermPath(slug));
}

export default async function GlossaryTermPage({ params }: PageProps) {
  const { slug } = await params;
  const term = getGlossaryTerm(slug);
  if (!term) notFound();

  const path = glossaryTermPath(slug);
  const category = getGlossaryCategory(term.category);
  const related = getRelatedGlossaryTerms(term);
  const faq = getDefaultTermFaq(term);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <FocusPageShell path={path} width="3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <ContentPageLayout
        eyebrow={`Glossaire · ${category.label}`}
        title={term.title}
        intro={term.shortDefinition}
        cta={
          term.internalLinks[0]
            ? { href: term.internalLinks[0].href, label: term.internalLinks[0].label }
            : { href: "/wizard", label: "Structurer mon dossier" }
        }
      >
        <p className="text-sm leading-relaxed text-white/55 md:text-base">{term.extended}</p>

        {term.internalLinks.length > 0 ? (
          <section className="mt-10" aria-labelledby="glossary-tools">
            <h2
              id="glossary-tools"
              className="font-mono text-[11px] tracking-wide text-white/45"
            >
              Aller plus loin sur AUROS
            </h2>
            <ul className="mt-4 flex flex-wrap gap-3">
              {term.internalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="card-flat interactive-subtle inline-block px-4 py-2.5 text-sm text-white/75 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {related.length > 0 ? (
          <section className="mt-10" aria-labelledby="glossary-related">
            <h2
              id="glossary-related"
              className="font-mono text-[11px] tracking-wide text-white/45"
            >
              Termes associés
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {related.map((rel) => (
                <li key={rel.slug}>
                  <Link
                    href={glossaryTermPath(rel.slug)}
                    className="interactive-subtle rounded-full border border-white/[0.08] px-3 py-1.5 font-mono text-[11px] text-white/50 hover:text-white/80"
                  >
                    {rel.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="mt-12" aria-labelledby="glossary-faq">
          <h2
            id="glossary-faq"
            className="font-display text-lg font-semibold text-white/90"
          >
            Questions fréquentes
          </h2>
          <p className="mt-2 text-xs text-white/35">
            Réponses éducatives indicatives — counsel qualifié requis avant décision.
          </p>
          <div className="mt-6">
            <ContentFaqList items={faq} />
          </div>
        </section>

        <p className="mt-10">
          <Link
            href={GLOSSARY_ROUTE}
            className="font-mono text-[11px] tracking-wide text-white/40 transition hover:text-white/70"
          >
            ← Retour au glossaire
          </Link>
        </p>
      </ContentPageLayout>
    </FocusPageShell>
  );
}
