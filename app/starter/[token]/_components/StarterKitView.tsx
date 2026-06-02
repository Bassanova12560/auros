"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

import type { StarterKitPortalData } from "@/lib/actions/jurisdiction-starter";
import { getStarterKitUiMessages } from "@/lib/jurisdictions/starter-kit-i18n";
import { saveWizardPrefill } from "@/lib/wizard-prefill";

import { StarterKitJurisdictionHero } from "./StarterKitJurisdictionHero";
import { StarterKitPhaseBridge } from "./StarterKitPhaseBridge";
import { StarterKitReadinessCard } from "./StarterKitReadinessCard";

export function StarterKitView({
  data,
  token,
}: {
  data: StarterKitPortalData;
  token: string;
}) {
  const router = useRouter();
  const ui = getStarterKitUiMessages(data.locale);
  const c = data.content;

  const goWizard = useCallback(() => {
    saveWizardPrefill(data.wizardPrefill);
    try {
      sessionStorage.setItem(
        "auros_wizard_starter_seed",
        JSON.stringify(data.wizardSeed)
      );
      sessionStorage.setItem("auros_starter_phase1", "1");
      sessionStorage.setItem(
        "auros_starter_phase1_meta",
        JSON.stringify({
          country: data.wizardPrefill.country,
          locale: data.locale,
        })
      );
    } catch {
      // ignore
    }
    router.push("/wizard");
  }, [data, router]);

  return (
    <main className="page-main page-main--nav">
      <div className="page-inner page-inner--3xl mx-auto">
        <header className="mb-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-emerald-300/80">
            {ui.phaseBadge} · {data.paidTier}
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold text-white md:text-4xl">
            {ui.portalTitle}
          </h1>
          <p className="mt-3 text-base text-white/60">{ui.portalSubtitle}</p>
          <p className="mt-2 text-sm text-white/45">
            {data.firstName} · {data.email}
          </p>
        </header>

        <StarterKitJurisdictionHero
          jurisdictions={data.jurisdictions}
          projectType={data.projectType}
          projectValue={data.projectValue}
          locale={data.locale}
        />

        <StarterKitReadinessCard content={c} locale={data.locale} />

        <div className="flex flex-wrap gap-3">
          <a
            href={`/api/starter/${token}/pdf`}
            className="inline-flex rounded-full bg-accent px-6 py-3 text-sm font-medium text-void transition hover:bg-white"
          >
            {ui.downloadPdf}
          </a>
        </div>

        <p className="mt-4 text-xs text-white/40">{ui.notSameAsDossier}</p>

        <article className="mt-10 space-y-8">
          <Section title={ui.sectionJurisdiction} body={c.jurisdictionRationale} />
          <Section title={ui.sectionStructure} body={c.recommendedStructure} />
          <Section title={ui.sectionSummary} body={c.executiveSummary} />

          <section>
            <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
              {ui.sectionChecklist}
            </h2>
            <ul className="mt-3 space-y-2">
              {c.regulatoryChecklist.map((item) => (
                <li
                  key={item}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3 text-sm text-white/75"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
              {ui.sectionTimeline}
            </h2>
            <div className="mt-3 space-y-3">
              {c.timeline.map((t) => (
                <div
                  key={t.phase}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4"
                >
                  <p className="font-medium text-white">{t.phase}</p>
                  <p className="mt-1 text-xs text-white/45">{t.duration}</p>
                  <p className="mt-2 text-sm text-white/70">{t.actions}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
              {ui.sectionTech}
            </h2>
            <div className="mt-3 space-y-3">
              {c.techProviders.map((t) => (
                <div
                  key={t.name}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4"
                >
                  <p className="font-medium text-white">{t.name}</p>
                  <p className="mt-2 text-sm text-white/70">{t.fit}</p>
                  <p className="mt-2 text-xs text-white/45">{t.note}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
              {ui.sectionNext}
            </h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-white/75">
              {c.nextSteps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          </section>
        </article>

        <StarterKitPhaseBridge locale={data.locale} onOpenWizard={goWizard} />

        <footer className="mt-12 border-t border-white/[0.08] pt-6 text-xs text-white/45">
          <p>{c.disclaimer}</p>
          <p className="mt-2">{ui.generatedBy(data.provider ?? "template")}</p>
        </footer>
      </div>
    </main>
  );
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <section>
      <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
        {title}
      </h2>
      <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-white/75">
        {body}
      </p>
    </section>
  );
}
