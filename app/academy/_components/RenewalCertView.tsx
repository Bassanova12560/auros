"use client";



import Link from "next/link";

import { useCallback, useEffect, useRef, useState } from "react";



import { BezelCard } from "@/app/_components/ui/BezelCard";

import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";

import { AcademyReminderOptIn } from "./AcademyReminderOptIn";

import {

  ACADEMY_ROUTE,

  MIN_CHALLENGE_MS,

  verifyUrl,

  type PublicQuizQuestion,

  type RenewalResult,

} from "@/lib/academy";

import { formatCertDate, getAcademyMessages } from "@/lib/academy/i18n";



type Props = { certToken: string };



type ChallengeView = {

  id: string;

  title: string;

  intro: string;

  fields: {

    id: string;

    label: string;

    prompt: string;

    hint: string;

    minWords: number;

    maxWords: number;

  }[];

};



export function RenewalCertView({ certToken }: Props) {

  const { locale } = useLocale();

  const m = getAcademyMessages(locale);

  const r = m.renewal;



  const [phase, setPhase] = useState<"loading" | "quiz" | "brief" | "result">("loading");

  const [questions, setQuestions] = useState<PublicQuizQuestion[]>([]);

  const [challenge, setChallenge] = useState<ChallengeView | null>(null);

  const [challengeToken, setChallengeToken] = useState<string | null>(null);

  const [answers, setAnswers] = useState<Record<string, string>>({});

  const [step, setStep] = useState(0);

  const [response, setResponse] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [gradeFeedback, setGradeFeedback] = useState<string | null>(null);

  const [success, setSuccess] = useState<Extract<RenewalResult, { ok: true }> | null>(null);

  const [failReason, setFailReason] = useState<string | null>(null);

  const briefStartedAt = useRef(0);



  const question = questions[step];

  const renewalField = challenge?.fields[0];



  const startRenewal = useCallback(async () => {

    setLoading(true);

    setError(null);

    setGradeFeedback(null);

    setFailReason(null);

    setSuccess(null);

    try {

      const res = await fetch("/api/academy/renew/start", {

        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({ certToken, locale }),

      });

      const data = await res.json();

      if (!res.ok || !data.ok) {

        setFailReason(data.reason ?? "renewal_unavailable");

        setPhase("result");

        return;

      }

      setChallengeToken(data.challengeToken);

      setQuestions(data.questions);

      setChallenge(data.challenge);

      setPhase("quiz");

      setStep(0);

      setAnswers({});

      setResponse("");

    } catch {

      setError(m.errors.network);

      setPhase("result");

    } finally {

      setLoading(false);

    }

  }, [certToken, locale, m.errors.network]);



  useEffect(() => {

    void startRenewal();

  }, [startRenewal]);



  function selectOption(optionId: string) {

    if (!question) return;

    const next = { ...answers, [question.id]: optionId };

    setAnswers(next);

    if (step < questions.length - 1) {

      setStep(step + 1);

    } else {

      briefStartedAt.current = Date.now();

      setPhase("brief");

    }

  }



  async function submitRenewal() {

    if (!challengeToken || !renewalField) return;

    setLoading(true);

    setError(null);

    setGradeFeedback(null);

    try {

      const res = await fetch("/api/academy/renew/complete", {

        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({

          certToken,

          challengeToken,

          answers,

          fields: { [renewalField.id]: response },

          elapsedMs: Date.now() - briefStartedAt.current,

        }),

      });

      const data = (await res.json()) as RenewalResult & { grade?: { feedback?: string } };

      if (data.ok) {

        setSuccess(data);

        setPhase("result");

      } else {

        setFailReason(data.reason);

        if (data.grade?.feedback) setGradeFeedback(data.grade.feedback);

        setPhase("result");

      }

    } catch {

      setError(m.errors.network);

    } finally {

      setLoading(false);

    }

  }



  function renewalReasonMessage(reason: string | null): string {

    if (reason === "not_due_yet") return r.notDueYet;

    if (reason && r.reasons[reason]) return r.reasons[reason];

    if (reason && m.reasons[reason]) return m.reasons[reason];

    return r.unavailableGeneric;

  }



  if (phase === "loading") {

    return (

      <BezelCard innerClassName="p-6 md:p-10">

        <p className="text-sm text-white/55">{r.loading}</p>

      </BezelCard>

    );

  }



  if (phase === "quiz" && question) {

    return (

      <BezelCard innerClassName="p-6 md:p-10">

        <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">

          {r.quizEyebrow(step + 1, questions.length)}

        </p>

        <h2 className="mt-6 font-display text-xl text-white">{question.prompt}</h2>

        <ul className="mt-8 space-y-3">

          {question.options.map((opt) => (

            <li key={opt.id}>

              <button

                type="button"

                onClick={() => selectOption(opt.id)}

                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-4 text-left text-sm text-white/75 transition hover:border-white/20 hover:bg-white/[0.04]"

              >

                {opt.label}

              </button>

            </li>

          ))}

        </ul>

      </BezelCard>

    );

  }



  if (phase === "brief" && renewalField && challenge) {

    const minSeconds = Math.ceil(MIN_CHALLENGE_MS / 1000);

    return (

      <BezelCard innerClassName="p-6 md:p-10">

        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">

          {challenge.title}

        </p>

        <h2 className="mt-4 font-display text-2xl font-semibold text-white">

          {renewalField.label}

        </h2>

        <p className="mt-4 text-sm text-white/55">{renewalField.prompt}</p>

        <p className="mt-2 text-xs text-white/40">{renewalField.hint}</p>

        <p className="mt-4 text-xs text-white/40">{r.minTime(minSeconds)}</p>

        <p className="mt-1 text-xs text-white/35">

          {r.minWordsHint(renewalField.minWords)}

        </p>

        <textarea

          value={response}

          onChange={(e) => setResponse(e.target.value)}

          rows={8}

          className="mt-6 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none focus:border-white/25"

        />

        {error && (

          <p className="mt-4 text-sm text-white/70" role="alert">

            {error}

          </p>

        )}

        <div className="mt-8">

          <PrimaryButton

            type="button"

            disabled={loading || !response.trim()}

            onClick={() => void submitRenewal()}

          >

            {loading ? r.submitting : r.submit}

          </PrimaryButton>

        </div>

      </BezelCard>

    );

  }



  if (phase === "result" && success) {

    const url = verifyUrl(success.token);

    const expiry = formatCertDate(locale, success.certificate.expiresAt);

    return (

      <BezelCard innerClassName="p-6 md:p-10" animate>

        <h2 className="font-display text-2xl font-semibold text-white">{r.successTitle}</h2>

        <p className="mt-4 text-sm text-white/55">

          {r.successBody(success.certificate.renewalGeneration, expiry)}

        </p>

        <div className="mt-8 flex flex-wrap gap-3">

          <PrimaryButton href={url}>{r.verifyCta}</PrimaryButton>

          <Link href={ACADEMY_ROUTE} className="text-sm text-white/50 hover:text-white">

            {r.backLink}

          </Link>

        </div>

        <AcademyReminderOptIn certToken={success.token} compact />

      </BezelCard>

    );

  }



  const canRetry =

    failReason &&

    failReason !== "not_due_yet" &&

    failReason !== "invalid_certificate" &&

    failReason !== "renewal_unavailable";



  return (

    <BezelCard innerClassName="p-6 md:p-10">

      <h2 className="font-display text-xl text-white">{r.unavailableTitle}</h2>

      <p className="mt-4 text-sm text-white/55">{renewalReasonMessage(failReason)}</p>

      {gradeFeedback && (

        <p className="mt-3 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/65">

          {gradeFeedback}

        </p>

      )}

      {error && <p className="mt-2 text-sm text-white/45">{error}</p>}

      <div className="mt-6 flex flex-wrap gap-4">

        {canRetry && (

          <PrimaryButton type="button" onClick={() => void startRenewal()}>

            {r.retry}

          </PrimaryButton>

        )}

        <Link href={ACADEMY_ROUTE} className="text-sm text-white/50 hover:text-white">

          {r.backLink}

        </Link>

      </div>

    </BezelCard>

  );

}

