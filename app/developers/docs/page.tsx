import Link from "next/link";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import {
  getProtocolDocsByCategory,
  PROTOCOL_DOCS_ROUTE,
  protocolDocPath,
} from "@/lib/protocol/docs";
import { DeveloperBrandMark } from "@/app/developers/_components/DeveloperBrandMark";
import { metadataFromPath } from "@/lib/seo/metadata";

export const metadata = metadataFromPath(PROTOCOL_DOCS_ROUTE);

const CATEGORIES = [
  { key: "getting-started" as const, label: "Démarrage" },
  { key: "endpoints" as const, label: "Endpoints" },
  { key: "guides" as const, label: "Guides" },
];

export default function ProtocolDocsIndexPage() {
  return (
    <FocusPageShell path={PROTOCOL_DOCS_ROUTE} width="3xl">
      <DeveloperBrandMark />
      <ContentPageLayout
        eyebrow="AUROS Protocol · Documentation"
        title="Documentation API"
        intro="Référence complète AUROS Protocol v1 — quickstart, authentification, endpoints et guides d'intégration. Contenu indicatif ; counsel qualifié requis avant émission."
        cta={{ href: "/developers", label: "Retour développeurs" }}
      >
        {CATEGORIES.map((cat) => {
          const pages = getProtocolDocsByCategory(cat.key);
          return (
            <section key={cat.key} className="mt-10 first:mt-0">
              <h2 className="font-mono text-[11px] tracking-wide text-white/45">
                {cat.label}
              </h2>
              <ul className="mt-4 space-y-3">
                {pages.map((page) => (
                  <li key={page.slug}>
                    <Link
                      href={protocolDocPath(page.slug)}
                      className="card-flat interactive-subtle block px-5 py-4"
                    >
                      <p className="text-sm font-medium text-white">{page.title}</p>
                      <p className="mt-1 text-xs font-light text-white/45">
                        {page.description}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}

        <section className="mt-12 border-t border-white/[0.06] pt-8">
          <h2 className="font-mono text-[11px] tracking-wide text-white/45">
            Ressources
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-white/60">
            <li>
              <Link href="/auros-openapi.yaml" className="hover:text-white">
                OpenAPI 3.1 spec →
              </Link>
            </li>
            <li>
              <Link href="/developers#playground" className="hover:text-white">
                Playground interactif →
              </Link>
            </li>
          </ul>
        </section>
      </ContentPageLayout>
    </FocusPageShell>
  );
}
