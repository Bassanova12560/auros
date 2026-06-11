"use client";

import Link from "next/link";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import {
  GREEN_BLOG_ARTICLES,
  greenBlogArticlePath,
  type GreenBlogArticle,
} from "@/lib/green/blog/articles";
import { GREEN_ROUTE, getGreenMessages } from "@/lib/green";

function formatArticleDate(iso: string, locale: string): string {
  const tag = locale === "es" ? "es-ES" : locale === "en" ? "en-GB" : "fr-FR";
  return new Date(iso).toLocaleDateString(tag, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function articleTitle(article: GreenBlogArticle): string {
  return article.title.replace(" | AUROS Green", "");
}

export function GreenBlogIndexView() {
  const { locale } = useLocale();
  const b = getGreenMessages(locale).blog;
  const [featured, ...rest] = GREEN_BLOG_ARTICLES;

  return (
    <ContentPageLayout eyebrow={b.eyebrow} title={b.title} intro={b.intro}>
      {featured ? (
        <article className="card-flat interactive-subtle mb-10 border border-green-royal/20 bg-green-royal/[0.04] px-5 py-8 md:px-10 md:py-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-green-royal-bright">
            {b.featuredLabel}
          </p>
          <p className="mt-3 font-mono text-[10px] tracking-wide text-white/35">
            {formatArticleDate(featured.publishedAt, locale)}
            {" · "}
            {featured.readingTimeMinutes} min
          </p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-white md:text-3xl">
            <Link
              href={greenBlogArticlePath(featured.slug)}
              className="transition hover:text-green-royal-bright"
            >
              {articleTitle(featured)}
            </Link>
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/55">
            {featured.excerpt}
          </p>
          <p className="mt-6">
            <Link
              href={greenBlogArticlePath(featured.slug)}
              className="inline-flex min-h-[44px] items-center rounded-full border border-white/15 px-5 py-2.5 font-mono text-[11px] tracking-wide text-white/70 transition hover:border-white/30 hover:text-white"
            >
              {b.readArticle}
            </Link>
          </p>
        </article>
      ) : null}

      <ul className="space-y-6">
        {rest.map((article) => (
          <li key={article.slug}>
            <article className="card-flat interactive-subtle px-5 py-6 md:px-8">
              <p className="font-mono text-[10px] tracking-wide text-white/35">
                {formatArticleDate(article.publishedAt, locale)}
                {" · "}
                {article.readingTimeMinutes} min
              </p>
              <h2 className="mt-2 font-display text-xl font-semibold text-white">
                <Link
                  href={greenBlogArticlePath(article.slug)}
                  className="transition hover:text-green-royal-bright"
                >
                  {articleTitle(article)}
                </Link>
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/50">
                {article.excerpt}
              </p>
              <p className="mt-4">
                <Link
                  href={greenBlogArticlePath(article.slug)}
                  className="font-mono text-[11px] tracking-wide text-white/50 transition hover:text-white/80"
                >
                  {b.readArticle}
                </Link>
              </p>
            </article>
          </li>
        ))}
      </ul>
      <p className="mt-8">
        <Link
          href={GREEN_ROUTE}
          className="font-mono text-[11px] tracking-wide text-white/40 transition hover:text-white/70"
        >
          {b.backLink}
        </Link>
      </p>
    </ContentPageLayout>
  );
}
