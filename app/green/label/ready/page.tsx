"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { GREEN_ROUTE } from "@/lib/green/constants";
import { getGreenLabelReadyCopy } from "@/lib/green/label-checkout-i18n";

type VerifyState = "loading" | "ok" | "error";

function ReadyInner() {
  const { locale } = useLocale();
  const copy = getGreenLabelReadyCopy(locale);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id")?.trim() ?? "";
  const [state, setState] = useState<VerifyState>("loading");
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setState("error");
      setError(copy.errors.sessionMissing);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `/api/green/label/verify?session_id=${encodeURIComponent(sessionId)}`,
        );
        const json = (await res.json()) as {
          ok?: boolean;
          applicationId?: string;
        };
        if (cancelled) return;
        if (!res.ok || !json.ok || !json.applicationId) {
          setState("error");
          setError(copy.errors.paymentUnconfirmed);
          return;
        }
        setApplicationId(json.applicationId);
        setState("ok");
      } catch {
        if (!cancelled) {
          setState("error");
          setError(copy.errors.paymentUnconfirmed);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [copy.errors.paymentUnconfirmed, copy.errors.sessionMissing, sessionId]);

  if (state === "loading") {
    return <p className="text-sm text-white/50">{copy.loading}</p>;
  }

  return (
    <div className="page-inner mx-auto max-w-lg px-4 py-16 md:py-24">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-500/70">
        {copy.eyebrow}
      </p>
      <h1 className="mt-4 text-2xl font-light text-white">
        {state === "ok" ? copy.title : copy.errors.paymentUnconfirmed}
      </h1>
      {state === "ok" ? (
        <>
          <p className="mt-3 text-sm leading-relaxed text-white/60">{copy.description}</p>
          {applicationId ? (
            <p className="mt-4 font-mono text-[10px] text-green-royal-bright">
              {copy.reference(applicationId)}
            </p>
          ) : null}
        </>
      ) : null}
      {error ? (
        <p className="mt-4 text-sm text-amber-400/90" role="alert">
          {error}
        </p>
      ) : null}
      <Link
        href={GREEN_ROUTE}
        className="mt-8 inline-flex min-h-[44px] items-center text-sm text-white/45 hover:text-white/70"
      >
        {copy.backLink} →
      </Link>
    </div>
  );
}

function ReadyLoading() {
  const { locale } = useLocale();
  const copy = getGreenLabelReadyCopy(locale);
  return <div className="page-inner px-4 py-16 text-white/50">{copy.loading}</div>;
}

export default function GreenLabelReadyPage() {
  return (
    <Suspense fallback={<ReadyLoading />}>
      <ReadyInner />
    </Suspense>
  );
}
