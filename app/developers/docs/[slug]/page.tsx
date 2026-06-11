import Link from "next/link";
import { notFound } from "next/navigation";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import {
  getAllProtocolDocSlugs,
  getProtocolDoc,
  PROTOCOL_DOCS_ROUTE,
  protocolDocPath,
} from "@/lib/protocol/docs";
import { metadataFromPath } from "@/lib/seo/metadata";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllProtocolDocSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const doc = getProtocolDoc(slug);
  if (!doc) return { title: "Documentation | AUROS Protocol" };
  return metadataFromPath(protocolDocPath(slug));
}

export default async function ProtocolDocPage({ params }: PageProps) {
  const { slug } = await params;
  const doc = getProtocolDoc(slug);
  if (!doc) notFound();

  const path = protocolDocPath(slug);
  const related = doc.relatedSlugs
    .map((s) => getProtocolDoc(s))
    .filter((d): d is NonNullable<typeof d> => Boolean(d));

  return (
    <FocusPageShell path={path} width="3xl">
      <ContentPageLayout
        eyebrow={`Documentation · ${doc.categoryLabel}`}
        title={doc.title}
        intro={doc.description}
        cta={{ href: "/developers#playground", label: "Tester dans le playground" }}
      >
        {doc.sections.map((section) => (
          <section key={section.heading} className="mt-10 first:mt-0">
            <h2 className="font-display text-lg font-medium text-white">
              {section.heading}
            </h2>
            {section.paragraphs.map((p) => (
              <p key={p.slice(0, 40)} className="mt-3 text-sm leading-relaxed text-white/55">
                {p}
              </p>
            ))}
            {section.code ? (
              <pre className="mt-4 overflow-x-auto rounded-lg bg-black/40 p-4 font-mono text-[11px] leading-relaxed text-white/65">
                {section.code}
              </pre>
            ) : null}
            {section.links && section.links.length > 0 ? (
              <ul className="mt-4 flex flex-wrap gap-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="card-flat interactive-subtle inline-block px-4 py-2 text-sm text-white/75 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}

        {related.length > 0 ? (
          <section className="mt-12" aria-labelledby="doc-related">
            <h2
              id="doc-related"
              className="font-mono text-[11px] tracking-wide text-white/45"
            >
              Pages associées
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {related.map((rel) => (
                <li key={rel.slug}>
                  <Link
                    href={protocolDocPath(rel.slug)}
                    className="interactive-subtle rounded-full border border-white/[0.08] px-3 py-1.5 font-mono text-[11px] text-white/50 hover:text-white/80"
                  >
                    {rel.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <p className="mt-10">
          <Link
            href={PROTOCOL_DOCS_ROUTE}
            className="font-mono text-[11px] tracking-wide text-white/40 transition hover:text-white/70"
          >
            ← Retour à la documentation
          </Link>
        </p>
      </ContentPageLayout>
    </FocusPageShell>
  );
}
