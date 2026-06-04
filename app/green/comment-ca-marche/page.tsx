import Link from "next/link";

import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import {
  GREEN_HOW_IT_WORKS_ROUTE,
  GREEN_LABEL_ROUTE,
  GREEN_MARKET_ROUTE,
  GREEN_REGISTER_ROUTE,
  GREEN_REGISTRY_ROUTE,
  GREEN_ROUTE,
  GREEN_STANDARDS_ROUTE,
  AUROS_WIZARD_ROUTE,
} from "@/lib/green";
import { metadataFromPath } from "@/lib/seo/metadata";

export const metadata = metadataFromPath(GREEN_HOW_IT_WORKS_ROUTE);

const STEPS = [
  {
    step: "01",
    title: "Comprendre RTMS",
    body:
      "Avant toute candidature, parcourez la grille Réel · Transparent · Mesurable · Sain. Elle structure la due diligence documentaire — pas un agrément régulateur.",
    href: GREEN_STANDARDS_ROUTE,
    linkLabel: "Standards RTMS",
  },
  {
    step: "02",
    title: "Trouver ou référencer un acteur",
    body:
      "La marketplace mondiale cartographie producteurs, stockeurs, rechargeurs et consommateurs. Publiez votre fiche via le formulaire — modération sous 48 h ouvrées.",
    href: GREEN_REGISTER_ROUTE,
    linkLabel: "Référencer mon acteur",
  },
  {
    step: "03",
    title: "Candidater au label Verified",
    body:
      "Soumettez votre dossier RTMS sur le formulaire label. Revue documentaire AUROS — objectif cinq jours ouvrés. Badge public uniquement après validation.",
    href: GREEN_LABEL_ROUTE,
    linkLabel: "Demander le label",
  },
  {
    step: "04",
    title: "Vérifier au registre public",
    body:
      "Projets Verified, cas pilote RTMS et experts Praticien sont listés avec lien de vérification partageable. Statuts honnêtes sur le comparateur.",
    href: GREEN_REGISTRY_ROUTE,
    linkLabel: "Ouvrir le registre",
  },
] as const;

export default function GreenHowItWorksPage() {
  return (
    <>
      <AiFirstPageJsonLd path={GREEN_HOW_IT_WORKS_ROUTE} />
      <ContentPageLayout
        eyebrow="AUROS Green · Parcours"
        title="Comment ça marche"
        intro="Quatre étapes pour passer de la découverte RTMS à un projet vérifiable — une action principale par phase, sans promesse de rendement."
        cta={{ href: GREEN_MARKET_ROUTE, label: "Explorer la marketplace" }}
      >
        <ol className="space-y-6">
          {STEPS.map((item) => (
            <li
              key={item.step}
              className="border border-white/[0.08] bg-white/[0.02] px-5 py-6 md:px-8"
            >
              <p className="font-mono text-[11px] tracking-wide text-green-royal">
                Étape {item.step}
              </p>
              <h2 className="mt-2 font-display text-xl font-semibold text-white">
                {item.title}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/55">
                {item.body}
              </p>
              <p className="mt-4">
                <Link
                  href={item.href}
                  className="font-mono text-[11px] tracking-wide text-white/50 transition hover:text-white/80"
                >
                  {item.linkLabel} →
                </Link>
              </p>
            </li>
          ))}
        </ol>
        <p className="mt-10 text-sm text-white/45">
          Structuration actif renouvelable côté AUROS principal :{" "}
          <Link
            href={`${AUROS_WIZARD_ROUTE}?asset=renewable`}
            className="text-white/65 underline-offset-2 hover:underline"
          >
            wizard actif renouvelable
          </Link>
          . Questions :{" "}
          <Link href="/green/faq" className="text-white/65 underline-offset-2 hover:underline">
            FAQ Green
          </Link>
          .
        </p>
        <p className="mt-6">
          <Link
            href={GREEN_ROUTE}
            className="font-mono text-[11px] tracking-wide text-white/40 transition hover:text-white/70"
          >
            ← Retour hub Green
          </Link>
        </p>
      </ContentPageLayout>
    </>
  );
}
