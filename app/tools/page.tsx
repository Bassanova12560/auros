import Link from "next/link";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { TOOLS_HUB_ENTRIES, TOOLS_HUB_RELATED } from "@/lib/tools/hub";
import { TOOLS_ROUTE } from "@/lib/tools/paths";
import { metadataFromPath } from "@/lib/seo/metadata";

export const metadata = metadataFromPath(TOOLS_ROUTE);

export default function ToolsHubPage() {
  return (
    <FocusPageShell path={TOOLS_ROUTE} width="3xl">
      <ContentPageLayout
        eyebrow="Ressources · Pilier SEO"
        title="Outils tokenisation RWA"
        intro="Quatre outils gratuits et indicatifs pour cadrer conformité, rendement, juridiction et budget — avant de lancer votre dossier AUROS. Aucun compte requis ; validation counsel avant toute émission."
        cta={{ href: "/wizard", label: "Lancer le wizard gratuit" }}
      >
        <ul className="grid gap-4 sm:grid-cols-2">
          {TOOLS_HUB_ENTRIES.map((tool) => (
            <li key={tool.href}>
              <Link
                href={tool.href}
                className="card-flat interactive-subtle group flex h-full flex-col px-5 py-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="font-display text-base font-medium text-white group-hover:text-white/90">
                    {tool.title}
                  </p>
                  {tool.duration ? (
                    <span className="shrink-0 font-mono text-[10px] tracking-wide text-white/30">
                      {tool.duration}
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 flex-1 text-sm font-light leading-relaxed text-white/45">
                  {tool.description}
                </p>
                <p className="mt-4 font-mono text-[11px] tracking-wide text-white/50 group-hover:text-white/70">
                  {tool.cta} →
                </p>
              </Link>
            </li>
          ))}
        </ul>

        <section className="mt-14 border-t border-white/[0.06] pt-10">
          <h2 className="font-mono text-[11px] tracking-wide text-white/45">
            Aller plus loin
          </h2>
          <ul className="mt-5 space-y-4">
            {TOOLS_HUB_RELATED.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="card-flat interactive-subtle group block max-w-xl px-5 py-4"
                >
                  <p className="font-display text-base font-medium text-white group-hover:text-white/90">
                    {link.label}
                  </p>
                  <p className="mt-1.5 text-sm font-light text-white/45">{link.desc}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </ContentPageLayout>
    </FocusPageShell>
  );
}
