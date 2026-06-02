"use client";

import Link from "next/link";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { getDossierMessages } from "@/lib/dossier-i18n";
import type { DossierStatus } from "@/lib/dossier-status";

type StepState = "done" | "current" | "upcoming";

type Props = {
  isSignedIn: boolean;
  aiReady: boolean;
  submitDone: boolean;
  dossierStatus: DossierStatus;
};

function stepState(index: number, currentIndex: number, done: boolean): StepState {
  if (done) return "done";
  if (index === currentIndex) return "current";
  return "upcoming";
}

function firstOpenStep(
  aiReady: boolean,
  isSignedIn: boolean,
  submitted: boolean
): number {
  if (submitted) return 4;
  if (!aiReady) return 0;
  if (!isSignedIn) return 2;
  return 3;
}

export function DossierNextSteps({
  isSignedIn,
  aiReady,
  submitDone,
  dossierStatus,
}: Props) {
  const { locale } = useLocale();
  const dm = getDossierMessages(locale);
  const ns = dm.nextSteps;

  const submitted =
    submitDone ||
    dossierStatus === "submitted" ||
    dossierStatus === "in_review" ||
    dossierStatus === "approved";

  const current = firstOpenStep(aiReady, isSignedIn, submitted);

  const steps = [
    { key: "read", label: ns.stepRead, done: aiReady },
    { key: "pdf", label: ns.stepPdf, done: false },
    { key: "account", label: ns.stepAccount, done: isSignedIn },
    { key: "submit", label: ns.stepSubmit, done: submitted },
  ] as const;

  return (
    <section
      className="mb-8 rounded-2xl border border-white/[0.1] bg-white/[0.04] p-5 md:p-6"
      aria-label={ns.title}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">
        {ns.title}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-white/70">{ns.subtitle}</p>

      <ol className="mt-6 space-y-3">
        {steps.map((step, i) => {
          const state = stepState(i, current, step.done);
          return (
            <li
              key={step.key}
              className={`flex items-start gap-3 rounded-xl border px-4 py-3 transition ${
                state === "current"
                  ? "border-white/25 bg-white/[0.06]"
                  : state === "done"
                    ? "border-emerald-500/20 bg-emerald-500/[0.04]"
                    : "border-white/[0.06] bg-transparent"
              }`}
            >
              <span
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[11px] ${
                  state === "done"
                    ? "bg-emerald-500/20 text-emerald-300"
                    : state === "current"
                      ? "bg-white text-void"
                      : "border border-white/20 text-white/40"
                }`}
                aria-hidden
              >
                {state === "done" ? "✓" : i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className={`text-sm font-medium ${
                    state === "upcoming" ? "text-white/55" : "text-white"
                  }`}
                >
                  {step.label}
                </p>
                {state === "current" && step.key === "read" && !aiReady ? (
                  <p className="mt-1 text-xs text-white/45">{ns.waitAi}</p>
                ) : null}
                {state === "current" && step.key === "account" && !isSignedIn ? (
                  <Link
                    href="/sign-up?redirect_url=/dossier"
                    className="mt-2 inline-block text-xs font-medium underline underline-offset-2"
                  >
                    {ns.accountCta}
                  </Link>
                ) : null}
                {state === "current" &&
                step.key === "pdf" &&
                isSignedIn &&
                aiReady ? (
                  <a
                    href="#dossier-actions"
                    className="mt-2 inline-block text-xs font-medium underline underline-offset-2"
                  >
                    {ns.pdfCta}
                  </a>
                ) : null}
                {state === "current" &&
                step.key === "submit" &&
                isSignedIn &&
                !submitted ? (
                  <a
                    href="#dossier-actions"
                    className="mt-2 inline-block text-xs font-medium underline underline-offset-2"
                  >
                    {ns.submitCta}
                  </a>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>

      {submitted ? (
        <p className="mt-4 rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-center text-xs text-emerald-200/90">
          {dm.submitDone}
        </p>
      ) : (
        <p className="mt-4 text-center text-xs leading-relaxed text-white/40">
          {ns.footer}
        </p>
      )}
    </section>
  );
}
