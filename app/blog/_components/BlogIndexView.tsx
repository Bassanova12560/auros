import Link from "next/link";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import {
  BLOG_ARTICLES,
  blogArticlePath,
  type BlogArticle,
} from "@/lib/blog";
import { AUROS_RESOURCES_ROUTE } from "@/lib/green/constants";

function formatArticleDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function articleTitle(article: BlogArticle): string {
  return article.title;
}

export function BlogIndexView() {
  const [featured, ...rest] = BLOG_ARTICLES;

  return (
    <ContentPageLayout
      eyebrow="Ressources · Pilier SEO"
      title="Blog tokenisation RWA"
      intro="Guides long format pour préparer une émission immobilière, obligations ou crédit en Europe — contenu éducatif indicatif, ton institutionnel. Deux piliers : panorama UE puis focus Luxembourg."
      cta={{ href: "/wizard", label: "Lancer le wizard gratuit" }}
    >
      {featured ? (
        <article className="card-flat interactive-subtle mb-10 border border-white/[0.1] px-5 py-8 md:px-10 md:py-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
            Article pilier
          </p>
          <p className="mt-3 font-mono text-[10px] tracking-wide text-white/35">
            {formatArticleDate(featured.publishedAt)}
            {" · "}
            {featured.readingTimeMinutes} min
          </p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-white md:text-3xl">
            <Link href={blogArticlePath(featured.slug)} className="transition hover:text-white/80">
              {articleTitle(featured)}
            </Link>
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/55">
            {featured.excerpt}
          </p>
          <p className="mt-6">
            <Link
              href={blogArticlePath(featured.slug)}
              className="inline-flex min-h-[44px] items-center rounded-full border border-white/15 px-5 py-2.5 font-mono text-[11px] tracking-wide text-white/70 transition hover:border-white/30 hover:text-white"
            >
              Lire le guide
            </Link>
          </p>
        </article>
      ) : null}

      {rest.length > 0 ? (
        <ul className="space-y-6">
          {rest.map((article) => (
            <li key={article.slug}>
              <article className="card-flat interactive-subtle px-5 py-6 md:px-8">
                <p className="font-mono text-[10px] tracking-wide text-white/35">
                  {formatArticleDate(article.publishedAt)}
                  {" · "}
                  {article.readingTimeMinutes} min
                </p>
                <h2 className="mt-2 font-display text-xl font-semibold text-white">
                  <Link
                    href={blogArticlePath(article.slug)}
                    className="transition hover:text-white/80"
                  >
                    {articleTitle(article)}
                  </Link>
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/50">
                  {article.excerpt}
                </p>
              </article>
            </li>
          ))}
        </ul>
      ) : null}

      <p className="mt-8">
        <Link
          href={AUROS_RESOURCES_ROUTE}
          className="font-mono text-[11px] tracking-wide text-white/40 transition hover:text-white/70"
        >
          ← Retour aux ressources
        </Link>
      </p>
    </ContentPageLayout>
  );
}
