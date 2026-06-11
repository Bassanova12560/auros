import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ContentFaqList,
  ContentPageLayout,
} from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import {
  BLOG_ROUTE,
  getAllBlogSlugs,
  getBlogArticle,
  blogArticlePath,
} from "@/lib/blog";
import { metadataFromPath } from "@/lib/seo/metadata";

import { BlogCtaBlock } from "../_components/BlogCtaBlock";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const article = getBlogArticle(slug);
  if (!article) return { title: "Article | Blog AUROS" };
  return metadataFromPath(blogArticlePath(slug));
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getBlogArticle(slug);
  if (!article) notFound();

  const path = blogArticlePath(slug);

  const ctaBySection = new Map(
    (article.ctaBlocks ?? []).map((block) => [block.afterSection, block])
  );

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: article.faq.map((item) => ({
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
        eyebrow="Blog · Tokenisation RWA"
        title={article.title}
        intro={article.excerpt}
        cta={article.cta}
      >
        <p className="mb-8 font-mono text-[10px] tracking-wide text-white/35">
          Publié le{" "}
          {new Date(article.publishedAt).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          {" · Mis à jour "}
          {new Date(article.modifiedAt).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          {" · "}
          {article.readingTimeMinutes} min de lecture
        </p>

        <p className="mb-10 rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-xs leading-relaxed text-white/40">
          Contenu éducatif indicatif — ne constitue pas un conseil juridique, fiscal ou
          financier. Validation par counsel qualifié requise avant toute émission ou offre
          au public.
        </p>

        <div className="space-y-10">
          {article.sections.map((section, index) => {
            const ctaBlock = ctaBySection.get(index);
            return (
              <div key={section.heading}>
                <section>
                  <h2 className="font-display text-xl font-semibold text-white/90">
                    {section.heading}
                  </h2>
                  <div className="mt-4 space-y-4">
                    {section.paragraphs.map((paragraph) => (
                      <p
                        key={paragraph.slice(0, 48)}
                        className="text-sm leading-relaxed text-white/55 md:text-base"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  {section.links && section.links.length > 0 ? (
                    <ul className="mt-6 flex flex-wrap gap-3">
                      {section.links.slice(0, 3).map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            className="interactive-subtle rounded-full border border-white/[0.08] px-3 py-1.5 font-mono text-[11px] text-white/50 hover:text-white/80"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </section>
                {ctaBlock ? (
                  <BlogCtaBlock title={ctaBlock.title} links={ctaBlock.links} />
                ) : null}
              </div>
            );
          })}
        </div>

        <section className="mt-14" aria-labelledby="blog-faq">
          <h2
            id="blog-faq"
            className="font-display text-lg font-semibold text-white/90"
          >
            Questions fréquentes
          </h2>
          <p className="mt-2 text-xs text-white/35">
            Réponses éducatives indicatives — counsel qualifié requis avant décision.
          </p>
          <div className="mt-6">
            <ContentFaqList items={article.faq} />
          </div>
        </section>

        <BlogCtaBlock
          title="Prochaines étapes sur AUROS"
          links={[
            { href: "/tools/mica-checker", label: "Test MiCA" },
            { href: "/wizard", label: "Wizard dossier actif" },
            { href: "/real-estate", label: "Comparer l'immobilier tokenisé" },
          ]}
        />

        <p className="mt-10 flex flex-wrap gap-x-4 gap-y-2">
          <Link
            href={BLOG_ROUTE}
            className="font-mono text-[11px] tracking-wide text-white/40 transition hover:text-white/70"
          >
            ← Tous les articles
          </Link>
          <Link
            href="/glossary"
            className="font-mono text-[11px] tracking-wide text-white/40 transition hover:text-white/70"
          >
            Glossaire RWA
          </Link>
          <Link
            href="/ressources"
            className="font-mono text-[11px] tracking-wide text-white/40 transition hover:text-white/70"
          >
            Hub ressources
          </Link>
        </p>
      </ContentPageLayout>
    </FocusPageShell>
  );
}
