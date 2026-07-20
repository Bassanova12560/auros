import Link from "next/link";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { COMPARATOR_ROUTES } from "@/lib/comparators";
import {
  AUROS_FAQ_ROUTE,
  AUROS_RESOURCES_ROUTE,
  GREEN_BLOG_ROUTE,
  GREEN_FAQ_ROUTE,
  GREEN_ROUTE,
} from "@/lib/green/constants";
import { metadataFromPath } from "@/lib/seo/metadata";

export const metadata = metadataFromPath(AUROS_RESOURCES_ROUTE);

const SECTIONS = [
  {
    title: "Démarrer avec AUROS",
    links: [
      { href: "/how-it-works", label: "Comment ça marche", desc: "Trois étapes jusqu'au dossier RWA." },
      { href: "/guides", label: "Définitions de catégories", desc: "Booking engine watts, CFU, RWA Intelligence, RTMS, low-carbon — + intents citables." },
      { href: "/power", label: "AUROS Power", desc: "Low-carbon / nucléaire — Watts + CFU, hors Green Verified." },
      { href: "/developers/institutions", label: "API institutions", desc: "OpenAPI, export CFU, Monitor, Watts — pack banques / risque." },
      { href: "/developers/shield", label: "AUROS Shield", desc: "Sous-couche on-prem — clés locales, CBOM crypto, PQC-ready." },
      { href: "/comment-tokeniser", label: "Comment tokeniser mon actif", desc: "Guides immobilier, art, fonds, obligations, crédit privé, énergie, nucléaire et eau — wizard prérempli." },
      { href: "/estimate", label: "Score de préparation", desc: "Test indicatif en une phrase, sans compte." },
      { href: "/tools", label: "Outils tokenisation RWA", desc: "4 outils gratuits — MiCA, rendement, juridiction et coût indicatif." },
      { href: "/wizard", label: "Wizard tokenisation", desc: "Parcours gratuit — score et data room." },
      { href: AUROS_FAQ_ROUTE, label: "FAQ AUROS", desc: "10 réponses sur wizard, juridictions, RGPD." },
    ],
  },
  {
    title: "Approfondir",
    links: [
      { href: "/blog", label: "Blog tokenisation RWA", desc: "Guides pilier — immobilier Europe, MiCA et parcours émetteur." },
      { href: "/glossary", label: "Glossaire RWA", desc: "80+ définitions MiCA, standards, structures et ESG." },
      { href: "/data/rwa-index", label: "AUROS RWA Index", desc: "Indice mensuel — rendements par classe, export CSV." },
      { href: "/data/green-index", label: "AUROS Green RWA Index", desc: "Top actifs climatiques — CQS, Watt Score, export CSV." },
      { href: "/data/uhi-index", label: "AUROS UHI Index", desc: "Actifs productifs tokenisés — énergie, trésorerie, crédit." },
      { href: "/data/state-of-rwa-issuers", label: "State of RWA Issuers", desc: "Rapport trimestriel émetteurs — PDF avec email gate." },
      { href: "/discover", label: "Découvrir AUROS", desc: "Univers d'actifs et livrables dossier." },
      { href: "/trust", label: "Confiance & conformité", desc: "MiCA, RGPD, cadre réglementaire." },
      { href: "/jurisdictions", label: "Comparateur juridictions", desc: "8 juridictions — régulateur, fiscalité, délais." },
      { href: COMPARATOR_ROUTES.compare, label: "Comparateur rendements RWA", desc: "Données live multi-classes d'actifs." },
    ],
  },
  {
    title: "AUROS Green — énergie tokenisée",
    links: [
      { href: GREEN_ROUTE, label: "Hub AUROS Green", desc: "Marketplace, RTMS, label, registre." },
      { href: GREEN_FAQ_ROUTE, label: "FAQ Green", desc: "14 Q&R RTMS, label, marketplace." },
      { href: "/green/comment-ca-marche", label: "Comment ça marche Green", desc: "Parcours en 4 étapes." },
      { href: GREEN_BLOG_ROUTE, label: "Blog Green", desc: "Articles RTMS, PPA, producteurs vs stockeurs." },
      { href: "/data/green-index", label: "AUROS Green Index", desc: "Indice mensuel CQS + Watt — top 20 actifs EU." },
      { href: "/green/compare", label: "Comparateur Green", desc: "Références marché avec CQS et Watt Score." },
    ],
  },
  {
    title: "Formation & machine-readable",
    links: [
      { href: "/academy", label: "AUROS Academy", desc: "Fondamentaux RWA gratuits — FR/EN/ES." },
      { href: "/copilot", label: "AUROS Copilot", desc: "Assistant sourcé — comparateur, juridictions, ChargeFlow." },
      { href: "/llms.txt", label: "llms.txt", desc: "Catalogue texte pour agents IA." },
      { href: "/ai-first/index.json", label: "Catalogue AI-first", desc: "JSON indexable pour crawlers." },
    ],
  },
] as const;

export default function ResourcesPage() {
  return (
    <FocusPageShell path={AUROS_RESOURCES_ROUTE} width="3xl">
      <ContentPageLayout
        eyebrow="Ressources"
        title="Guides et documentation"
        intro="Hub éditorial AUROS — contenus éducatifs pour préparer une tokenisation RWA ou un dossier Green. Un lien principal par besoin."
        cta={{ href: "/wizard", label: "Lancer le wizard gratuit" }}
      >
        <div className="space-y-12">
          {SECTIONS.map((section) => (
            <section key={section.title} aria-labelledby={`res-${section.title}`}>
              <h2
                id={`res-${section.title}`}
                className="font-mono text-[11px] tracking-wide text-white/45"
              >
                {section.title}
              </h2>
              <ul className="mt-5 space-y-4">
                {section.links.map((link) => (
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
          ))}
        </div>
      </ContentPageLayout>
    </FocusPageShell>
  );
}
