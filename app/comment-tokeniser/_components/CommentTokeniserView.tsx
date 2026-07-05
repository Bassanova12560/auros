"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { MobilePageShell } from "@/app/_components/ui/MobilePageShell";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { BezelCard } from "@/app/_components/ui/BezelCard";
import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import {
  getCommentTokeniserCopy,
  getCommentTokeniserDisclaimer,
  type CommentTokeniserLanding,
} from "@/lib/comment-tokeniser/landings";
import {
  prefillFromCommentTokeniser,
  wizardEntryPathForCommentTokeniser,
} from "@/lib/comment-tokeniser/prefill";
import { saveWizardPrefill } from "@/lib/wizard-prefill";
import { track } from "@/lib/analytics";

const REVENUE_SECTION_LABEL: Record<string, string> = {
  fr: "Suite AUROS — infra & Green",
  en: "AUROS suite — infra & Green",
  es: "Suite AUROS — infra y Green",
};

export function CommentTokeniserView({ landing }: { landing: CommentTokeniserLanding }) {
  const { locale } = useLocale();
  const router = useRouter();
  const copy = getCommentTokeniserCopy(landing.slug, locale);

  function startWizard() {
    saveWizardPrefill(prefillFromCommentTokeniser(landing.slug, locale));
    track("comment_tokeniser_cta", { slug: landing.slug, locale });
    router.push(wizardEntryPathForCommentTokeniser(landing.slug));
  }

  return (
    <MobilePageShell width="3xl" stickyBottom>
      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/40">
        AUROS · {copy.h1.split(" ").slice(0, 2).join(" ")}
      </p>
      <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-white md:text-5xl">
        {copy.h1}
      </h1>
      <p className="mt-5 text-lg leading-relaxed text-white/55">{copy.intro}</p>

      <BezelCard className="mt-10" innerClassName="p-6 md:p-8" animate>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-300/70">
          3 priorités
        </p>
        <ul className="mt-4 space-y-3">
          {copy.priorities.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-white/65">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-white/30" />
              {item}
            </li>
          ))}
        </ul>
      </BezelCard>

      <BezelCard className="mt-4" innerClassName="p-6 md:p-8" animate>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
          Parcours en 4 parties
        </p>
        <ol className="mt-4 grid gap-3 sm:grid-cols-2">
          {copy.parts.map((part, index) => (
            <li key={part.label} className="rounded-xl border border-white/[0.06] bg-black/30 p-4">
              <p className="font-mono text-[10px] text-white/35">
                {index + 1} · {part.label}
              </p>
              <p className="mt-1 text-sm text-white/60">{part.detail}</p>
            </li>
          ))}
        </ol>
      </BezelCard>

      {copy.revenueLinks ? (
        <BezelCard
          className="mt-4 border-cyan-500/10"
          innerClassName="p-6 md:p-8"
          animate
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-300/60">
            {REVENUE_SECTION_LABEL[locale] ?? REVENUE_SECTION_LABEL.fr}
          </p>
          <ul className="mt-4 space-y-3">
            {copy.revenueLinks.map((link) => (
              <li key={link.trackId}>
                <Link
                  href={link.href}
                  onClick={() =>
                    track("comment_tokeniser_revenue", {
                      slug: landing.slug,
                      trackId: link.trackId,
                      locale,
                    })
                  }
                  className="group block rounded-xl border border-white/[0.06] bg-black/30 px-4 py-3 transition hover:border-cyan-500/25 hover:bg-cyan-500/[0.04]"
                >
                  <p className="text-sm font-medium text-white/85 group-hover:text-white">
                    {link.label}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-white/45">
                    {link.detail}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </BezelCard>
      ) : null}

      <div className="mt-8 flex flex-wrap gap-3">
        <PrimaryButton type="button" onClick={startWizard}>
          {copy.ctaWizard}
        </PrimaryButton>
        <Link
          href="/estimate"
          className="inline-flex items-center rounded-full border border-white/15 px-6 py-3 text-sm text-white/70 transition hover:border-white/30 hover:text-white"
        >
          {copy.ctaEstimate}
        </Link>
        <Link
          href="/jurisdictions"
          className="inline-flex items-center rounded-full border border-white/10 px-6 py-3 text-sm text-white/45 transition hover:border-white/25 hover:text-white/70"
        >
          {copy.ctaJurisdictions}
        </Link>
      </div>

      <p className="mt-12 text-xs leading-relaxed text-white/35">
        {getCommentTokeniserDisclaimer(locale)}
      </p>
    </MobilePageShell>
  );
}
