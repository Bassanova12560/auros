"use client";

import Link from "next/link";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import {
  GREEN_DIRECTION_BLURB,
  GREEN_MARKET_TARGETS,
  type PresenceStatus,
} from "@/data/listings/green-markets";

const STATUS_LABEL: Record<
  PresenceStatus,
  { fr: string; en: string; tone: string }
> = {
  live_consumer: {
    fr: "Déjà branché (données)",
    en: "Live data consumer",
    tone: "text-emerald-300/90",
  },
  ready_to_submit: {
    fr: "Dossier prêt · à soumettre",
    en: "Submission-ready",
    tone: "text-sky-300/80",
  },
  outreach_ready: {
    fr: "Mail d’approche prêt",
    en: "Outreach pack ready",
    tone: "text-amber-200/80",
  },
  watch: {
    fr: "Veille (critères)",
    en: "Watch · eligibility",
    tone: "text-white/40",
  },
};

function copy(locale: string) {
  const fr = locale === "fr";
  return {
    eyebrow: fr ? "Présence · marchés" : "Presence · markets",
    title: fr
      ? "Où AUROS doit apparaître — green d’abord"
      : "Where AUROS must show up — green first",
    intro: fr
      ? "Visibilité et sérieux sans faux logos partenaires. On consomme déjà DeFiLlama ; le reste est packé pour soumission. La vague CSRD / taxonomie UE rend la direction green bientôt non négociable."
      : "Visibility and seriousness without fake partner logos. We already consume DeFiLlama; the rest is submission-packed. The CSRD / EU Taxonomy wave makes the green direction soon non-negotiable.",
    direction: locale === "fr" ? GREEN_DIRECTION_BLURB.fr : GREEN_DIRECTION_BLURB.en,
    board: fr ? "Tableau de présence" : "Presence board",
    honest: fr
      ? "Statut honnête : « prêt » ≠ « listé ». Aucun badge « Listed on » tant que ce n’est pas confirmé."
      : "Honest status: ready ≠ listed. No “Listed on” badges until confirmed.",
    ctaGreen: fr ? "Ouvrir AUROS Green" : "Open AUROS Green",
    ctaCompare: fr ? "Comparateur RWA" : "RWA comparator",
    ctaPartners: fr ? "Partenaires plateformes" : "Platform partners",
    open: fr ? "Ouvrir" : "Open",
    submit: fr ? "Soumettre" : "Submit",
  };
}

export function PresencePageContent() {
  const { locale } = useLocale();
  const c = copy(locale);
  const targets = [...GREEN_MARKET_TARGETS].sort((a, b) => a.priority - b.priority);

  return (
    <div className="space-y-12 text-sm leading-relaxed text-white/65">
      <section className="flex flex-wrap gap-3">
        <PrimaryButton href="/green">{c.ctaGreen}</PrimaryButton>
        <PrimaryButton href="/compare" variant="ghost">
          {c.ctaCompare}
        </PrimaryButton>
        <PrimaryButton href="/partners" variant="ghost">
          {c.ctaPartners}
        </PrimaryButton>
      </section>

      <section className="space-y-3 border border-emerald-500/20 bg-emerald-500/[0.04] px-5 py-5">
        <h2 className="font-display text-xl text-white">{c.direction.title}</h2>
        <p>{c.direction.body}</p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-white/55">
          <li>
            <Link href="/green/csrd-check" className="underline-offset-2 hover:underline">
              /green/csrd-check
            </Link>
          </li>
          <li>
            <Link href="/green/compare" className="underline-offset-2 hover:underline">
              /green/compare
            </Link>
          </li>
          <li>
            <Link href="/green/impact-report" className="underline-offset-2 hover:underline">
              /green/impact-report
            </Link>
          </li>
          <li>
            <Link href="/data/green-index" className="underline-offset-2 hover:underline">
              /data/green-index
            </Link>
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-display text-xl text-white">{c.board}</h2>
          <p className="font-mono text-[10px] text-white/35">{c.honest}</p>
        </div>
        <ul className="divide-y divide-white/[0.06] border border-white/[0.08]">
          {targets.map((t) => {
            const st = STATUS_LABEL[t.status];
            const label = locale === "fr" ? st.fr : st.en;
            return (
              <li
                key={t.id}
                className="grid gap-2 px-4 py-4 sm:grid-cols-[9rem_1fr_auto] sm:items-start sm:gap-4"
              >
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-white/35">
                    {t.category.replace("_", " ")}
                  </p>
                  <p className={`mt-1 font-mono text-[10px] ${st.tone}`}>{label}</p>
                </div>
                <div>
                  <p className="font-display text-base text-white">{t.name}</p>
                  <p className="mt-1 text-white/55">{t.why}</p>
                  <p className="mt-2 font-mono text-[10px] leading-relaxed text-white/35">
                    {t.notes}
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:items-end">
                  <a
                    href={t.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[11px] text-white/70 underline-offset-2 hover:underline"
                  >
                    {c.open} →
                  </a>
                  {t.submitUrl ? (
                    <a
                      href={t.submitUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[11px] text-emerald-300/80 underline-offset-2 hover:underline"
                    >
                      {c.submit} →
                    </a>
                  ) : null}
                  {t.contactEmail ? (
                    <a
                      href={`mailto:${t.contactEmail}?subject=${encodeURIComponent(
                        `AUROS directory — ${t.name}`
                      )}`}
                      className="font-mono text-[10px] text-white/40 underline-offset-2 hover:underline"
                    >
                      {t.contactEmail}
                    </a>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="space-y-2 text-xs text-white/40">
        <p>
          Ops pack ·{" "}
          <code className="text-white/55">npm run listings:generate</code> →{" "}
          <code className="text-white/55">data/listings/generated/</code>
        </p>
        <p>
          Platform embed / verify for counterparties ·{" "}
          <Link href="/platforms" className="underline-offset-2 hover:underline">
            /platforms
          </Link>
        </p>
      </section>
    </div>
  );
}
