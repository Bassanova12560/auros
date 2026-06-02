"use client";

import Link from "next/link";
import { useCallback, useState, useTransition } from "react";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { analyzeRtmsPreliminaryAction } from "@/lib/actions/green-rtms-assistant";
import {
  GREEN_LABEL_ROUTE,
  GREEN_RTMS_PILLARS,
  GREEN_ROUTE,
  GREEN_STANDARDS_ROUTE,
  getGreenMessages,
} from "@/lib/green";
import {
  MIN_SUMMARY_WORDS,
  extractTopRtmsGapPriorities,
} from "@/lib/green/rtms-assistant";
import type { GreenRtmsScore } from "@/lib/green/rtms-scoring";

import {
  GreenBackLink,
  GreenDisclaimer,
  GreenPageHeader,
  GreenPanel,
  GreenSectionTitle,
} from "./green-ui";

const COPY = {
  fr: {
    eyebrow: "Assistant RTMS · bêta",
    title: "Pré-diagnostic RTMS",
    intro:
      "Décrivez votre projet en quelques lignes et joignez un PDF optionnel — nous générons une grille indicative (pas une certification).",
    disclaimer:
      "Résultat éducatif uniquement · revue humaine requise pour le label Auros Green Verified.",
    summary: "Résumé du projet",
    summaryHint: `Minimum ${MIN_SUMMARY_WORDS} mots — production, traçabilité, métriques, juridiction.`,
    country: "Pays / juridiction (optionnel)",
    document: "Dossier PDF (optionnel)",
    documentHint: "PDF uniquement, 5 Mo max — non stocké, analyse indicative côté formulaire.",
    submit: "Obtenir la grille indicative",
    submitting: "Analyse…",
    minWords: (n: number) => `${n} mots minimum`,
    errorInvalid: "Ajoutez un résumé plus détaillé (12 mots minimum).",
    errorRateLimit: "Trop de requêtes — réessayez dans une heure.",
    resultTitle: "Grille RTMS préliminaire",
    overall: "Score indicatif",
    tierEarly: "Amorçage — complétez les preuves clés",
    tierProgress: "En progression — priorisez 3 écarts",
    tierReady: "Solide pour une candidature label — revue AUROS recommandée",
    priorities: "Priorités indicatives (max. 3)",
    prioritiesComplete: "Signaux clés présents — affinez via standards et label.",
    checklist: "Checklist par pilier",
    pass: "Signal présent",
    gap: "À compléter",
    nextSteps: "Prochaines étapes",
    standardsCta: "Lire les standards RTMS",
    labelCta: "Candidater au label",
    backLink: "← Retour AUROS Green",
  },
  en: {
    eyebrow: "RTMS Assistant · beta",
    title: "Preliminary RTMS check",
    intro:
      "Describe your project in a few lines and optionally attach a PDF — we return an indicative grid (not certification).",
    disclaimer:
      "Educational output only · human review required for Auros Green Verified label.",
    summary: "Project summary",
    summaryHint: `Minimum ${MIN_SUMMARY_WORDS} words — production, traceability, metrics, jurisdiction.`,
    country: "Country / jurisdiction (optional)",
    document: "PDF dossier (optional)",
    documentHint: "PDF only, 5 MB max — not stored; indicative analysis from your inputs.",
    submit: "Get indicative grid",
    submitting: "Analyzing…",
    minWords: (n: number) => `${n} words minimum`,
    errorInvalid: "Add a more detailed summary (12 words minimum).",
    errorRateLimit: "Too many requests — try again in an hour.",
    resultTitle: "Preliminary RTMS grid",
    overall: "Indicative score",
    tierEarly: "Early — complete key evidence",
    tierProgress: "In progress — focus on top 3 gaps",
    tierReady: "Strong for label application — AUROS review recommended",
    priorities: "Indicative priorities (max 3)",
    prioritiesComplete: "Key signals present — refine via standards and label.",
    checklist: "Checklist by pillar",
    pass: "Signal present",
    gap: "To complete",
    nextSteps: "Next steps",
    standardsCta: "Read RTMS standards",
    labelCta: "Apply for label",
    backLink: "← Back to AUROS Green",
  },
  es: {
    eyebrow: "Asistente RTMS · beta",
    title: "Pre-diagnóstico RTMS",
    intro:
      "Describa su proyecto en unas líneas y adjunte un PDF opcional — generamos una cuadrícula indicativa (no certificación).",
    disclaimer:
      "Resultado educativo · revisión humana necesaria para el label Auros Green Verified.",
    summary: "Resumen del proyecto",
    summaryHint: `Mínimo ${MIN_SUMMARY_WORDS} palabras — producción, trazabilidad, métricas, jurisdicción.`,
    country: "País / jurisdicción (opcional)",
    document: "Dossier PDF (opcional)",
    documentHint: "Solo PDF, 5 MB max — no almacenado; análisis indicativo del formulario.",
    submit: "Obtener cuadrícula indicativa",
    submitting: "Analizando…",
    minWords: (n: number) => `${n} palabras mínimo`,
    errorInvalid: "Añada un resumen más detallado (12 palabras mínimo).",
    errorRateLimit: "Demasiadas solicitudes — intente en una hora.",
    resultTitle: "Cuadrícula RTMS preliminar",
    overall: "Puntuación indicativa",
    tierEarly: "Inicio — complete pruebas clave",
    tierProgress: "En progreso — priorice 3 brechas",
    tierReady: "Sólido para candidatura label — revisión AUROS recomendada",
    priorities: "Prioridades indicativas (máx. 3)",
    prioritiesComplete: "Señales clave presentes — refine con estándares y label.",
    checklist: "Checklist por pilar",
    pass: "Señal presente",
    gap: "Por completar",
    nextSteps: "Próximos pasos",
    standardsCta: "Leer estándares RTMS",
    labelCta: "Solicitar label",
    backLink: "← Volver a AUROS Green",
  },
} as const;

const inputClass =
  "w-full rounded-lg border border-emerald-500 bg-black px-4 py-3 text-sm text-emerald-400 placeholder:text-neutral-600 outline-none focus:border-emerald-400";

type AssistantCopy = (typeof COPY)[keyof typeof COPY];

function tierLabel(tier: GreenRtmsScore["tier"], c: AssistantCopy): string {
  if (tier === "ready") return c.tierReady;
  if (tier === "progress") return c.tierProgress;
  return c.tierEarly;
}

export function GreenRtmsAssistantView() {
  const { locale } = useLocale();
  const m = getGreenMessages(locale);
  const c = COPY[locale === "fr" ? "fr" : locale === "es" ? "es" : "en"];
  const pillars = m.standards.pillars;

  const [summary, setSummary] = useState("");
  const [country, setCountry] = useState("");
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [error, setError] = useState<"invalid" | "rate_limit" | null>(null);
  const [result, setResult] = useState<GreenRtmsScore | null>(null);
  const [pending, startTransition] = useTransition();

  const wordCount = summary.trim().split(/\s+/).filter(Boolean).length;

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      startTransition(async () => {
        const res = await analyzeRtmsPreliminaryAction({
          projectSummary: summary,
          country: country || undefined,
          hasDocument: Boolean(documentFile && documentFile.size > 0),
        });
        if (!res.ok) {
          setError(res.error);
          setResult(null);
          return;
        }
        setResult(res.score);
      });
    },
    [summary, country, documentFile]
  );

  return (
    <div className="page-inner page-inner--6xl mx-auto px-4 pb-20 pt-12 md:px-6 md:pt-14">
      <GreenPageHeader eyebrow={c.eyebrow} title={c.title} intro={c.intro} compact />
      <p className="mt-4 max-w-3xl border-l border-emerald-500/40 pl-5 text-xs leading-relaxed text-neutral-500">
        {c.disclaimer}
      </p>

      <GreenPanel className="mt-10">
        <form onSubmit={handleSubmit} className="space-y-6 p-6 md:p-8">
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-emerald-500/50">{c.summary}</span>
            <textarea
              required
              rows={5}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className={`${inputClass} mt-2 resize-y`}
              placeholder={c.summaryHint}
            />
            <p className="mt-1 text-[11px] text-neutral-500">
              {wordCount} / {c.minWords(MIN_SUMMARY_WORDS)}
            </p>
          </label>

          <label className="block max-w-md">
            <span className="text-xs uppercase tracking-wider text-emerald-500/50">{c.country}</span>
            <input
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className={`${inputClass} mt-2`}
            />
          </label>

          <label className="block max-w-lg">
            <span className="text-xs uppercase tracking-wider text-emerald-500/50">{c.document}</span>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setDocumentFile(e.target.files?.[0] ?? null)}
              className="mt-2 w-full text-sm text-emerald-400/80 file:mr-3 file:rounded-lg file:border file:border-emerald-500/40 file:bg-black file:px-3 file:py-2 file:text-xs file:uppercase file:tracking-wider file:text-emerald-400"
            />
            <p className="mt-1 text-[11px] text-neutral-500">{c.documentHint}</p>
          </label>

          {error ? (
            <p className="text-xs text-red-400/80" role="alert">
              {error === "rate_limit" ? c.errorRateLimit : c.errorInvalid}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending || wordCount < MIN_SUMMARY_WORDS}
            className="inline-flex items-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-medium text-emerald-950 hover:bg-emerald-400 disabled:opacity-50"
          >
            {pending ? c.submitting : c.submit}
          </button>
        </form>
      </GreenPanel>

      {result ? (
        <GreenPanel className="mt-10">
          <div className="p-6 md:p-8">
            <GreenSectionTitle>{c.resultTitle}</GreenSectionTitle>
            <p className="mt-4 text-3xl font-display font-semibold text-emerald-400">
              {result.overall}
              <span className="ml-2 text-sm font-normal text-neutral-500">/ 100 · {c.overall}</span>
            </p>
            <p className="mt-2 text-sm text-neutral-400">{tierLabel(result.tier, c)}</p>

            {(() => {
              const priorities = extractTopRtmsGapPriorities(result, locale);
              return (
                <div className="mt-8">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-emerald-500">
                    {c.priorities}
                  </p>
                  {priorities.length > 0 ? (
                    <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-neutral-300">
                      {priorities.map((p) => (
                        <li key={p.id}>{p.label}</li>
                      ))}
                    </ol>
                  ) : (
                    <p className="mt-3 text-sm text-neutral-400">{c.prioritiesComplete}</p>
                  )}
                </div>
              );
            })()}

            <p className="mt-8 font-mono text-[10px] uppercase tracking-wider text-emerald-500">
              {c.checklist}
            </p>
            <ul className="mt-4 space-y-4">
              {GREEN_RTMS_PILLARS.map((key) => {
                const meta = pillars[key];
                const pillar = result.pillars[key];
                const gaps = pillar.checks.filter((ch) => !ch.pass).length;
                return (
                  <li
                    key={key}
                    className="rounded-lg border border-emerald-500/20 bg-black/40 px-4 py-3"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="font-medium text-emerald-400">{meta.name}</p>
                      <p className="font-mono text-xs text-emerald-500">{pillar.score}%</p>
                    </div>
                    <p className="mt-1 text-xs text-neutral-500">{meta.tagline}</p>
                    <p className="mt-2 text-[11px] text-neutral-400">
                      {gaps === 0
                        ? c.pass
                        : `${gaps} ${c.gap.toLowerCase()}${gaps > 1 && locale === "fr" ? "s" : ""}`}
                    </p>
                  </li>
                );
              })}
            </ul>

            <p className="mt-8 font-mono text-[10px] uppercase tracking-wider text-emerald-500">
              {c.nextSteps}
            </p>
            <div className="mt-4 flex flex-wrap gap-4">
              <Link
                href={GREEN_STANDARDS_ROUTE}
                className="rounded-lg border border-emerald-500/40 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-emerald-500 hover:border-emerald-400 hover:text-emerald-400"
              >
                {c.standardsCta} →
              </Link>
              <Link
                href={GREEN_LABEL_ROUTE}
                className="rounded-lg border border-emerald-500/40 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-emerald-500 hover:border-emerald-400 hover:text-emerald-400"
              >
                {c.labelCta} →
              </Link>
            </div>
          </div>
        </GreenPanel>
      ) : null}

      <GreenDisclaimer>{m.disclaimer}</GreenDisclaimer>
      <GreenBackLink href={GREEN_ROUTE}>{c.backLink}</GreenBackLink>
    </div>
  );
}
