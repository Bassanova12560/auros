import type { Metadata } from "next";
import Link from "next/link";

import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import {
  DATA_LICENCE_ROUTE,
  DATA_TERMINAL_ROUTE,
} from "@/lib/data-terminal/constants";
import { GREEN_API_DOCS_ROUTE } from "@/lib/green/api/constants";
import {
  GREEN_API_PREMIUM_MONTHLY_EUR,
  greenApiPremiumDescription,
} from "@/lib/green/green-api-pricing";
import { GREEN_INDEX_ROUTE } from "@/lib/green-index";
import { metadataFromPath } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  ...metadataFromPath(DATA_LICENCE_ROUTE),
  title: "Licence data Green | AUROS",
  description:
    "CC-BY pour l’index public, API Premium pour l’usage commercial API, redistribution sur devis partenaires.",
};

const TIERS = [
  {
    id: "free",
    title: "Free — index public",
    body: "Green Index, CSV et pages /data/* : licence Creative Commons BY 4.0. Citation « AUROS Green Index » obligatoire. Pas de garantie SLA.",
    cta: { href: GREEN_INDEX_ROUTE, label: "Voir l’index →" },
  },
  {
    id: "premium",
    title: `API Premium — ${GREEN_API_PREMIUM_MONTHLY_EUR} €/mo`,
    body: `${greenApiPremiumDescription("fr")}. Usage API pour vos produits et outils internes. Ne couvre pas la redistribution du feed complet comme produit data concurrent.`,
    cta: {
      href: `${GREEN_API_DOCS_ROUTE}#premium`,
      label: "Souscrire Premium →",
    },
  },
  {
    id: "redistrib",
    title: "Redistribution commerciale",
    body: "Licence pour republier, revendre ou intégrer l’index / scores dans un terminal tiers. Sur devis — contact partenaires AUROS.",
    cta: {
      href: "/partners?intent=data-licence#contact",
      label: "Demander une licence →",
    },
  },
] as const;

export default function DataLicencePage() {
  return (
    <FocusPageShell path={DATA_LICENCE_ROUTE} width="3xl">
      <div className="space-y-12">
        <header className="space-y-4 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-emerald-400/80">
            Data licence
          </p>
          <h1 className="font-display text-3xl font-medium text-white md:text-4xl">
            Trois niveaux, une règle claire
          </h1>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-white/55">
            L’index public reste ouvert (CC-BY). L’API payante finance le terminal.
            La redistribution commerciale se négocie à part.
          </p>
        </header>

        <div className="grid gap-5 md:grid-cols-3">
          {TIERS.map((tier) => (
            <article
              key={tier.id}
              className="flex flex-col rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6"
            >
              <h2 className="font-display text-lg font-semibold text-white">
                {tier.title}
              </h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-white/55">
                {tier.body}
              </p>
              <Link
                href={tier.cta.href}
                className="mt-6 font-mono text-xs uppercase tracking-wider text-emerald-400/80 hover:text-emerald-300"
              >
                {tier.cta.label}
              </Link>
            </article>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <PrimaryButton href={DATA_TERMINAL_ROUTE}>Data Terminal</PrimaryButton>
          <Link
            href={GREEN_API_DOCS_ROUTE}
            className="inline-flex items-center rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/80 hover:border-white/30"
          >
            Green API →
          </Link>
        </div>

        <p className="text-center text-xs leading-relaxed text-white/35">
          Indicatif — pas un avis juridique. Les conditions exactes figurent dans{" "}
          <Link href="/terms" className="underline hover:text-white/55">
            /terms
          </Link>{" "}
          et le contrat partenaires.
        </p>
      </div>
    </FocusPageShell>
  );
}
