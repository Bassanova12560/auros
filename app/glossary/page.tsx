import Link from "next/link";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import {
  GLOSSARY_CATEGORY_ORDER,
  GLOSSARY_ROUTE,
  GLOSSARY_TERMS,
  getGlossaryCategory,
  getGlossaryTermsByCategory,
  glossaryTermPath,
} from "@/lib/glossary";
import { metadataFromPath } from "@/lib/seo/metadata";

export const metadata = metadataFromPath(GLOSSARY_ROUTE);

export default function GlossaryIndexPage() {
  return (
    <FocusPageShell path={GLOSSARY_ROUTE} width="3xl">
      <ContentPageLayout
        eyebrow="Ressources · Pilier SEO"
        title="Glossaire RWA"
        intro={`${GLOSSARY_TERMS.length} définitions pour préparer une tokenisation — MiCA, standards techniques, structures et finance verte. Contenu éducatif indicatif ; validation counsel avant toute émission.`}
        cta={{ href: "/wizard", label: "Lancer le wizard gratuit" }}
      >
        <div className="space-y-14">
          {GLOSSARY_CATEGORY_ORDER.map((categoryId) => {
            const category = getGlossaryCategory(categoryId);
            const terms = getGlossaryTermsByCategory(categoryId);
            return (
              <section key={categoryId} aria-labelledby={`glossary-cat-${categoryId}`}>
                <h2
                  id={`glossary-cat-${categoryId}`}
                  className="font-display text-xl font-semibold text-white/90"
                >
                  {category.label}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/45">
                  {category.description}
                </p>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {terms.map((term) => (
                    <li key={term.slug}>
                      <Link
                        href={glossaryTermPath(term.slug)}
                        className="card-flat interactive-subtle group block h-full px-4 py-3.5"
                      >
                        <p className="font-display text-sm font-medium text-white group-hover:text-white/90">
                          {term.title}
                        </p>
                        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-white/40">
                          {term.shortDefinition}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>

        <section className="mt-14 border-t border-white/[0.06] pt-10">
          <h2 className="font-mono text-[11px] tracking-wide text-white/45">
            Outils complémentaires
          </h2>
          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
            {[
              { href: "/tools", label: "Outils tokenisation RWA" },
              { href: "/compare", label: "Comparateur RWA" },
              { href: "/ressources", label: "Hub ressources" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-mono text-[11px] tracking-wide text-white/40 transition hover:text-white/70"
                >
                  {link.label} →
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </ContentPageLayout>
    </FocusPageShell>
  );
}
